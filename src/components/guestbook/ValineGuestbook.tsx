"use client";

import { useEffect } from 'react';

export default function ValineGuestbook() {
  useEffect(() => {
    // 清理之前的实例
    const existingContainer = document.getElementById('vguestbook');
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
            el: '#vguestbook',
            appId: 'tNNnez7lGPAvJR1m7SJmdgWr-gzGzoHsz',
            appKey: 'qQyqSoZuGOaEIj7Urq6U0A0B',
            placeholder: '请输入留言...',
            placeholderMail: '联系方式（选填）',
            avatar: 'mm',
            meta: ['nick', 'mail'],
            pageSize: 10,
            lang: 'zh-CN',
            visitor: true, // 支持游客留言
            enableQQ: true,
            recordIP: true,
            path: 'guestbook', // 留言板固定路径
            title: '留言板',
            // 切换为中国区节点（与你的应用一致）。如需省略也可删除 serverURLs，由 SDK 自动匹配。
            serverURLs: 'https://tnnnez71.lc-cn-n1-shared.com'
          });
        } catch (error) {
          console.error('Valine留言板初始化失败:', error);
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
      const vguestbook = document.getElementById('vguestbook');
      if (vguestbook) {
        vguestbook.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">留言板</h3>
      <style jsx>{`
        #vguestbook .vc-count {
          display: none;
        }
        #vguestbook .vc-count::after {
          content: "留言";
        }
        /* 确保所有评论数量显示为"留言" */
        #vguestbook .vc-count,
        #vguestbook [class*="count"],
        #vguestbook [class*="comment"] {
          display: none !important;
        }
        #vguestbook .vc-count::after,
        #vguestbook [class*="count"]::after,
        #vguestbook [class*="comment"]::after {
          content: "留言" !important;
          display: inline !important;
        }
      `}</style>
      <div id="vguestbook"></div>
    </div>
  );
}
