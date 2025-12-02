'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    // 检查用户是否已登录
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    
    // 如果未登录，重定向到登录页面
    if (!isLoggedIn) {
      router.push('/admin/login');
    }
  }, [router]);

  // 检查是否已登录，已登录则渲染子组件，否则不渲染（会被重定向）
  const isLoggedIn = localStorage.getItem('adminLoggedIn');
  if (!isLoggedIn) {
    return null; // 或者返回一个加载状态
  }

  return <>{children}</>;
};

export default AuthGuard;
