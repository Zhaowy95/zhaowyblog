"use client";

import { useState, useEffect } from "react";
import { GuestbookEntry, GuestbookFormData } from "./types/guestbook";
import dynamic from "next/dynamic";
import Tabs from "@/components/ui/tabs";

// 懒加载留言板组件
const GuestbookForm = dynamic(() => import("./components/GuestbookForm"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded"></div>,
  ssr: false
});

const GuestbookList = dynamic(() => import("./components/GuestbookList"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded"></div>,
  ssr: false
});

export default function GuestbookPage() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 从 localStorage 加载留言数据
  useEffect(() => {
    const loadEntries = () => {
      try {
        const savedEntries = localStorage.getItem("guestbook-entries");
        if (savedEntries) {
          const parsedEntries = JSON.parse(savedEntries);
          // 按时间倒序排列
          const sortedEntries = parsedEntries.sort((a: GuestbookEntry, b: GuestbookEntry) => 
            b.timestamp - a.timestamp
          );
          setEntries(sortedEntries);
        }
      } catch (error) {
        console.error("加载留言数据失败:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, []);

  // 保存留言到 localStorage
  const saveEntry = (entry: GuestbookEntry) => {
    try {
      const updatedEntries = [entry, ...entries];
      localStorage.setItem("guestbook-entries", JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
    } catch (error) {
      console.error("保存留言失败:", error);
      throw error;
    }
  };

  // 处理表单提交
  const handleSubmit = async (formData: GuestbookFormData) => {
    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      identity: formData.identity.trim() || undefined,
      contact: formData.contact.trim() || undefined,
      content: formData.content.trim(),
      timestamp: Date.now(),
      createdAt: new Date().toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    await saveEntry(newEntry);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  const tabItems = [
    {
      id: "write",
      label: "写留言",
      content: <GuestbookForm onSubmit={handleSubmit} />
    },
    {
      id: "list",
      label: "看留言",
      content: <GuestbookList entries={entries} />
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-lg text-gray-600">
          欢迎在这里留下您的想法、建议或任何想说的话。我会认真阅读每一条留言！
        </p>
      </div>
      
      <Tabs items={tabItems} defaultTab="write" />
    </div>
  );
}
