export default function Hero({
  title,
  image,
  buttonText,
  onScroll,
  paragraphs = []
}) {
  return (
    <section className="relative w-full pt-4 mt-14 min-h-screen bg-[#F3F4F6] font-manrope overflow-hidden">
      <div className="max-w-7xl mx-auto pt-32 px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          
          <div className="max-w-xl animate-fade-in-up">
            {/* Title with brand accent color */}
            <h1 className="text-4xl sm:text-5xl font-black text-[#111827] leading-[1.1] mb-6 font-space-grotesk tracking-tight">
              {title.includes(" ") ? (
                <>
                  {title.split(' ').slice(0, -1).join(' ')} 
                  <span className="text-[#3B82F6]"> {title.split(' ').pop()}</span>
                </>
              ) : title}
            </h1>

            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="mb-4 text-[#6B7280] text-lg leading-relaxed font-medium"
              >
                {para}
              </p>
            ))}

            {buttonText && (
              <button
                onClick={onScroll}
                className="group inline-flex items-center gap-3 mt-6 px-8 py-4 bg-[#3B82F6] text-white font-bold rounded-lg shadow-lg shadow-[#3B82F6]/25 transition-all hover:bg-[#2776f5] hover:shadow-xl hover:-translate-y-1 active:scale-95"
              >
                {buttonText}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            )}
          </div>

          {/* Image side with a subtle floating effect */}
          <div className="flex justify-center relative w-full md:w-auto">
            <div className="absolute -inset-4 bg-[#3B82F6]/5 rounded-full blur-3xl -z-10"></div>
            
            <img
              src={image}
              alt={title}
              className="w-112.5 max-w-full drop-shadow-2xl animate-float-slow" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}