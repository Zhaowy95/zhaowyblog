"use client";

interface SimpleMarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function SimpleMarkdownEditor({ 
  content, 
  onChange, 
  placeholder = "请输入Markdown内容..." 
}: SimpleMarkdownEditorProps) {
  return (
    <div className="w-full">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-vertical"
        style={{ 
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          lineHeight: '1.5'
        }}
      />
      <div className="mt-2 text-sm text-gray-500">
        支持Markdown语法：**粗体**、*斜体*、# 标题、- 列表、[链接](url)、`代码`等
      </div>
    </div>
  );
}
