import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageShell({ children, className = "" }) {
  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      <Navbar />
      <main className={`flex-1 ${className}`}>{children}</main>
      <Footer />
    </div>
  );
}
