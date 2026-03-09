#!/bin/bash
# Server backup script for apartment-project
# Creates compressed backups of database, environment file and uploads.

set -euo pipefail

APP_DIR="${APP_DIR:-/opt/apartment-project}"
DB_PATH="${DB_PATH:-/var/lib/apartment-project/dev.db}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/apartment-project}"
UPLOADS_DIR="${UPLOADS_DIR:-$APP_DIR/public/uploads}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"

TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
HOSTNAME="$(hostname -s 2>/dev/null || hostname)"
TMP_DIR="$(mktemp -d /tmp/apartment-backup.XXXXXX)"
ARCHIVE_NAME="apartment-backup-${HOSTNAME}-${TIMESTAMP}.tar.gz"
ARCHIVE_PATH="${BACKUP_DIR}/${ARCHIVE_NAME}"
CHECKSUM_PATH="${ARCHIVE_PATH}.sha256"

cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

mkdir -p "${BACKUP_DIR}"
mkdir -p "${TMP_DIR}/db" "${TMP_DIR}/config" "${TMP_DIR}/uploads"

if [ -f "${DB_PATH}" ]; then
  cp -f "${DB_PATH}" "${TMP_DIR}/db/dev.db"
else
  echo "WARNING: Database file not found at ${DB_PATH}" >&2
fi

if [ -f "${ENV_FILE}" ]; then
  cp -f "${ENV_FILE}" "${TMP_DIR}/config/.env"
else
  echo "WARNING: .env file not found at ${ENV_FILE}" >&2
fi

if [ -d "${UPLOADS_DIR}" ]; then
  cp -a "${UPLOADS_DIR}/." "${TMP_DIR}/uploads/"
else
  echo "WARNING: Uploads directory not found at ${UPLOADS_DIR}" >&2
fi

tar -czf "${ARCHIVE_PATH}" -C "${TMP_DIR}" .
sha256sum "${ARCHIVE_PATH}" > "${CHECKSUM_PATH}"

find "${BACKUP_DIR}" -type f -name "apartment-backup-*.tar.gz" -mtime +"${RETENTION_DAYS}" -delete
find "${BACKUP_DIR}" -type f -name "apartment-backup-*.tar.gz.sha256" -mtime +"${RETENTION_DAYS}" -delete

echo "Backup created: ${ARCHIVE_PATH}"
echo "Checksum file: ${CHECKSUM_PATH}"





