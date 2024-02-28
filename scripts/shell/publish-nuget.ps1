$manifestPath = Join-Path -Path $PSScriptRoot -ChildPath ".\..\..\manifest.json"
$manifestContent = Get-Content -Path $manifestPath | ConvertFrom-Json

$packageName = $manifestContent.name
$packageVersion = $manifestContent.version

$envFilePath = Join-Path -Path $PSScriptRoot -ChildPath ".\..\..\.env"

$envContent = Get-Content -Path $envFilePath | ForEach-Object {
    if ($_ -match "NUGET_API_KEY=(.+)") {
        $Matches[1]
    }
}

$apiKey = $envContent | ForEach-Object { $_.Trim() }

$packageFilePath = Join-Path -Path $PSScriptRoot -ChildPath ".\..\..\source\$packageName\$packageName.$packageVersion.nupkg"

$nugetServer = "https://api.nuget.org/v3/index.json"

nuget pack .\source\$packageName\$packageName.csproj -Version $packageVersion
nuget push $packageFilePath -ApiKey $apiKey -Source $nugetServer
