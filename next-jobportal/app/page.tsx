import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main>
      <div className="relative bg-gradient-to-br from-[#020617] via-[#0b0f19] to-[#0f172a]">
  <Navbar />
  <HeroSection />
</div>

<FeaturesSection />

    </main>
  );
}
