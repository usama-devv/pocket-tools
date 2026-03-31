import { useState } from 'react';
import { Copy, Smartphone, Apple } from 'lucide-react';
import toast from 'react-hot-toast';

const ReactNativeShadow = () => {
    const [color, setColor] = useState('#3B82F6');
    const [depth, setDepth] = useState(4);
    const [copied, setCopied] = useState(false);

    const hexToRGBA = (hex, opacity) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    const shadowStyles = {
        shadowColor: color,
        shadowOffset: { width: 0, height: Math.round(depth / 2) },
        shadowOpacity: parseFloat((0.1 + (depth / 50)).toFixed(2)),
        shadowRadius: parseFloat((depth * 0.8).toFixed(2)),
        elevation: depth,
    };

    const codeString = `shadowColor: "${shadowStyles.shadowColor}",
shadowOffset: {
  width: ${shadowStyles.shadowOffset.width},
  height: ${shadowStyles.shadowOffset.height},
},
shadowOpacity: ${shadowStyles.shadowOpacity},
shadowRadius: ${shadowStyles.shadowRadius},
elevation: ${shadowStyles.elevation}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(codeString);
        setCopied(true);
        toast.success('Code copied!', { duration: 1500 });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-2 md:p-12 font-manrope">
            <div className="max-w-5xl mx-auto">

                {/* TOP SECTION: Controls */}
                <div className="flex flex-col md:flex-row gap-6 pb-8 items-center">
                    {/* Color Picker Column */}
                    <div className="w-full md:w-1/4">
                        <label className="text-xs font-medium text-[#6B7280] mb-1 block h-5">Shadow Color</label>
                        <div className="flex items-center gap-3 p-3 border border-[#E5E7EB] rounded-lg bg-white h-12">
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-8 h-8 cursor-pointer bg-transparent border border-[#E5E7EB]"
                            />
                            <span className="text-sm uppercase font-semibold text-[#111827]">{color}</span>
                        </div>
                    </div>

                    {/* Slider Column */}
                    <div className="w-full md:w-3/4">
                        <div className="flex items-center gap-2 mb-1 h-5">
                            <label className="text-xs font-medium text-[#6B7280]">Shadow Depth</label>
                            <span className="text-sm font-bold text-[#3B82F6] bg-[#F9FAFB] px-2 py-0.5 rounded border border-[#E5E7EB]">{depth}</span>
                        </div>
                        <div className="flex items-center h-12">
                            <input
                                type="range" min="1" max="24" value={depth}
                                onChange={(e) => setDepth(parseInt(e.target.value))}
                                className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                            />
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION: Previews */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="flex justify-around items-start gap-4">
                        {/* iOS */}
                        <div className="flex flex-col items-center flex-1">
                            <div className="flex items-center gap-1 text-xs font-bold text-[#6B7280] uppercase mb-3">
                                <Apple size={16} className="text-[#111827]" /> iOS
                            </div>
                            <div className="w-full h-72 bg-white rounded-t-[2.5rem] border-x-4 border-t-4 border-[#E5E7EB] relative overflow-hidden">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#E5E7EB] rounded-b-lg" />
                                <div className="flex justify-center mt-12">
                                    <div
                                        className="mt-10 bg-white rounded-xl transition-all duration-300 w-25 h-25 md:w-35 md:h-35"
                                        style={{
                                            boxShadow: `0px ${shadowStyles.shadowOffset.height}px ${shadowStyles.shadowRadius}px ${hexToRGBA(color, shadowStyles.shadowOpacity)}`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Android */}
                        <div className="flex flex-col items-center flex-1">
                            <div className="flex items-center gap-1 text-xs font-bold text-[#6B7280] uppercase mb-3">
                                <Smartphone size={16} className="text-[#111827]" /> Android
                            </div>
                            <div className="w-full h-72 bg-white rounded-t-3xl border-x-4 border-t-4 border-[#E5E7EB] relative overflow-hidden">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#E5E7EB] rounded-full" />
                                <div className="flex justify-center mt-12">
                                    <div
                                        className="mt-10 bg-white rounded-md transition-all duration-300 w-25 h-25 md:w-35 md:h-35"
                                        style={{
                                            boxShadow: `0px ${shadowStyles.shadowOffset.height * 1.5}px ${shadowStyles.shadowRadius * 1.2}px ${hexToRGBA(color, shadowStyles.shadowOpacity * 0.7)}`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Code Box */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-white rounded-2xl p-4 pl-8 shadow-xl border border-[#E5E7EB] min-h-55">
                            <label className="text-xs font-bold text-[#6B7280] uppercase tracking-widest block mb-4">React Native Shadow Style</label>
                            <pre className="text-[#3B82F6] font-mono text-sm leading-relaxed overflow-x-auto">
                                {codeString}
                            </pre>
                        </div>

                        <button
                            onClick={handleCopy}
                            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition-all active:scale-[0.98] ${copied
                                ? 'bg-[#10B981]'
                                : 'bg-[#3B82F6] hover:bg-[#2776f5] shadow-lg shadow-[#3B82F6]/20'
                                }`}
                        >
                            <Copy size={18} />
                            {copied ? 'Copied!' : 'Copy Code'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReactNativeShadow;