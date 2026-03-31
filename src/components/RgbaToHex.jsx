import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { convertRgbaToAll } from '../utils/convertRgbaToHex'; 
import toast from 'react-hot-toast';

const RgbaToHex = () => {
    const [rgbaInput, setRgbaInput] = useState("");
    const [result, setResult] = useState({ hex: "", rgba: "—", hsla: "—" });
    const [copiedField, setCopiedField] = useState("");
    const [error, setError] = useState(false);

    const handleConvert = () => {
        const data = convertRgbaToAll(rgbaInput);

        if (data.error) {
            setError(true);
            toast.error(data.message, { duration: 1500 });
            setResult({ hex: "—", rgba: "", hsla: "—" });
        } else {
            setError(false);
            setResult(data);
            toast.success("Converted successfully!", { duration: 1500 });
        }
    };

    const copyToClipboard = (text, field) => {
        if (!text || text === "—") {
            toast.error("Nothing to copy!", { duration: 1500 });
            return;
        }
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        toast.success("Copied!", { duration: 1500 });
        setTimeout(() => setCopiedField(""), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-2 space-y-10 font-manrope mt-6">

            {/* Row 1: Input Boxes */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-6">

                {/* RGBA Input Box */}
                <div className="flex-1 relative group">
                    <div className="absolute top-1 left-4">
                        <span className="text-xs font-bold text-[#6B7280] tracking-widest">RGBA</span>
                    </div>
                    <input
                        type="text"
                        value={rgbaInput}
                        onChange={(e) => {
                            setRgbaInput(e.target.value);
                            if (error) setError(false);
                        }}
                        className={`w-full pt-6 pb-3 px-4 py-4 rounded-lg border bg-white focus:ring-1 focus:ring-[#3B82F6] outline-none text-lg font-semibold transition-all text-[#111827] ${
                            error
                                ? 'border-[#EF4444] bg-[#FEF2F2]'
                                : 'border-[#E5E7EB] focus:border-[#3B82F6]'
                        }`}
                        placeholder="rgba(0, 0, 0, 1)"
                    />
                </div>

                {/* Convert Button */}
                <div className="flex justify-center items-center">
                    <button
                        onClick={handleConvert}
                        className="bg-[#3B82F6] hover:bg-[#2776f5] text-white px-8 py-5 rounded-lg flex items-center gap-2 font-semibold transition-all active:scale-95 whitespace-nowrap shadow-lg shadow-[#3B82F6]/20"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Convert
                    </button>
                </div>

                {/* Hex Output Box */}
                <div className="flex-1 relative group">
                    <div className="absolute top-1 left-4">
                        <span className="text-xs font-bold text-[#6B7280] tracking-widest">Hex</span>
                    </div>
                    <input
                        type="text"
                        readOnly
                        value={result.hex}
                        className="w-full pt-6 pb-3 px-4 py-4 rounded-lg border border-[#E5E7EB] bg-white text-lg font-semibold text-[#111827] outline-none"
                        placeholder="#000000"
                    />
                </div>
            </div>

            {/* Row 2: Secondary Button */}
            <div className="flex justify-center md:justify-end">
                <button
                    onClick={() => copyToClipboard(result.hex, 'main-hex')}
                    className={`group flex items-center gap-2 px-8 py-3 rounded-full border transition-all active:scale-95 font-bold ${
                        copiedField === 'main-hex'
                            ? 'bg-[#10B981] border-[#10B981] text-white'
                            : 'border-[#3B82F6] text-[#3B82F6] hover:bg-[#F9FAFB]'
                    }`}
                >
                    {copiedField === 'main-hex' ? (
                        <Check className="w-4 h-4 stroke-[3px]" />
                    ) : (
                        <Copy className="w-4 h-4 stroke-[3px]" />
                    )}
                    <span>
                        {copiedField === 'main-hex' ? 'Copied!' : 'Copy HEX Color'}
                    </span>
                </button>
            </div>

            {/* Row 3: Result Preview Card */}
            <div className="flex justify-center pt-6">
                <div className="bg-white rounded-lg border border-[#E5E7EB] flex flex-col md:flex-row w-full max-w-lg overflow-hidden min-h-40 shadow-sm">
                    <div
                        className="w-full md:w-1/3 min-h-20 md:min-h-full transition-all duration-500 relative flex items-center justify-center border-b md:border-b-0 md:border-r border-[#E5E7EB]"
                        style={{ backgroundColor: result.hex || '#F9FAFB' }}
                    >
                        {!result.hex || result.hex === "—" ? (
                            <span className="text-6xl font-bold text-[#9CA3AF]">?</span>
                        ) : null}
                        <div className="absolute inset-0 bg-black/5 opacity-0 hover:opacity-100 transition-opacity"></div>
                    </div>

                    <div className="w-full md:w-2/3 p-6 flex flex-col justify-center space-y-5">
                        {/* Hex Detail */}
                        <div className="flex flex-col">
                            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">Hex</p>
                            <div onClick={() => copyToClipboard(result.hex, 'hex')} className="flex items-center justify-between cursor-pointer group/item">
                                <p className="text-base font-semibold text-[#111827] transition-colors group-hover/item:text-[#3B82F6]">{result.hex || "—"}</p>
                                <div className="opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity">
                                    {copiedField === 'hex' ? (
                                        <Check className="w-4 h-4 text-[#10B981]" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-[#6B7280] hover:text-[#3B82F6]" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RGBA Detail */}
                        <div className="flex flex-col">
                            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">RGBA</p>
                            <div onClick={() => copyToClipboard(result.rgba, 'rgba')} className="flex items-center justify-between cursor-pointer group/item">
                                <p className="text-base font-semibold text-[#111827] transition-colors group-hover/item:text-[#3B82F6]">{result.rgba || "—"}</p>
                                <div className="opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity">
                                    {copiedField === 'rgba' ? (
                                        <Check className="w-4 h-4 text-[#10B981]" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-[#6B7280] hover:text-[#3B82F6]" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* HSLA Detail */}
                        <div className="flex flex-col">
                            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">HSLA</p>
                            <div onClick={() => copyToClipboard(result.hsla, 'hsla')} className="flex items-center justify-between cursor-pointer group/item">
                                <p className="text-base font-semibold text-[#111827] transition-colors group-hover/item:text-[#3B82F6]">{result.hsla || "—"}</p>
                                <div className="opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity">
                                    {copiedField === 'hsla' ? (
                                        <Check className="w-4 h-4 text-[#10B981]" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-[#6B7280] hover:text-[#3B82F6]" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RgbaToHex;