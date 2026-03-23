import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import About from "./About";
import Footer from "../components/Footer";
import Blog from "./Blog";
import CTASection from "../components/CTASection";

function Home() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Navbar />
      <main>
      <Hero />
      <Features />
      <About />
        <Blog />
        <CTASection />
      </main>
        <Footer />
    </div>
  );
}

export default Home;