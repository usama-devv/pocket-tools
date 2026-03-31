import { Link, useLocation } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

const SidebarSection = ({ category, isOpen, onToggle }) => {
  const location = useLocation();
  const Icon = category.icon;

  return (
    <div className="w-full border-b border-gray-50 last:border-0 font-manrope">
      {/* Category Header */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-6 py-5 transition-all duration-200 
          ${isOpen ? "bg-white" : "hover:bg-gray-50"}`}
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 flex items-center justify-center">
            {Icon ? (
              <img 
                src={Icon} 
                className={`w-full h-full object-contain transition-all duration-200 ${isOpen ? "brightness-100" : "grayscale opacity-70"}`} 
                alt="" 
              />
            ) : (
              <span className="text-lg">📁</span>
            )}
          </div>
          
          <span className={`text-[16px] font-bold tracking-tight transition-colors duration-200 
            ${isOpen ? "text-[#3B82F6]" : "text-[#1F2937]"}`}>
            {category.displayName}
          </span>
        </div>

        <FiChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-[#3B82F6]" : ""
          }`}
        />
      </button>

      {/* Tools List */}
      {isOpen && (
        <ul className="bg-white pb-2 overflow-hidden">
          {category.tools.map((tool) => {
            const isActive = location.pathname.endsWith(`/${tool.slug}`) || location.pathname.includes(`/${tool.slug}/`);

            return (
              <li key={tool.slug} className="relative group">
                <Link
                  to={`/tools/${category.category}/${tool.slug}`}
                  className={`
                    flex items-center gap-4 px-8 py-3.5 text-[14.5px] transition-all duration-200
                    ${isActive 
                      ? "text-[#3B82F6] font-bold bg-[#EFF6FF]" 
                      : "text-[#6B7280] hover:text-[#111827] hover:bg-gray-50"
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3B82F6] z-20 shadow-[2px_0_8px_rgba(59,130,246,0.3)]" />
                  )}

                  <div className={`w-5 h-5 flex items-center justify-center transition-all 
                    ${isActive ? "scale-110 opacity-100" : "opacity-60 grayscale-[0.3]"}`}>
                    <img
                      src={`/images/${tool.image}`}
                      alt={tool.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <span className="truncate">{tool.title}</span>

                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-[#3B82F6] rounded-full"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SidebarSection;