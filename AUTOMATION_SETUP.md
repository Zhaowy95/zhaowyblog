# 全自动化发布设置指南

## 🚀 实现完全自动化的文章发布

本博客现在支持完全自动化的文章发布功能！用户只需点击"发布文章"按钮，系统就会自动：
1. 生成 Markdown 文件
2. 直接提交到 GitHub 仓库
3. 触发自动部署
4. 无需任何手动操作

## 🔧 设置步骤

### 1. 创建 GitHub Personal Access Token

1. 访问 GitHub Settings: https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 设置以下权限：
   - ✅ `repo` (完整仓库访问权限)
   - ✅ `workflow` (更新 GitHub Action 工作流)
4. 点击 "Generate token"
5. 复制生成的 token（只显示一次！）

### 2. 配置环境变量

#### 方法一：在 GitHub Pages 中配置（推荐）

1. 访问你的仓库: https://github.com/Zhaowy95/zhaowyblog
2. 点击 "Settings" → "Secrets and variables" → "Actions"
3. 点击 "New repository secret"
4. 名称: `NEXT_PUBLIC_GITHUB_TOKEN`
5. 值: 粘贴你的 GitHub Token
6. 点击 "Add secret"

#### 方法二：在本地开发环境中配置

1. 在项目根目录创建 `.env.local` 文件
2. 添加以下内容：
```
NEXT_PUBLIC_GITHUB_TOKEN=你的GitHub_Token
```

### 3. 验证设置

1. 访问博客的写文章页面
2. 输入标题和内容
3. 点击"发布文章"
4. 如果配置正确，文章会自动发布到 GitHub 并触发部署

## 🎯 自动化流程

1. **用户操作**: 点击"发布文章"按钮
2. **系统处理**: 
   - 生成 Markdown 文件
   - 调用 GitHub API 提交文件
   - 触发 GitHub Actions 部署
3. **结果**: 文章自动出现在博客中

## 🔒 安全说明

- GitHub Token 具有仓库访问权限，请妥善保管
- 不要在公开场所分享你的 Token
- 如果 Token 泄露，请立即在 GitHub 中撤销并重新生成

## 🛠️ 故障排除

### 问题：提示"请配置 GitHub Token"
**解决方案**: 按照上述步骤配置 `NEXT_PUBLIC_GITHUB_TOKEN` 环境变量

### 问题：发布失败，提示权限错误
**解决方案**: 检查 Token 是否具有 `repo` 权限

### 问题：文章发布成功但未显示
**解决方案**: 等待 GitHub Actions 完成部署（通常需要 2-5 分钟）

## 📞 技术支持

如果遇到问题，请检查：
1. GitHub Token 是否正确配置
2. Token 是否具有必要的权限
3. 网络连接是否正常
4. GitHub Actions 是否正常运行
