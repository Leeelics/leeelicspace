"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // 初始化主题
  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

    setTheme(initialTheme);

    // 直接应用主题，避免额外的 useCallback 开销
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(initialTheme);
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      // 仅在用户未手动设置偏好时自动切换
      if (!localStorage.getItem("theme")) {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);

        const html = document.documentElement;
        html.classList.remove("light", "dark");
        html.classList.add(newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // 应用主题变化
  useEffect(() => {
    if (mounted) {
      const html = document.documentElement;
      html.classList.remove("light", "dark");
      html.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  // 防止 hydration 不匹配
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return <div className="theme-provider">{children}</div>;
};

export default ThemeProvider;
