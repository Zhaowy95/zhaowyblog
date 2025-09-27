"use client";

import { useState, useEffect } from 'react';

interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  pageStats: {
    homepage: { visits: number; uniqueVisitors: number };
    blogList: { visits: number; uniqueVisitors: number };
    analytics: { visits: number; uniqueVisitors: number };
    guestbook: { visits: number; uniqueVisitors: number };
    write: { visits: number; uniqueVisitors: number };
    other: { visits: number; uniqueVisitors: number };
  };
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  blogStats: Array<{
    title: string;
    slug: string;
    views: number;
    uniqueViews: number;
    todayViews: number;
    todayUniqueViews: number;
  }>;
  dailyStats: Array<{
    date: string;
    visits: number;
    uniqueVisitors: number;
  }>;
}

// LeanCloud配置
const LEANCLOUD_APP_ID = 'tNNnez7lGPAvJR1m7SJmdgWr-gzGzoHsz';
const LEANCLOUD_APP_KEY = 'qQyqSoZuGOaEIj7Urq6U0A0B';
const LEANCLOUD_SERVER_URL = 'https://tnnnez71.lc-cn-n1-shared.com';

export function useAnalyticsData() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisits: 0,
    pageStats: {
      homepage: { visits: 0, uniqueVisitors: 0 },
      blogList: { visits: 0, uniqueVisitors: 0 },
      analytics: { visits: 0, uniqueVisitors: 0 },
      guestbook: { visits: 0, uniqueVisitors: 0 },
      write: { visits: 0, uniqueVisitors: 0 },
      other: { visits: 0, uniqueVisitors: 0 },
    },
    deviceStats: {
      mobile: 0,
      desktop: 0,
      tablet: 0,
    },
    blogStats: [],
    dailyStats: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // 获取今天的开始时间
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();

        // 获取所有访问数据，限制数量避免重复计算
        const allDataResponse = await fetch(
          `${LEANCLOUD_SERVER_URL}/1.1/classes/Analytics?limit=500&order=-createdAt`,
          {
            headers: {
              'X-LC-Id': LEANCLOUD_APP_ID,
              'X-LC-Key': LEANCLOUD_APP_KEY,
            },
          }
        );
        
        if (!allDataResponse.ok) {
          throw new Error(`LeanCloud API error: ${allDataResponse.status}`);
        }
        
        const allData = await allDataResponse.json();
        const records = allData.results || [];
        
        // 调试信息
        console.log('Analytics records:', records.length);
        console.log('Sample record:', records[0]);
        const allIPs = records.map((r: any) => r.ip).filter(Boolean);
        console.log('All IP addresses:', allIPs);
        console.log('Unique IPs:', [...new Set(allIPs)]);

        // 计算总访问量
        const totalVisits = records.length;

        // 计算今日访问量
        const todayVisits = records.filter((record: any) => 
          record.timestamp >= todayTimestamp
        ).length;

        // 基于IP计算独立访客
        const uniqueIPs = new Set(records.map((record: any) => record.ip).filter(Boolean));
        const uniqueVisitors = uniqueIPs.size;

        // 按页面维度统计
        const pageStats = {
          homepage: { visits: 0, uniqueVisitors: 0 },
          blogList: { visits: 0, uniqueVisitors: 0 },
          analytics: { visits: 0, uniqueVisitors: 0 },
          guestbook: { visits: 0, uniqueVisitors: 0 },
          write: { visits: 0, uniqueVisitors: 0 },
          other: { visits: 0, uniqueVisitors: 0 },
        };

        // 统计各页面访问量
        records.forEach((record: any) => {
          const path = record.path || '';
          const ip = record.ip;
          
          console.log('Processing record:', { path, type: record.type });
          
          if (path === '/' || path === '') {
            pageStats.homepage.visits++;
          } else if (path === '/blog') {
            pageStats.blogList.visits++;
          } else if (path === '/analytics') {
            pageStats.analytics.visits++;
          } else if (path === '/guestbook') {
            pageStats.guestbook.visits++;
          } else if (path === '/write') {
            pageStats.write.visits++;
          } else if (path.startsWith('/blog/')) {
            // 文章详情页
            pageStats.other.visits++;
          } else {
            // 其他页面
            pageStats.other.visits++;
          }
        });

        // 计算各页面独立访客数
        const homepageIPs = new Set(records.filter((r: any) => r.path === '/' || r.path === '').map((r: any) => r.ip).filter(Boolean));
        const blogListIPs = new Set(records.filter((r: any) => r.path === '/blog').map((r: any) => r.ip).filter(Boolean));
        const analyticsIPs = new Set(records.filter((r: any) => r.path === '/analytics').map((r: any) => r.ip).filter(Boolean));
        const guestbookIPs = new Set(records.filter((r: any) => r.path === '/guestbook').map((r: any) => r.ip).filter(Boolean));
        const writeIPs = new Set(records.filter((r: any) => r.path === '/write').map((r: any) => r.ip).filter(Boolean));
        const otherIPs = new Set(records.filter((r: any) => 
          !['/', '/blog', '/analytics', '/guestbook', '/write'].includes(r.path)
        ).map((r: any) => r.ip).filter(Boolean));

        pageStats.homepage.uniqueVisitors = homepageIPs.size;
        pageStats.blogList.uniqueVisitors = blogListIPs.size;
        pageStats.analytics.uniqueVisitors = analyticsIPs.size;
        pageStats.guestbook.uniqueVisitors = guestbookIPs.size;
        pageStats.write.uniqueVisitors = writeIPs.size;
        pageStats.other.uniqueVisitors = otherIPs.size;

        // 获取设备统计
        const deviceStats = {
          mobile: 0,
          desktop: 0,
          tablet: 0,
        };
        
        records.forEach((record: any) => {
          if (record.deviceType === 'mobile') deviceStats.mobile++;
          if (record.deviceType === 'desktop') deviceStats.desktop++;
          if (record.deviceType === 'tablet') deviceStats.tablet++;
        });

        // 获取博客文章统计
        const blogViews = records.filter((record: any) => record.type === 'blog_view');
        const blogStatsMap = new Map();
        
        blogViews.forEach((record: any) => {
          const key = record.blogSlug || 'unknown';
          if (!blogStatsMap.has(key)) {
            blogStatsMap.set(key, {
              title: record.blogTitle || '未知标题',
              slug: record.blogSlug || 'unknown',
              views: 0,
              uniqueViews: new Set()
            });
          }
          const blogStat = blogStatsMap.get(key);
          blogStat.views++;
          if (record.ip) blogStat.uniqueViews.add(record.ip);
        });

        const blogStats = Array.from(blogStatsMap.values()).map(stat => ({
          ...stat,
          uniqueViews: stat.uniqueViews.size,
          todayViews: 0, // 今天访问量
          todayUniqueViews: 0 // 今天独立访客
        })).sort((a, b) => b.views - a.views).slice(0, 10);

        // 计算近7天数据（按时间倒序）
        const dailyStats = [];
        for (let i = 0; i <= 6; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);
          const startOfDay = date.getTime();
          const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;
          
          const dayRecords = records.filter((record: any) => {
            const recordTime = parseInt(record.timestamp);
            return recordTime >= startOfDay && recordTime <= endOfDay;
          });
          
          const dayIPs = new Set(dayRecords.map((r: any) => r.ip).filter(Boolean));
          
          dailyStats.push({
            date: date.toISOString().split('T')[0],
            visits: dayRecords.length,
            uniqueVisitors: dayIPs.size
          });
        }

        // 计算文章今天数据
        const todayBlogStats = blogStats.map(blog => {
          const todayBlogRecords = records.filter((record: any) => {
            const recordTime = parseInt(record.timestamp);
            return recordTime >= todayTimestamp && 
                   record.type === 'blog_view' && 
                   record.blogSlug === blog.slug;
          });
          
          const todayBlogIPs = new Set(todayBlogRecords.map((r: any) => r.ip).filter(Boolean));
          
          return {
            ...blog,
            todayViews: todayBlogRecords.length,
            todayUniqueViews: todayBlogIPs.size
          };
        });

        setAnalytics({
          totalVisits,
          uniqueVisitors,
          todayVisits,
          pageStats,
          deviceStats,
          blogStats: todayBlogStats,
          dailyStats,
        });
      } catch (error) {
        console.error('Analytics data fetch error:', error);
        // 保持默认值
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return { analytics, isLoading };
}
