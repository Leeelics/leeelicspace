"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("用户名和密码不能为空");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // 简单的本地验证 - 实际项目中应使用更安全的认证方式
      if (username === "admin" && password === "admin-secret") {
        // 保存登录状态到localStorage
        localStorage.setItem("adminLoggedIn", "true");
        router.push("/dashboard");
      } else {
        setError("用户名或密码错误");
      }
    } catch {
      setError("登录失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-catppuccin-base">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow dark:bg-catppuccin-surface0 dark:border-catppuccin-surface1">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-catppuccin-text">
            管理后台登录
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-catppuccin-subtext0">
            请输入您的管理员凭证
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-catppuccin-red dark:border-red-900/40">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-catppuccin-subtext1"
              >
                用户名
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-catppuccin-surface1 dark:border-catppuccin-surface2 dark:text-catppuccin-text dark:focus:ring-catppuccin-blue dark:focus:border-catppuccin-blue"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-catppuccin-subtext1"
              >
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-catppuccin-surface1 dark:border-catppuccin-surface2 dark:text-catppuccin-text dark:focus:ring-catppuccin-blue dark:focus:border-catppuccin-blue"
                placeholder="admin-secret"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex justify-center items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-white 
                bg-gradient-to-r from-blue-600 to-blue-700 
                border border-transparent rounded-lg shadow-md 
                hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:-translate-y-0.5
                active:translate-y-0
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                dark:from-catppuccin-blue dark:to-catppuccin-lavender 
                dark:hover:from-catppuccin-lavender dark:hover:to-catppuccin-blue
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  登录中...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  登录
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
