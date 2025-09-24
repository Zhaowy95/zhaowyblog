"use client";

import { useState } from "react";
import { GuestbookFormData, GuestbookFormErrors } from "../types/guestbook";

interface GuestbookFormProps {
  onSubmit: (data: GuestbookFormData) => void;
}

export default function GuestbookForm({ onSubmit }: GuestbookFormProps) {
  const [formData, setFormData] = useState<GuestbookFormData>({
    identity: "",
    contact: "",
    content: "",
  });

  const [errors, setErrors] = useState<GuestbookFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: GuestbookFormErrors = {};

    if (!formData.content.trim()) {
      newErrors.content = "留言内容不能为空";
    } else if (formData.content.trim().length < 10) {
      newErrors.content = "留言内容至少需要10个字符";
    } else if (formData.content.trim().length > 500) {
      newErrors.content = "留言内容不能超过500个字符";
    }

    if (formData.contact.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const wechatRegex = /^@/;
      
      if (!emailRegex.test(formData.contact) && !wechatRegex.test(formData.contact)) {
        newErrors.contact = "请输入有效的邮箱地址或微信号（以@开头）";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      setFormData({
        identity: "",
        contact: "",
        content: "",
      });
      setErrors({});
    } catch (error) {
      console.error("提交留言失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof GuestbookFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof GuestbookFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">留下您的留言</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="identity" className="block text-sm font-medium text-gray-700 mb-2">
            身份/职业 <span className="text-gray-400">(选填)</span>
          </label>
          <input
            type="text"
            id="identity"
            value={formData.identity}
            onChange={(e) => handleInputChange("identity", e.target.value)}
            placeholder="例如：产品经理、学生、开发者等"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
            联系方式 <span className="text-gray-400">(选填)</span>
          </label>
          <input
            type="text"
            id="contact"
            value={formData.contact}
            onChange={(e) => handleInputChange("contact", e.target.value)}
            placeholder="邮箱地址或微信号（如：@your_wechat）"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.contact ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.contact && (
            <p className="mt-1 text-sm text-red-600">{errors.contact}</p>
          )}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            留言内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="请在这里写下您的想法、建议或任何想说的话..."
            rows={6}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.content ? "border-red-500" : "border-gray-300"
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content}</p>
            )}
            <p className="text-sm text-gray-500 ml-auto">
              {formData.content.length}/500
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "提交中..." : "提交留言"}
        </button>
      </form>
    </div>
  );
}
