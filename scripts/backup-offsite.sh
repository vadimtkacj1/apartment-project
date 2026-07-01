#!/usr/bin/env bash
# OFF-SITE encrypted backup of apartment-project to Backblaze B2 via restic.
# This is the REAL disaster protection (survives total VPS/disk loss), unlike
# the same-disk scripts/backup-server.sh local layer.
#
# Captures, in one encrypted snapshot:
#   - a CONSISTENT SQLite snapshot (DB path derived from the LIVE PM2 process)
#   - the uploaded images dir (/opt/apartment-project/public/uploads)
#   - admin JSON state (data/homepage-settings.json)
#   - .env (secrets) — safe because restic encrypts client-side (AES-256)
#
# One-time setup (bucket, keys, repo init, /etc/restic/b2.env) lives in the
# runbook, not here. Required env (sourced from /etc/restic/b2.env, root-only):
#   RESTIC_REPOSITORY=b2:apartment-project-restic   (native B2 backend)
#   B2_ACCOUNT_ID / B2_ACCOUNT_KEY                  (APPEND-ONLY key: no delete)
#   RESTIC_PASSWORD_FILE=/etc/restic/password
set -Eeuo pipefail
umask 077

APP="${APP_DIR:-/opt/apartment-project}"
ENV_FILE="$APP/.env"

# Load off-site creds (RESTIC_REPOSITORY, B2 keys, RESTIC_PASSWORD_FILE, HC_URL).
set -a; . /etc/restic/b2.env; set +a
HC_URL="${HC_URL:-}"                       # healthchecks.io ping URL (dead-man switch)

# Optional Bunny libSQL backup creds (BUNNY_LIBSQL_URL + read-only token),
# kept in a separate root-only file so the app .env stays clean.
[ -f /etc/apartment/bunny.env ] && { set -a; . /etc/apartment/bunny.env; set +a; }

ping_hc() { [ -n "$HC_URL" ] && curl -fsS -m 10 --retry 3 "$HC_URL$1" >/dev/null 2>&1 || true; }

STAGE="$(mktemp -d /root/aptbk.XXXXXX)"     # root-only staging, NOT /tmp
chmod 700 "$STAGE"
cleanup() { rm -rf "$STAGE"; }
# Single ERR+EXIT trap: clean up always, ping /fail on error.
trap 'rc=$?; ping_hc /fail; cleanup; exit $rc' ERR
trap 'cleanup' EXIT

ping_hc /start

# --- 1) Resolve the LIVE DB path the same way the running app does -----------
# Ask PM2 for the process cwd + DATABASE_URL (authoritative — avoids the
# /opt/.../dev.db vs .next/standalone/dev.db ambiguity).
PM_INFO="$(pm2 jlist 2>/dev/null | node -e '
  let s=""; process.stdin.on("data",d=>s+=d).on("end",()=>{
    try{ const a=JSON.parse(s); const p=a.find(x=>x.name==="apartment-project");
      if(!p){return} const e=p.pm2_env||{};
      process.stdout.write((e.pm_cwd||"")+"\n"+(e.DATABASE_URL||"")); }catch(_){}
  });' || true)"
PM_CWD="$(printf '%s' "$PM_INFO" | sed -n 1p)"
DB_URL="$(printf '%s' "$PM_INFO" | sed -n 2p)"
[ -z "$PM_CWD" ] && PM_CWD="$APP/.next/standalone"      # prod cwd fallback
# Fall back to .env (strip UTF-8 BOM + quotes) if PM2 didn't expose the URL.
[ -z "$DB_URL" ] && DB_URL="$(grep -aE '^(\xEF\xBB\xBF)?DATABASE_URL=' "$ENV_FILE" 2>/dev/null \
  | head -1 | sed -E 's/^\xEF\xBB\xBF//; s/^DATABASE_URL=//; s/^"//; s/"$//' | tr -d '\r')"
DB_FILE="${DB_URL#file:}"
case "$DB_FILE" in
  /*) : ;;                                  # absolute
  *)  DB_FILE="$PM_CWD/${DB_FILE#./}" ;;     # relative -> resolve against app cwd
esac

# --- 2) Consistent DB snapshot via better-sqlite3 Online Backup API ----------
# Runs from the dir that HAS better-sqlite3 (standalone). fileMustExist=true so
# a wrong path ERRORS instead of silently snapshotting an empty auto-created DB.
SNAP="$STAGE/dev.db"
( cd "$PM_CWD" && node -e '
    const Database = require("better-sqlite3");
    const [src, out] = [process.argv[1], process.argv[2]];
    const db = new Database(src, { readonly: true, fileMustExist: true });
    const tables = db.prepare("SELECT count(*) c FROM sqlite_master WHERE type=\x27table\x27").get().c;
    if (tables < 1) { console.error("refusing: DB has no tables ->", src); process.exit(2); }
    db.backup(out).then(() => {
      const chk = db.pragma("integrity_check", { simple: true });
      db.close();
      if (chk !== "ok") { console.error("integrity_check:", chk); process.exit(3); }
      console.log("DB snapshot ok (tables=" + tables + ") <-", src);
    }).catch(e => { console.error(e.message); process.exit(4); });
  ' "$DB_FILE" "$SNAP" )

# --- 2b) Bunny libSQL dump (optional; skipped if creds absent) ---------------
# Bunny libSQL is the migration target; once it holds live data this captures it
# in the SAME encrypted snapshot. Uses a READ-ONLY token. Non-fatal by design:
# a Bunny outage must never fail the off-site backup of the VPS source-of-truth.
BUNNY_PATHS=()
if [ -n "${BUNNY_LIBSQL_URL:-}" ] && [ -n "${BUNNY_LIBSQL_TOKEN:-}" ]; then
  mkdir -p "$STAGE/bunny"
  if ( cd "$APP" && BUNNY_BACKUP_DIR="$STAGE/bunny" BUNNY_RETENTION_DAYS=3650 \
         node scripts/backup-bunny-libsql.mjs ); then
    BUNNY_PATHS+=("$STAGE/bunny")
  else
    echo "WARNING: Bunny libSQL dump failed; continuing without it" >&2
  fi
fi

# --- 3) Push everything off-site (restic encrypts client-side) ---------------
# Capture uploads (absolute path) + every data/ dir (homepage-settings.json) + .env.
DATA_DIRS=()
while IFS= read -r d; do [ -d "$d" ] && DATA_DIRS+=("$d"); done \
  < <(find "$APP" -maxdepth 4 -type d -name data 2>/dev/null | sort -u)

rc=0
restic backup --tag apartment --host apartment-vps --exclude-caches \
  "$SNAP" \
  "$APP/public/uploads" \
  "$ENV_FILE" \
  "${DATA_DIRS[@]}" \
  "${BUNNY_PATHS[@]}" || rc=$?
# restic exit 3 = some source files were unreadable but a snapshot WAS created.
# Treat 0 and 3 as success; anything else is a real failure.
[ "$rc" -ne 0 ] && [ "$rc" -ne 3 ] && exit "$rc"

# --- 4) Retention (hide only; real deletion done by B2 lifecycle) ------------
# Append-only key can hide snapshots on the native B2 backend but cannot delete.
# Monthly `restic prune` (repack) runs separately with the full key (runbook).
restic forget --tag apartment \
  --keep-hourly 24 --keep-daily 14 --keep-weekly 8 --keep-monthly 12

# --- 5) Integrity check (structure) ------------------------------------------
restic check

ping_hc ""    # success
echo "OK $(date '+%F %T') off-site backup complete (db=$DB_FILE)"
