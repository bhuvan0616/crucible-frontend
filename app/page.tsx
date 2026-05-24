import type { Metadata } from "next";
import Hero from "@/components/landing/hero";
import Showcase from "@/components/landing/showcase";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import Testimonials from "@/components/landing/testimonials";
import Newsletter from "@/components/landing/newsletter";
import Footer from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "Crucible Creations | Premium 3D Printed Products",
  description: "Discover portable keychain phone stands - foldable, compact, and customizable. Crafted with precision 3D printing for those who appreciate quality and style.",
};

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
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