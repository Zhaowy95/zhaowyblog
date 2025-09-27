"use client";

import { useState } from "react";
import { config } from "@/lib/config";
import { useRouter } from "next/navigation";

interface PasswordAuthProps {
  onSuccess: () => void;
}

export default function PasswordAuth({ onSuccess }: PasswordAuthProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 简单的密码验证（生产环境建议使用更安全的加密方式）
      if (password === config.auth.password) {
        // 保存认证状态到 localStorage
        localStorage.setItem("blog-auth", "true");
        localStorage.setItem("blog-auth-time", Date.now().toString());
        console.log("密码验证成功，调用onSuccess回调");
        onSuccess();
      } else {
        setError("密码错误，请重新输入");
      }
    } catch (error) {
      console.error("认证错误:", error);
      setError("验证失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            博主身份验证
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            请输入密码以进入写博客界面
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="请输入密码"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "验证中..." : "验证身份"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-500 text-sm"
            >
              返回博客
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
