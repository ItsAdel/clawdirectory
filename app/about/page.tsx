import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About - ClawDirectory',
  description: 'Learn about ClawDirectory, the directory for OpenClaw platforms and tools.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-700 transition-colors mb-8 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        {/* Hero */}
        <h1 className="text-3xl md:text-4xl font-bold text-orange-950 tracking-tight mb-3">
          About ClawDirectory
        </h1>
        <p className="text-lg text-orange-800/60 leading-relaxed mb-12">
          The go-to directory for OpenClaw deployment platforms, hosting services,
          marketplaces, and tools. We help founders and developers discover the
          best infrastructure for their AI agents.
        </p>

        {/* Why */}
        <h2 className="text-xs text-orange-500 font-medium tracking-wide uppercase mb-4">
          Why ClawDirectory
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-14">
          {[
            { title: 'Curated quality', desc: 'Every platform is manually reviewed to ensure real value for the community.' },
            { title: 'Free backlinks', desc: 'List your platform for free and get a high-quality backlink for SEO.' },
            { title: 'Transparency', desc: 'Platforms can share MRR to build trust and credibility.' },
            { title: 'Community-driven', desc: 'Upvote favorites and help others discover the best tools.' },
          ].map((item) => (
            <div
              key={item.title}
              className="p-4 rounded-xl bg-white/60 border border-orange-200/40 hover:border-orange-300/60 transition-colors"
            >
              <h3 className="text-sm font-semibold text-orange-900 mb-1">{item.title}</h3>
              <p className="text-sm text-orange-700/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* How to submit */}
        <h2 className="text-xs text-orange-500 font-medium tracking-wide uppercase mb-4">
          How to submit
        </h2>
        <div className="space-y-3 mb-8">
          {[
            'Sign in with Google',
            'Click "Submit" in the navigation',
            'Fill out the form with your platform details',
            'Wait for approval (usually within 24 hours)',
            'Your platform appears in the directory',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-orange-800/70">{step}</span>
            </div>
          ))}
        </div>
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm"
        >
          Submit your platform
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Categories */}
        <h2 className="text-xs text-orange-500 font-medium tracking-wide uppercase mb-4 mt-14">
          Categories
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-14">
          {[
            { icon: '🚀', name: 'Deployment', desc: 'One-click deploy, Docker, cloud' },
            { icon: '⚡', name: 'Infrastructure', desc: 'VPS, managed services' },
            { icon: '🔌', name: 'Marketplace', desc: 'Skills, plugins, templates' },
            { icon: '🛠️', name: 'Tools', desc: 'CLI, dev tools, testing' },
          ].map((cat) => (
            <div
              key={cat.name}
              className="p-4 rounded-xl bg-white/60 border border-orange-200/40"
            >
              <span className="text-xl">{cat.icon}</span>
              <h3 className="text-sm font-semibold text-orange-900 mt-2">{cat.name}</h3>
              <p className="text-xs text-orange-600/60 mt-0.5">{cat.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="flex items-center gap-4 pt-8 border-t border-orange-200/50">
          <span className="text-sm text-orange-700/60">Get in touch</span>
          <div className="flex items-center gap-3">
            <a
              href="https://x.com/0xAdel"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-700 transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://github.com/ItsAdel/clawdirectory"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-700 transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
