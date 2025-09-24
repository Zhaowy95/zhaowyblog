import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('GitHub API调用开始');
    const body = await request.json();
    console.log('请求体:', body);
    
    const { title, content, summary, date, featured } = body;

    if (!title || !content) {
      console.log('验证失败: 标题或内容为空');
      return NextResponse.json(
        { error: '标题和内容不能为空' },
        { status: 400 }
      );
    }

    // 生成文件名（使用时间戳确保唯一性，避免中文文件名问题）
    const timestamp = Date.now();
    const fileName = `blog-${timestamp}.md`;
    console.log('生成文件名:', fileName);

    // 生成Markdown内容
    const markdownContent = `---
title: "${title}"
date: "${date}"
summary: "${summary || ''}"
featured: ${featured || false}
---

${content}`;

    console.log('Markdown内容生成完成');

    // 使用GitHub API直接保存文件
    const githubToken = process.env.GITHUB_TOKEN;
    
    if (!githubToken) {
      console.log('GitHub token未配置');
      return NextResponse.json(
        { error: 'GitHub token未配置，请在Netlify中配置GITHUB_TOKEN环境变量' },
        { status: 500 }
      );
    }

    const githubApiUrl = 'https://api.github.com/repos/Zhaowy95/zhaowyblog/contents/src/content/blog/' + fileName;
    
    const response = await fetch(githubApiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add blog post: ${title}`,
        content: Buffer.from(markdownContent, 'utf-8').toString('base64'),
        branch: 'main'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub API错误:', errorData);
      throw new Error(`GitHub API错误: ${errorData.message || '未知错误'}`);
    }

    const result = await response.json();
    console.log('GitHub API成功响应:', result);

    return NextResponse.json({
      success: true,
      message: '文章保存成功',
      fileName: fileName,
      githubUrl: result.content.html_url
    });

  } catch (error) {
    console.error('保存文章失败:', error);
    return NextResponse.json(
      { 
        error: '保存文章失败',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
