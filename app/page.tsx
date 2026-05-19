import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Showcase from "@/components/landing/showcase";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import Testimonials from "@/components/landing/testimonials";
import Newsletter from "@/components/landing/newsletter";
import Footer from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <Hero />
      <Showcase />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
}