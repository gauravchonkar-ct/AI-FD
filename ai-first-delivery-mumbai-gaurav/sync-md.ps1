# ============================================================
# sync-md.ps1 — Copy MD files from OneDrive sync to project
# ============================================================
# Run once, or leave running to auto-sync on changes.
# Usage:
#   .\sync-md.ps1              → one-time copy
#   .\sync-md.ps1 -Watch       → continuous watch mode
# ============================================================

param(
    [switch]$Watch
)

# ── CONFIGURE THESE PATHS ──
$SOURCE = "C:\Users\GauravC2\OneDrive - CitiusTech\AIFD\MYCONTEXT"
$TARGET = "C:\Users\GauravC2\Documents\AI FD\ai-first-delivery-mumbai-gaurav"

# ── ONE-TIME COPY ──
function Copy-MdFiles {
    Write-Host "`n[sync-md] Copying MD files..." -ForegroundColor Cyan

    if (!(Test-Path $TARGET)) {
        New-Item -ItemType Directory -Path $TARGET -Force | Out-Null
    }

    $files = Get-ChildItem -Path $SOURCE -Filter "*.md"
    foreach ($file in $files) {
        Copy-Item -Path $file.FullName -Destination $TARGET -Force
        Write-Host "  ✅ $($file.Name)" -ForegroundColor Green
    }

    Write-Host "[sync-md] Done. $($files.Count) files copied.`n" -ForegroundColor Cyan
}

# ── INITIAL COPY ──
Copy-MdFiles

# ── WATCH MODE ──
if ($Watch) {
    Write-Host "[sync-md] 👁️ Watch mode ON — monitoring for changes..." -ForegroundColor Yellow
    Write-Host "          Press Ctrl+C to stop.`n"

    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = $SOURCE
    $watcher.Filter = "*.md"
    $watcher.EnableRaisingEvents = $true
    $watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor
                            [System.IO.NotifyFilters]::FileName

    $action = {
        Start-Sleep -Milliseconds 500   # debounce
        $name = $Event.SourceEventArgs.Name
        $src  = $Event.SourceEventArgs.FullPath
        $dest = Join-Path $using:TARGET $name
        Copy-Item -Path $src -Destination $dest -Force
        Write-Host "  🔄 Updated: $name  ($(Get-Date -Format 'HH:mm:ss'))" -ForegroundColor Green
    }

    Register-ObjectEvent $watcher "Changed" -Action $action | Out-Null
    Register-ObjectEvent $watcher "Created" -Action $action | Out-Null

    # Keep script alive
    while ($true) { Start-Sleep -Seconds 1 }
}