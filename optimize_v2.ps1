Add-Type -AssemblyName System.Drawing

$sourcePath = "c:\AntigravityWORKS\蓮花院\temp_source.png"
$destPath = "c:\AntigravityWORKS\蓮花院\images\TOP_NEW_optimized.jpg"

Write-Host "Loading image from $sourcePath..."
$img = [System.Drawing.Image]::FromFile($sourcePath)
Write-Host "Original size: $($img.Width) x $($img.Height)"

# Resize to 1920 width
$maxWidth = 1920
$scale = $maxWidth / $img.Width
$newWidth = [int]($img.Width * $scale)
$newHeight = [int]($img.Height * $scale)
Write-Host "Resizing to: $newWidth x $newHeight"

$newImg = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
$graph = [System.Drawing.Graphics]::FromImage($newImg)
$graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
$graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graph.DrawImage($img, 0, 0, $newWidth, $newHeight)

# Jpeg Codec
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }

# Quality: 85
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85)

Write-Host "Saving to $destPath..."
$newImg.Save($destPath, $codec, $encParams)

$img.Dispose()
$newImg.Dispose()
$graph.Dispose()

Write-Host "Done! Optimized image saved."
