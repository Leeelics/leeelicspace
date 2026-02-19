import { getTranslations } from 'next-intl/server';

// 语言颜色映射
const languageColors: Record<string, string> = {
  Python: '#3776ab',
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'C++': '#f34b7d',
  Java: '#b07219',
  Go: '#00add8',
  Rust: '#dea584'
};

export default async function AboutPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const t = await getTranslations();
  
  const isEn = locale === 'en';
  
  // 项目数据（使用翻译）
  const featuredProjects = [
    {
      name: 'AlignJuice',
      description: t('about.projects.AlignJuice'),
      language: 'Python',
      stars: 0,
      updated_at: '2026-02-10T15:08:13Z',
      html_url: 'https://github.com/Leeelics/AlignJuice'
    },
    {
      name: 'speaksense',
      description: t('about.projects.speaksense'),
      language: 'HTML',
      stars: 0,
      updated_at: '2026-02-10T15:08:13Z',
      html_url: 'https://github.com/Leeelics/speaksense'
    },
    {
      name: 'Eval-Explorer-',
      description: t('about.projects.Eval-Explorer-'),
      language: 'TypeScript',
      stars: 0,
      updated_at: '2026-02-10T15:08:24Z',
      html_url: 'https://github.com/Leeelics/Eval-Explorer-'
    }
  ];
  
  // 自动推断技术栈
  const techStack = {
    'AI/ML': ['Python', 'LLM', '数据对齐'],
    'Frontend': ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    'Backend': ['Node.js', 'Flask', 'PostgreSQL'],
    'Mobile': ['Flutter']
  };
  
  // 格式化日期
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return isEn ? 'Yesterday' : '昨天';
    if (diffDays < 7) return `${diffDays} ${isEn ? 'days ago' : '天前'}`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} ${isEn ? 'weeks ago' : '周前'}`;
    
    return date.toLocaleDateString(isEn ? 'en-US' : 'zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-20 md:pt-32 md:pb-24 border-b border-[var(--border)]">
        <div className="container container-narrow">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-8">
            {t('about.title')}
          </h1>
          
            {/* Introduction Card */}
            <div className="bg-[var(--surface)] rounded-lg p-10 md:p-14 border border-[var(--border)] mb-16">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-gradient flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                👋
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  {t('about.hi')}
                </h2>
                <p className="text-[var(--text-secondary)]">
                  {t('about.welcome')}
                </p>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                {t('about.intro1')}
              </p>
              
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                {t('about.intro2')}
              </p>
              
              {/* Contact Links */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--border)]">
                <a 
                  href="mailto:leeelics@gmail.com"
                  className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Email">
                    <title>Email</title>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  leeelics@gmail.com
                </a>
                
                <a 
                  href="https://github.com/Leeelics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="GitHub">
                    <title>GitHub</title>
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
          
          {/* Featured Projects Section */}
          <div className="mb-16">
            <h2 className="text-xs font-bold tracking-wider text-[var(--accent)] uppercase mb-8">
              {t('about.featuredProjects')}
            </h2>
            
            <div className="space-y-6">
              {featuredProjects.map((project) => (
                <a
                  key={project.name}
                  href={project.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-[var(--surface)] rounded-lg p-8 border border-[var(--border)] hover:border-[var(--accent)] transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📁</span>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                        {project.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[var(--text-muted)]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-label="Stars">
                        <title>Stars</title>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {project.stars}
                    </div>
                  </div>
                  
                  <p className="text-[var(--text-secondary)] text-sm mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {project.language && (
                        <div className="flex items-center gap-1.5">
                          <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: languageColors[project.language] || '#888' }}
                          />
                          <span className="text-xs text-[var(--text-tertiary)]">
                            {project.language}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <span className="text-xs text-[var(--text-muted)]">
                      {formatDate(project.updated_at)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          {/* Tech Stack Section */}
          <div>
            <h2 className="text-xs font-bold tracking-wider text-[var(--accent)] uppercase mb-8">
              {t('about.techStack')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(techStack).map(([category, techs]) => (
                <div key={category} className="bg-[var(--surface)] rounded-lg p-8 border border-[var(--border)]">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                    {category}
                  </h3>
                  <ul className="space-y-3">
                    {techs.map((tech) => (
                      <li key={tech} className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
