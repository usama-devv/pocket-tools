import { useState } from 'react';
import { Settings, MoreHorizontal, Shuffle, Copy, RotateCcw, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const GlassmorphismGenerator = () => {
  // --- State Management ---
  const [color, setColor] = useState('#3B82F6');
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(0.5);
  const [showBorder, setShowBorder] = useState(true);
  const [showContent, setShowContent] = useState(true);
  const [useShapes, setUseShapes] = useState(false); 
  const [bgImage, setBgImage] = useState('https://images.unsplash.com/photo-1557683316-973673baf926');
  const [copied, setCopied] = useState(false);

  // Helper: Hex to RGBA
  const hexToRGBA = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const glassStyle = {
    background: hexToRGBA(color, opacity),
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: showBorder ? `1px solid ${hexToRGBA(color, 0.25)}` : 'none',
    minHeight: '380px', 
  };

  const cssCode = `background: ${hexToRGBA(color, opacity)};\nbackdrop-filter: blur(${blur}px);\n-webkit-backdrop-filter: blur(${blur}px);\n${showBorder ? `border: 1px solid ${hexToRGBA(color, 0.25)};` : ''}`;

  // --- Copy Handler  ---
  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    toast.success('CSS copied!', { duration: 1500 });
    setTimeout(() => setCopied(false), 2000);
  };

  const shuffleBg = () => {
    setBgImage(`https://picsum.photos/800/800?random=${Math.floor(Math.random() * 1000)}`);
    toast.success('Background shuffled!', { duration: 1500 });
  };

  const shuffleColor = () => {
    setColor('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'));
    toast.success('Color shuffled!', { duration: 1500 });
  };

  const handleReset = () => {
    setBlur(10);
    setOpacity(0.5);
    setColor('#3B82F6');
    toast.success('Reset to default!', { duration: 1500 });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] md:p-8 font-sans text-[#111827] font-manrope">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#FFFFFF] p-6 rounded-xl shadow border border-[#E5E7EB]">
        
        {/* Left Side: Preview Area */}
        <div className={`relative flex items-center justify-center rounded-xl overflow-hidden min-h-100 md:min-h-125 transition-all duration-500 ${useShapes ? 'bg-linear-to-br from-[#111827] to-[#1F2937]' : ''}`}
             style={!useShapes ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
          
          {useShapes && (
            <div className="absolute inset-0 overflow-hidden bg-linear-to-br from-[#1E293B] via-[#0F172A] to-[#020617]">
              <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-[#8B5CF6] rounded-full mix-blend-screen filter blur-[60px] opacity-60 animate-pulse"></div>
              <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-[#06B6D4] rounded-full mix-blend-screen filter blur-[80px] opacity-50 animate-bounce transition-all duration-1000"></div>
              <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-[#EC4899] rounded-full mix-blend-overlay filter blur-[100px] opacity-40 animate-spin-slow"></div>
              <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-[#FBBF24] rounded-full mix-blend-overlay filter blur-2xl opacity-30"></div>
            </div>
          )}
          
          <div style={glassStyle} className="w-11/12 max-w-sm rounded-3xl p-6 shadow-2xl transition-all duration-300 relative z-10 flex flex-col justify-center border border-white/20">
            <div className={`space-y-6 transition-opacity duration-300 ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="flex justify-between items-center">
                <h2 className={`text-xl font-bold ${useShapes ? 'text-white' : 'text-[#111827]'}`}>User List</h2>
                <Settings className={`w-5 h-5 cursor-pointer opacity-70 ${useShapes ? 'text-white' : 'text-[#111827]'}`} />
              </div>
              
              {[ 
                { name: 'Kelli Hopkins', role: 'Fashion Designer', img: 'https://i.pravatar.cc/150?u=1' },
                { name: 'Craig Voss', role: 'Software Developer', img: 'https://i.pravatar.cc/150?u=2' },
                { name: 'Debra J. Davis', role: 'Marketing Specialist', img: 'https://i.pravatar.cc/150?u=3' }
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={user.img} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white/30 shadow-sm" />
                    <div>
                      <p className={`font-semibold text-sm ${useShapes ? 'text-white' : 'text-[#111827]'}`}>{user.name}</p>
                      <p className={`text-xs opacity-70 ${useShapes ? 'text-white/80' : 'text-[#6B7280]'}`}>{user.role}</p>
                    </div>
                  </div>
                  <MoreHorizontal className={`w-5 h-5 opacity-50 ${useShapes ? 'text-white' : 'text-[#111827]'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Controls */}
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#111827]">Glass Color</label>
              <div className="flex items-center gap-3 p-3 border border-[#E5E7EB] rounded-lg focus-within:ring-2 ring-[#3B82F6] transition-all">
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border border-[#E5E7EB]" />
                <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="flex-1 outline-none uppercase font-mono bg-transparent text-[#0B1220]" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#111827] font-semibold">Blur: {blur}px</span>
                </div>
                <input type="range" min="0" max="25" value={blur} onChange={(e) => setBlur(parseInt(e.target.value))} className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#111827] font-semibold">Opacity: {opacity}</span>
                </div>
                <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]" />
              </div>
            </div>

            <div className="space-y-3 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={showBorder} onChange={(e) => setShowBorder(e.target.checked)} className="w-5 h-5 rounded border-[#E5E7EB] text-[#3B82F6] focus:ring-[#3B82F6]" />
                <span className="text-[#111827] font-semibold">Use border for glass</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={showContent} onChange={(e) => setShowContent(e.target.checked)} className="w-5 h-5 rounded border-[#E5E7EB] text-[#3B82F6] focus:ring-[#3B82F6]" />
                <span className="text-[#111827] font-semibold">Show content on glass?</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={useShapes} onChange={(e) => setUseShapes(e.target.checked)} className="w-5 h-5 rounded border-[#E5E7EB] text-[#3B82F6] focus:ring-[#3B82F6]" />
                <span className="text-[#111827] font-semibold">Use gradient shapes</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button onClick={shuffleBg} className="flex items-center justify-center gap-2 py-3 px-4 border border-[#3B82F6] text-[#3B82F6] rounded-full hover:bg-[#F9FAFB] transition-all font-bold">
                <Shuffle className="w-4 h-4" /> Shuffle Background
              </button>
              <button onClick={shuffleColor} className="flex items-center justify-center gap-2 py-3 px-4 border border-[#3B82F6] text-[#3B82F6] rounded-full hover:bg-[#F9FAFB] transition-all font-bold">
                <Shuffle className="w-4 h-4" /> Shuffle Color
              </button>
            </div>
          </div>

          <div className="mt-auto">
            <div className="bg-[#111827] rounded-xl p-6 relative group border border-[#374151]">
              <p className="text-[#9CA3AF] text-xs font-mono mb-2 uppercase tracking-widest">CSS Code</p>
              <pre className="text-[#10B981] font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                {cssCode}
              </pre>
              <div className="absolute top-4 right-4 flex gap-2">
                 <button onClick={handleReset} className="p-4 bg-[#1F2937] text-[#9CA3AF] rounded-full hover:bg-[#374151] hover:text-white transition-colors">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleCopy} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-bold shadow ${copied ? 'bg-[#10B981] text-white' : 'bg-[#3B82F6] text-white hover:bg-[#2776f5]'}`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 15s linear infinite; }
        
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #3B82F6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default GlassmorphismGenerator;