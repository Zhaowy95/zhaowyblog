"use client";

import Link from "next/link";
import { useAnalyticsData } from "@/components/AnalyticsDataProvider";
import { useState } from "react";

export default function AnalyticsPage() {
  const { analytics, isLoading } = useAnalyticsData();
  const [activeTab, setActiveTab] = useState<'visits' | 'unique'>('visits');

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

      {/* 总体统计 - 移动端优化：一行展示 */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">总访问量</h3>
          <p className="text-xl font-bold text-blue-600">{analytics.totalVisits.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">独立访客</h3>
          <p className="text-xl font-bold text-green-600">{analytics.uniqueVisitors.toLocaleString()}</p>
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
        
        {/* Tab选择 */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('visits')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'visits'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            访问量
          </button>
          <button
            onClick={() => setActiveTab('unique')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'unique'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            独立访问
          </button>
        </div>

        {/* 基础设备统计 - 移动端优化：3个数据放一排 */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="text-center bg-blue-50 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-600">
              {activeTab === 'visits' ? analytics.deviceStats.mobile : 
               Object.values(analytics.detailedBrowserStats.mobile).reduce((sum, browser) => sum + browser.uniqueVisitors, 0)}
            </div>
            <div className="text-xs text-gray-600">移动端</div>
          </div>
          <div className="text-center bg-green-50 rounded-lg p-3">
            <div className="text-lg font-bold text-green-600">
              {activeTab === 'visits' ? analytics.deviceStats.desktop : 
               Object.values(analytics.detailedBrowserStats.desktop).reduce((sum, browser) => sum + browser.uniqueVisitors, 0)}
            </div>
            <div className="text-xs text-gray-600">桌面端</div>
          </div>
          <div className="text-center bg-orange-50 rounded-lg p-3">
            <div className="text-lg font-bold text-orange-600">
              {activeTab === 'visits' ? analytics.deviceStats.tablet : 
               Object.values(analytics.detailedBrowserStats.tablet).reduce((sum, browser) => sum + browser.uniqueVisitors, 0)}
            </div>
            <div className="text-xs text-gray-600">平板端</div>
          </div>
        </div>

        {/* 详细浏览器统计 - 列表形式 */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold">设备类型</th>
                <th className="text-left py-3 px-4 font-semibold">浏览器</th>
                <th className="text-center py-3 px-4 font-semibold">
                  {activeTab === 'visits' ? '访问量' : '独立访问'}
                </th>
              </tr>
            </thead>
            <tbody>
              {/* 桌面端浏览器 */}
              {Object.entries(analytics.detailedBrowserStats.desktop)
                .sort(([,a], [,b]) => (activeTab === 'visits' ? b.visits : b.uniqueVisitors) - (activeTab === 'visits' ? a.visits : a.uniqueVisitors))
                .map(([browser, stats]) => (
                  <tr key={`desktop-${browser}`} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        桌面端
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{browser}</td>
                    <td className="py-3 px-4 text-center font-bold text-green-600">
                      {activeTab === 'visits' ? stats.visits : stats.uniqueVisitors}
                    </td>
                  </tr>
                ))}

              {/* 移动端浏览器 */}
              {Object.entries(analytics.detailedBrowserStats.mobile)
                .sort(([,a], [,b]) => (activeTab === 'visits' ? b.visits : b.uniqueVisitors) - (activeTab === 'visits' ? a.visits : a.uniqueVisitors))
                .map(([browser, stats]) => (
                  <tr key={`mobile-${browser}`} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        移动端
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{browser}</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-600">
                      {activeTab === 'visits' ? stats.visits : stats.uniqueVisitors}
                    </td>
                  </tr>
                ))}

              {/* 平板端浏览器 */}
              {Object.entries(analytics.detailedBrowserStats.tablet)
                .sort(([,a], [,b]) => (activeTab === 'visits' ? b.visits : b.uniqueVisitors) - (activeTab === 'visits' ? a.visits : a.uniqueVisitors))
                .map(([browser, stats]) => (
                  <tr key={`tablet-${browser}`} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        平板端
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{browser}</td>
                    <td className="py-3 px-4 text-center font-bold text-orange-600">
                      {activeTab === 'visits' ? stats.visits : stats.uniqueVisitors}
                    </td>
                  </tr>
                ))}

              {/* 无数据提示 */}
              {Object.keys(analytics.detailedBrowserStats.desktop).length === 0 && 
               Object.keys(analytics.detailedBrowserStats.mobile).length === 0 && 
               Object.keys(analytics.detailedBrowserStats.tablet).length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 px-4 text-center text-gray-500">
                    暂无浏览器访问数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
