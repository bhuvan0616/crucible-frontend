import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { UsageScenarios } from "@/components/landing/usage-scenarios";
import { FeaturedProducts } from "@/components/landing/featured-products";
import { Testimonials } from "@/components/landing/testimonials";
import { Benefits } from "@/components/landing/benefits";
import { Newsletter } from "@/components/landing/newsletter";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <UsageScenarios />
        <FeaturedProducts />
        <Testimonials />
        <Benefits />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}