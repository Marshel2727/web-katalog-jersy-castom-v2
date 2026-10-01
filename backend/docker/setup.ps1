$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$utf8Encoding = New-Object System.Text.UTF8Encoding($false)

function New-RandomBytes([int] $count) {
    $bytes = New-Object byte[] $count
    $generator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try {
        $generator.GetBytes($bytes)
        return ,$bytes
    }
    finally {
        $generator.Dispose()
    }
}

$backendEnvPath = Join-Path $projectRoot 'backend/.env'
if (-not (Test-Path -LiteralPath $backendEnvPath)) {
    Copy-Item -LiteralPath (Join-Path $projectRoot 'backend/.env.example') -Destination $backendEnvPath
}
$backendEnvText = [System.IO.File]::ReadAllText($backendEnvPath)
$keyMatch = [regex]::Match($backendEnvText, '(?m)^APP_KEY=([^\r\n]*)')
if (-not $keyMatch.Success -or [string]::IsNullOrWhiteSpace($keyMatch.Groups[1].Value.Trim(' ', '"', "'"))) {
    $newKey = 'APP_KEY=base64:' + [Convert]::ToBase64String((New-RandomBytes 32))
    if ($keyMatch.Success) {
        $backendEnvText = [regex]::Replace($backendEnvText, '(?m)^APP_KEY=[^\r\n]*', $newKey)
    }
    else {
        $backendEnvText = $backendEnvText.TrimEnd() + [Environment]::NewLine + $newKey + [Environment]::NewLine
    }
    [System.IO.File]::WriteAllText($backendEnvPath, $backendEnvText, $utf8Encoding)
    Write-Output 'APP_KEY created; existing nonempty keys are preserved.'
}

$dockerEnvPath = Join-Path $projectRoot '.env.docker'
if (-not (Test-Path -LiteralPath $dockerEnvPath)) {
    $dockerEnvText = [System.IO.File]::ReadAllText((Join-Path $projectRoot '.env.docker.example'))
    $appPassword = ([BitConverter]::ToString((New-RandomBytes 24))).Replace('-', '').ToLowerInvariant()
    $rootPassword = ([BitConverter]::ToString((New-RandomBytes 24))).Replace('-', '').ToLowerInvariant()
    $dockerEnvText = $dockerEnvText.Replace('change-this-local-password', $appPassword).Replace('change-this-local-root-password', $rootPassword)
    [System.IO.File]::WriteAllText($dockerEnvPath, $dockerEnvText, $utf8Encoding)
    Write-Output '.env.docker created with random MySQL passwords.'
}

Write-Output 'Docker environment ready. Existing credentials and database data were not changed.'
