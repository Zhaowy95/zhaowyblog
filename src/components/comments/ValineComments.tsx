"use client";

import { useEffect } from 'react';

interface ValineCommentsProps {
  articleId: string;
  title?: string;
}

export default function ValineComments({ articleId, title }: ValineCommentsProps) {
  useEffect(() => {
    // 清理之前的实例
    const existingContainer = document.getElementById('vcomments');
    if (existingContainer) {
      existingContainer.innerHTML = '';
    }

    // 动态加载Valine
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/valine/dist/Valine.min.js';
    script.async = true;
    
    script.onload = () => {
      // 确保Valine已加载
      if (window.Valine) {
        try {
          new window.Valine({
            el: '#vcomments',
            appId: 'tNNnez7lGPAvJR1m7SJmdgWr-gzGzoHsz',
            appKey: 'qQyqSoZuGOaEIj7Urq6U0A0B',
            placeholder: '请输入评论...',
            avatar: 'mm',
            meta: ['nick', 'mail'],
            pageSize: 10,
            lang: 'zh-CN',
            visitor: true, // 支持游客评论
            enableQQ: true,
            recordIP: true,
            path: articleId, // 使用文章ID作为路径
            title: title || '文章评论',
            serverURLs: {
              api: 'https://tNNnez7l.api.lncldglobal.com',
              img: 'https://tNNnez7l.img.lncldglobal.com',
              realtime: 'https://tNNnez7l.rtm.lncldglobal.com'
            }
          });
        } catch (error) {
          console.error('Valine初始化失败:', error);
        }
      }
    };

    script.onerror = () => {
      console.error('Valine脚本加载失败');
    };

    document.head.appendChild(script);

    // 清理函数
    return () => {
      const existingScript = document.querySelector('script[src*="valine"]');
      if (existingScript) {
        existingScript.remove();
      }
      const vcomments = document.getElementById('vcomments');
      if (vcomments) {
        vcomments.innerHTML = '';
      }
    };
  }, [articleId, title]);

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-lg font-semibold mb-4">评论</h3>
      <div id="vcomments"></div>
    </div>
  );
}
