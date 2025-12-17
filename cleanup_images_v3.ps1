
$imageDir = ".\images"
$unusedDir = ".\images\unused"

# Create unused directory
if (-not (Test-Path $unusedDir)) {
    New-Item -ItemType Directory -Path $unusedDir | Out-Null
}

# 1. Get all text files to search in
Write-Host "Scanning project files..."
$files = Get-ChildItem -Path . -Recurse -File | Where-Object { 
    ($_.Extension -eq ".html" -or $_.Extension -eq ".css" -or $_.Extension -eq ".js" -or $_.Extension -eq ".json") -and 
    $_.FullName -notmatch "\\.git\\" -and 
    $_.FullName -notmatch "\\.history\\" -and 
    $_.FullName -notmatch "\\node_modules\\" -and
    $_.FullName -notmatch "\\temple-backups\\" -and
    $_.Name -ne "backup-info.json" # Exclude backup log itself if necessary, though it might reference images
}

$allContent = ""
foreach ($file in $files) {
    $allContent += [System.IO.File]::ReadAllText($file.FullName) + "`n"
}

# 2. Get all images
$images = Get-ChildItem $imageDir -File | Where-Object { 
    $_.Extension -match "\.(jpg|jpeg|png|gif|webp|svg)$" -and
    $_.Name -ne "priest.jpg" # Keep specific files if needed, or rely on search
}

$movedCount = 0

foreach ($img in $images) {
    # Skip backup and unused folders logic is handled by Get-ChildItem not recursing into them (since we didn't use -Recurse on images)
    # But wait, if images are in subfolders? The current Get-ChildItem for images is NOT recursive.
    # The previous `dir` output showed images in the root of `images/`.

    # Search for image filename in content
    if ($allContent.IndexOf($img.Name) -eq -1) {
        Write-Host "Unused image detected: $($img.Name)" -ForegroundColor Yellow
        
        $destPath = Join-Path $unusedDir $img.Name
        Move-Item $img.FullName $destPath -Force
        $movedCount++
    }
    else {
        # Write-Host "Used: $($img.Name)" -ForegroundColor Green
    }
}

Write-Host "Completed: Moved $movedCount images to $unusedDir"
