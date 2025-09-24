"use client";

import { useEffect, useState } from 'react';

interface ValineCommentsProps {
  articleId: string;
  title?: string;
}

export default function ValineCommentsDebug({ articleId, title }: ValineCommentsProps) {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
    console.log(`[Valine Debug] ${info}`);
  };

  useEffect(() => {
    addDebugInfo(`开始初始化Valine，文章ID: ${articleId}`);
    
    // 清理之前的实例
    const existingContainer = document.getElementById('vcomments');
    if (existingContainer) {
      existingContainer.innerHTML = '';
      addDebugInfo('清理了之前的容器');
    }

    // 检查是否已经加载了Valine脚本
    const existingScript = document.querySelector('script[src*="valine"]');
    if (existingScript) {
      addDebugInfo('发现已存在的Valine脚本，先移除');
      existingScript.remove();
    }

    // 动态加载Valine
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/valine/dist/Valine.min.js';
    script.async = true;
    
    script.onload = () => {
      addDebugInfo('Valine脚本加载成功');
      
      // 确保Valine已加载
      if (window.Valine) {
        addDebugInfo('window.Valine可用，开始初始化');
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
            visitor: true,
            enableQQ: true,
            recordIP: true,
            path: articleId,
            title: title || '文章评论'
          });
          addDebugInfo('Valine初始化成功');
        } catch (error) {
          addDebugInfo(`Valine初始化失败: ${error}`);
        }
      } else {
        addDebugInfo('window.Valine不可用');
      }
    };

    script.onerror = (error) => {
      addDebugInfo(`Valine脚本加载失败: ${error}`);
    };

    document.head.appendChild(script);
    addDebugInfo('Valine脚本已添加到页面');

    // 清理函数
    return () => {
      addDebugInfo('组件卸载，清理资源');
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
      
      {/* 调试信息 */}
      <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
        <h4 className="font-semibold mb-2">调试信息：</h4>
        <div className="max-h-32 overflow-y-auto">
          {debugInfo.map((info, index) => (
            <div key={index} className="text-xs text-gray-600">{info}</div>
          ))}
        </div>
      </div>
      
      <div id="vcomments"></div>
    </div>
  );
}
