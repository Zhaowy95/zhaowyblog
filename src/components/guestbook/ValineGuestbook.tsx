"use client";

import { useEffect, useRef } from 'react';

// Valine类型声明
declare global {
  interface Window {
    Valine: any;
  }
}

export default function ValineGuestbook() {
  const initializedRef = useRef(false);

  const initializeValine = () => {
    if (initializedRef.current) {
      console.log('Valine guestbook already initialized for this component');
      return;
    }
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
        initializedRef.current = true;
      } catch (error) {
        console.error('Valine留言板初始化失败:', error);
      }
    }
  };

  useEffect(() => {
    // 防止重复初始化
    if (window.Valine && document.querySelector('#vguestbook .vc-container')) {
      console.log('Valine guestbook already initialized, skipping');
      return;
    }

    // 清理之前的实例
    const existingContainer = document.getElementById('vguestbook');
    if (existingContainer) {
      existingContainer.innerHTML = '';
    }

    // 检查是否已有Valine脚本
    const existingScript = document.querySelector('script[src*="valine"]');
    if (existingScript) {
      // 如果脚本已存在，直接初始化
      if (window.Valine) {
        initializeValine();
      } else {
        // 等待脚本加载完成
        existingScript.addEventListener('load', initializeValine);
      }
      return;
    }

    // 动态加载Valine
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/valine/dist/Valine.min.js';
    script.async = true;
    
    script.onload = initializeValine;

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
