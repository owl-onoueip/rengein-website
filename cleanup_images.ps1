
$imageDir = ".\images"
$unusedDir = ".\images\unused"
$searchExtensions = @("*.html", "*.css", "*.js", "*.json")
$imageExtensions = @("*.jpg", "*.jpeg", "*.png", "*.gif", "*.webp", "*.svg")

# 未使用画像フォルダの作成
if (-not (Test-Path $unusedDir)) {
    New-Item -ItemType Directory -Path $unusedDir | Out-Null
}

# 全てのテキストファイルの内容を取得
Write-Host "プロジェクトファイルをスキャン中..."
$filesContent = Get-ChildItem -Recurse -Include $searchExtensions -Exclude .git, .history, node_modules, temple-backups | Get-Content -Raw
$allContent = $filesContent -join " "

# 画像ファイルを検索
$images = Get-ChildItem $imageDir -Include $imageExtensions -File

$movedCount = 0

foreach ($img in $images) {
    # バックアップフォルダや未使用フォルダはスキップ
    if ($img.DirectoryName -like "*\backup*" -or $img.DirectoryName -like "*\unused*" -or $img.DirectoryName -like "*\shakaki*") {
        continue
    }

    # ファイル名で検索
    if ($allContent -notmatch [regex]::Escape($img.Name)) {
        Write-Host "未使用画像を検出: $($img.Name)" -ForegroundColor Yellow
        
        $destPath = Join-Path $unusedDir $img.Name
        Move-Item $img.FullName $destPath -Force
        $movedCount++
    }
}

Write-Host "`n完了: $movedCount 個の画像を $unusedDir に移動しました。"
