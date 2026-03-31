import { useState, useEffect } from 'react';
import { X, Palette, Code, Copy, Check, Eye, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const CheckboxCustomizeModal = ({ isOpen, onClose, design, activeTab, setActiveTab, initialColor }) => {
  const [primaryColor, setPrimaryColor] = useState("#3B82F6");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (design) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrimaryColor(initialColor || "#3B82F6");
    }
  }, [design, initialColor, isOpen]);

  if (!isOpen || !design) return null;

  const dynamicCSS = typeof design.getCss === 'function' ? design.getCss(primaryColor) : '';
  const dynamicHTML = design.html || '';

  const handleCopyCode = () => {
    const fullCode = `\n${dynamicHTML}\n\n<style>\n${dynamicCSS}\n</style>`;
    navigator.clipboard.writeText(fullCode);
    setCopied(true);
    
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
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#111827]/60 backdrop-blur-md p-4 font-manrope">
      {/* Dynamic Style Injection for the Preview */}
      <style>{dynamicCSS}</style>

      <div className="bg-[#FFFFFF] rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl border border-[#E5E7EB] relative animate-in fade-in zoom-in duration-300">

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2] p-2 rounded-full transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Header */}
        <div className="flex justify-center pt-10 pb-6 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <div className="flex bg-[#FFFFFF] p-1 rounded-lg border border-[#E5E7EB]">
            <button 
              onClick={() => setActiveTab('customize')} 
              className={`flex items-center gap-2 px-8 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'customize' 
                  ? 'bg-[#3B82F6] text-[#FFFFFF] shadow-md' 
                  : 'text-[#6B7280] hover:text-[#3B82F6]'
              }`}
            >
              <Palette className="w-4 h-4" />
              Customize
            </button>
            <button 
              onClick={() => setActiveTab('code')} 
              className={`flex items-center gap-2 px-8 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'code' 
                  ? 'bg-[#3B82F6] text-[#FFFFFF] shadow-md' 
                  : 'text-[#6B7280] hover:text-[#3B82F6]'
              }`}
            >
              <Code className="w-4 h-4" />
              Get Code
            </button>
          </div>
        </div>

        <div className="px-6 pb-8 flex flex-col md:flex-row gap-6 items-stretch min-h-80">
          
          {/* Left Side: Dynamic Preview */}
          <div className="w-full md:w-[45%] flex flex-col items-center justify-center bg-linear-to-br from-[#F9FAFB] to-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-6">
            <div className="flex flex-col items-center gap-6 w-full">
                <div className="flex items-center justify-center min-h-30 w-full">
                  <div 
                    className="scale-[2.5] flex items-center justify-center" 
                    dangerouslySetInnerHTML={{ __html: dynamicHTML }} 
                  />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Eye className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span className="text-[#6B7280] font-bold tracking-widest text-[10px] uppercase">Live Preview</span>
                </div>
            </div>
          </div>

          {/* Right Side: Content Area */}
          <div className="w-full md:w-[55%] flex flex-col">
            {activeTab === 'customize' ? (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-2 mt-5">
                  <Sparkles className="w-4 h-4 text-[#3B82F6]" />
                  <h3 className="text-sm font-bold text-[#111827]">Customization Option</h3>
                </div>
                
                <div>
                  <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block ml-1">
                    Primary Color
                  </label>
                  <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-4 hover:border-[#3B82F6] transition-all">
                    <div className="flex items-center gap-4">
                      <input 
                        type="color" 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)} 
                        className="w-14 h-14 rounded-lg cursor-pointer border-2 border-[#E5E7EB] shadow-sm" 
                      />
                      <div>
                        <span className="text-[#0B1220] font-mono text-xl font-bold uppercase tracking-tight block">
                          {primaryColor}
                        </span>
                        <span className="text-[#6B7280] text-[10px] font-bold tracking-widest mt-1 flex items-center gap-1">
                          <Palette className="w-3 h-3" />
                          HEX CODE
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Design Info */}
                <div className="mt-4 p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280]">
                    <span className="font-bold text-[#111827]">Design:</span> {design.name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col mt-5 h-full animate-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-[#3B82F6]" />
                    <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                      Pure CSS & HTML
                    </label>
                  </div>
                  <button 
                    onClick={handleCopyCode}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all border ${
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
                        COPY
                      </>
                    )}
                  </button>
                </div>

                <div className="relative flex-1 bg-[#111827] rounded-xl border border-[#374151] shadow-2xl overflow-hidden flex flex-col font-mono">
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#1F2937] border-b border-[#374151]">
                    <div className="w-3 h-3 bg-[#EF4444] rounded-full"></div>
                    <div className="w-3 h-3 bg-[#F59E0B] rounded-full"></div>
                    <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
                    <span className="text-[#9CA3AF] text-xs ml-2">checkbox-code.css</span>
                  </div>
                  <div className="p-4 overflow-auto text-xs leading-relaxed custom-scrollbar max-h-60">
                    <pre className="text-[#F472B6] mb-2">{`<!-- HTML -->`}</pre>
                    <pre className="text-[#E5E7EB] mb-4 whitespace-pre-wrap font-mono">{dynamicHTML}</pre>
                    <pre className="text-[#60A5FA] mb-2">{`/* CSS */`}</pre>
                    <pre className="text-[#9CA3AF] whitespace-pre-wrap font-mono">{dynamicCSS}</pre>
                  </div>
                </div>

                {/* Code Stats */}
                <div className="flex justify-between mt-3 text-[10px] text-[#6B7280]">
                  <span>HTML: {dynamicHTML.length} chars</span>
                  <span>CSS: {dynamicCSS.length} chars</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#F9FAFB] border-t border-[#E5E7EB] text-center">
          <p className="text-[10px] text-[#6B7280]">
            Changes are applied in real-time
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckboxCustomizeModal;