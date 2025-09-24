"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import { useState } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Strike,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  if (!editor) {
    return null;
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

  const addImage = () => {
    const url = window.prompt('请输入图片URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('请输入链接URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

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
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="下划线 (Ctrl+U)"
          >
            <u>U</u>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="删除线"
          >
            <s>S</s>
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

        {/* Alignment */}
        <div className="flex gap-1 mr-4">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
            title="左对齐"
          >
            ⬅️
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
            title="居中对齐"
          >
            ↔️
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            isActive={editor.isActive({ textAlign: 'right' })}
            title="右对齐"
          >
            ➡️
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

        {/* Media */}
        <div className="flex gap-1 mr-4">
          <ToolbarButton
            onClick={addImage}
            title="插入图片"
          >
            🖼️
          </ToolbarButton>
          <ToolbarButton
            onClick={addLink}
            title="插入链接"
          >
            🔗
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
