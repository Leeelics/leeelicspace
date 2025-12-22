import React from 'react';
import Link from 'next/link';

// 模拟项目数据 - 实际项目中可以从API获取
const projects = [
  {
    id: 1,
    title: '博客系统',
    description: '使用Next.js和Flask构建的个人博客应用，支持文章的撰写和浏览。',
    tech: ['Next.js', 'React', 'Flask', 'Python'],
    link: '/',
  },
  {
    id: 2,
    title: '待办事项应用',
    description: '一个功能完整的待办事项管理应用，支持任务的创建、编辑和删除。',
    tech: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    link: '#',
  },
  {
    id: 3,
    title: '数据分析仪表盘',
    description: '基于数据可视化的仪表盘，展示各种业务指标和趋势。',
    tech: ['React', 'D3.js', 'Express', 'PostgreSQL'],
    link: '#',
  },
];

export default function Projects() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">个人项目</h1>
      
      <div className="space-y-8">
        {projects.map((project) => (
          <article key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-blue-600">{project.title}</h2>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                href={project.link}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4 md:mt-0"
                target={project.link.startsWith('#') ? '_self' : '_blank'}
              >
                查看详情
              </Link>
            </div>
          </article>
        ))}
      </div>
      
      {projects.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>暂无项目，敬请期待！</p>
        </div>
      )}
    </div>
  );
}