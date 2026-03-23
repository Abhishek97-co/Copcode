const badges = [
  "Real-time sync",
  "WebSocket powered",
  "Zero latency",
  "End-to-end encrypted",
];

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-[#0d1117]">
      <div className="max-w-4xl mx-auto">
        <div className="code-window shadow-2xl shadow-black/50">
          <div className="code-titlebar">
            <span className="dot-red" /><span className="dot-yellow" /><span className="dot-green" />
            <span className="ml-2 font-mono text-xs text-gray-500">about.md</span>
          </div>

          {/* Gradient background like screenshot */}
          <div className="relative px-8 py-10 md:px-12 md:py-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0e1e2e]/80 via-[#161b22] to-[#1a1230]/60 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <p className="font-mono text-xs text-cyan-400 tracking-widest mb-5">
                ## ABOUT CODESYNC
              </p>
              <h2 className="font-mono font-bold text-3xl md:text-4xl mb-6 leading-tight">
                <span className="text-white">Built for developers, </span>
                <span className="text-cyan-400">by developers</span>
              </h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
                This platform enables multiple developers to collaborate in real time using a shared main editor
                and individual workspaces to reduce conflicts and improve productivity. Whether you're pair
                programming, running a coding workshop, or building with a distributed team — CodeSync keeps
                everyone in sync.
              </p>
              <div className="flex flex-wrap gap-3">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="font-mono text-xs text-cyan-400 border border-cyan-500/30 bg-[#0d1117]/60 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10 transition-colors cursor-default"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
