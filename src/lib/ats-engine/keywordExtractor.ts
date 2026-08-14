// Comprehensive technology and skills keyword dictionary

export const TECH_SKILLS_DICTIONARY: Record<string, string[]> = {
  'Programming Languages': [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'c', 'go', 'golang',
    'rust', 'swift', 'kotlin', 'ruby', 'php', 'r', 'scala', 'dart', 'perl',
    'haskell', 'elixir', 'clojure', 'lua', 'matlab', 'bash', 'shell', 'powershell',
  ],
  'Frontend': [
    'react', 'react.js', 'reactjs', 'next.js', 'nextjs', 'vue', 'vue.js', 'vuejs',
    'angular', 'svelte', 'html', 'html5', 'css', 'css3', 'sass', 'scss', 'less',
    'tailwind', 'tailwindcss', 'bootstrap', 'material-ui', 'mui', 'chakra-ui',
    'styled-components', 'emotion', 'redux', 'zustand', 'mobx', 'webpack', 'vite',
    'babel', 'jest', 'testing-library', 'cypress', 'playwright', 'storybook',
    'graphql', 'apollo', 'tanstack-query', 'react-query', 'three.js', 'd3.js',
  ],
  'Backend': [
    'node.js', 'nodejs', 'express', 'express.js', 'fastify', 'nest.js', 'nestjs',
    'django', 'flask', 'fastapi', 'spring', 'spring-boot', 'laravel', 'rails',
    'ruby-on-rails', 'asp.net', '.net', 'gin', 'fiber', 'graphql', 'rest api',
    'restful', 'grpc', 'websocket', 'microservices', 'serverless',
  ],
  'Databases': [
    'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'sqlite', 'oracle',
    'sql-server', 'mssql', 'cassandra', 'dynamodb', 'elasticsearch', 'firebase',
    'firestore', 'supabase', 'prisma', 'mongoose', 'sequelize', 'typeorm',
    'drizzle', 'neo4j', 'influxdb', 'clickhouse',
  ],
  'Cloud & DevOps': [
    'aws', 'amazon-web-services', 'gcp', 'google-cloud', 'azure', 'docker',
    'kubernetes', 'k8s', 'terraform', 'ansible', 'jenkins', 'github-actions',
    'gitlab-ci', 'circleci', 'travisci', 'linux', 'nginx', 'apache', 'vercel',
    'netlify', 'heroku', 'digitalocean', 'cloudflare', 'pulumi', 'helm',
    'prometheus', 'grafana', 'datadog', 'sentry',
  ],
  'Tools': [
    'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'notion',
    'figma', 'postman', 'insomnia', 'swagger', 'openapi', 'vscode', 'vim',
    'intellij', 'xcode', 'android-studio', 'npm', 'yarn', 'pnpm', 'pip',
    'maven', 'gradle', 'make', 'cmake', 'linux', 'unix',
  ],
  'AI/ML': [
    'machine-learning', 'deep-learning', 'tensorflow', 'pytorch', 'keras',
    'scikit-learn', 'pandas', 'numpy', 'opencv', 'nlp', 'llm', 'openai',
    'langchain', 'hugging-face', 'transformers', 'computer-vision', 'data-science',
    'statistics', 'jupyter', 'matplotlib', 'seaborn', 'spark', 'hadoop',
  ],
  'Soft Skills': [
    'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical',
    'critical-thinking', 'agile', 'scrum', 'kanban', 'project-management',
    'collaboration', 'mentoring', 'presentation', 'stakeholder-management',
    'time-management', 'adaptability',
  ],
};

export const ALL_KEYWORDS = Object.values(TECH_SKILLS_DICTIONARY).flat();

// Normalize keyword for comparison
export function normalizeKeyword(kw: string): string {
  return kw.toLowerCase().replace(/[-_.\/\s]/g, '').trim();
}

// Extract keywords from text
export function extractKeywordsFromText(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const found: string[] = [];

  for (const kw of ALL_KEYWORDS) {
    const escaped = kw.replace(/[+*?^${}()|[\]\\]/g, '\\$&');
    const norm = escaped.replace(/[-_.]/g, '[\\-_.\\s]?');
    // Using lookarounds/boundaries that support non-word characters at the edges
    const regex = new RegExp(`(^|\\W)${norm}($|\\W)`, 'i');
    if (regex.test(lower)) {
      found.push(kw);
    }
  }
  return [...new Set(found)];
}

// Get keyword frequency in text
export function getKeywordFrequency(text: string, keyword: string): number {
  if (!text || !keyword) return 0;
  const escaped = keyword.replace(/[+*?^${}()|[\]\\]/g, '\\$&');
  const norm = escaped.replace(/[-_.]/g, '[\\-_.\\s]?');
  const regex = new RegExp(`(^|\\W)${norm}($|\\W)`, 'gi');
  return (text.match(regex) || []).length;
}

// Extract all skills from a resume (flattened)
export function extractResumeSkills(resumeData: {
  skills?: Array<{ items: string[] }>;
  experience?: Array<{ bullets: string[] }>;
  projects?: Array<{ technologies: string[] }>;
}): string[] {
  const allText: string[] = [];

  // From skills section
  resumeData.skills?.forEach((cat) => allText.push(...cat.items));

  // From experience bullets
  resumeData.experience?.forEach((exp) =>
    exp.bullets?.forEach((b) => allText.push(b))
  );

  // From project technologies
  resumeData.projects?.forEach((proj) => allText.push(...(proj.technologies || [])));

  const fullText = allText.join(' ');
  return extractKeywordsFromText(fullText);
}
