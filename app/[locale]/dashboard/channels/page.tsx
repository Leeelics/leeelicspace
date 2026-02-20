'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  MessageSquare,
  FileText,
  Twitter,
  Zap,
  ExternalLink,
  Settings,
} from 'lucide-react';
import type { Platform } from '@/types';
import { platforms } from '@/types';

const platformIcons: Record<Platform, React.ElementType> = {
  blog: BookOpen,
  xiaohongshu: MessageSquare,
  wechat: FileText,
  x: Twitter,
  jike: Zap,
};

interface ChannelConfig {
  enabled: boolean;
  username?: string;
  url?: string;
  apiKey?: string;
}

const defaultConfigs: Record<Platform, ChannelConfig> = {
  blog: { enabled: true, url: 'https://leelicspace.com' },
  xiaohongshu: { enabled: false },
  wechat: { enabled: false },
  x: { enabled: false },
  jike: { enabled: false },
};

export default function ChannelsPage() {
  const [configs, setConfigs] = useState(defaultConfigs);
  const [saving, setSaving] = useState(false);

  const handleToggle = (platform: Platform) => {
    setConfigs(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        enabled: !prev[platform].enabled,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Save to localStorage or API
    localStorage.setItem('channelConfigs', JSON.stringify(configs));
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    alert('配置已保存');
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          渠道配置
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          管理各发布平台的账号和设置
        </p>
      </div>

      {/* Platform Cards */}
      <div className="space-y-4">
        {platforms.map((platform) => {
          const Icon = platformIcons[platform.id];
          const config = configs[platform.id];
          const isBlog = platform.id === 'blog';

          return (
            <div
              key={platform.id}
              className={`bg-[var(--surface)] rounded-lg border transition-all ${
                config.enabled
                  ? 'border-[var(--accent)]'
                  : 'border-[var(--border)]'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: platform.color }}
                  >
                    <Icon size={24} />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-[var(--text-primary)]">
                          {platform.name}
                        </h3>
                        <p className="text-sm text-[var(--text-muted)]">
                          {platform.nameEn}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config.enabled}
                          onChange={() => handleToggle(platform.id)}
                          disabled={isBlog}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
                      </label>
                    </div>

                    {/* Platform-specific settings */}
                    {config.enabled && (
                      <div className="mt-4 pt-4 border-t border-[var(--border)]">
                        {isBlog ? (
                          <div className="text-sm text-[var(--text-secondary)]">
                            博客为默认发布渠道，文章将自动发布到网站首页。
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm text-[var(--text-secondary)] mb-1">
                                用户名/账号
                              </label>
                              <input
                                type="text"
                                value={config.username || ''}
                                onChange={(e) =>
                                  setConfigs(prev => ({
                                    ...prev,
                                    [platform.id]: {
                                      ...prev[platform.id],
                                      username: e.target.value,
                                    },
                                  }))
                                }
                                placeholder={`你的${platform.name}账号`}
                                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)]"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-[var(--text-secondary)] mb-1">
                                主页链接
                              </label>
                              <input
                                type="url"
                                value={config.url || ''}
                                onChange={(e) =>
                                  setConfigs(prev => ({
                                    ...prev,
                                    [platform.id]: {
                                      ...prev[platform.id],
                                      url: e.target.value,
                                    },
                                  }))
                                }
                                placeholder={`https://...`}
                                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)]"
                              />
                            </div>
                          </div>
                        )}

                        {/* Quick link */}
                        {platform.id !== 'blog' && (
                          <div className="mt-3">
                            <a
                              href={
                                platform.id === 'xiaohongshu'
                                  ? 'https://www.xiaohongshu.com'
                                  : platform.id === 'wechat'
                                  ? 'https://mp.weixin.qq.com'
                                  : platform.id === 'x'
                                  ? 'https://x.com'
                                  : 'https://web.okjike.com'
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
                            >
                              访问 {platform.name}
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
        >
          {saving ? '保存中...' : '保存配置'}
        </button>
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
        <h3 className="font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
          <Settings size={16} />
          配置说明
        </h3>
        <ul className="text-sm text-[var(--text-secondary)] space-y-1 list-disc list-inside">
          <li>启用平台后，写作时可以选择发布到对应平台</li>
          <li>配置账号信息用于生成水印和署名</li>
          <li>目前采用半自动发布方式，生成内容后需手动复制到各平台</li>
          <li>未来将支持 API 自动发布（需要各平台开放接口）</li>
        </ul>
      </div>
    </div>
  );
}
