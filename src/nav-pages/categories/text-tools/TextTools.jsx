import React, { useRef, useEffect } from "react";
import Hero from "../../../components/category-hero-section/Hero";
import { useDispatch, useSelector } from "react-redux";
import { fetchTools } from "../../../redux/slices/toolsSlice";
import CategoryCard from "../../../components/category-card/CategoryCard";
// import styles from "../category.module.css";
import BottomSection from "../../../components/category-hero-section/BottomSection";
import texttools from "../../../assets/texttools.svg";
import texttools1 from "../../../assets/texttools1.svg";
import { FaShareAlt } from "react-icons/fa";
import { openShareModal } from "../../../redux/slices/modalSlice";
import BuyMeACoffee from "../../../components/BuyMeACoffee";

function TextTools() {
  const dispatch = useDispatch();
  const { items: tools = [], status } = useSelector((state) => state.tools);

  const textTools = tools.filter((p) => p.category === "text-tools");
  const cardsRef = useRef(null);

  useEffect(() => {
    dispatch(fetchTools());
  }, [dispatch]);

  const scrollToCards = () => {
    cardsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (status === "loading") return <p>Loading...</p>;               

  return (
    <>
      <Hero
        title="Online text tools for Free"
        paragraphs={[
          "Looking for some great online text tools? Look no further than 10015.io!",
          "Our text tools are the best in the web and they're all available for free. Whether you're looking for a tool to help you with generating, editing, formatting, converting, manipulating text, or just general writing, we've got you covered.",
        ]}
        image={texttools}
        buttonText="Explore Text Tools"
        onScroll={scrollToCards}
      />

      <div className="bg-[#F3F4F6]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
          <div className="flex justify-between items-center pt-7 h-14">
            <h2 className="text-xl font-semibold text-[#0B1220]">
              Text Tools Collection
            </h2>

            <button
              className="flex items-center gap-2 px-3 py-1.5 border border-[#E5E7EB] rounded-full text-[#0B1220] bg-white hover:bg-[#F3F4F6] hover:border-[rgba(59,130,246,0.45)] hover:text-[#3B82F6] transition"
              onClick={() =>
                dispatch(
                  openShareModal({
                    title: "Text Tools",
                    category: "text-tools",
                  })
                )
              }
            >
              <FaShareAlt className="text-[#3B82F6]" />
              Share
            </button>
          </div>

          <div
            ref={cardsRef}
            className="grid grid-cols-1 sm:grid-cols-2 justify-items-center
              sm:justify-items-stretch md:grid-cols-3 md:justify-items-stretch
              gap-4 sm:gap-6"
          >
            {textTools.map((item) => (
              <CategoryCard key={item.id} product={item} />
            ))}
          </div>

          <div>
            <BuyMeACoffee />
          </div>
        </div>
      </div>

      <BottomSection
        title="Online text tools for Free"
        paragraphs={[
         "In the age of the internet, there are a plethora of text tools available online. These tools can be used for a variety of purposes, such as editing, formatting, generating and analyzing text. While some of these tools are designed for general use, others are specifically tailored for specific tasks.",

        "No matter what your needs are, there is sure to be a text tool that can help you in Pocket Tools. We will provide a brief overview of what each tool does and how it can be used."
        ]}
        image={texttools1}
      />
    </>
  );
}

export default TextTools;