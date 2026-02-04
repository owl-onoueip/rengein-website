
Add-Type -AssemblyName System.Drawing

$sourcePath = "c:\AntigravityWORKS\蓮花院\images\unused\Gemini_Generated_Image_ittvc2ittvc2ittv.png"
$destPath = "c:\AntigravityWORKS\蓮花院\images\main_hall_new.jpg"

write-host "Loading image..."
$img = [System.Drawing.Image]::FromFile($sourcePath)

# Encoder parameter for image quality
$Encoder = [System.Drawing.Imaging.Encoder]::Quality
$EncoderParameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
$EncoderParameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($Encoder, 85)

# Get jpeg codec
$ImageCodecInfo = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }

write-host "Saving image..."
$img.Save($destPath, $ImageCodecInfo, $EncoderParameters)
$img.Dispose()

write-host "Done. Saved to $destPath"
