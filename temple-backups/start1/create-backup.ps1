param(
    [Parameter(Mandatory=$true)]
    [string]$Description
)

# バックアップ情報のJSONファイルを読み込む
$backupInfo = Get-Content -Raw -Path "backup-info.json" | ConvertFrom-Json
$newNumber = $backupInfo.latest_number + 1

# バックアップディレクトリの作成
$backupDir = "temple-backups\start$newNumber"
if (Test-Path $backupDir) {
    Remove-Item -Recurse -Force $backupDir
}
New-Item -ItemType Directory -Path $backupDir | Out-Null

# ファイルのコピー
robocopy . $backupDir /E /XD "node_modules" ".git" "temple-backups"

# バックアップ情報の更新
$backupInfo.latest_number = $newNumber
$newBackup = @{
    number = $newNumber
    date = (Get-Date -Format "yyyy-MM-dd")
    description = $Description
}
$backupInfo.backups += $newBackup

# 更新した情報をJSONファイルに保存
$backupInfo | ConvertTo-Json -Depth 10 | Set-Content "backup-info.json"

Write-Host "バックアップが完了しました。バックアップ番号: $newNumber" 