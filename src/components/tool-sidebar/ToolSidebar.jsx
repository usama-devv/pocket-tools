import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import SidebarSection from "./SidebarSection";
import { buildSidebarData } from "./sidebarData";

const ToolSidebar = () => {
  const location = useLocation();
  const [sidebarData, setSidebarData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await buildSidebarData();
      setSidebarData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!sidebarData.length) return;
    
    const index = sidebarData.findIndex((cat) =>
      cat.tools.some((t) => location.pathname.includes(t.slug))
    );
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (index !== -1) setOpenIndex(index);
  }, [location.pathname, sidebarData]);

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden border-r border-gray-100 shadow-sm font-manrope">
      <div className="bg-[#F9FAFB] px-6 py-4 border-b border-gray-100">
        <h3 className="text-[13px] font-bold text-gray-600 uppercase tracking-[0.15em]">
          Tool categories
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {sidebarData.map((category, index) => (
          <SidebarSection
            key={category.category}
            category={category}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ToolSidebar;