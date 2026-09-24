#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
docker network inspect hrms-network >/dev/null 2>&1 || {
  echo "Start the backend first so the hrms-network Docker network exists." >&2
  exit 1
}
docker compose up -d --build
docker compose ps
