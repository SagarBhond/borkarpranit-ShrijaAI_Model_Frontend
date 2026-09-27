#!/usr/bin/env bash
set -euo pipefail

: "${FRONTEND_EC2_HOST:?Set FRONTEND_EC2_HOST to the instance public IP or DNS name}"
: "${FRONTEND_SSH_KEY_FILE:?Set FRONTEND_SSH_KEY_FILE to the deployment private key path}"
: "${FRONTEND_KNOWN_HOSTS_FILE:?Set FRONTEND_KNOWN_HOSTS_FILE to the verified known_hosts file}"

deploy_user="${FRONTEND_EC2_USER:-ec2-user}"
dist_dir="${1:-dist}"
archive_file="$(mktemp)"
trap 'rm -f "$archive_file"' EXIT

if [[ ! -d "$dist_dir" ]]; then
  echo "Build output directory not found: $dist_dir" >&2
  exit 1
fi

ssh_options=(
  -i "$FRONTEND_SSH_KEY_FILE"
  -o IdentitiesOnly=yes
  -o BatchMode=yes
  -o StrictHostKeyChecking=yes
  -o "UserKnownHostsFile=$FRONTEND_KNOWN_HOSTS_FILE"
)

tar -czf "$archive_file" -C "$dist_dir" .
scp "${ssh_options[@]}" "$archive_file" "$deploy_user@$FRONTEND_EC2_HOST:/tmp/frontend-build.tar.gz"
ssh "${ssh_options[@]}" "$deploy_user@$FRONTEND_EC2_HOST" 'sudo bash -s' <<'REMOTE'
set -euo pipefail
release="/var/www/frontend/releases/$(date -u +%Y%m%d%H%M%S)-$$"
mkdir -p "$release"
tar -xzf /tmp/frontend-build.tar.gz -C "$release"
find "$release" -type d -exec chmod 755 {} +
find "$release" -type f -exec chmod 644 {} +
ln -sfn "$release" /var/www/frontend/current.next
mv -Tf /var/www/frontend/current.next /var/www/frontend/current
rm -f /tmp/frontend-build.tar.gz
find /var/www/frontend/releases -mindepth 1 -maxdepth 1 -type d ! -path "$release" -printf '%T@ %p\n' \
  | sort -nr | tail -n +3 | cut -d' ' -f2- | xargs -r rm -rf --
REMOTE

echo "Frontend deployed to $FRONTEND_EC2_HOST"