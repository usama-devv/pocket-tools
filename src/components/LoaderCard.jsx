import { useState } from 'react';
import { Copy, Check, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

const LoaderCard = ({ title, onCustomize, html, css }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGetCode = (e) => {
    e.stopPropagation();
    const fullCode = `/* CSS */\n${css}\n\n\n${html}`;

    navigator.clipboard.writeText(fullCode).then(() => {
      setIsCopied(true);
      toast.success('Code copied to clipboard!', {
        duration: 2000,
        position: 'top-right',
        icon: '📋',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(() => {
      toast.error('Failed to copy code', {
        duration: 3000,
        position: 'top-right',
        icon: '❌',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
    });
  };

  <div
    className="flex flex-col items-center gap-3 group"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <div className="relative w-full h-52 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl flex items-center justify-center overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">

      <style>{css}</style>

      <div
        dangerouslySetInnerHTML={{ __html: html }}
        className={`${isHovered ? 'opacity-10 scale-95' : 'opacity-100 scale-100'} transition-all duration-300`}
      />

      {/* Hover Buttons */}
      {isHovered && (
        <div className="flex flex-col gap-3 z-10 bg-[#FFFFFF]/95 backdrop-blur-sm w-full h-full absolute inset-0 items-center justify-center transition-all duration-300 animate-in fade-in">
          <div className="flex flex-col gap-3 w-48">
            <button
              onClick={onCustomize}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#3B82F6] text-[#FFFFFF] rounded-xl text-sm font-semibold hover:bg-[#2776f5] transition-all active:scale-95 shadow-lg shadow-[#3B82F6]/20 group"
            >
              <Palette className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Customize
            </button>
            <button
              onClick={handleGetCode}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-lg ${isCopied
                  ? 'bg-[#10B981] text-[#FFFFFF] shadow-[#10B981]/20'
                  : 'bg-[#F9FAFB] text-[#0B1220] border border-[#E5E7EB] hover:border-[#3B82F6] hover:text-[#3B82F6] hover:bg-[#FFFFFF]'
                }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Get the code
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Top-right badge */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-medium text-[#6B7280] bg-[#F9FAFB] px-2 py-1 rounded-full border border-[#E5E7EB]">
          {title.split(' ')[0]}
        </span>
      </div>
    </div>

    {/* Title with accent dot */}
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full"></div>
      <span className="text-[#6B7280] text-sm font-light tracking-wide">{title}</span>
    </div>
  </div>
};

export default LoaderCard;