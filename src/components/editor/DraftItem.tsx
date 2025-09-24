interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  date: string;
  status: "draft" | "published";
  featured: boolean;
}

interface DraftItemProps {
  draft: BlogPost;
  onEdit: (draftId: string) => void;
  onDelete: (draftId: string) => void;
  onPublish: (draftId: string) => void;
}

export default function DraftItem({ draft, onEdit, onDelete, onPublish }: DraftItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getContentPreview = (content: string) => {
    // 移除 Markdown 标记，获取纯文本预览
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // 移除标题标记
      .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体标记
      .replace(/\*(.*?)\*/g, '$1') // 移除斜体标记
      .replace(/!\[.*?\]\(.*?\)/g, '[图片]') // 替换图片为文字
      .replace(/\[.*?\]\(.*?\)/g, '[链接]'); // 替换链接为文字
    
    return plainText.length > 100 ? plainText.substring(0, 100) + "..." : plainText;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {draft.title || "无标题"}
          </h3>
          {draft.summary && (
            <p className="text-gray-600 mb-2">{draft.summary}</p>
          )}
          <p className="text-sm text-gray-500 mb-3">
            {getContentPreview(draft.content)}
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>创建时间: {formatDate(draft.date)}</span>
            {draft.featured && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                特色文章
              </span>
            )}
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              草稿
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(draft.id)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            编辑
          </button>
          <button
            onClick={() => onPublish(draft.id)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            发布
          </button>
        </div>
        
        <button
          onClick={() => onDelete(draft.id)}
          className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors text-sm"
        >
          删除
        </button>
      </div>
    </div>
  );
}
