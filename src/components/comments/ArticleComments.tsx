"use client";

import { useState, useEffect } from "react";

interface Comment {
  id: string;
  content: string;
  timestamp: number;
  createdAt: string;
}

interface ArticleCommentsProps {
  articleId: string;
}

export default function ArticleComments({ articleId }: ArticleCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    loadComments();
  }, [articleId]);

  const loadComments = () => {
    try {
      const savedComments = localStorage.getItem(`article-comments-${articleId}`);
      if (savedComments) {
        const parsedComments = JSON.parse(savedComments);
        setComments(parsedComments.sort((a: Comment, b: Comment) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.error("加载评论失败:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment.trim(),
        timestamp: Date.now(),
        createdAt: new Date().toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const updatedComments = [comment, ...comments];
      localStorage.setItem(`article-comments-${articleId}`, JSON.stringify(updatedComments));
      setComments(updatedComments);
      setNewComment("");
    } catch (error) {
      console.error("提交评论失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          评论 ({comments.length})
        </h3>
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showComments ? "收起评论" : "查看评论"}
        </button>
      </div>

      {showComments && (
        <div className="space-y-6">
          {/* 评论表单 */}
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="写下您的想法..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? "提交中..." : "发表评论"}
              </button>
            </div>
          </form>

          {/* 评论列表 */}
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              还没有评论，来成为第一个评论的人吧！
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500">匿名用户</span>
                    <time className="text-sm text-gray-500">{comment.createdAt}</time>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
