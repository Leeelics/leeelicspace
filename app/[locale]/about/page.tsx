import { getTranslations } from "next-intl/server";

// Language colors
const languageColors: Record<string, string> = {
  Python: "#3776ab",
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  Java: "#b07219",
  Go: "#00add8",
  Rust: "#dea584",
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const isEn = locale === "en";

  const featuredProjects = [
    {
      name: "AlignJuice",
      description: t("about.projects.AlignJuice"),
      language: "Python",
      stars: 0,
      updated_at: "2026-02-10T15:08:13Z",
      html_url: "https://github.com/Leeelics/AlignJuice",
    },
    {
      name: "speaksense",
      description: t("about.projects.speaksense"),
      language: "HTML",
      stars: 0,
      updated_at: "2026-02-10T15:08:13Z",
      html_url: "https://github.com/Leeelics/speaksense",
    },
    {
      name: "Eval-Explorer-",
      description: t("about.projects.Eval-Explorer-"),
      language: "TypeScript",
      stars: 0,
      updated_at: "2026-02-10T15:08:24Z",
      html_url: "https://github.com/Leeelics/Eval-Explorer-",
    },
  ];

  const techStack = {
    "AI/ML": ["Python", "LLM", "数据对齐"],
    Frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    Backend: ["Node.js", "Flask", "PostgreSQL"],
    Mobile: ["Flutter"],
  };

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return isEn ? "Yesterday" : "昨天";
    if (diffDays < 7) return `${diffDays} ${isEn ? "days ago" : "天前"}`;
    if (diffDays < 30)
      return `${Math.floor(diffDays / 7)} ${isEn ? "weeks ago" : "周前"}`;

    return date.toLocaleDateString(isEn ? "en-US" : "zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-[var(--border)]">
        <div className="container py-8 md:py-12">
          <div className="max-w-3xl">
            <h1 className="text-[var(--font-size-hero)] font-semibold text-[var(--text-primary)] leading-tight mb-4">
              {t("about.title")}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container">
          <div className="max-w-3xl space-y-12">
            {/* Introduction */}
            <div className="card">
              <div className="card-body">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                    👋
                  </div>
                  <div>
                    <h2 className="text-[var(--font-size-h3)] font-semibold text-[var(--text-primary)] mb-1">
                      {t("about.hi")}
                    </h2>
                    <p className="text-[var(--font-size-body)] text-[var(--text-secondary)]">
                      {t("about.welcome")}
                    </p>
                  </div>
                </div>

                <div className="prose">
                  <p>{t("about.intro1")}</p>
                  <p className="mb-0">{t("about.intro2")}</p>
                </div>

                {/* Contact */}
                <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-[var(--border)]">
                  <a
                    href="mailto:leeelics@gmail.com"
                    className="inline-flex items-center gap-2 text-[var(--font-size-body)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <title>Email icon</title>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    leeelics@gmail.com
                  </a>

                  <a
                    href="https://github.com/Leeelics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[var(--font-size-body)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <title>GitHub icon</title>
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* Featured Projects */}
            <div>
              <h2 className="text-[var(--font-size-small)] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-6">
                {t("about.featuredProjects")}
              </h2>

              <div className="space-y-4">
                {featuredProjects.map((project) => (
                  <a
                    key={project.name}
                    href={project.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card block"
                  >
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📁</span>
                          <h3 className="text-[var(--font-size-h3)] font-semibold text-[var(--text-primary)]">
                            {project.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 text-[var(--font-size-small)] text-[var(--text-muted)]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <title>Star icon</title>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          {project.stars}
                        </div>
                      </div>

                      <p className="text-[var(--font-size-body)] text-[var(--text-secondary)] line-clamp-2 mb-3">
                        {project.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {project.language && (
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{
                                  backgroundColor:
                                    languageColors[project.language] || "#888",
                                }}
                              />
                              <span className="text-[var(--font-size-small)] text-[var(--text-tertiary)]">
                                {project.language}
                              </span>
                            </div>
                          )}
                        </div>

                        <span className="text-[var(--font-size-small)] text-[var(--text-muted)]">
                          {formatDate(project.updated_at)}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h2 className="text-[var(--font-size-small)] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-6">
                {t("about.techStack")}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(techStack).map(([category, techs]) => (
                  <div key={category} className="card">
                    <div className="card-body">
                      <h3 className="text-[var(--font-size-body)] font-semibold text-[var(--text-primary)] mb-3">
                        {category}
                      </h3>
                      <ul className="space-y-2">
                        {techs.map((tech) => (
                          <li
                            key={tech}
                            className="text-[var(--font-size-body)] text-[var(--text-secondary)] flex items-center gap-2"
                          >
                            <span className="w-1 h-1 rounded-full bg-[var(--accent)]"></span>
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
