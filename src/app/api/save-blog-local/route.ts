import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('本地存储API调用开始');
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

    // 返回成功响应，提示用户手动同步
    return NextResponse.json({
      success: true,
      message: '文章已保存到本地，请手动同步到GitHub仓库',
      fileName: fileName,
      content: markdownContent,
      instructions: {
        title: '手动同步步骤',
        steps: [
          '1. 复制下面的Markdown内容',
          '2. 在GitHub仓库中创建新文件',
          '3. 文件路径：src/content/blog/' + fileName,
          '4. 粘贴内容并提交',
          '5. Netlify将自动重新部署'
        ]
      }
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
