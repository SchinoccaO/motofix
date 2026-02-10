# Script de configuración de MySQL para MotoFIX
# DEBE EJECUTARSE COMO ADMINISTRADOR

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Configuracion MySQL - MotoFIX" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Verificar permisos de administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: Este script requiere permisos de administrador" -ForegroundColor Red
    Write-Host ""
    Write-Host "Como ejecutar como administrador:" -ForegroundColor Yellow
    Write-Host "1. Click derecho en PowerShell" -ForegroundColor Yellow
    Write-Host "2. Seleccionar 'Ejecutar como administrador'" -ForegroundColor Yellow
    Write-Host "3. Ejecutar: cd C:\Users\USUARIO\motoya" -ForegroundColor Yellow
    Write-Host "4. Ejecutar: .\setup-mysql-admin.ps1" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.4\bin"
$dataPath = "C:\ProgramData\MySQL\MySQL Server 8.4\data"

Write-Host "Verificando instalacion de MySQL..." -ForegroundColor Yellow

if (-not (Test-Path "$mysqlPath\mysqld.exe")) {
    Write-Host "ERROR: MySQL no encontrado en $mysqlPath" -ForegroundColor Red
    Write-Host "Instala MySQL primero con: winget install Oracle.MySQL" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "MySQL encontrado!" -ForegroundColor Green
Write-Host ""

# Verificar si ya está inicializado
if (Test-Path $dataPath) {
    Write-Host "MySQL ya esta inicializado" -ForegroundColor Green
} else {
    Write-Host "Inicializando MySQL (sin contraseña de root)..." -ForegroundColor Yellow
    & "$mysqlPath\mysqld.exe" --initialize-insecure --console
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "MySQL inicializado correctamente!" -ForegroundColor Green
    } else {
        Write-Host "Error al inicializar MySQL" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
}

Write-Host ""
Write-Host "Instalando servicio MySQL..." -ForegroundColor Yellow

# Verificar si el servicio ya existe
$service = Get-Service -Name "MySQL84" -ErrorAction SilentlyContinue

if ($service) {
    Write-Host "Servicio MySQL84 ya existe" -ForegroundColor Green
} else {
    & "$mysqlPath\mysqld.exe" --install MySQL84
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Servicio instalado correctamente!" -ForegroundColor Green
    } else {
        Write-Host "Error al instalar servicio" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Iniciando servicio MySQL..." -ForegroundColor Yellow

Start-Service -Name "MySQL84" -ErrorAction SilentlyContinue

if ((Get-Service -Name "MySQL84").Status -eq "Running") {
    Write-Host "MySQL esta corriendo!" -ForegroundColor Green
} else {
    Write-Host "Error al iniciar MySQL" -ForegroundColor Red
    Write-Host "Intenta manualmente: net start MySQL84" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Configuracion completada!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Yellow
Write-Host "1. Ejecutar: mysql -u root" -ForegroundColor White
Write-Host "2. Dentro de MySQL, ejecutar: source database/schema.sql" -ForegroundColor White
Write-Host "3. Ejecutar: source database/seeds.sql" -ForegroundColor White
Write-Host "4. Ejecutar: EXIT;" -ForegroundColor White
Write-Host "5. Iniciar servidor: cd server && npm run dev" -ForegroundColor White
Write-Host ""

Read-Host "Presiona Enter para salir"
