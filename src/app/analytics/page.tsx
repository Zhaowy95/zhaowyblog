"use client";

import { useState, useEffect } from "react";

interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  blogStats: Array<{
    title: string;
    slug: string;
    views: number;
    comments: number;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 0,
    uniqueVisitors: 0,
    todayVisits: 0,
    deviceStats: {
      mobile: 0,
      desktop: 0,
      tablet: 0,
    },
    blogStats: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模拟获取统计数据
    const fetchAnalytics = async () => {
      try {
        // 这里应该调用后端API获取真实数据
        // 目前使用模拟数据
        const mockData: AnalyticsData = {
          totalVisits: 1256,
          uniqueVisitors: 423,
          todayVisits: 28,
          deviceStats: {
            mobile: 65,
            desktop: 30,
            tablet: 5,
          },
          blogStats: [
            { title: "产品经理转独立开发之路", slug: "independent-developer-journey", views: 156, comments: 8 },
            { title: "前端学习笔记", slug: "frontend-learning-notes", views: 134, comments: 5 },
            { title: "2025年技术趋势", slug: "tech-trends-2025", views: 98, comments: 3 },
            { title: "创业经验分享", slug: "startup-experience", views: 87, comments: 6 },
          ],
        };
        
        setAnalytics(mockData);
      } catch (error) {
        console.error("获取统计数据失败:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">网站统计</h1>
        <p className="text-gray-600">实时监控网站访问情况和内容表现</p>
      </div>

      {/* 总体统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">总访问量</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics.totalVisits.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">独立访客</h3>
          <p className="text-3xl font-bold text-green-600">{analytics.uniqueVisitors.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">今日访问</h3>
          <p className="text-3xl font-bold text-orange-600">{analytics.todayVisits}</p>
        </div>
      </div>

      {/* 设备统计 */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">访问设备分布</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analytics.deviceStats.mobile}%</div>
            <div className="text-gray-600">移动端</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{analytics.deviceStats.desktop}%</div>
            <div className="text-gray-600">桌面端</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{analytics.deviceStats.tablet}%</div>
            <div className="text-gray-600">平板端</div>
          </div>
        </div>
      </div>

      {/* 博客统计 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">文章表现</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">文章标题</th>
                <th className="text-center py-3 px-4">浏览量</th>
                <th className="text-center py-3 px-4">评论数</th>
              </tr>
            </thead>
            <tbody>
              {analytics.blogStats.map((blog, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <a 
                      href={`/blog/${blog.slug}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {blog.title}
                    </a>
                  </td>
                  <td className="text-center py-3 px-4">{blog.views}</td>
                  <td className="text-center py-3 px-4">{blog.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
