import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategoryCard from "../../components/category-card/CategoryCard";
import { fetchTools } from "../../redux/slices/toolsSlice";

const SocialMediaTools = () => {
  const dispatch = useDispatch();
  const { items: tools = [], status } = useSelector((state) => state.tools || {});
  const socialTools = Array.isArray(tools)
    ? tools.filter((t) => String(t.category || "").toLowerCase() === "social-media-tools")
    : [];
  const cardsRef = useRef(null);

  useEffect(() => {
    if (!tools || tools.length === 0) dispatch(fetchTools());
  }, [dispatch, tools]);

  if (status === "loading") return <p className="text-[#6B7280]">Loading...</p>;

  const QuickLinks = [
    "Discover More",
    "Web Development Services",
    "Productivity tool platform",
    "Social media tools",
    "Social media management tools",
    "Image tools",
    "Pdf editing software",
    "Productivity apps",
  ];

  return (
    <section
      id="social-media-tools"
      className="bg-[#F3F4F6] max-w-5xl mx-auto px-4 sm:px-6 py-10"
    >
      <h1 className="text-3xl sm:text-4xl font-semibold text-[#0B1220] mb-6">
        Social Media Tools
      </h1>

      <div className="flex flex-wrap items-center gap-2 text-sm text-[#6B7280]">
        {QuickLinks.map((link, index) => (
          <React.Fragment key={index}>
            <button
              type="button"
              className="text-[#3B82F6] font-medium hover:text-[#2563EB] hover:underline transition"
            >
              {link}
            </button>
            {index < QuickLinks.length - 1 && (
              <span className="text-[#6B7280]/60">•</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="h-px bg-[#E5E7EB] my-8" />

      <div
        ref={cardsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
      >
        {socialTools.length > 0 ? (
          socialTools.map((tool) => <CategoryCard key={tool.id} product={tool} />)
        ) : (
          <p className="col-span-full text-center text-[#6B7280]">
            No social media tools found.
          </p>
        )}
      </div>
    </section>
  );
};

export default SocialMediaTools;