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
            avatar: 'mm',
            meta: ['nick', 'mail'],
            pageSize: 10,
            lang: 'zh-CN',
            visitor: true, // 支持游客留言
            enableQQ: true,
            recordIP: true,
            path: 'guestbook', // 留言板固定路径
            title: '留言板'
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
      <div id="vguestbook"></div>
    </div>
  );
}
