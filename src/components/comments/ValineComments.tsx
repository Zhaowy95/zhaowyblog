"use client";

import { useEffect, useRef } from 'react';

// Valine类型声明
declare global {
  interface Window {
    Valine: any;
  }
}

interface ValineCommentsProps {
  articleId: string;
  title?: string;
}

export default function ValineComments({ articleId, title }: ValineCommentsProps) {
  const initializedRef = useRef(false);

  const initializeValine = () => {
    if (initializedRef.current) {
      console.log('Valine already initialized for this component');
      return;
    }
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
          // 切换为中国区节点（与你的应用一致）。如需省略也可删除 serverURLs，由 SDK 自动匹配。
          serverURLs: 'https://tnnnez71.lc-cn-n1-shared.com'
        });
        initializedRef.current = true;
      } catch (error) {
        console.error('Valine初始化失败:', error);
      }
    }
  };

  useEffect(() => {
    // 防止重复初始化
    if (window.Valine && document.querySelector('#vcomments .vc-container')) {
      console.log('Valine already initialized, skipping');
      return;
    }

    // 清理之前的实例
    const existingContainer = document.getElementById('vcomments');
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
