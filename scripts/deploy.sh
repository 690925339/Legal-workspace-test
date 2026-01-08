#!/bin/bash

# ============================================
# AI法律助手 - 部署脚本
# ============================================
# 用法: ./scripts/deploy.sh [环境]
# 环境参数: staging | production (默认: staging)
# ============================================

set -e  # 出错时立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 获取环境参数
ENV=${1:-staging}
DEPLOY_DIR="dist"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/deploy_${TIMESTAMP}"

# 显示部署信息
echo ""
echo "============================================"
echo "       AI法律助手 - 自动化部署脚本"
echo "============================================"
echo ""
log_info "部署环境: ${ENV}"
log_info "时间戳: ${TIMESTAMP}"
echo ""

# 检查 Node.js 和 npm
check_dependencies() {
    log_info "检查依赖项..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装，请先安装 Node.js"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装，请先安装 npm"
        exit 1
    fi
    
    NODE_VERSION=$(node -v)
    NPM_VERSION=$(npm -v)
    log_success "Node.js 版本: ${NODE_VERSION}"
    log_success "npm 版本: ${NPM_VERSION}"
}

# 安装依赖
install_dependencies() {
    log_info "安装项目依赖..."
    npm ci --silent
    log_success "依赖安装完成"
}

# 代码质量检查
lint_check() {
    log_info "执行代码质量检查..."
    
    if npm run lint; then
        log_success "代码质量检查通过"
    else
        log_warning "代码质量检查发现问题，但继续部署"
    fi
}

# 运行测试
run_tests() {
    log_info "运行单元测试..."
    
    if npm run test -- --run; then
        log_success "单元测试全部通过"
    else
        log_error "单元测试失败，终止部署"
        exit 1
    fi
}

# 构建项目
build_project() {
    log_info "开始构建项目 (环境: ${ENV})..."
    
    # 根据环境设置不同的构建参数
    if [ "$ENV" = "production" ]; then
        NODE_ENV=production npm run build
    else
        npm run build
    fi
    
    if [ -d "$DEPLOY_DIR" ]; then
        log_success "构建完成，输出目录: ${DEPLOY_DIR}"
        
        # 显示构建产物大小
        BUILD_SIZE=$(du -sh ${DEPLOY_DIR} | cut -f1)
        log_info "构建产物大小: ${BUILD_SIZE}"
    else
        log_error "构建失败，${DEPLOY_DIR} 目录不存在"
        exit 1
    fi
}

# 创建备份
create_backup() {
    if [ -d "$DEPLOY_DIR" ]; then
        log_info "创建备份..."
        mkdir -p "$BACKUP_DIR"
        cp -r "$DEPLOY_DIR" "$BACKUP_DIR/"
        log_success "备份已创建: ${BACKUP_DIR}"
    fi
}

# 部署到服务器 (示例 - 根据实际情况修改)
deploy_to_server() {
    log_info "准备部署到服务器..."
    
    # 这里可以根据实际部署方式进行修改
    # 例如: SCP, rsync, Docker, Kubernetes 等
    
    case "$ENV" in
        staging)
            log_info "部署到测试环境..."
            # rsync -avz --delete ${DEPLOY_DIR}/ user@staging-server:/var/www/legal-workspace/
            log_warning "测试环境部署命令未配置，请根据实际情况修改脚本"
            ;;
        production)
            log_info "部署到生产环境..."
            # rsync -avz --delete ${DEPLOY_DIR}/ user@production-server:/var/www/legal-workspace/
            log_warning "生产环境部署命令未配置，请根据实际情况修改脚本"
            ;;
        *)
            log_error "未知环境: ${ENV}"
            exit 1
            ;;
    esac
}

# 部署后验证
post_deploy_check() {
    log_info "执行部署后验证..."
    
    # 检查构建产物是否完整
    if [ -f "${DEPLOY_DIR}/index.html" ]; then
        log_success "index.html 存在"
    else
        log_error "index.html 不存在，部署可能失败"
        exit 1
    fi
    
    # 检查资源文件
    if [ -d "${DEPLOY_DIR}/assets" ]; then
        ASSET_COUNT=$(find ${DEPLOY_DIR}/assets -type f | wc -l)
        log_success "资源文件数量: ${ASSET_COUNT}"
    fi
    
    log_success "部署后验证通过"
}

# 清理旧备份 (保留最近5个)
cleanup_old_backups() {
    if [ -d "backups" ]; then
        log_info "清理旧备份..."
        cd backups
        ls -t | tail -n +6 | xargs -r rm -rf
        cd ..
        log_success "旧备份清理完成"
    fi
}

# 显示部署摘要
show_summary() {
    echo ""
    echo "============================================"
    echo "              部署摘要"
    echo "============================================"
    log_success "环境: ${ENV}"
    log_success "时间: ${TIMESTAMP}"
    log_success "构建目录: ${DEPLOY_DIR}"
    log_success "备份目录: ${BACKUP_DIR}"
    echo "============================================"
    echo ""
}

# 主流程
main() {
    check_dependencies
    install_dependencies
    lint_check
    # run_tests  # 如需运行测试，取消此行注释
    create_backup
    build_project
    post_deploy_check
    deploy_to_server
    cleanup_old_backups
    show_summary
    
    log_success "🚀 部署完成！"
}

# 执行主流程
main
