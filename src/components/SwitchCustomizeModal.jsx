import { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const SwitchCustomizeModal = ({ isOpen, onClose, design, activeTab, setActiveTab, initialColor }) => {
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [size, setSize] = useState("small"); 
  const [copied, setCopied] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (design) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrimaryColor(initialColor || "#3B82F6");
      setSize("small"); 
      setIsChecked(false);
    }
  }, [design, initialColor, isOpen]);

  const uniqueId = design ? `switch-modal-${design.id}` : '';
  const dynamicCSS = design && typeof design.getCss === 'function' 
    ? design.getCss(primaryColor, size).replaceAll(`.${design.id}`, `#${uniqueId}`) 
    : '';
  const dynamicHTML = design?.html
    ? design.html
        .replaceAll('id="cb', `id="${uniqueId}`)
        .replaceAll('for="cb', `for="${uniqueId}`)
        .replaceAll('id="switch', `id="${uniqueId}`)
        .replaceAll('for="switch', `for="${uniqueId}`)
    : '';

  useEffect(() => {
    if (!design || !isOpen) return;
    
    const handleToggle = () => {
      const checkbox = document.getElementById(uniqueId);
      if (checkbox) {
        setIsChecked(checkbox.checked);
      }
    };

    const timer = setTimeout(() => {
      const checkbox = document.getElementById(uniqueId);
      if (checkbox) {
        checkbox.addEventListener('change', handleToggle);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      const checkbox = document.getElementById(uniqueId);
      if (checkbox) {
        checkbox.removeEventListener('change', handleToggle);
      }
    };
  }, [uniqueId, dynamicHTML, design, isOpen]);

  if (!isOpen || !design) return null;

  const handleCopyCode = () => {
    const fullCode = `${dynamicHTML}\n\n<style>\n${dynamicCSS}\n</style>`;
    navigator.clipboard.writeText(fullCode);
    setCopied(true);
    
    toast.success('Code copied to clipboard!', {
      duration: 2000,
      icon: '📋',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const getPreviewScale = () => {
    switch(size) {
      case 'small': return 'scale-[2.0]';
      case 'medium': return 'scale-[2.5]';
      case 'large': return 'scale-[3.0]';
      default: return 'scale-[2.0]';
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#111827]/60 backdrop-blur-sm p-3 sm:p-4 font-manrope">
      
      <div className="bg-[#FFFFFF] rounded-xl w-full max-w-3xl shadow-2xl border border-[#E5E7EB] relative animate-in fade-in zoom-in duration-300 overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute right-3 sm:right-6 top-3 sm:top-6 text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] p-2 rounded-full transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Header */}
        <div className="flex justify-center pt-8 sm:pt-6 pb-4 sm:pb-6 border-b border-[#E5E7EB] bg-[#F9FAFB] px-3 sm:px-0">
          <div className="flex bg-[#FFFFFF] p-1 rounded-lg border border-[#E5E7EB] w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('customize')} 
              className={`flex-1 sm:flex-none px-4 sm:px-10 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'customize' 
                  ? 'bg-[#3B82F6] text-[#FFFFFF] shadow-md' 
                  : 'text-[#6B7280] hover:text-[#3B82F6]'
              }`}
            >
              ✎ Customize
            </button>
            <button 
              onClick={() => setActiveTab('code')} 
              className={`flex-1 sm:flex-none px-4 sm:px-10 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'code' 
                  ? 'bg-[#3B82F6] text-[#FFFFFF] shadow-md' 
                  : 'text-[#6B7280] hover:text-[#3B82F6]'
              }`}
            >
              {'<>'} Get Code
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6 md:p-8 pb-6 sm:pb-8 flex flex-col md:flex-row gap-6 min-h-112.5 md:min-h-100">
          
          {/* Left Side: Dynamic Preview */}
          <div className="w-full md:w-[45%] flex flex-col items-center justify-center bg-linear-to-br from-[#F9FAFB] to-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-4">
            <div className="flex flex-col items-center justify-center w-full h-full">
              {/* Dynamic CSS Injection */}
              <style>{dynamicCSS}</style>
              
              <div className="flex items-center justify-center min-h-37.5 w-full">
                <div 
                  className={`flex items-center justify-center ${getPreviewScale()} transition-transform duration-300`} 
                  dangerouslySetInnerHTML={{ __html: dynamicHTML }} 
                />
              </div>
              
              {/* Status Indicators */}
              <div className="flex items-center gap-3 mt-4">
                <div className={`w-2 h-2 rounded-full ${isChecked ? 'bg-[#3B82F6]' : 'bg-[#E5E7EB]'}`}></div>
                <span className="text-[#6B7280] font-bold tracking-widest text-[10px] uppercase">
                  Live Preview • {size.charAt(0).toUpperCase() + size.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Content Area */}
          <div className="w-full md:w-[55%] flex flex-col overflow-y-auto max-h-87.5 md:max-h-100 pr-1 custom-scrollbar">
            {activeTab === 'customize' ? (
              <div className="space-y-5">
                {/* Primary Color */}
                <div>
                  <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
                    Primary Color
                  </label>
                  <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-3 hover:border-[#3B82F6] transition-all">
                    <div className="flex items-center gap-4">
                      <input 
                        type="color" 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)} 
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-[#E5E7EB] shadow-sm" 
                      />
                      <div>
                        <span className="text-[#0B1220] font-mono text-base sm:text-xl font-bold uppercase block">
                          {primaryColor}
                        </span>
                        <span className="text-[#6B7280] text-[10px] font-bold tracking-widest mt-1 flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div>
                          HEX CODE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SIZE SECTION */}
                <div>
                  <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
                    Switch Size
                  </label>
                  <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-4 hover:border-[#3B82F6] transition-all">
                    {/* Size buttons */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {['small', 'medium', 'large'].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={`py-2.5 sm:py-3 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                            size === s 
                              ? 'bg-[#3B82F6] text-[#FFFFFF] shadow-md' 
                              : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#FFFFFF] hover:text-[#3B82F6] border border-[#E5E7EB]'
                          }`}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                    
                    {/* Size preview bars */}
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-xs text-[#6B7280] font-medium mb-2">Size Preview</div>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 rounded-full transition-all ${
                            size === 'small' ? 'w-8 bg-[#3B82F6]' : 'w-8 bg-[#E5E7EB]'
                          }`}></div>
                          <div className={`h-2 rounded-full transition-all ${
                            size === 'medium' ? 'w-12 bg-[#3B82F6]' : 'w-12 bg-[#E5E7EB]'
                          }`}></div>
                          <div className={`h-2 rounded-full transition-all ${
                            size === 'large' ? 'w-16 bg-[#3B82F6]' : 'w-16 bg-[#E5E7EB]'
                          }`}></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#111827] font-bold text-base sm:text-lg">{size.toUpperCase()}</div>
                        <div className="text-[#6B7280] text-[10px] font-bold tracking-widest">SIZE</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Code Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                    Pure CSS & HTML
                  </label>
                  <button 
                    onClick={handleCopyCode}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all border w-full sm:w-auto justify-center ${
                      copied 
                        ? 'bg-[#10B981] border-[#10B981] text-[#FFFFFF]' 
                        : 'bg-[#FFFFFF] border-[#E5E7EB] text-[#6B7280] hover:border-[#3B82F6] hover:text-[#3B82F6]'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        COPIED
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        COPY CODE
                      </>
                    )}
                  </button>
                </div>

                {/* Code Window */}
                <div className="relative flex-1 bg-[#111827] rounded-xl border border-[#374151] overflow-hidden flex flex-col font-mono">
                  {/* Window Controls */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#1F2937] border-b border-[#374151]">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 bg-[#EF4444] rounded-full"></div>
                      <div className="w-3 h-3 bg-[#F59E0B] rounded-full"></div>
                      <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
                    </div>
                    <span className="text-[#9CA3AF] text-xs ml-2 truncate">switch-{design.id}.html</span>
                  </div>
                  
                  {/* Code Content */}
                  <div className="p-4 overflow-auto text-xs leading-relaxed custom-scrollbar h-55 sm:h-62.5 bg-[#111827]">
                    <pre className="text-[#F472B6] mb-2">{`<!-- ${design.name} - ${size.toUpperCase()} -->`}</pre>
                    <pre className="text-[#E5E7EB] mb-4 whitespace-pre-wrap font-mono text-[11px] sm:text-xs">{dynamicHTML}</pre>
                    <pre className="text-[#60A5FA] mb-2">{`/* CSS */`}</pre>
                    <pre className="text-[#9CA3AF] whitespace-pre-wrap font-mono text-[11px] sm:text-xs">{dynamicCSS}</pre>
                  </div>
                </div>

                {/* Code Stats */}
                <div className="flex justify-between mt-3 text-[10px] text-[#6B7280]">
                  <span>HTML: {dynamicHTML.length} chars</span>
                  <span>CSS: {dynamicCSS.length} chars</span>
                  <span>Size: {size}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwitchCustomizeModal;