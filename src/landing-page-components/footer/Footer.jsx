import pocketTools from "../../images/landing-page-images/pocketTools.png";
import { Link } from "react-router-dom";

function Bottombar() {
  return (
    <footer className="w-full mx-auto min-h-13 bg-gray-50 border-t border-gray-100 py-6 md:py-0">
      <div className="max-w-7xl mx-auto h-full px-6 flex flex-col md:flex-row items-center justify-evenly gap-6 md:gap-0">
        
        {/* LOGO */}
        <Link to="/" className="shrink-0">
          <img 
            className="h-10 md:h-12 w-auto object-contain transition-opacity hover:opacity-80" 
            src={pocketTools} 
            alt="Pocket Tools Logo" 
          />
        </Link>

        {/* LINKS CONTAINER */}
        <div className="flex flex-wrap justify-center items-center gap-5 md:gap-8">
          {[
            { name: "About", path: "/about" },
            { name: "Terms Of Use", path: "/termsofuse" },
            { name: "Contact", path: "/contact" },
            { name: "Privacy & Policy", path: "/privicyandpolicy" },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm md:text-[15px] font-medium text-slate-400 hover:text-slate-900 hover:-translate-y-0.5 transition-all duration-200 ease-in-out"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* COPYRIGHT & MADE WITH HEART */}
        <div className="flex flex-col items-center md:items-end gap-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            © 2026 Pocket Tools • All Rights Reserved
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Bottombar;