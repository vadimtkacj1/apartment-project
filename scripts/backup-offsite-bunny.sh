#!/usr/bin/env bash
# OFF-SITE copy of the newest local backup archive to Bunny.net Edge Storage.
# The local archive (scripts/backup-server.sh) already contains the Postgres
# dump + SQLite fallback + all uploaded images + the image manifest + .env, so
# one uploaded file per run is a complete, restorable snapshot living OFF the
# VPS disk — the real protection against total disk loss.
#
# Non-fatal by design: a Bunny outage must never break the local backup.
#
# Creds (root-only) in /etc/apartment/bunny-storage.env:
#   BUNNY_STORAGE_ZONE=ramhaim-backups          # Storage Zone name
#   BUNNY_STORAGE_PASSWORD=xxxxxxxx              # zone Password / API access key
#   BUNNY_STORAGE_HOST=storage.bunnycdn.com      # region host: storage. / ny. / la. / sg. / uk. / se. / br. / syd. .storage.bunnycdn.com
#   BUNNY_STORAGE_PREFIX=apartment-project       # folder inside the zone (optional)
#   BUNNY_OFFSITE_RETENTION=30                   # days to keep on Bunny (0 = keep everything)
set -uo pipefail

CONF="${BUNNY_STORAGE_CONF:-/etc/apartment/bunny-storage.env}"
if [ ! -f "$CONF" ]; then
  echo "backup-offsite-bunny: $CONF not found — skipping (configure it to enable off-site)"; exit 0
fi
set -a; . "$CONF"; set +a

: "${BUNNY_STORAGE_ZONE:?set BUNNY_STORAGE_ZONE in $CONF}"
: "${BUNNY_STORAGE_PASSWORD:?set BUNNY_STORAGE_PASSWORD in $CONF}"
HOST="${BUNNY_STORAGE_HOST:-storage.bunnycdn.com}"
PREFIX="${BUNNY_STORAGE_PREFIX:-apartment-project}"
RETENTION="${BUNNY_OFFSITE_RETENTION:-30}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/apartment-project}"
BASE_URL="https://$HOST/$BUNNY_STORAGE_ZONE/$PREFIX"

ARCHIVE="$(ls -t "$BACKUP_DIR"/apartment-backup-*.tar.gz 2>/dev/null | head -1)"
[ -n "$ARCHIVE" ] || { echo "backup-offsite-bunny: no local archive in $BACKUP_DIR — nothing to upload"; exit 0; }

upload() {
  local f="$1" bn code
  bn="$(basename "$f")"
  code="$(curl -sS -o /dev/null -w '%{http_code}' --retry 3 --retry-delay 5 -X PUT \
      -H "AccessKey: $BUNNY_STORAGE_PASSWORD" \
      -H 'Content-Type: application/octet-stream' \
      --data-binary "@$f" \
      "$BASE_URL/$bn")" || code="000"
  echo "  PUT $bn -> HTTP $code"
  case "$code" in 200|201) return 0 ;; *) echo "WARNING: Bunny upload failed ($code) for $bn" >&2; return 1 ;; esac
}

echo "backup-offsite-bunny: uploading $(basename "$ARCHIVE") ($(du -h "$ARCHIVE" | cut -f1)) -> $BASE_URL"
upload "$ARCHIVE" || exit 0                     # non-fatal
[ -f "$ARCHIVE.sha256" ] && upload "$ARCHIVE.sha256" || true

# --- retention: delete objects older than RETENTION days on Bunny ------------
if [ "$RETENTION" -gt 0 ] 2>/dev/null && command -v node >/dev/null 2>&1; then
  listing="$(curl -sS -H "AccessKey: $BUNNY_STORAGE_PASSWORD" "$BASE_URL/" || true)"
  # Bunny returns a JSON array with ObjectName + LastChanged (UTC). Delete old ones.
  echo "$listing" | node -e '
    let s=""; process.stdin.on("data",d=>s+=d).on("end",()=>{
      let arr=[]; try{arr=JSON.parse(s)}catch{ return }
      const days=Number(process.env.RETENTION)||30;
      const cutoff=Date.now()-days*86400000;
      for(const o of arr){
        if(o.IsDirectory) continue;
        const t=Date.parse(o.LastChanged||o.DateCreated||"");
        if(!isNaN(t) && t<cutoff) console.log(o.ObjectName);
      }
    });' RETENTION="$RETENTION" | while IFS= read -r old; do
      [ -n "$old" ] || continue
      dc="$(curl -sS -o /dev/null -w '%{http_code}' -X DELETE -H "AccessKey: $BUNNY_STORAGE_PASSWORD" "$BASE_URL/$old")"
      echo "  DELETE $old -> HTTP $dc"
    done
fi

echo "OK $(date '+%F %T') off-site (Bunny) complete"
