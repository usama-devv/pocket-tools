import { useNavigate } from "react-router-dom";
import chromeImg from "../../images/landing-page-images/chrome.png";
import firefoxImg from "../../images/landing-page-images/firefox.png";
import { lazy } from "react";

// ✅ Replace this import path with wherever you keep the hero illustration
const Animation = lazy(() => import("../DotLottieReact"));


const HeroSection = () => {
  const navigate = useNavigate();

  const extensions = [
    {
      img: chromeImg,
      text: "Add to Chrome",
      url: "https://chromewebstore.google.com/detail/online-tools-by-10015io/afbphoagjpegnkpeiliacmiiggojdabo?pli=1",
    },
    {
      img: firefoxImg,
      text: "Add to Firefox",
      url: "https://addons.mozilla.org/en-US/firefox/addon/online-tools-by-10015-io/",
    },
  ];

  const goToFeatured = () => {
    navigate("/#featured-tools");
    const el = document.getElementById("featured-tools");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const goToFinder = () => {
    navigate("/product-finder");
    const el = document.getElementById("product-finder");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* HERO */}
      <section className="relative w-full overflow-hidden bg-[#F3F4F6]">
        {/* background blobs */}
        <div className="pointer-events-none absolute -top-24 -left-30 h-105 w-105 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18)_0%,transparent_62%)] blur-[2px]" />
        <div className="pointer-events-none absolute -bottom-28 -right-35 h-130 w-130 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.14)_0%,transparent_62%)] blur-[2px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid min-h-[calc(100vh-60px)] items-center gap-10 lg:grid-cols-2">
            {/* LEFT */}
            <div className="relative pt-10 lg:pt-0">
            

              <h1 className="font-serif text-[34px] font-bold leading-[1.12] tracking-[-1px] text-[#0B1220] sm:text-[44px] lg:text-[54px]">
                All online tools in{" "}
                <span className="relative">
                  <span className="relative z-1 text-[#0652f7]">one place</span>
                </span>
                .
              </h1>

              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#0B1220] sm:text-[16px]">
                No need to bookmark tools separately. <b>My Pocket Tools</b> keeps
                everything organized so you can jump in and get things done.
              </p>

             
              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={goToFeatured}
                  className="inline-flex items-center justify-center rounded-full bg-[#3B82F6] px-7 py-3.5 text-[14px] font-semibold text-white shadow-[0_10px_25px_rgba(17,24,39,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(17,24,39,0.22)] active:translate-y-0"
                >
                  Explore Tools
                  <span className="ml-2">→</span>
                </button>

                <button
                  onClick={goToFinder}
                  className="inline-flex items-center justify-center rounded-full border-2 border-[#E5E7EB] bg-white/60 px-7 py-3.5 text-[14px] font-semibold text-[#0B1220] transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(59,130,246,0.7)] hover:bg-white hover:text-[#2563EB] active:translate-y-0"
                >
                  Product Finder
                </button>
              </div>

              {/* Extensions */}
              <div className="mt-8">
                <p className="mb-3 text-[13px] font-semibold text-[#0B1220] sm:text-[14px]">
                  Get the extension and access all tools with one click
                </p>

                <div className="flex flex-wrap gap-2">
                  {extensions.map((ext) => (
                    <a
                      key={ext.text}
                      href={ext.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-[18px] border border-[#E5E7EB] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0B1220] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(59,130,246,0.45)] hover:shadow-[0_10px_20px_rgba(59,130,246,0.10)]"
                    >
                      <img
                        src={ext.img}
                        alt={ext.text}
                        className="h-4 w-4 object-contain"
                      />
                      {ext.text}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative flex items-center justify-center pb-10 lg:pb-0">
              {/* glow card */}
              <div className="relative w-full max-w-140">
                <div className="pointer-events-none absolute -inset-3 rounded-4xl bg-[radial-gradient(circle,rgba(59,130,246,0.18)_0%,transparent_60%)] blur-xl" />
                <div className="relative overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white/70 shadow-[0_18px_45px_rgba(17,24,39,0.12)] backdrop-blur">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
                    </div>
                    <span className="text-[12px] font-semibold text-[#6B7280]">
                      My Pocket Tools
                    </span>
                  </div>

                 <Animation className="h-75 w-full object-contain sm:h-90" />

                  <div className="px-5 py-4">

                    {/* small stats row */}
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      {[
                        { k: "100+", v: "Tools" },
                        { k: "1", v: "Extension" },
                        { k: "0", v: "Bookmark mess" },
                      ].map((s) => (
                        <div
                          key={s.v}
                          className="rounded-2xl border border-[#E5E7EB] bg-white p-3 text-center"
                        >
                          <div className="text-[16px] font-extrabold text-[#0B1220] sm:text-[18px]">
                            {s.k}
                          </div>
                          <div className="text-[11px] font-semibold text-[#6B7280] sm:text-[12px]">
                            {s.v}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

             
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST / FEATURED IN */}
      <section className="bg-[#F3F4F6] px-4 py-8 sm:px-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-center gap-6 text-[#6B7280] sm:justify-between">
            <span className="w-full text-center text-xs font-semibold tracking-wide opacity-80 sm:w-auto sm:text-left sm:text-sm">
              Featured in:
            </span>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {[
                { mark: "P", label: "Product Hunt" },
                { mark: "YC", label: "Combinator" },
                { mark: "IH", label: "Indie Hackers" },
                { mark: "r", label: "reddit" },
                { mark: "S", label: "sitepoint" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-2 text-xs font-semibold opacity-80 sm:text-sm"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#6B7280] text-[10px] font-extrabold sm:h-8 sm:w-8 sm:text-xs">
                    {b.mark}
                  </span>
                  <span className="hidden sm:inline">{b.label}</span>
                  <span className="sm:hidden">{b.mark}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;