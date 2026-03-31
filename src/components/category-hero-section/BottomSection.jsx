export default function BottomSection({ image, title, paragraphs = [] }) {
  return (
    <section className="w-full bg-[#FFFFFF] py-20 font-manrope border-t border-[#E5E7EB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        
        {/* Image Container with subtle shadow */}
        <div className="w-full max-w-sm md:max-w-md shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-auto drop-shadow-xl"
          />
        </div>

        {/* Text Content */}
        <div className="max-w-xl text-center md:text-left">
          <h3 className="text-3xl sm:text-4xl font-black mb-6 text-[#111827] font-space-grotesk tracking-tight leading-tight">
            {title.includes(" ") ? (
              <>
                {title.split(' ').slice(0, -1).join(' ')} 
                <span className="text-[#3B82F6]"> {title.split(' ').pop()}</span>
              </>
            ) : title}
          </h3>

          <div className="space-y-4">
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="text-[#6B7280] text-lg leading-relaxed font-medium"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Optional: Subtle divider or decorative element can go here */}
          <div className="mt-8 flex justify-center md:justify-start">
            <div className="w-20 h-1.5 bg-[#3B82F6] rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}