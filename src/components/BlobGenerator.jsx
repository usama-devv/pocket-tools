import { useState, useEffect, useRef } from 'react';
import { Shuffle, Download, Copy, Check, ChevronDown, Palette, Image, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const BlobGenerator = () => {
    // --- States ---
    const [color, setColor] = useState('#3B82F6');
    const [growth, setGrowth] = useState(5);
    const [edgeCount, setEdgeCount] = useState(8);
    const [useImage, setUseImage] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [path, setPath] = useState('');
    const [copied, setCopied] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [recentColors] = useState(['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']);

    const dropdownRef = useRef(null);

    // --- Logic: Pure function to calculate path string ---
    const calculatePath = (currentGrowth, currentEdges) => {
        const size = 400;
        const center = size / 2;
        const variability = (10 - currentGrowth) * 20;
        const radius = 100;
        const points = [];
        const angleStep = (Math.PI * 2) / currentEdges;

        for (let i = 0; i < currentEdges; i++) {
            const theta = i * angleStep;
            const delta = Math.random() * variability;
            const r = radius + delta;
            points.push({
                x: center + r * Math.cos(theta),
                y: center + r * Math.sin(theta)
            });
        }

        let d = `M ${(points[0].x + points[points.length - 1].x) / 2} ${(points[0].y + points[points.length - 1].y) / 2}`;
        for (let i = 0; i < points.length; i++) {
            const pCurrent = points[i];
            const pNext = points[(i + 1) % points.length];
            const midX = (pCurrent.x + pNext.x) / 2;
            const midY = (pCurrent.y + pNext.y) / 2;
            d += ` Q ${pCurrent.x} ${pCurrent.y}, ${midX} ${midY}`;
        }
        return d + ' Z';
    };

    useEffect(() => {
        const newPath = calculatePath(growth, edgeCount);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPath(newPath);
    }, [growth, edgeCount]);

    const handleShuffle = () => {
        setPath(calculatePath(growth, edgeCount));
        toast.success('New blob shape created!', {
            duration: 2000,
            icon: '✨',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });
    };

    const handleCopy = async () => {
        const svgElement = document.getElementById('blob-svg');
        if (svgElement) {
            await navigator.clipboard.writeText(svgElement.outerHTML);
            setCopied(true);
            setIsExportOpen(false);
            toast.success('SVG code copied!', {
                duration: 2000,
                icon: '📋',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        const svgElement = document.getElementById('blob-svg');
        if (svgElement) {
            const svgData = svgElement.outerHTML;
            const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "blob.svg";
            link.click();
            URL.revokeObjectURL(url);
            setIsExportOpen(false);
            toast.success('SVG downloaded!', {
                duration: 2000,
                icon: '📥',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
        }
    };

    useEffect(() => {
        const closeMenu = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsExportOpen(false);
            }
        };
        document.addEventListener("mousedown", closeMenu);
        return () => document.removeEventListener("mousedown", closeMenu);
    }, []);

    return (
        <div className="max-w-5xl mx-auto min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
            <div className="bg-[#FFFFFF] rounded-lg shadow border border-[#E5E7EB] p-8 max-w-6xl w-full">
                {/* Header with Gradient */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-[#111827] flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-[#3B82F6]" />
                            Blob Generator
                        </h2>
                        <p className="text-sm text-[#6B7280] mt-1">Create unique organic shapes for your designs</p>
                    </div>
                    <div className="flex items-center gap-2 bg-[#F9FAFB] px-4 py-2 rounded-full border border-[#E5E7EB]">
                        <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-[#0B1220]">Live Preview</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* SVG Preview - Enhanced */}
                    <div className="flex-1">
                        <div className="bg-linear-to-br from-[#F9FAFB] to-[#FFFFFF] rounded-2xl border-2 border-[#E5E7EB] p-6 shadow-inner">
                            <div className="relative">
                                <svg id="blob-svg" viewBox="0 0 400 400" className="w-full aspect-square drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        {useImage && imageUrl && (
                                            <pattern id="pattern" patternUnits="userSpaceOnUse" width="400" height="400">
                                                <image href={imageUrl} x="0" y="0" width="400" height="400" preserveAspectRatio="xMidYMid slice" />
                                            </pattern>
                                        )}
                                        <filter id="shadow">
                                            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
                                        </filter>
                                    </defs>
                                    <path 
                                        d={path} 
                                        fill={useImage && imageUrl ? "url(#pattern)" : color} 
                                        filter="url(#shadow)"
                                        className="transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                                    />
                                </svg>
                                
                                {/* Badge */}
                                <div className="absolute top-4 left-4 bg-[#FFFFFF]/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#E5E7EB] shadow-sm">
                                    <span className="text-xs font-medium text-[#3B82F6] flex items-center gap-1">
                                        <Palette className="w-3 h-3" />
                                        {edgeCount} pts · {growth}/9
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls - Attractive but Clean */}
                    <div className="flex-1 space-y-6">
                        {/* Color Picker Card */}
                        <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-5">
                            <label className="flex items-center gap-2 text-sm font-semibold text-[#111827] mb-4">
                                <Palette className="w-4 h-4 text-[#3B82F6]" />
                                Color
                            </label>
                            
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <input 
                                        type="color" 
                                        value={color} 
                                        onChange={(e) => setColor(e.target.value)} 
                                        className="w-12 h-12 rounded-xl border-2 border-[#E5E7EB] cursor-pointer"
                                        disabled={useImage && imageUrl}
                                    />
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#3B82F6] rounded-full border-2 border-white"></div>
                                </div>
                                <span className="font-mono text-lg font-semibold text-[#0B1220]">{color}</span>
                            </div>

                            {/* Recent Colors */}
                            <div className="flex gap-2 mt-4">
                                {recentColors.map((c, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setColor(c)}
                                        className="w-8 h-8 rounded-lg border-2 border-[#E5E7EB] hover:scale-110 transition-transform shadow-sm"
                                        style={{ backgroundColor: c }}
                                        title={c}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Sliders Card */}
                        <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-5 space-y-5">
                            {/* Growth Slider */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-[#111827]">Growth</label>
                                    <span className="text-sm font-bold text-[#3B82F6] bg-white px-3 py-1 rounded-full border border-[#E5E7EB]">
                                        {growth}
                                    </span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="9" 
                                    value={growth} 
                                    onChange={(e) => setGrowth(parseInt(e.target.value))} 
                                    className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                                />
                                <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                                    <span>Smooth</span>
                                    <span>Irregular</span>
                                </div>
                            </div>

                            {/* Edge Count Slider */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium text-[#111827]">Edges</label>
                                    <span className="text-sm font-bold text-[#3B82F6] bg-white px-3 py-1 rounded-full border border-[#E5E7EB]">
                                        {edgeCount}
                                    </span>
                                </div>
                                <input 
                                    type="range" 
                                    min="3" 
                                    max="20" 
                                    value={edgeCount} 
                                    onChange={(e) => setEdgeCount(parseInt(e.target.value))} 
                                    className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                                />
                                <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                                    <span>Simple</span>
                                    <span>Complex</span>
                                </div>
                            </div>
                        </div>

                        {/* Image Toggle Card */}
                        <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-5">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={useImage} 
                                    onChange={(e) => setUseImage(e.target.checked)} 
                                    className="w-5 h-5 rounded border-[#E5E7EB] text-[#3B82F6] focus:ring-[#3B82F6]"
                                />
                                <span className="text-sm font-medium text-[#111827] flex items-center gap-2">
                                    <Image className="w-4 h-4 text-[#3B82F6]" />
                                    Use Image Background
                                </span>
                            </label>
                            
                            {useImage && (
                                <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
                                    <input 
                                        type="text" 
                                        placeholder="https://example.com/image.jpg" 
                                        value={imageUrl} 
                                        onChange={(e) => setImageUrl(e.target.value)} 
                                        className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-sm text-[#0B1220] placeholder-[#6B7280] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button 
                                onClick={handleShuffle} 
                                className="flex-1 flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#2776f5] text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-[#3B82F6]/30 active:scale-95 transition-all"
                            >
                                <Shuffle size={18} /> 
                                Shuffle
                            </button>

                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setIsExportOpen(!isExportOpen)} 
                                    className="h-full px-6 py-4 border-2 border-[#3B82F6] text-[#3B82F6] font-semibold rounded-xl flex items-center gap-2 hover:bg-[#F9FAFB] active:scale-95 transition-all"
                                >
                                    Export <ChevronDown size={16} className={`transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isExportOpen && (
                                    <div className="absolute bottom-full mb-2 right-0 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                                        <button onClick={handleCopy} className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-[#0B1220] hover:bg-[#F9FAFB] transition-colors border-b border-[#E5E7EB]">
                                            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-[#3B82F6]" />}
                                            {copied ? 'Copied!' : 'Copy SVG Code'}
                                        </button>
                                        <button onClick={handleDownload} className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-[#0B1220] hover:bg-[#F9FAFB] transition-colors">
                                            <Download size={16} className="text-[#3B82F6]" />
                                            Download SVG
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-xs text-[#6B7280] pt-2">
                            <span>🎨 {useImage ? 'Image Mode' : 'Color Mode'}</span>
                            <span>📐 {edgeCount} edges</span>
                            <span>✨ {growth}/9 growth</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlobGenerator;