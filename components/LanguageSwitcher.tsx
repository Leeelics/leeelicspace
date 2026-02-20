"use client";

import { usePathname } from "next/navigation";

interface LanguageSwitcherProps {
  currentLocale: string;
}

export default function LanguageSwitcher({
  currentLocale,
}: LanguageSwitcherProps) {
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLocale = currentLocale === "zh" ? "en" : "zh";

    // 替换路径中的语言代码
    let newPathname = pathname;

    // 如果路径以当前语言开头，替换它
    if (pathname.startsWith(`/${currentLocale}`)) {
      newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    } else if (pathname === "/") {
      // 根路径特殊情况
      newPathname = `/${newLocale}`;
    } else {
      // 其他情况，添加语言前缀
      newPathname = `/${newLocale}${pathname}`;
    }

    // 使用 window.location 进行硬刷新，确保语言切换生效
    window.location.href = newPathname;
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="btn btn-ghost btn-sm"
      aria-label={currentLocale === "zh" ? "Switch to English" : "切换到中文"}
      title={currentLocale === "zh" ? "Switch to English" : "切换到中文"}
    >
      <span className="text-sm font-medium">
        {currentLocale === "zh" ? "EN" : "中"}
      </span>
    </button>
  );
}
