# 环境变量配置说明

## 必需的环境变量

### 1. 博客认证密码
```bash
BLOG_AUTH_PASSWORD=your_secure_password_here
```
- 用于保护写博客功能
- 建议使用强密码
- 在Netlify中配置此环境变量

### 2. GitHub API Token
```bash
GITHUB_TOKEN=your_github_token_here
```
- 用于发布文章到GitHub仓库
- 需要repo权限
- 在Netlify中配置此环境变量

## 配置步骤

### 本地开发
1. 创建 `.env.local` 文件
2. 添加上述环境变量
3. 重启开发服务器

### Netlify部署
1. 进入Netlify控制台
2. 选择项目 → Site settings → Environment variables
3. 添加上述环境变量
4. 重新部署项目

## 安全建议

- 使用强密码（至少12位，包含大小写字母、数字、特殊字符）
- 定期更换密码
- 不要在代码中硬编码密码
- GitHub Token权限最小化原则
