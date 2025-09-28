"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { allBlogs } from "content-collections";

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

// 创建Context
const AnalyticsContext = createContext<{
  analytics: AnalyticsData;
  isLoading: boolean;
}>({
  analytics: {
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
    deviceStats: { mobile: 0, desktop: 0, tablet: 0 },
    blogStats: [],
    dailyStats: [],
  },
  isLoading: true,
});

// LeanCloud配置
const LEANCLOUD_APP_ID = 'tNNnez7lGPAvJR1m7SJmdgWr-gzGzoHsz';
const LEANCLOUD_APP_KEY = 'qQyqSoZuGOaEIj7Urq6U0A0B';
const LEANCLOUD_SERVER_URL = 'https://tnnnez71.lc-cn-n1-shared.com';

export function useAnalyticsData() {
  return useContext(AnalyticsContext);
}

function AnalyticsDataProviderInternal({ children }: { children: React.ReactNode }) {
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
    deviceStats: { mobile: 0, desktop: 0, tablet: 0 },
    blogStats: [],
    dailyStats: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // 动态加载LeanCloud SDK
        if (!window.AV) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/leancloud-storage@4.12.0/dist/av-min.js';
          script.onload = () => {
            initializeLeanCloud();
          };
          document.head.appendChild(script);
          return;
        }
        
        initializeLeanCloud();
      } catch (error) {
        console.error('Analytics data fetch error:', error);
        setIsLoading(false);
      }
    };

    const initializeLeanCloud = () => {
      try {
        // 初始化LeanCloud
        window.AV.init({
          appId: LEANCLOUD_APP_ID,
          appKey: LEANCLOUD_APP_KEY,
          serverURL: LEANCLOUD_SERVER_URL
        });

        // 获取所有分析数据 - 使用分页查询获取所有数据
        const Analytics = window.AV.Object.extend('Analytics');
        const allRecords = [];
        let skip = 0;
        const limit = 100; // LeanCloud最大限制
        
        const fetchAllRecords = async () => {
          while (true) {
            const query = new window.AV.Query(Analytics);
            query.limit(limit);
            query.skip(skip);
            query.descending('createdAt');
            
            const batch = await query.find();
            if (batch.length === 0) break;
            
            allRecords.push(...batch);
            skip += limit;
            
            // 防止无限循环
            if (skip > 10000) break;
          }
          return allRecords;
        };

        fetchAllRecords().then((records: any[]) => {
          console.log('Analytics records:', records.length);
          
          if (records.length === 0) {
            setIsLoading(false);
            return;
          }

          // 计算总体统计
          const totalVisits = records.length;
          const todayTimestamp = new Date();
          todayTimestamp.setHours(0, 0, 0, 0);
          const todayVisits = records.filter((record: any) => {
            const recordTime = parseInt(record.get('timestamp'));
            return recordTime >= todayTimestamp.getTime();
          }).length;

          // 计算独立访客（基于IP）
          const allIPs = records.map((record: any) => record.get('ip')).filter(Boolean);
          const uniqueVisitors = new Set(allIPs).size;

          // 计算页面级统计
          const pageStats = {
            homepage: { visits: 0, uniqueVisitors: 0 },
            blogList: { visits: 0, uniqueVisitors: 0 },
            analytics: { visits: 0, uniqueVisitors: 0 },
            guestbook: { visits: 0, uniqueVisitors: 0 },
            write: { visits: 0, uniqueVisitors: 0 },
            other: { visits: 0, uniqueVisitors: 0 },
          };

          records.forEach((record: any) => {
            const path = record.get('path') || '';
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
              pageStats.other.visits++;
            } else {
              pageStats.other.visits++;
            }
          });

          // 计算各页面独立访客
          const homepageIPs = new Set(records.filter((r: any) => r.get('path') === '/' || r.get('path') === '').map((r: any) => r.get('ip')).filter(Boolean));
          const blogListIPs = new Set(records.filter((r: any) => r.get('path') === '/blog').map((r: any) => r.get('ip')).filter(Boolean));
          const analyticsIPs = new Set(records.filter((r: any) => r.get('path') === '/analytics').map((r: any) => r.get('ip')).filter(Boolean));
          const guestbookIPs = new Set(records.filter((r: any) => r.get('path') === '/guestbook').map((r: any) => r.get('ip')).filter(Boolean));
          const writeIPs = new Set(records.filter((r: any) => r.get('path') === '/write').map((r: any) => r.get('ip')).filter(Boolean));
          const otherIPs = new Set(records.filter((r: any) => {
            const path = r.get('path') || '';
            return path.startsWith('/blog/') || (path !== '/' && path !== '/blog' && path !== '/analytics' && path !== '/guestbook' && path !== '/write');
          }).map((r: any) => r.get('ip')).filter(Boolean));

          pageStats.homepage.uniqueVisitors = homepageIPs.size;
          pageStats.blogList.uniqueVisitors = blogListIPs.size;
          pageStats.analytics.uniqueVisitors = analyticsIPs.size;
          pageStats.guestbook.uniqueVisitors = guestbookIPs.size;
          pageStats.write.uniqueVisitors = writeIPs.size;
          pageStats.other.uniqueVisitors = otherIPs.size;

          // 计算设备统计
          const deviceStats = { mobile: 0, desktop: 0, tablet: 0 };
          records.forEach((record: any) => {
            const device = record.get('device') || 'desktop';
            if (device === 'mobile') deviceStats.mobile++;
            else if (device === 'tablet') deviceStats.tablet++;
            else deviceStats.desktop++;
          });

          // 计算文章统计
          const blogViews: { [key: string]: { views: number; uniqueViews: number; todayViews: number; todayUniqueViews: number } } = {};
          
          records.forEach((record: any) => {
            if (record.get('type') === 'blog_view') {
              const slug = record.get('blogSlug');
              const title = record.get('blogTitle');
              if (slug && title) {
                if (!blogViews[slug]) {
                  blogViews[slug] = { views: 0, uniqueViews: 0, todayViews: 0, todayUniqueViews: 0 };
                }
                blogViews[slug].views++;
              }
            }
          });

          // 计算文章独立访客
          Object.keys(blogViews).forEach(slug => {
            const blogRecords = records.filter((r: any) => r.get('type') === 'blog_view' && r.get('blogSlug') === slug);
            const uniqueIPs = new Set(blogRecords.map((r: any) => r.get('ip')).filter(Boolean));
            blogViews[slug].uniqueViews = uniqueIPs.size;
          });

          // 计算今日文章访问
          Object.keys(blogViews).forEach(slug => {
            const todayBlogRecords = records.filter((record: any) => {
              const recordTime = parseInt(record.get('timestamp'));
              return recordTime >= todayTimestamp.getTime() && 
                     record.get('type') === 'blog_view' && 
                     record.get('blogSlug') === slug;
            });
            blogViews[slug].todayViews = todayBlogRecords.length;
            
            const todayBlogIPs = new Set(todayBlogRecords.map((r: any) => r.get('ip')).filter(Boolean));
            blogViews[slug].todayUniqueViews = todayBlogIPs.size;
          });

          // 获取当前存在的博客文章列表
          const currentBlogSlugs = allBlogs.map((blog: any) => blog.slug);
          
          // 只显示当前存在的博客文章的统计数据
          const blogStats = Object.keys(blogViews)
            .filter(slug => currentBlogSlugs.includes(slug)) // 只包含当前存在的博客
            .map(slug => ({
              title: records.find((r: any) => r.get('blogSlug') === slug)?.get('blogTitle') || 'Unknown',
              slug,
              views: blogViews[slug].views,
              uniqueViews: blogViews[slug].uniqueViews,
              todayViews: blogViews[slug].todayViews,
              todayUniqueViews: blogViews[slug].todayUniqueViews,
            })).sort((a, b) => b.views - a.views);

          // 计算近7天趋势
          const dailyStats = [];
          for (let i = 0; i <= 6; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const startOfDay = date.getTime();
            const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;
            
            const dayRecords = records.filter((record: any) => {
              const recordTime = parseInt(record.get('timestamp'));
              return recordTime >= startOfDay && recordTime <= endOfDay;
            });
            
            const dayIPs = new Set(dayRecords.map((r: any) => r.get('ip')).filter(Boolean));
            
            // 使用本地时间格式化，避免UTC时区转换问题
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;
            
            dailyStats.push({
              date: dateString,
              visits: dayRecords.length,
              uniqueVisitors: dayIPs.size
            });
          }

          setAnalytics({
            totalVisits,
            uniqueVisitors,
            todayVisits,
            pageStats,
            deviceStats,
            blogStats,
            dailyStats,
          });
        }).catch((error: any) => {
          console.error('LeanCloud query error:', error);
        });
      } catch (error) {
        console.error('LeanCloud initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <AnalyticsContext.Provider value={{ analytics, isLoading }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// Context Provider组件
export default function AnalyticsDataProvider({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsDataProviderInternal>
      {children}
    </AnalyticsDataProviderInternal>
  );
}