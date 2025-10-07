# Rename-Images.ps1
# Renames all image files in the current directory to img-1, img-2, img-3, etc.

# Get all files with image extensions (case-insensitive)
$images = Get-ChildItem -Path . -File | Where-Object { 
    $_.Name -like "*.jpg" -or 
    $_.Name -like "*.jpeg" -or 
    $_.Name -like "*.png" -or 
    $_.Name -like "*.gif" -or 
    $_.Name -like "*.bmp" -or 
    $_.Name -like "*.tiff" -or 
    $_.Name -like "*.webp" -or 
    $_.Name -like "*.svg"
} | Sort-Object Name

# Check if any images were found
if ($images.Count -eq 0) {
    Write-Host "No image files found in the current directory." -ForegroundColor Yellow
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    Write-Host "`nAll files in current directory:" -ForegroundColor Yellow
    Get-ChildItem -Path . -File | ForEach-Object { Write-Host "  $($_.Name)" }
    exit
}

Write-Host "Found $($images.Count) image file(s). Starting rename process..." -ForegroundColor Green

# Counter for sequential naming
$counter = 1

# Rename each image
foreach ($image in $images) {
    $newName = "img-$counter$($image.Extension)"
    
    # Check if the new name already exists
    if (Test-Path $newName) {
        Write-Host "Warning: $newName already exists. Skipping $($image.Name)" -ForegroundColor Yellow
    }
    else {
        Rename-Item -Path $image.FullName -NewName $newName
        Write-Host "Renamed: $($image.Name) -> $newName" -ForegroundColor Cyan
    }
    
    $counter++
}

Write-Host "`nRename process completed!" -ForegroundColor Green