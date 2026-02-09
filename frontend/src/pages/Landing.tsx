import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Landing() {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden flex-1">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-40">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-sm font-medium mb-8 border border-primary/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now supporting Amazon Sponsored Brands
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8">
            Launch cross-platform ads <br />
            <span className="text-gradient">in seconds, not days.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-muted-foreground mb-10 leading-relaxed">
            One platform to rule them all. Auto-generate high-converting campaigns for Google, Meta, and Amazon with a single click.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1">
                Launch Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-lg border-2 hover:bg-muted/50">
              View Demo
            </Button>
          </div>
        </div>
        {/* Footer */}
        <footer className="absolute bottom-0 w-full border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center text-white text-xs font-bold">A</div>
              <span className="font-bold text-gray-900">AutoAds</span>
            </div>
            <p className="text-sm text-gray-500">© 2024 AutoAds Inc. All rights reserved.</p>
          </div>
        </footer>
      </section>
    </div>
  );
}
