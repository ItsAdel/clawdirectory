import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'About - ClawDirectory',
  description: 'Learn about ClawDirectory, the directory for OpenClaw platforms and tools.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-orange-900 mb-6">
          🦞 About ClawDirectory
        </h1>

        <div className="prose max-w-none">
          <p className="text-lg text-orange-800 leading-relaxed mb-6">
            ClawDirectory is the cozy go-to directory for OpenClaw deployment platforms, hosting
            services, marketplaces, and tools. We help founders and developers discover the
            best infrastructure for their AI agents! 🦞
          </p>

          <h2 className="text-2xl font-bold text-orange-900 mt-12 mb-4">🦞 Why ClawDirectory?</h2>
          <div className="space-y-4 text-orange-700">
            <div className="p-4 rounded-lg bg-white border border-orange-200 shadow-sm">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">🎯 Curated Quality</h3>
              <p>
                Every platform is manually reviewed to ensure quality. We only list platforms
                that provide real value to the OpenClaw community.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white border border-orange-200 shadow-sm">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">🚀 Free Backlinks</h3>
              <p>
                List your platform for free and get a high-quality backlink. Help other
                developers discover your service while improving your SEO.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white border border-orange-200 shadow-sm">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">💡 Transparency</h3>
              <p>
                Platforms can optionally share their MRR, building trust and credibility with
                the community. Inspired by TrustMRR's approach.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white border border-orange-200 shadow-sm">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">🤝 Community-Driven</h3>
              <p>
                Upvote your favorite platforms and help others discover the best tools. The
                community decides what rises to the top.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-orange-900 mt-12 mb-4">🦞 How to Submit</h2>
          <p className="text-orange-700 mb-4">
            Submitting your platform is super simple:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-orange-700 mb-6">
            <li>Sign in with Google 🦞</li>
            <li>Click "Submit Platform" in the navigation</li>
            <li>Fill out the submission form with your platform details</li>
            <li>Wait for manual approval (usually within 24 hours) ⏳</li>
            <li>Your platform appears in the directory! 🎉</li>
          </ol>
          <Link href="/submit">
            <Button size="lg">🦞 Submit Your Platform</Button>
          </Link>

          <h2 className="text-2xl font-bold text-orange-900 mt-12 mb-4">🦞 Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-white border border-orange-200 shadow-sm">
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="font-semibold text-orange-900 mb-1">Deployment</h3>
              <p className="text-sm text-orange-700">
                One-click deploy services, Docker images, cloud platforms
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white border border-orange-200 shadow-sm">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-orange-900 mb-1">Infrastructure</h3>
              <p className="text-sm text-orange-700">
                VPS optimized for OpenClaw, managed services
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white border border-orange-200 shadow-sm">
              <div className="text-2xl mb-2">🔌</div>
              <h3 className="font-semibold text-orange-900 mb-1">Marketplace</h3>
              <p className="text-sm text-orange-700">
                Skills, plugins, templates, integrations
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white border border-orange-200 shadow-sm">
              <div className="text-2xl mb-2">🛠️</div>
              <h3 className="font-semibold text-orange-900 mb-1">Tools</h3>
              <p className="text-sm text-orange-700">
                CLI tools, dev tools, testing tools
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-orange-900 mt-12 mb-4">🦞 Contact</h2>
          <p className="text-orange-700 mb-4">
            Have questions or suggestions? We'd love to hear from you! 🦞
          </p>
          <div className="flex gap-4">
            <a
              href="https://x.com/0xAdel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Follow on X
            </a>
            <a
              href="https://github.com/ItsAdel/clawdirectory"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              Star on GitHub
            </a>
          </div>

          <div className="mt-12 p-6 rounded-xl bg-gradient-to-br from-orange-100 to-pink-50 border-2 border-orange-300 shadow-lg">
            <h3 className="text-xl font-bold text-orange-900 mb-2">🦞 Built for the Community</h3>
            <p className="text-orange-700 mb-4">
              ClawDirectory is a free resource for the OpenClaw community. Our mission is to
              help founders discover the best platforms and tools for deploying AI agents! 🦞
            </p>
            <Link href="/">
              <Button variant="primary">🦞 Browse Directory</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
