# Node portable
$NodePortable = "D:\Software\node-v24.11.0-win-x64\node-v24.11.0-win-x64"

# Thêm Node portable vào PATH
$env:PATH = "$NodePortable;$env:PATH"

# Kiểm tra Node version
Write-Host "Using Node version:" (& "$NodePortable\node.exe" -v)

# Chuyển vào thư mục project
$ProjectPath = "D:\quangnv\Code\BASE_PROJECT_FE\auth-fe"
Set-Location $ProjectPath

# Cài dependencies
# Write-Host "Installing dependencies..."
# & "$NodePortable\npm.cmd" ci

# Chạy dev server React
Write-Host "Starting React dev server..."
& "$NodePortable\npm.cmd" run dev
