import { useState, useRef, useEffect } from 'react';
import {
    ChevronDown, Copy, Upload, Check, ImageIcon, Wifi, Battery
} from 'lucide-react';
import { FaSquareXTwitter } from "react-icons/fa6";
import toast from 'react-hot-toast';

// --- Reusable Field Component ---
const FormField = ({ label, children }) => (
    <div className="relative w-full p-3 bg-white border border-[#E5E7EB] rounded-lg flex flex-col justify-center focus-within:ring-2 ring-[#3B82F6]/20 focus-within:border-[#3B82F6] transition-all">
        <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-tight leading-none mb-2">
            {label}
        </label>
        <div className="w-full flex items-center">
            {children}
        </div>
    </div>
);

const CustomDropdown = ({ label, value, options, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropRef = useRef(null);

    useEffect(() => {
        const close = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    return (
        <div className="relative w-full" ref={dropRef}>
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                <FormField label={label}>
                    <div className="w-full flex justify-between items-center text-sm font-bold text-[#111827]">
                        <span className="truncate">{value.name || value}</span>
                        <ChevronDown size={16} className={`text-[#6B7280] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </FormField>
            </div>
            {isOpen && (
                <div className="absolute top-[110%] left-0 w-full bg-white border border-[#E5E7EB] rounded-lg z-100 py-2 max-h-64 overflow-y-auto shadow-lg">
                    {options.map((opt, i) => (
                        <div key={i} onClick={() => { onSelect(opt); setIsOpen(false); }}
                            className="px-4 py-3 hover:bg-[#F9FAFB] hover:text-[#3B82F6] cursor-pointer text-sm font-semibold flex justify-between items-center text-[#6B7280]">
                            {opt.name || opt}
                            {(opt.name || opt) === (value.name || value) && <Check size={14} className="text-[#3B82F6]" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const AdRevenueGenerator = () => {
    const wallpapersList = [
        { name: 'Deep Space', url: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1000' },
        { name: 'Minimal Grey', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000' },
        { name: 'Sunset Vibes', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1000' },
        { name: 'Cyberpunk', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000' },
        { name: 'Forest Mist', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000' },
        { name: 'Ocean Dark', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1000' },
        { name: 'Neon City', url: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=1000' },
        { name: 'Mountain Peak', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000' }
    ];

    const [selectedWallpaper, setSelectedWallpaper] = useState(wallpapersList[0]);
    const [carrier, setCarrier] = useState('AT&T');
    const [revenue, setRevenue] = useState('100.0');
    const [exportOpen, setExportOpen] = useState(false);

    const screenshotRef = useRef(null);
    const exportBtnRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportBtnRef.current && !exportBtnRef.current.contains(event.target)) {
                setExportOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleExport = async (mode) => {
        try {
            const { toPng, toBlob } = await import('html-to-image');
            if (mode === 'download') {
                const dataUrl = await toPng(screenshotRef.current, { cacheBust: true, pixelRatio: 2 });
                const link = document.createElement('a');
                link.download = `revenue-${revenue}.png`;
                link.href = dataUrl;
                link.click();
                toast.success("Image downloaded!", { duration: 1500 });
            } else {
                const blob = await toBlob(screenshotRef.current);
                await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
                toast.success("Copied to clipboard!", { duration: 1500 });
            }
        } catch (err) { 
            console.error('Export failed', err);
            toast.error("Export failed!", { duration: 1500 });
        }
        setExportOpen(false);
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size should be less than 5MB", { duration: 1500 });
                return;
            }
            const url = URL.createObjectURL(file);
            setSelectedWallpaper({ name: 'Custom Upload', url: url });
            toast.success("Wallpaper uploaded!", { duration: 1500 });
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-manrope">

            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 items-start">

                    {/* Mockup Column */}
                    <div className="lg:sticky lg:top-10 flex flex-col items-center">
                        {/* Mobile Frame */}
                        <div className="relative w-80 h-150 bg-[#111827] rounded-[2.8rem] border-8 border-[#1F2937] shadow-2xl overflow-hidden">

                            {/* Inner Screen Area */}
                            <div ref={screenshotRef} className="relative w-full h-full overflow-hidden">
                                <img src={selectedWallpaper.url} className="absolute inset-0 w-full h-full object-cover" alt="bg" />

                                <div className="absolute top-0 w-full p-4 flex justify-between items-center text-white z-10">
                                    <span className="text-[11px] font-bold">{carrier}</span>
                                    <div className="flex items-center gap-1.5 opacity-90 font-bold">
                                        <span className="text-[10px]">5G</span>
                                        <Wifi size={14} />
                                        <Battery size={14} />
                                    </div>
                                </div>

                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] bg-white/95 backdrop-blur-md rounded-lg p-4 shadow-xl border border-[#E5E7EB]">
                                    <div className="flex gap-3">
                                        <div className="w-12 h-12 bg-[#111827] rounded-lg flex items-center justify-center shrink-0">
                                            <FaSquareXTwitter className="text-white text-2xl" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="font-bold text-[13px] text-[#111827] truncate">You got paid!</h4>
                                                <span className="text-[9px] text-[#6B7280] font-medium">9m ago</span>
                                            </div>
                                            <p className="text-[12px] text-[#6B7280] leading-tight font-medium">
                                                ${revenue} has been deposited into your account.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Column */}
                    <div className="space-y-8">
                        <section className="space-y-4">
                            <h2 className="text-sm font-bold text-[#111827] uppercase tracking-widest">Wallpaper</h2>
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="flex-1 w-full">
                                    <CustomDropdown
                                        label="Ready-To-Use Wallpaper"
                                        value={selectedWallpaper}
                                        options={wallpapersList}
                                        onSelect={(val) => setSelectedWallpaper(val)}
                                    />
                                </div>
                                <span className="text-xs font-bold text-[#9CA3AF] italic">OR</span>
                                <div className="flex-1 w-full">
                                    <label className="cursor-pointer">
                                        <FormField label="Custom Wallpaper">
                                            <div className="flex items-center gap-2 text-xs font-bold text-[#3B82F6] uppercase">
                                                <Upload size={14} /> Click to upload
                                            </div>
                                        </FormField>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                                    </label>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-sm font-bold text-[#111827] uppercase tracking-widest">Details</h2>
                            <div className="space-y-4">
                                <FormField label="Carrier Name">
                                    <input className="w-full bg-transparent outline-none text-sm font-bold text-[#111827]" value={carrier} onChange={(e) => setCarrier(e.target.value)} />
                                </FormField>
                                <FormField label="Revenue Amount ($)">
                                    <input className="w-full bg-transparent outline-none text-md font-bold text-[#111827] font-manrope" value={revenue} onChange={(e) => setRevenue(e.target.value)} />
                                </FormField>
                            </div>
                        </section>

                        {/* Export Section */}
                        <div className="relative pt-6 flex justify-center">
                            <div className="relative inline-block w-full max-w-xs" ref={exportBtnRef}>
                                <button
                                    onClick={() => setExportOpen(!exportOpen)}
                                    className="w-full py-4 bg-[#3B82F6] text-white rounded-full font-black text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-[#2776f5] transition-all active:scale-95 shadow-lg shadow-[#3B82F6]/20"
                                >
                                    EXPORT SCREENSHOT <ChevronDown size={18} className={`transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {exportOpen && (
                                    <div className="absolute top-[115%] left-0 w-full bg-white rounded-lg border border-[#E5E7EB] z-120 py-2 overflow-hidden animate-in fade-in zoom-in-95 shadow-xl">
                                        <button onClick={() => handleExport('download')} className="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold text-[#111827] hover:bg-[#F9FAFB] hover:text-[#3B82F6] transition-colors border-b border-[#E5E7EB]">
                                            <ImageIcon size={18} className="text-[#3B82F6]" /> Download Image
                                        </button>
                                        <button onClick={() => handleExport('copy')} className="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold text-[#111827] hover:bg-[#F9FAFB] hover:text-[#3B82F6] transition-colors">
                                            <Copy size={18} className="text-[#3B82F6]" /> Copy to Clipboard
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="text-center text-[11px] text-[#6B7280] font-medium leading-relaxed">
                            By using Twitter Ad Revenue Generator, you agree to our <span className="text-[#3B82F6] font-bold underline cursor-pointer hover:text-[#2776f5]">Usage Policy</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdRevenueGenerator;