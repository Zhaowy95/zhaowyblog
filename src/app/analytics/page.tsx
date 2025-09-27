"use client";

import Link from "next/link";
import { useAnalyticsData } from "@/components/AnalyticsDataProvider";

export default function AnalyticsPage() {
  const { analytics, isLoading } = useAnalyticsData();

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
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* 总体统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">总访问量</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics.totalVisits.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">独立访客</h3>
          <p className="text-3xl font-bold text-green-600">{analytics.uniqueVisitors.toLocaleString()}</p>
        </div>
      </div>

      {/* 近7天数据 */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">近7天访问趋势</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">日期</th>
                <th className="text-center py-3 px-4">访问量</th>
                <th className="text-center py-3 px-4">独立访客</th>
              </tr>
            </thead>
            <tbody>
              {analytics.dailyStats.map((day, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{day.date}</td>
                  <td className="text-center py-3 px-4">{day.visits}</td>
                  <td className="text-center py-3 px-4">{day.uniqueVisitors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* 设备统计 */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">访问设备分布</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analytics.deviceStats.mobile}</div>
            <div className="text-gray-600">移动端</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{analytics.deviceStats.desktop}</div>
            <div className="text-gray-600">桌面端</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{analytics.deviceStats.tablet}</div>
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
                <th className="text-center py-3 px-4">历史累计</th>
                <th className="text-center py-3 px-4">今天访问</th>
                <th className="text-center py-3 px-4">历史独立访客</th>
                <th className="text-center py-3 px-4">今天独立访客</th>
              </tr>
            </thead>
            <tbody>
              {analytics.blogStats.map((blog, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link 
                      href={`/blog/${blog.slug}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {blog.title}
                    </Link>
                  </td>
                  <td className="text-center py-3 px-4">{blog.views}</td>
                  <td className="text-center py-3 px-4 text-green-600 font-semibold">{blog.todayViews}</td>
                  <td className="text-center py-3 px-4">{blog.uniqueViews}</td>
                  <td className="text-center py-3 px-4 text-green-600 font-semibold">{blog.todayUniqueViews}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
