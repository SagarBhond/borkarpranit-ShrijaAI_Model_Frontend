$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
docker network inspect hrms-network *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Error "Start the backend first so the hrms-network Docker network exists."
}
docker compose up -d --build
docker compose ps
