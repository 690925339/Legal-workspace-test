# ============================================
# AI法律助手 - 部署脚本 (PowerShell)
# ============================================
# 用法: .\scripts\deploy.ps1 [-Env staging|production]
# ============================================

param(
    [ValidateSet("staging", "production")]
    [string]$Env = "staging"
)

$ErrorActionPreference = "Stop"

# ==================== 服务器配置 ====================
$ServerConfig = @{
    Host       = "192.168.50.197"
    User       = "neo4j"
    RemotePath = "/www/wwwroot/legal-workspace-vue"
}
# ===================================================

# 颜色输出函数
function Write-Info { param($Message) Write-Host "[INFO] $Message" -ForegroundColor Blue }
function Write-Success { param($Message) Write-Host "[SUCCESS] $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "[WARNING] $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "[ERROR] $Message" -ForegroundColor Red }

# 配置
$DeployDir = "dist"
$HelpDir = "help\.vitepress\dist"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupDir = "backups\deploy_$Timestamp"

# 显示欢迎信息
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "       AI法律助手 - 自动化部署脚本" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Info "部署环境: $Env"
Write-Info "时间戳: $Timestamp"
Write-Host ""

# 检查依赖
function Test-Dependencies {
    Write-Info "检查依赖项..."
    
    try {
        $nodeVersion = node -v
        $npmVersion = npm -v
        Write-Success "Node.js 版本: $nodeVersion"
        Write-Success "npm 版本: $npmVersion"
    }
    catch {
        Write-Error "Node.js 或 npm 未安装"
        exit 1
    }
}

# 安装依赖
function Install-Dependencies {
    Write-Info "安装项目依赖..."
    npm ci --silent
    if ($LASTEXITCODE -ne 0) {
        Write-Error "依赖安装失败"
        exit 1
    }
    Write-Success "依赖安装完成"
}

# 代码质量检查
function Invoke-LintCheck {
    Write-Info "执行代码质量检查..."
    npm run lint
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "代码质量检查发现问题，但继续部署"
    }
    else {
        Write-Success "代码质量检查通过"
    }
}

# 运行测试
function Invoke-Tests {
    Write-Info "运行单元测试..."
    npm run test -- --run
    if ($LASTEXITCODE -ne 0) {
        Write-Error "单元测试失败，终止部署"
        exit 1
    }
    Write-Success "单元测试全部通过"
}

# 创建备份
function New-Backup {
    if (Test-Path $DeployDir) {
        Write-Info "创建备份..."
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
        Copy-Item -Path "$DeployDir\*" -Destination $BackupDir -Recurse
        Write-Success "备份已创建: $BackupDir"
    }
}

# 构建项目
function Build-Project {
    Write-Info "开始构建项目 (环境: $Env)..."
    
    if ($Env -eq "production") {
        $env:NODE_ENV = "production"
    }
    
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "构建失败"
        exit 1
    }
    
    if (Test-Path $DeployDir) {
        $buildSize = (Get-ChildItem -Path $DeployDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Success "构建完成，输出目录: $DeployDir"
        Write-Info ("构建产物大小: {0:N2} MB" -f $buildSize)
    }
    else {
        Write-Error "构建失败，$DeployDir 目录不存在"
        exit 1
    }
}

# 构建帮助中心
function Build-HelpCenter {
    Write-Info "构建帮助中心..."
    
    npm run help:build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "帮助中心构建失败，但继续部署主应用"
        return
    }
    
    if (Test-Path $HelpDir) {
        Write-Success "帮助中心构建完成"
    }
}

# 部署后验证
function Test-Deployment {
    Write-Info "执行部署后验证..."
    
    if (Test-Path "$DeployDir\index.html") {
        Write-Success "index.html 存在"
    }
    else {
        Write-Error "index.html 不存在，部署可能失败"
        exit 1
    }
    
    if (Test-Path "$DeployDir\assets") {
        $assetCount = (Get-ChildItem -Path "$DeployDir\assets" -Recurse -File).Count
        Write-Success "资源文件数量: $assetCount"
    }
    
    Write-Success "部署后验证通过"
}

# 部署到服务器
function Deploy-ToServer {
    Write-Info "准备部署到服务器..."
    Write-Info "目标服务器: $($ServerConfig.User)@$($ServerConfig.Host):$($ServerConfig.RemotePath)"
    
    $sshHost = "$($ServerConfig.User)@$($ServerConfig.Host)"
    $remotePath = $ServerConfig.RemotePath
    
    # 创建远程目录（如果不存在）
    Write-Info "确保远程目录存在..."
    ssh $sshHost "mkdir -p $remotePath"
    ssh $sshHost "mkdir -p $remotePath/help"
    
    # 使用 scp 上传主应用文件
    Write-Info "上传主应用文件到服务器..."
    scp -r "$DeployDir\*" "${sshHost}:${remotePath}/"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "主应用文件上传失败"
        exit 1
    }
    Write-Success "主应用文件上传成功！"
    
    # 上传帮助中心文件
    if (Test-Path $HelpDir) {
        Write-Info "上传帮助中心文件到服务器..."
        scp -r "$HelpDir\*" "${sshHost}:${remotePath}/help/"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "帮助中心文件上传成功！"
        }
        else {
            Write-Warning "帮助中心文件上传失败，但主应用已部署"
        }
    }
    
    Write-Success "部署地址: http://$($ServerConfig.Host)/legal-workspace-v3/"
    Write-Success "帮助中心: http://$($ServerConfig.Host)/legal-workspace-v3/help/"
}

# 清理旧备份
function Clear-OldBackups {
    if (Test-Path "backups") {
        Write-Info "清理旧备份..."
        $backups = Get-ChildItem -Path "backups" -Directory | Sort-Object LastWriteTime -Descending
        if ($backups.Count -gt 5) {
            $backups | Select-Object -Skip 5 | ForEach-Object {
                Remove-Item $_.FullName -Recurse -Force
            }
        }
        Write-Success "旧备份清理完成"
    }
}

# 显示摘要
function Show-Summary {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "              部署摘要" -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Success "环境: $Env"
    Write-Success "时间: $Timestamp"
    Write-Success "构建目录: $DeployDir"
    Write-Success "备份目录: $BackupDir"
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
}

# 主流程
function Main {
    Test-Dependencies
    Install-Dependencies
    Invoke-LintCheck
    # Invoke-Tests  # 如需运行测试，取消此行注释
    New-Backup
    Build-Project
    Build-HelpCenter
    Test-Deployment
    Deploy-ToServer
    Clear-OldBackups
    Show-Summary
    
    Write-Success "🚀 部署完成！"
}

# 执行主流程
Main
