# GitHub Token 配置指南

## 实现自动发布功能

为了让博客支持自动发布，需要配置GitHub Personal Access Token。

### 步骤1：创建GitHub Personal Access Token

1. 登录GitHub，进入 **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. 点击 **Generate new token** → **Generate new token (classic)**
3. 填写Token信息：
   - **Note**: `Blog Auto Publish`
   - **Expiration**: 选择合适的时间（建议1年）
   - **Scopes**: 勾选 `repo` (完整仓库访问权限)
4. 点击 **Generate token**
5. **重要**：复制生成的token，只显示一次！

### 步骤2：在Netlify中配置环境变量

1. 登录Netlify，进入您的项目
2. 进入 **Site settings** → **Environment variables**
3. 点击 **Add variable**
4. 添加环境变量：
   - **Key**: `GITHUB_TOKEN`
   - **Value**: 粘贴刚才复制的token
5. 点击 **Save**

### 步骤3：重新部署

1. 在Netlify中点击 **Deploys** → **Trigger deploy** → **Deploy site**
2. 等待部署完成

### 完成！

配置完成后，您的博客将支持：
- ✅ **自动发布**：点击"发布文章"直接保存到GitHub
- ✅ **自动部署**：Netlify检测到GitHub更新后自动重新部署
- ✅ **无需手动操作**：完全自动化的发布流程

### 安全说明

- GitHub Token具有仓库写入权限，请妥善保管
- 如果Token泄露，请立即在GitHub中删除并重新生成
- 建议定期更新Token以确保安全

### 故障排除

如果自动发布仍然失败：
1. 检查Token是否正确配置
2. 确认Token具有`repo`权限
3. 查看Netlify部署日志中的错误信息
4. 系统会自动降级到手动同步方案
