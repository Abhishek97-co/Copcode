import { Code2, User, MessageSquare, Box } from "lucide-react";

const features = [
  {
    icon: Code2,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    title: "Real-Time Shared Editor",
    description: "Collaborate on code simultaneously with live cursor tracking and instant synchronization.",
  },
  {
    icon: User,
    iconColor: "text-green-400",
    iconBg: "bg-green-500/10",
    title: "Personal Coding Workspace",
    description: "Your own sandbox to experiment freely without affecting the shared codebase.",
  },
  {
    icon: MessageSquare,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/10",
    title: "Live Chat Collaboration",
    description: "Communicate in real-time with integrated chat, code sharing, and mentions.",
  },
  {
    icon: Box,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    title: "Room-Based Development",
    description: "Create or join coding rooms to organize projects and team collaboration.",
  },
];

function FeatureCard({ icon: Icon, iconColor, iconBg, title, description }) {
  return (
    <div className="card group cursor-default">
      <div className="code-titlebar">
        <span className="dot-red" /><span className="dot-yellow" /><span className="dot-green" />
        <span className="ml-2 font-mono text-xs text-gray-600">feature.jsx</span>
      </div>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={20} className={iconColor} />
          </div>
          <div>
            <h3 className="font-mono font-bold text-white text-base mb-2 group-hover:text-cyan-400 transition-colors duration-200">
              {title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-[#0a0e15]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-tag">// FEATURES</p>
          <h2 className="section-heading">
            Everything You Need to{" "}
            <span className="text-cyan-400">Code Together</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
