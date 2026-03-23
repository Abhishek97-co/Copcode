import { useState } from "react";
import PageShell from "../components/PageShell";
import CodeWindow from "../components/CodeWindow";
import { Send, Github, Linkedin, Twitter, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1000);
  };

  const field = (id, label, type = "text", placeholder = "") => (
    <div key={id}>
      <label className="font-mono text-xs text-gray-500 tracking-widest block mb-2">{label}</label>
      <input
        type={type}
        value={form[id]}
        onChange={(e) => { setForm((f) => ({ ...f, [id]: e.target.value })); setErrors((er) => ({ ...er, [id]: undefined })); }}
        placeholder={placeholder}
        className={`input-field ${errors[id] ? "border-red-500/60 focus:border-red-400" : ""}`}
      />
      {errors[id] && <p className="font-mono text-xs text-red-400 mt-1">{errors[id]}</p>}
    </div>
  );

  return (
    <PageShell>
      <div className="pt-28 pb-24 px-6">
        <div className="max-w-2xl mx-auto">

          <div className="mb-10">
            <p className="section-tag">// CONTACT</p>
            <h1 className="font-mono font-bold text-4xl text-white mb-3">
              Get in <span className="text-cyan-400">touch</span>
            </h1>
            <p className="text-gray-400 text-sm">
              Have a question or want to work together? We'd love to hear from you.
            </p>
          </div>

          <CodeWindow filename="contact.form" className="mb-8 shadow-xl">
            {sent ? (
              <div className="px-8 py-14 text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 size={48} className="text-green-400" />
                </div>
                <h3 className="font-mono font-bold text-white text-xl mb-2">Message sent!</h3>
                <p className="text-gray-400 text-sm">We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }}
                  className="mt-6 font-mono text-sm text-cyan-400 hover:underline"
                >
                  Send another →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
                {field("name",  "NAME",    "text",  "your_name")}
                {field("email", "EMAIL",   "email", "dev@example.com")}
                <div>
                  <label className="font-mono text-xs text-gray-500 tracking-widest block mb-2">MESSAGE</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => { setForm((f) => ({ ...f, message: e.target.value })); setErrors((er) => ({ ...er, message: undefined })); }}
                    placeholder="// Write your message here..."
                    className={`input-field resize-none ${errors.message ? "border-red-500/60 focus:border-red-400" : ""}`}
                  />
                  {errors.message && <p className="font-mono text-xs text-red-400 mt-1">{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 btn-primary disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Send size={15} />
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </CodeWindow>

          {/* Social row */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              { Icon: Github,   label: "GitHub",   href: "https://github.com"   },
              { Icon: Linkedin, label: "LinkedIn",  href: "https://linkedin.com" },
              { Icon: Twitter,  label: "Twitter",   href: "https://twitter.com"  },
            ].map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 font-mono text-sm text-gray-500 hover:text-cyan-400 transition-colors"
              >
                <Icon size={16} />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
