"use client";

import { useEditor, EditorContent } from '@tiptap/react';
// import { useCallback, useMemo } from 'react';
import StarterKit from '@tiptap/starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Underline } from '@tiptap/extension-underline';
import { Superscript } from '@tiptap/extension-superscript';
import { Subscript } from '@tiptap/extension-subscript';
import { Highlight } from '@tiptap/extension-highlight';
import { useState, useEffect } from 'react';

interface AdvancedTiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function AdvancedTiptapEditor({ content, onChange, placeholder }: AdvancedTiptapEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [fontSize, setFontSize] = useState('16px');
  const [textColor, setTextColor] = useState('#000000');
  const [highlightColor, setHighlightColor] = useState('#ffff00');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Underline,
      Superscript,
      Subscript,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[400px] p-4',
        style: `font-size: ${fontSize}; color: ${textColor};`,
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
    title,
    className = ""
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode; 
    title: string;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${className} ${
        isActive 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  const ToolbarSelect = ({ 
    value, 
    onChange, 
    options, 
    title 
  }: { 
    value: string; 
    onChange: (value: string) => void; 
    options: { value: string; label: string }[]; 
    title: string;
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      title={title}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  const insertImage = () => {
    const url = window.prompt('请输入图片URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertLink = () => {
    const url = window.prompt('请输入链接URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const addRow = () => {
    editor.chain().focus().addRowAfter().run();
  };

  const addColumn = () => {
    editor.chain().focus().addColumnAfter().run();
  };

  const deleteRow = () => {
    editor.chain().focus().deleteRow().run();
  };

  const deleteColumn = () => {
    editor.chain().focus().deleteColumn().run();
  };

  const deleteTable = () => {
    editor.chain().focus().deleteTable().run();
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* 主工具栏 */}
      <div className="bg-gray-50 border-b border-gray-200 p-3 space-y-3">
        {/* 第一行：撤销/重做、字体大小、颜色 */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              title="撤销 (Ctrl+Z)"
            >
              ↶
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              title="重做 (Ctrl+Y)"
            >
              ↷
            </ToolbarButton>
          </div>

          <div className="flex gap-1 items-center">
            <span className="text-sm text-gray-600">字体:</span>
            <ToolbarSelect
              value={fontSize}
              onChange={(value) => {
                setFontSize(value);
                editor.commands.updateAttributes('textStyle', { fontSize: value });
              }}
              options={[
                { value: '12px', label: '12px' },
                { value: '14px', label: '14px' },
                { value: '16px', label: '16px' },
                { value: '18px', label: '18px' },
                { value: '20px', label: '20px' },
                { value: '24px', label: '24px' },
                { value: '28px', label: '28px' },
                { value: '32px', label: '32px' },
              ]}
              title="字体大小"
            />
          </div>

          <div className="flex gap-1 items-center">
            <span className="text-sm text-gray-600">颜色:</span>
            <input
              type="color"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value);
                editor.commands.setColor(e.target.value);
              }}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              title="文字颜色"
            />
            <input
              type="color"
              value={highlightColor}
              onChange={(e) => {
                setHighlightColor(e.target.value);
                editor.commands.setHighlight({ color: e.target.value });
              }}
              className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
              title="高亮颜色"
            />
          </div>
        </div>

        {/* 第二行：文本格式 */}
        <div className="flex flex-wrap gap-1">
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
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive('highlight')}
            title="高亮"
          >
            🖍️
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            isActive={editor.isActive('superscript')}
            title="上标"
          >
            x²
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            isActive={editor.isActive('subscript')}
            title="下标"
          >
            x₂
          </ToolbarButton>
        </div>

        {/* 第三行：标题和对齐 */}
        <div className="flex flex-wrap gap-1">
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

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

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
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            isActive={editor.isActive({ textAlign: 'justify' })}
            title="两端对齐"
          >
            ⬌
          </ToolbarButton>
        </div>

        {/* 第四行：列表和代码 */}
        <div className="flex flex-wrap gap-1">
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
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="引用"
          >
            &ldquo; 引用
          </ToolbarButton>
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
            {'{ }'}
          </ToolbarButton>
        </div>

        {/* 第五行：插入和表格 */}
        <div className="flex flex-wrap gap-1">
          <ToolbarButton
            onClick={insertLink}
            title="插入链接"
          >
            🔗 链接
          </ToolbarButton>
          <ToolbarButton
            onClick={insertImage}
            title="插入图片"
          >
            🖼️ 图片
          </ToolbarButton>
          <ToolbarButton
            onClick={insertTable}
            title="插入表格"
          >
            📊 表格
          </ToolbarButton>

          {editor.isActive('table') && (
            <>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <ToolbarButton
                onClick={addRow}
                title="添加行"
              >
                ➕ 行
              </ToolbarButton>
              <ToolbarButton
                onClick={addColumn}
                title="添加列"
              >
                ➕ 列
              </ToolbarButton>
              <ToolbarButton
                onClick={deleteRow}
                title="删除行"
              >
                ➖ 行
              </ToolbarButton>
              <ToolbarButton
                onClick={deleteColumn}
                title="删除列"
              >
                ➖ 列
              </ToolbarButton>
              <ToolbarButton
                onClick={deleteTable}
                title="删除表格"
              >
                🗑️ 表格
              </ToolbarButton>
            </>
          )}
        </div>

        {/* 第六行：预览和清除格式 */}
        <div className="flex flex-wrap gap-1 justify-between">
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().unsetAllMarks().run()}
              title="清除格式"
            >
              🧹 清除格式
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().clearNodes().run()}
              title="清除样式"
            >
              🎨 清除样式
            </ToolbarButton>
          </div>

          <ToolbarButton
            onClick={() => setIsPreview(!isPreview)}
            isActive={isPreview}
            title="切换预览模式"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {isPreview ? '✏️ 编辑' : '👁️ 预览'}
          </ToolbarButton>
        </div>
      </div>

      {/* 编辑器内容 */}
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
