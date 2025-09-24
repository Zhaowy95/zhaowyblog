# 🚀 Vercel部署指南

## 部署步骤

### 方法一：通过Vercel CLI（推荐）

1. **安装Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   vercel
   ```

4. **生产环境部署**
   ```bash
   vercel --prod
   ```

### 方法二：通过Vercel Dashboard

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 连接您的GitHub仓库
4. 配置环境变量（见下方）
5. 点击 "Deploy"

## 环境变量配置

在Vercel Dashboard的项目设置中添加以下环境变量：

### 必需变量
- `BLOG_AUTH_PASSWORD`: 博客认证密码（默认：123456）
- `GITHUB_TOKEN`: GitHub Token（用于发布文章）

### 可选变量
- `NEXT_PUBLIC_SITE_URL`: 网站URL（部署后自动设置）
- `VALINE_APP_ID`: Valine评论系统App ID
- `VALINE_APP_KEY`: Valine评论系统App Key

## GitHub Token获取

1. 访问 GitHub Settings > Developer settings > Personal access tokens
2. 点击 "Generate new token (classic)"
3. 选择权限：
   - `repo` (完整仓库访问权限)
   - `workflow` (更新GitHub Actions工作流)
4. 复制生成的token并添加到Vercel环境变量

## 部署后配置

1. **域名配置**：在Vercel Dashboard中配置自定义域名
2. **环境变量**：确保所有必需的环境变量都已设置
3. **构建设置**：Vercel会自动检测Next.js项目配置

## 故障排除

### 常见问题

1. **构建失败**
   - 检查Node.js版本（推荐18.x）
   - 确保所有依赖都已安装

2. **环境变量未生效**
   - 重启部署
   - 检查变量名是否正确

3. **API路由问题**
   - 确保API路由在`src/app/api/`目录下
   - 检查Vercel函数配置

### 性能优化

1. **图片优化**：使用Next.js Image组件
2. **静态资源**：启用CDN缓存
3. **代码分割**：利用Next.js自动代码分割

## 监控和维护

1. **部署状态**：在Vercel Dashboard查看部署日志
2. **性能监控**：使用Vercel Analytics
3. **错误追踪**：集成错误监控服务

## 自动部署

连接GitHub仓库后，每次推送代码都会自动触发部署：
- `main`分支 → 生产环境
- 其他分支 → 预览环境
