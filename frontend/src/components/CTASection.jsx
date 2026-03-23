import { Link } from "react-router-dom";
import { Zap, Hash, Terminal } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 px-6 bg-[#0d1117] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-purple-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-6">
          <Terminal size={12} className="text-cyan-400" />
          <span className="font-mono text-xs text-cyan-400 tracking-widest">Ready to ship?</span>
        </div>

        <h2 className="font-mono font-bold text-4xl md:text-5xl mb-4 leading-tight">
          <span className="text-white">Start coding with your </span>
          <span className="text-cyan-400">team today</span>
        </h2>

        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          No installs, no config. Open a room, share the link, start writing
          code together in seconds.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/create-room"
            className="btn-primary flex items-center gap-2 text-base px-8 py-3.5"
          >
            <Zap size={16} />
            Create a Room — free
          </Link>
          <Link
            to="/join-room"
            className="btn-secondary flex items-center gap-2 text-base px-8 py-3.5"
          >
            <Hash size={16} />
            Join a Room
          </Link>
        </div>
      </div>
    </section>
  );
}
