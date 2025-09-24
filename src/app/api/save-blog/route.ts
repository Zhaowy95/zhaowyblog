import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, summary, date, featured } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: '标题和内容不能为空' },
        { status: 400 }
      );
    }

    // 生成文件名（使用时间戳确保唯一性，避免中文文件名问题）
    const timestamp = Date.now();
    const fileName = `blog-${timestamp}.md`;

    // 确保目录存在
    const blogDir = join(process.cwd(), 'src', 'content', 'blog');
    await mkdir(blogDir, { recursive: true });

    // 生成Markdown内容
    const markdownContent = `---
title: "${title}"
date: "${date}"
summary: "${summary || ''}"
featured: ${featured || false}
---

${content}`;

    // 写入文件
    const filePath = join(blogDir, fileName);
    await writeFile(filePath, markdownContent, 'utf-8');

    return NextResponse.json({
      success: true,
      message: '文章保存成功',
      fileName: fileName,
      filePath: filePath
    });

  } catch (error) {
    console.error('保存文章失败:', error);
    return NextResponse.json(
      { error: '保存文章失败' },
      { status: 500 }
    );
  }
}
