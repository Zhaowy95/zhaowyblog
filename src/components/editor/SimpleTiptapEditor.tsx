"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState, useEffect } from 'react';

interface SimpleTiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function SimpleTiptapEditor({ content, onChange, placeholder }: SimpleTiptapEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
        placeholder: placeholder || '请输入文章内容...',
      },
    },
  });

  if (!isMounted || !editor) {
    return (
      <div className="border border-gray-300 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500">加载编辑器中...</div>
      </div>
    );
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode; 
    title: string;
  }) => (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-3 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex gap-1 mr-4">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="粗体 (Ctrl+B)"
          >
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="斜体 (Ctrl+I)"
          >
            <em>I</em>
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="flex gap-1 mr-4">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="标题 1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="标题 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="标题 3"
          >
            H3
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div className="flex gap-1 mr-4">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="无序列表"
          >
            • 列表
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="有序列表"
          >
            1. 列表
          </ToolbarButton>
        </div>

        {/* Code */}
        <div className="flex gap-1 mr-4">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="行内代码"
          >
            &lt;/&gt;
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
            title="代码块"
          >
            { }
          </ToolbarButton>
        </div>

        {/* Preview Toggle */}
        <div className="flex gap-1 ml-auto">
          <ToolbarButton
            onClick={() => setIsPreview(!isPreview)}
            isActive={isPreview}
            title="切换预览模式"
          >
            {isPreview ? '编辑' : '预览'}
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[400px]">
        {isPreview ? (
          <div 
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto p-4"
            dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
          />
        ) : (
          <EditorContent 
            editor={editor} 
            className="min-h-[400px]"
          />
        )}
      </div>
    </div>
  );
}
