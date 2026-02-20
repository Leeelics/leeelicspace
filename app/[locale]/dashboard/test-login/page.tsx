'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TestLogin() {
  const router = useRouter();

  useEffect(() => {
    // 测试localStorage功能
    const testLocalStorage = () => {
      try {
        localStorage.setItem('test', 'test-value');
        const testValue = localStorage.getItem('test');
        localStorage.removeItem('test');
        return testValue === 'test-value';
      } catch (e) {
        return false;
      }
    };

    // 测试页面功能已简化
  }, [router]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">登录测试页面</h1>
      <p>请打开浏览器控制台查看测试结果</p>
      <div className="mt-8 space-y-4">
        <button
          onClick={() => {
            localStorage.setItem('adminLoggedIn', 'true');
            router.push('/dashboard');
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          强制登录并跳转到管理后台
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('adminLoggedIn');
            router.push('/dashboard/login');
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          强制登出并跳转到登录页
        </button>
        <button
          onClick={() => {
            router.push('/dashboard/login');
          }}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          前往正常登录页
        </button>
      </div>
    </div>
  );
}
