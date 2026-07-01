#!/usr/bin/env bash
# Server backup for apartment-project: database + uploaded images + .env.
#
# Safe to run at ANY time:
#  - DB is snapshotted with `sqlite3 .backup` when available (consistent even
#    while the app is writing in WAL mode); falls back to copying db + WAL/SHM.
#  - Paths are auto-detected, so it keeps working if the DB or uploads move.
#  - Archives are gzip tarballs with a sha256 checksum and N-day retention.
#
# Overridable via env: APP_DIR, BACKUP_DIR, ENV_FILE, UPLOADS_DIR, RETENTION_DAYS.
#
# NOTE: this is the LOCAL (same-disk) layer — fast restore, NOT disaster
# protection. The real protection is the off-site encrypted restic->B2 backup
# (see scripts/backup-offsite.sh). Keep both.
set -uo pipefail
umask 077   # archives contain .env secrets + the DB — never world/group readable

APP_DIR="${APP_DIR:-/opt/apartment-project}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/apartment-project}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# Read a KEY=value from .env, stripping surrounding quotes and CR (Windows EOL).
read_env() {
  [ -f "$ENV_FILE" ] || return 0
  grep -E "^$1=" "$ENV_FILE" | head -1 | cut -d= -f2- \
    | tr -d '\r' | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'\$//"
}

# Uploads dir resolved the same way the app does: UPLOADS_DIR or fixed default.
UPLOADS_DIR="${UPLOADS_DIR:-$(read_env UPLOADS_DIR)}"
[ -z "${UPLOADS_DIR:-}" ] && UPLOADS_DIR="$APP_DIR/public/uploads"

TS="$(date +%Y%m%d-%H%M%S)"
HOST="$(hostname -s 2>/dev/null || hostname)"
TMP="$(mktemp -d /tmp/aptbk.XXXXXX)"
ARCHIVE="$BACKUP_DIR/apartment-backup-$HOST-$TS.tar.gz"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$BACKUP_DIR" "$TMP/db" "$TMP/uploads" "$TMP/config" "$TMP/data"
chmod 700 "$BACKUP_DIR" 2>/dev/null || true   # archives hold .env secrets

# --- database(s): snapshot every *.db found under the app / data dirs ---
snapshot_db() {
  local src="$1" dest="$2"
  if command -v sqlite3 >/dev/null 2>&1; then
    sqlite3 "$src" ".backup '$dest'" && return 0
  fi
  cp -f "$src" "$dest"
  for ext in -wal -shm; do [ -f "$src$ext" ] && cp -f "$src$ext" "$dest$ext"; done
}

dbcount=0
while IFS= read -r db; do
  [ -f "$db" ] || continue
  name="$(echo "$db" | sed 's#^/##; s#/#__#g')"
  if snapshot_db "$db" "$TMP/db/$name"; then dbcount=$((dbcount + 1)); fi
done < <(find "$APP_DIR" /var/lib/apartment-project -maxdepth 4 -type f -name '*.db' 2>/dev/null | sort -u)
[ "$dbcount" -eq 0 ] && echo "WARNING: no .db files found (APP_DIR=$APP_DIR)" >&2

# --- uploaded images ---
if [ -d "$UPLOADS_DIR" ] && [ -n "$(ls -A "$UPLOADS_DIR" 2>/dev/null)" ]; then
  cp -a "$UPLOADS_DIR/." "$TMP/uploads/"
else
  echo "WARNING: uploads dir missing or empty at $UPLOADS_DIR" >&2
fi

# --- admin-mutable JSON state (homepage "hot propositions" config) ---
# Written by the app to <cwd>/data/homepage-settings.json; cwd is the standalone
# dir in prod, so capture every data/ we can find (not in DB, not in uploads).
while IFS= read -r d; do
  [ -d "$d" ] || continue
  name="$(echo "$d" | sed 's#^/##; s#/#__#g')"
  mkdir -p "$TMP/data/$name"
  cp -a "$d/." "$TMP/data/$name/" 2>/dev/null || true
done < <(find "$APP_DIR" -maxdepth 4 -type d -name data 2>/dev/null | sort -u)

# --- Bunny libSQL dump (optional; root-only creds, skipped if absent) ---
# Captures the Bunny migration-target DB too. Creds live in a root-only file so
# they stay out of the app .env. Non-fatal: never aborts the local backup.
if [ -f /etc/apartment/bunny.env ] && command -v node >/dev/null 2>&1; then
  set -a; . /etc/apartment/bunny.env; set +a
  if [ -n "${BUNNY_LIBSQL_URL:-}" ] && [ -n "${BUNNY_LIBSQL_TOKEN:-}" ]; then
    mkdir -p "$TMP/bunny"
    ( cd "$APP_DIR" && BUNNY_BACKUP_DIR="$TMP/bunny" BUNNY_RETENTION_DAYS=3650 \
        node scripts/backup-bunny-libsql.mjs ) \
      || echo "WARNING: Bunny libSQL dump failed" >&2
  fi
fi

# --- PostgreSQL dump (when the app runs on Postgres) ---
# Reads the connection string from the root-only override file. Captures the
# full live Postgres DB as plain SQL (tar gzips it). Non-fatal: never aborts.
if [ -f /etc/apartment/postgres.env ] && command -v pg_dump >/dev/null 2>&1; then
  # shellcheck disable=SC1091
  ( . /etc/apartment/postgres.env
    if [ -n "${DATABASE_URL:-}" ]; then
      mkdir -p "$TMP/postgres"
      # pg_dump/libpq rejects Prisma's "?schema=..." query param — strip it
      # ("\?" makes the ? a literal, not a single-char glob).
      pg_dump "${DATABASE_URL%%\?*}" --no-owner --no-privileges \
        -f "$TMP/postgres/apartment_prod.sql" \
        || echo "WARNING: pg_dump failed" >&2
    fi )
fi

# --- env (secrets) ---
[ -f "$ENV_FILE" ] && cp -f "$ENV_FILE" "$TMP/config/.env"

tar -czf "$ARCHIVE" -C "$TMP" . && sha256sum "$ARCHIVE" > "$ARCHIVE.sha256"
chmod 600 "$ARCHIVE" "$ARCHIVE.sha256" 2>/dev/null || true

# retention: remove archives + checksums older than RETENTION_DAYS
find "$BACKUP_DIR" -type f -name 'apartment-backup-*.tar.gz*' -mtime +"$RETENTION_DAYS" -delete 2>/dev/null || true

echo "OK $(date '+%F %T') -> $ARCHIVE ($(du -h "$ARCHIVE" | cut -f1)); dbs=$dbcount uploads=$UPLOADS_DIR"
