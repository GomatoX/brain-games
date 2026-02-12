import Script from "next/script";

const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:5173";

export default function Home() {
  return (
    <div className="bg-white text-[#0f172a] font-[family-name:var(--font-inter)] min-h-screen flex flex-col overflow-x-hidden antialiased selection:bg-[#c25e40]/20 selection:text-[#a0492d]">
      {/* Header */}
      <div className="relative w-full border-b border-[#e2e8f0] bg-white/95 backdrop-blur-[8px] sticky top-0 z-50 transition-all duration-300">
        <div className="flex justify-center">
          <div className="flex flex-1 max-w-[1280px] flex-col">
            <header className="flex items-center justify-between whitespace-nowrap px-6 py-4 md:px-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center text-[#c25e40]">
                  <span className="material-symbols-outlined text-3xl">
                    settings_suggest
                  </span>
                </div>
                <h2 className="text-[#0f172a] text-xl font-bold font-serif tracking-tight">
                  Rustycogs.io
                </h2>
              </div>
              <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                <div className="flex items-center gap-8">
                  <a
                    className="text-[#64748b] hover:text-[#c25e40] text-sm font-medium transition-colors"
                    href="#games"
                  >
                    Games
                  </a>
                  <a
                    className="text-[#64748b] hover:text-[#c25e40] text-sm font-medium transition-colors"
                    href="#integration"
                  >
                    Integration
                  </a>
                  <a
                    className="text-[#64748b] hover:text-[#c25e40] text-sm font-medium transition-colors"
                    href="#contact"
                  >
                    Get Started
                  </a>
                </div>
                <div className="flex gap-3">
                  <a
                    href="/login"
                    className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-5 text-[#0f172a] hover:text-[#c25e40] transition-all text-sm font-semibold border border-transparent hover:bg-[#f9fafb]"
                  >
                    <span className="truncate">Publisher Login</span>
                  </a>
                  <a
                    href="/register"
                    className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-[#c25e40] hover:bg-[#a0492d] transition-all text-white text-sm font-semibold shadow-sm hover:shadow-md"
                  >
                    <span className="truncate">Get Started Free</span>
                  </a>
                </div>
              </div>
            </header>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center w-full bg-white">
        <div className="w-full max-w-[1280px] px-4 md:px-10">
          {/* Hero Section */}
          <div className="flex flex-col gap-12 py-20 lg:py-28 lg:flex-row lg:items-center lg:gap-20">
            {/* Left Content */}
            <div className="flex flex-col gap-6 lg:w-1/2">
              <div className="flex flex-col gap-5 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fcece8]/50 border border-[#fcece8] w-fit">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#c25e40]">
                    For Digital Publishers
                  </span>
                </div>
                <h1 className="text-[#0f172a] text-5xl md:text-6xl lg:text-7xl font-serif font-medium leading-[1.1] tracking-tight">
                  Engage Your Audience with{" "}
                  <span className="text-[#c25e40] italic">Premium</span> Brain
                  Games
                </h1>
                <p className="text-[#64748b] text-lg font-light leading-relaxed max-w-lg">
                  Increase time-on-site and user retention by embedding
                  high-quality, white-labeled puzzles like Crosswords, Sudoku,
                  and Word Challenges directly into your platform.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <a
                  href="/register"
                  className="flex cursor-pointer items-center justify-center rounded-lg h-12 px-8 bg-[#c25e40] hover:bg-[#a0492d] text-white text-base font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Get Started Free
                </a>
                <a
                  href="#games"
                  className="flex cursor-pointer items-center justify-center rounded-lg h-12 px-8 bg-white border border-[#e2e8f0] hover:border-[#c25e40] text-[#0f172a] hover:text-[#c25e40] text-base font-semibold transition-all shadow-sm"
                >
                  View Live Examples
                </a>
              </div>
            </div>

            {/* Right - Dashboard Graphic */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative w-full aspect-[5/4] bg-white rounded-xl shadow-2xl border border-[#e2e8f0] overflow-hidden p-2">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#f9fafb] to-white z-0"></div>
                <div className="relative z-10 w-full h-full rounded-lg bg-[#f9fafb] border border-[#e2e8f0] flex flex-col overflow-hidden">
                  {/* Browser Chrome */}
                  <div className="h-10 border-b border-[#e2e8f0] bg-white flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="ml-4 w-64 h-6 bg-slate-100 rounded-md"></div>
                  </div>
                  {/* Dashboard Content */}
                  <div className="flex-1 p-6 flex flex-col gap-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-sm uppercase tracking-wider text-[#64748b] font-bold">
                          Daily Engagement
                        </h3>
                        <p className="text-3xl font-serif text-[#0f172a] font-medium mt-1">
                          +24.5%{" "}
                          <span className="text-sm font-sans text-green-600 font-medium">
                            ↑ vs last month
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <div className="px-3 py-1 bg-white border border-[#e2e8f0] rounded text-xs font-medium text-[#64748b]">
                          Last 30 Days
                        </div>
                      </div>
                    </div>
                    {/* Bar Chart */}
                    <div className="h-40 w-full flex items-end justify-between gap-1 px-2">
                      <div className="w-full bg-[#c25e40]/10 rounded-t h-[40%] hover:bg-[#c25e40]/20 transition-colors"></div>
                      <div className="w-full bg-[#c25e40]/20 rounded-t h-[55%] hover:bg-[#c25e40]/30 transition-colors"></div>
                      <div className="w-full bg-[#c25e40]/30 rounded-t h-[45%] hover:bg-[#c25e40]/40 transition-colors"></div>
                      <div className="w-full bg-[#c25e40]/40 rounded-t h-[70%] hover:bg-[#c25e40]/50 transition-colors"></div>
                      <div className="w-full bg-[#c25e40]/60 rounded-t h-[60%] hover:bg-[#c25e40]/70 transition-colors"></div>
                      <div className="w-full bg-[#c25e40]/80 rounded-t h-[85%] hover:bg-[#c25e40]/90 transition-colors"></div>
                      <div className="w-full bg-[#c25e40] rounded-t h-[95%] hover:bg-[#a0492d] transition-colors shadow-lg shadow-[#c25e40]/20"></div>
                    </div>
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-auto">
                      <div className="p-3 bg-white rounded border border-[#e2e8f0]">
                        <div className="text-xs text-[#64748b] mb-1">
                          Active Players
                        </div>
                        <div className="font-bold text-lg">12.4k</div>
                      </div>
                      <div className="p-3 bg-white rounded border border-[#e2e8f0]">
                        <div className="text-xs text-[#64748b] mb-1">
                          Puzzles Solved
                        </div>
                        <div className="font-bold text-lg">89.2k</div>
                      </div>
                      <div className="p-3 bg-white rounded border border-[#e2e8f0]">
                        <div className="text-xs text-[#64748b] mb-1">
                          Ad Impressions
                        </div>
                        <div className="font-bold text-lg">245k</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative Blurs */}
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#c25e40]/10 rounded-full blur-xl -z-10"></div>
                <div className="absolute -left-6 -top-6 w-32 h-32 bg-orange-100 rounded-full blur-xl -z-10"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Games Suite Section */}
        <div
          id="games"
          className="w-full bg-[#f9fafb] py-20 border-y border-[#e2e8f0] scroll-mt-20"
        >
          <div className="max-w-[1280px] mx-auto px-4 md:px-10">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#0f172a] mb-4">
                Our Games Suite
              </h2>
              <p className="text-[#64748b] text-lg">
                Discover our most popular embeddable titles. Fully responsive,
                customizable, and designed to keep users coming back daily.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Crossword Card */}
              <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] transition-all duration-300 overflow-hidden border border-[#e2e8f0] group flex flex-col">
                <div className="p-6 pb-0 flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-[#0f172a]">
                    Daily Crossword
                  </h3>
                  <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <span className="material-symbols-outlined text-lg">
                      grid_on
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-[#64748b] mb-4">
                    The classic retention driver. New puzzles daily with varying
                    difficulty levels tailored to your audience.
                  </p>
                </div>
                <div className="mt-auto relative bg-slate-50 border-t border-[#e2e8f0] h-48 flex items-center justify-center p-4 group-hover:bg-slate-100 transition-colors">
                  <div className="absolute inset-0 overflow-hidden opacity-50">
                    <svg
                      className="w-full h-full text-slate-200"
                      fill="currentColor"
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <pattern
                          height="20"
                          id="grid"
                          patternUnits="userSpaceOnUse"
                          width="20"
                        >
                          <path
                            d="M 20 0 L 0 0 0 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                          ></path>
                        </pattern>
                      </defs>
                      <rect fill="url(#grid)" height="100%" width="100%"></rect>
                    </svg>
                  </div>
                  <a
                    href={`${FRONTEND_URL}/?id=1`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 bg-white border border-[#e2e8f0] shadow-sm text-[#0f172a] px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 group-hover:border-[#c25e40] group-hover:text-[#c25e40] transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      visibility
                    </span>
                    Live Demo
                  </a>
                </div>
              </div>

              {/* Word of the Day Card */}
              <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] transition-all duration-300 overflow-hidden border border-[#e2e8f0] group flex flex-col">
                <div className="p-6 pb-0 flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-[#0f172a]">
                    Word of the Day
                  </h3>
                  <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <span className="material-symbols-outlined text-lg">
                      spellcheck
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-[#64748b] mb-4">
                    A viral sensation. 6 tries to guess the hidden 5-letter
                    word. Highly shareable results.
                  </p>
                </div>
                <div className="mt-auto relative bg-slate-50 border-t border-[#e2e8f0] h-48 flex items-center justify-center p-4 group-hover:bg-slate-100 transition-colors">
                  <div className="flex gap-1 opacity-80 scale-90">
                    <div className="w-8 h-8 border-2 border-slate-300 bg-white rounded flex items-center justify-center font-bold text-slate-400">
                      P
                    </div>
                    <div className="w-8 h-8 border-2 border-transparent bg-green-500 text-white rounded flex items-center justify-center font-bold">
                      L
                    </div>
                    <div className="w-8 h-8 border-2 border-transparent bg-yellow-500 text-white rounded flex items-center justify-center font-bold">
                      A
                    </div>
                    <div className="w-8 h-8 border-2 border-slate-300 bg-white rounded flex items-center justify-center font-bold text-slate-400">
                      T
                    </div>
                    <div className="w-8 h-8 border-2 border-slate-300 bg-white rounded flex items-center justify-center font-bold text-slate-400">
                      E
                    </div>
                  </div>
                  <a
                    href={`${FRONTEND_URL}/?id=1&type=word`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute z-10 bg-white border border-[#e2e8f0] shadow-sm text-[#0f172a] px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 group-hover:border-[#c25e40] group-hover:text-[#c25e40] transition-colors top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <span className="material-symbols-outlined text-lg">
                      visibility
                    </span>
                    Live Demo
                  </a>
                </div>
              </div>

              {/* Sudoku Card */}
              <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_0_rgba(0,0,0,0.06)] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] transition-all duration-300 overflow-hidden border border-[#e2e8f0] group flex flex-col">
                <div className="p-6 pb-0 flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-[#0f172a]">
                    Sudoku Challenge
                  </h3>
                  <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <span className="material-symbols-outlined text-lg">
                      tag
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-[#64748b] mb-4">
                    Logic puzzles for the analytical mind. Includes note-taking
                    mode and hints system.
                  </p>
                </div>
                <div className="mt-auto relative bg-slate-50 border-t border-[#e2e8f0] h-48 flex items-center justify-center p-4 group-hover:bg-slate-100 transition-colors">
                  <div className="grid grid-cols-3 gap-0.5 bg-slate-300 p-0.5 w-24 h-24 opacity-60">
                    <div className="bg-white flex items-center justify-center text-xs">
                      5
                    </div>
                    <div className="bg-white flex items-center justify-center text-xs">
                      3
                    </div>
                    <div className="bg-white"></div>
                    <div className="bg-white flex items-center justify-center text-xs">
                      6
                    </div>
                    <div className="bg-white"></div>
                    <div className="bg-white flex items-center justify-center text-xs">
                      9
                    </div>
                    <div className="bg-white"></div>
                    <div className="bg-white flex items-center justify-center text-xs">
                      8
                    </div>
                    <div className="bg-white"></div>
                  </div>
                  <a
                    href={`${FRONTEND_URL}/?id=1&type=sudoku`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute z-10 bg-white border border-[#e2e8f0] shadow-sm text-[#0f172a] px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 group-hover:border-[#c25e40] group-hover:text-[#c25e40] transition-colors top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <span className="material-symbols-outlined text-lg">
                      visibility
                    </span>
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Section */}
        <div id="integration" className="w-full bg-white py-20 scroll-mt-20">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 w-fit mb-6">
                <span className="material-symbols-outlined text-[#c25e40] text-sm">
                  code
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
                  Developer Friendly
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-medium text-[#0f172a] mb-6">
                Simple Integration
              </h2>
              <p className="text-[#64748b] text-lg mb-8 leading-relaxed">
                Get up and running in minutes, not weeks. Our games are
                delivered via a lightweight, responsive iframe that adapts to
                your site&apos;s CSS variables automatically.
              </p>
              <ul className="flex flex-col gap-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-600 mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <h4 className="font-bold text-[#0f172a]">
                      White-label Ready
                    </h4>
                    <p className="text-sm text-[#64748b]">
                      Remove our branding and use your own colors/fonts.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-600 mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <h4 className="font-bold text-[#0f172a]">
                      Single Sign-On (SSO)
                    </h4>
                    <p className="text-sm text-[#64748b]">
                      Authenticate users with your existing system.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-600 mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <h4 className="font-bold text-[#0f172a]">
                      Zero Maintenance
                    </h4>
                    <p className="text-sm text-[#64748b]">
                      We handle updates, bug fixes, and daily content.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="rounded-xl overflow-hidden shadow-2xl bg-[#1e293b] border border-slate-700">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    index.html
                  </span>
                  <div className="w-8"></div>
                </div>
                <div className="p-6 overflow-x-auto">
                  <pre className="font-mono text-sm leading-relaxed">
                    <code className="text-slate-300">
                      {`\n`}
                      <span className="text-slate-500">
                        &lt;!-- Load the game engine --&gt;
                      </span>
                      {`\n`}
                      <span className="text-purple-400">&lt;script</span>{" "}
                      <span className="text-blue-400">src</span>=
                      <span className="text-green-400">
                        &quot;https://cdn.rustycogs.io/crossword-engine.iife.js&quot;
                      </span>
                      <span className="text-purple-400">
                        &gt;&lt;/script&gt;
                      </span>
                      {`\n\n`}
                      <span className="text-slate-500">
                        &lt;!-- Drop in the Web Component --&gt;
                      </span>
                      {`\n`}
                      <span className="text-purple-400">
                        &lt;crossword-game
                      </span>
                      {`\n  `}
                      <span className="text-blue-400">puzzle-id</span>=
                      <span className="text-green-400">&quot;latest&quot;</span>
                      {`\n  `}
                      <span className="text-blue-400">api-url</span>=
                      <span className="text-green-400">
                        &quot;https://api.rustycogs.io&quot;
                      </span>
                      {`\n  `}
                      <span className="text-blue-400">theme</span>=
                      <span className="text-green-400">&quot;light&quot;</span>
                      <span className="text-purple-400">
                        &gt;&lt;/crossword-game&gt;
                      </span>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          id="contact"
          className="w-full bg-[#c25e40] py-16 text-center text-white scroll-mt-20"
        >
          <div className="max-w-[800px] mx-auto px-6">
            <h2 className="text-3xl font-serif font-medium mb-4">
              Ready to boost your engagement metrics?
            </h2>
            <p className="text-[#fcece8] text-lg mb-8 max-w-2xl mx-auto">
              Create your free publisher account, add your games, and start
              embedding them anywhere in minutes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/register"
                className="bg-white text-[#c25e40] hover:bg-slate-100 font-bold py-3 px-8 rounded-lg shadow-lg transition-colors"
              >
                Create Free Account
              </a>
              <a
                href="/login"
                className="bg-transparent border border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Publisher Login
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f9fafb] border-t border-[#e2e8f0] w-full py-16">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 text-[#0f172a] mb-4">
                <span className="material-symbols-outlined text-[#c25e40] text-2xl">
                  settings_suggest
                </span>
                <h3 className="text-lg font-bold font-serif">Rustycogs.io</h3>
              </div>
              <p className="text-[#64748b] text-sm leading-relaxed">
                White-label brain games and puzzles for digital publishers.
              </p>
            </div>
            <div>
              <h4 className="text-[#0f172a] font-bold mb-5 uppercase text-xs tracking-widest">
                Product
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-[#64748b]">
                <li>
                  <a
                    className="hover:text-[#c25e40] transition-colors"
                    href="#games"
                  >
                    Games Catalog
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-[#c25e40] transition-colors"
                    href="#integration"
                  >
                    Integration Guide
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-[#c25e40] transition-colors"
                    href="#contact"
                  >
                    Get Started
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#0f172a] font-bold mb-5 uppercase text-xs tracking-widest">
                Account
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-[#64748b]">
                <li>
                  <a
                    className="hover:text-[#c25e40] transition-colors"
                    href="/login"
                  >
                    Publisher Login
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-[#c25e40] transition-colors"
                    href="/register"
                  >
                    Create Account
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 flex justify-center">
            <p className="text-[#64748b] text-sm">
              © 2026 Rustycogs.io. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
