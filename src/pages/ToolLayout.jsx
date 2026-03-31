import { Outlet } from "react-router-dom";
import ToolSidebar from "../components/tool-sidebar/ToolSidebar";

const NAVBAR_HEIGHT = "64px";

const ToolLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-[#F9FAFB]">
      <aside
        className="hidden 2xl:block fixed left-0 w-[320px] bg-white border-r border-gray-200 z-30"
        style={{
          top: NAVBAR_HEIGHT,
          height: `calc(100vh - ${NAVBAR_HEIGHT})`,
        }}
      >
        <ToolSidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full 2xl:ml-80 transition-all duration-300">
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ToolLayout;