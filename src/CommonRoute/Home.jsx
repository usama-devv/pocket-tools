import { lazy, Suspense } from "react";

/* Lazy imports */
const HeroSection = lazy(() =>
  import("../landing-page-components/hero-section/HeroSection")
);
const FeaturedToolSection = lazy(() =>
  import("../landing-page-components/featured-tool-section/FeaturedTools")
);
const ToolcategoriesSection = lazy(() =>
  import("../landing-page-components/tool-categories-section/ToolCategories")
);
const TextToolsSection = lazy(() =>
  import("../landing-page-components/text-tool-section/TextTools")
);
const ImageToolSection = lazy(() =>
  import("../landing-page-components/image-tool-section/ImageTools")
);
const CssToolSection = lazy(() =>
  import("../landing-page-components/css-tool-section/CssTools")
);
const CodingToolSection = lazy(() =>
  import("../landing-page-components/coding-tool-section/CodingTools")
);
const ColorToolSection = lazy(() =>
  import("../landing-page-components/color-tool-section/ColorTool")
);
const SocialMediaToolSection = lazy(() =>
  import("../landing-page-components/social-media-tool-section/SocialMediaTools")
);
const MiscellaneousToolSection = lazy(() =>
  import("../landing-page-components/miscellaneous-tool-section/MiscellaneousTools")
);
const PreFooter = lazy(() =>
  import("../landing-page-components/pre-footer/PreFooter")
);
const FooterHeroSection = lazy(() =>
  import("../landing-page-components/footer-hero-section/FooterHero")
);

export default function Home() {
  return (
    <main className="w-full bg-[#F3F4F6]">
      {/* Hero: highest priority */}
      <Suspense fallback={null}>
        <HeroSection />
      </Suspense>

      {/* Remaining sections */}
      <Suspense fallback={<div className="h-32" />}>
        <FeaturedToolSection />
        <ToolcategoriesSection />
        <TextToolsSection />
        <ImageToolSection />
        <CssToolSection />
        <CodingToolSection />
        <ColorToolSection />
        <SocialMediaToolSection />
        <MiscellaneousToolSection />
        <PreFooter />
        <FooterHeroSection />
      </Suspense>
    </main>
  );
}
