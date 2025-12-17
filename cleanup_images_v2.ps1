
$imageDir = ".\images"
$unusedDir = ".\images\unused"
$searchExtensions = @("*.html", "*.css", "*.js", "*.json")
$imageExtensions = @("*.jpg", "*.jpeg", "*.png", "*.gif", "*.webp", "*.svg")

# Create unused directory
if (-not (Test-Path $unusedDir)) {
    New-Item -ItemType Directory -Path $unusedDir | Out-Null
}

# Scan all project files for text content
Write-Host "Scanning project files..."
$filesContent = Get-ChildItem -Recurse -Include $searchExtensions -Exclude .git, .history, node_modules, temple-backups | Get-Content -Raw
$allContent = $filesContent -join " "

# Get all images
$images = Get-ChildItem $imageDir -Include $imageExtensions -File

$movedCount = 0

foreach ($img in $images) {
    # Skip backup and unused folders
    if ($img.DirectoryName -like "*\backup*" -or $img.DirectoryName -like "*\unused*" -or $img.DirectoryName -like "*\shakaki*") {
        continue
    }

    # Search for image filename in content
    # Using simple string search to avoid regex issues with filenames
    if ($allContent.IndexOf($img.Name) -eq -1) {
        Write-Host "Unused image detected: $($img.Name)" -ForegroundColor Yellow
        
        $destPath = Join-Path $unusedDir $img.Name
        Move-Item $img.FullName $destPath -Force
        $movedCount++
    }
}

Write-Host "Completed: Moved $movedCount images to $unusedDir"
