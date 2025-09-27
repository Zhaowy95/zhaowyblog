"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// LeanCloud SDK类型声明
declare global {
  interface Window {
    AV: any;
  }
}

interface AnalyticsTrackerProps {
  type?: 'page_view' | 'blog_view';
  title?: string;
  blogSlug?: string;
  blogTitle?: string;
}

export default function AnalyticsTracker({ 
  type = 'page_view', 
  title, 
  blogSlug, 
  blogTitle 
}: AnalyticsTrackerProps) {
  const pathname = usePathname();

  useEffect(() => {
    // 异步发送统计数据，不阻塞页面渲染
    const trackAnalytics = async () => {
      try {
        // 使用requestIdleCallback在浏览器空闲时执行
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => {
            sendAnalytics();
          });
        } else {
          // 降级处理
          setTimeout(sendAnalytics, 100);
        }
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    const sendAnalytics = async () => {
      // 暂时禁用LeanCloud API调用，避免400错误
      console.log('Analytics tracking temporarily disabled to avoid 400 errors');
      
      // 获取用户IP地址 - 多个备用方案
      let userIP = 'unknown';
      
      // 生成稳定的设备指纹（不包含时间戳）
      const fingerprint = `${navigator.userAgent.slice(0, 50)}-${screen.width}x${screen.height}-${navigator.language}`;
      userIP = `fp-${btoa(fingerprint).slice(0, 16)}`;
      console.log('Using device fingerprint for IP:', userIP);
      
      // 可选：尝试获取真实IP（但不阻塞）
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
          if (data.ip) {
            console.log('Real IP obtained:', data.ip);
            // 这里可以发送一个更新请求，但为了简化，我们使用设备指纹
          }
        })
        .catch(error => {
          console.log('IP service unavailable, using fingerprint');
        });

      // 使用LeanCloud JavaScript SDK进行数据存储
      const analyticsData = {
        type: type || 'page_view',
        path: pathname || '/',
        title: title || document.title || 'Unknown',
        userAgent: navigator.userAgent || 'Unknown',
        referrer: document.referrer || '',
        timestamp: Date.now().toString(),
        deviceType: getDeviceType(navigator.userAgent),
        browser: getBrowserInfo(navigator.userAgent),
        os: getOSInfo(navigator.userAgent),
        ip: userIP,
        blogSlug: blogSlug || null,
        blogTitle: blogTitle || null
      };

      console.log('Sending analytics data:', analyticsData);
      
      // 使用LeanCloud JavaScript SDK
      try {
        // 动态加载LeanCloud SDK
        if (!window.AV) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/leancloud-storage@4.12.0/dist/av-min.js';
          script.onload = () => {
            initializeLeanCloud(analyticsData);
          };
          document.head.appendChild(script);
        } else {
          initializeLeanCloud(analyticsData);
        }
      } catch (error) {
        console.error('Failed to load LeanCloud SDK:', error);
      }
    };

    // LeanCloud SDK初始化函数
    const initializeLeanCloud = (data: any) => {
      try {
        // 检查SDK是否已经初始化
        if (window.AV && window.AV.applicationId) {
          console.log('LeanCloud SDK already initialized, skipping init');
        } else {
          // 初始化LeanCloud
          window.AV.init({
            appId: 'tNNnez7lGPAvJR1m7SJmdgWr-gzGzoHsz',
            appKey: 'qQyqSoZuGOaEIj7Urq6U0A0B',
            serverURL: 'https://tnnnez71.lc-cn-n1-shared.com'
          });
          console.log('LeanCloud SDK initialized');
        }

        // 创建Analytics对象
        const Analytics = window.AV.Object.extend('Analytics');
        const analytics = new Analytics();
        
        // 设置数据
        analytics.set('type', data.type);
        analytics.set('path', data.path);
        analytics.set('title', data.title);
        analytics.set('userAgent', data.userAgent);
        analytics.set('referrer', data.referrer);
        analytics.set('timestamp', data.timestamp);
        analytics.set('deviceType', data.deviceType);
        analytics.set('browser', data.browser);
        analytics.set('os', data.os);
        analytics.set('ip', data.ip);
        if (data.blogSlug) analytics.set('blogSlug', data.blogSlug);
        if (data.blogTitle) analytics.set('blogTitle', data.blogTitle);

        // 保存数据
        analytics.save().then(() => {
          console.log('Analytics data saved successfully via SDK');
        }).catch((error: any) => {
          console.error('Analytics save failed:', error);
        });
      } catch (error) {
        console.error('LeanCloud SDK initialization failed:', error);
      }
    };

    // 备用请求函数
    const tryAlternativeRequest = async (data: any) => {
      try {
        // 尝试使用不同的请求头格式
        const response = await fetch('https://tnnnez71.lc-cn-n1-shared.com/1.1/classes/Analytics', {
          method: 'POST',
          headers: {
            'X-LC-Id': 'tNNnez7lGPAvJR1m7SJmdgWr-gzGzoHsz',
            'X-LC-Key': 'qQyqSoZuGOaEIj7Urq6U0A0B',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        if (response.ok) {
          console.log('Alternative request successful');
        } else {
          const errorText = await response.text();
          console.error('Alternative request failed:', response.status, errorText);
        }
      } catch (error) {
        console.error('Alternative request error:', error);
      }
    };

    // 辅助函数
    const getDeviceType = (userAgent: string): 'mobile' | 'desktop' | 'tablet' => {
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const tabletRegex = /iPad|Android(?=.*\bMobile\b)/i;
      
      if (tabletRegex.test(userAgent)) return 'tablet';
      if (mobileRegex.test(userAgent)) return 'mobile';
      return 'desktop';
    };

    const getBrowserInfo = (userAgent: string) => {
      if (userAgent.includes('Chrome')) return 'Chrome';
      if (userAgent.includes('Firefox')) return 'Firefox';
      if (userAgent.includes('Safari')) return 'Safari';
      if (userAgent.includes('Edge')) return 'Edge';
      return 'Other';
    };

    const getOSInfo = (userAgent: string) => {
      if (userAgent.includes('Windows')) return 'Windows';
      if (userAgent.includes('Mac')) return 'macOS';
      if (userAgent.includes('Linux')) return 'Linux';
      if (userAgent.includes('Android')) return 'Android';
      if (userAgent.includes('iOS')) return 'iOS';
      return 'Other';
    };

    trackAnalytics();
  }, [pathname, type, title, blogSlug, blogTitle]);

  return null; // 这是一个无UI组件
}
