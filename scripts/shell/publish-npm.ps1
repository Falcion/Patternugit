$scriptDir = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition

Set-Location -Path $scriptDir

$packageJson = Get-Content -Path ".\..\..\package.json" | ConvertFrom-Json
$packageName = $packageJson.name
$packageVersion = $packageJson.version

npm login
npm publish
npm logout

Write-Host "Published $packageName@$packageVersion to NPM."

Set-Location -Path $scriptDir
