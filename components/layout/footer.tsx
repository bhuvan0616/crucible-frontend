import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] border-t border-[var(--border)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-xl font-bold text-[var(--color-accent)]">Crucible Creations</span>
            <p className="text-[var(--muted-foreground)] mt-2">Premium 3D Printed Products</p>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
            <span>© 2026 Crucible Creations</span>
          </div>
        </div>
      </div>
    </footer>
  );
}