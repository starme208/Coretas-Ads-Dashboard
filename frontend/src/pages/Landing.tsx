import { LandingNav } from "@/components/LandingNav";
import { LandingHero } from "@/components/LandingHero";
import { LandingFooter } from "@/components/LandingFooter";

export function Landing() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <LandingNav />
      <LandingHero />
      <LandingFooter />
    </div>
  );
}