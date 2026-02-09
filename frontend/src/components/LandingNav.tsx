import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  return (
    <nav className="max-w-7xl mx-auto px-4 pt-6 sm:px-6 lg:px-8 h-20 flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
          A
        </div>
        <span className="font-display font-bold text-2xl">AutoAds</span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
        </Link>
        <Link href="/dashboard">
          <Button className="rounded-full px-6">Get Started</Button>
        </Link>
      </div>
    </nav>
  );
}
