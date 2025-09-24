"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function WechatErrorPage() {
  const [isWechat, setIsWechat] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isWechatBrowser = /micromessenger/i.test(userAgent);
    setIsWechat(isWechatBrowser);
  }, []);

  if (!isWechat) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">此页面仅适用于微信浏览器</h1>
        <p className="text-gray-600">请在微信中打开此页面。</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-yellow-800 mb-4">
          微信浏览器访问问题
        </h1>
        <div className="space-y-4 text-gray-700">
          <p>如果您在微信中无法正常访问网站，请尝试以下解决方案：</p>
          
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold text-lg mb-2">解决方案 1：清除缓存</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>点击微信右上角的&ldquo;...&rdquo;菜单</li>
              <li>选择&ldquo;刷新&rdquo;或&ldquo;重新加载&rdquo;</li>
              <li>等待页面重新加载</li>
            </ol>
          </div>

          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold text-lg mb-2">解决方案 2：使用浏览器打开</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>点击微信右上角的&ldquo;...&rdquo;菜单</li>
              <li>选择&ldquo;在浏览器中打开&rdquo;</li>
              <li>选择&ldquo;Safari&rdquo;或&ldquo;Chrome&rdquo;等浏览器</li>
            </ol>
          </div>

          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold text-lg mb-2">解决方案 3：检查网络</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>确保网络连接正常</li>
              <li>尝试切换到WiFi或移动数据</li>
              <li>重新打开微信</li>
            </ol>
          </div>

          <div className="mt-6">
            <Link 
              href="/" 
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
