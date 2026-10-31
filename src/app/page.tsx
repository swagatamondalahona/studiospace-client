
import HeroSlider from "@/components/home/HeroSlider";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import BrowseCategories from "@/components/home/BrowseCategories";
import HowBookingWorks from "@/components/home/HowBookingWorks";
import HostGuarantee from "@/components/home/HostGuarantee";
export default function HomePage() {
  return (
    <main>
      <HeroSlider />
      <FeaturedStudios />
      <BrowseCategories />
      <HowBookingWorks />
      <HostGuarantee />
    </main>
  );
}
