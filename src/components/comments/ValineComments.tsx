"use client";

import { useEffect } from 'react';

interface ValineCommentsProps {
  articleId: string;
  title?: string;
}

export default function ValineComments({ articleId, title }: ValineCommentsProps) {
  useEffect(() => {
    // 动态加载Valine
    const script = document.createElement('script');
    script.src = '//unpkg.com/valine/dist/Valine.min.js';
    script.onload = () => {
      // 确保Valine已加载
      if (window.Valine) {
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
          serverURLs: 'https://tNNnez7l.api.lncldglobal.com', // LeanCloud API地址
          path: articleId, // 使用文章ID作为路径
          title: title || '文章评论'
        });
      }
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
