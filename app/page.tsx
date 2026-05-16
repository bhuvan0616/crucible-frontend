import { Hero } from "@/components/landing/hero";
import { FeaturedProducts } from "@/components/landing/featured-products";
import { Benefits } from "@/components/landing/benefits";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedProducts />
        <Benefits />
      </main>
      <Footer />
    </div>
  );
}