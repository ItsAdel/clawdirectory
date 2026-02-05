export const CATEGORIES = [
  { value: 'deployment', label: '🚀 Deployment', emoji: '🚀' },
  { value: 'hosting', label: '⚡ Infrastructure', emoji: '⚡' },
  { value: 'marketplace', label: '🔌 Marketplace', emoji: '🔌' },
  { value: 'analytics', label: '📊 Analytics', emoji: '📊' },
  { value: 'education', label: '🎓 Education', emoji: '🎓' },
  { value: 'services', label: '👥 Services', emoji: '👥' },
  { value: 'tools', label: '🛠️ Tools', emoji: '🛠️' },
  { value: 'business', label: '💼 Business', emoji: '💼' },
] as const

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  deployment: 'One-click deploy services, Docker images, cloud platforms',
  hosting: 'VPS optimized for OpenClaw, managed services',
  marketplace: 'Skills, plugins, templates, integrations',
  analytics: 'Performance tracking, usage monitoring, cost optimization',
  education: 'Courses, tutorials, documentation',
  services: 'Consulting, development, training humans for AI',
  tools: 'CLI tools, dev tools, testing tools',
  business: 'Insurance for AI agents, legal compliance, accounting',
}

export const SORT_OPTIONS = [
  { value: 'upvotes', label: 'Most Upvoted' },
  { value: 'newest', label: 'Newest' },
  { value: 'mrr', label: 'Highest MRR' },
] as const
