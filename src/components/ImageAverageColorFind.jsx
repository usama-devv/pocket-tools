import { useState, useRef, useEffect } from 'react';
import { Upload, Copy, Check, Info, Settings, Image as ImageIcon, Trash2, ChevronRight, MousePointer2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ImageAverageColorFind = () => {
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [algorithm, setAlgorithm] = useState('simple');
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const canvasRef = useRef(null);

    const algorithms = [
        { id: 'simple', name: 'Simple', description: 'Processes all color units one by one and finds a simple average.' },
        { id: 'sqrt', name: 'Square Root', description: 'Takes the square root of accumulated colors for better accuracy.' },
        { id: 'dominant', name: 'Dominant', description: 'Finds the most used and dominant color in the image.' },
    ];

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size should be less than 10MB', {
                duration: 3000,
                position: 'top-right',
                icon: '📁',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
            const img = new Image();
            img.onload = () => {
                setImage(img);
                analyzeImage(img, algorithm);
                
                toast.success('Image uploaded successfully!', {
                    duration: 2000,
                    position: 'top-right',
                    icon: '✅',
                    style: {
                        background: '#F9FAFB',
                        color: '#0B1220',
                        border: '1px solid #E5E7EB',
                    },
                });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    const analyzeImage = (img, algo) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Scale for processing speed
        const scale = Math.min(1, 300 / Math.max(img.width, img.height));
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0, a = 0;
        const totalPixels = imageData.length / 4;

        if (algo === 'simple') {
            for (let i = 0; i < imageData.length; i += 4) {
                r += imageData[i]; g += imageData[i + 1]; b += imageData[i + 2]; a += imageData[i + 3];
            }
            r = Math.round(r / totalPixels);
            g = Math.round(g / totalPixels);
            b = Math.round(b / totalPixels);
            a = Math.round(a / totalPixels);
        } else if (algo === 'sqrt') {
            for (let i = 0; i < imageData.length; i += 4) {
                r += imageData[i] ** 2; g += imageData[i + 1] ** 2; b += imageData[i + 2] ** 2; a += imageData[i + 3];
            }
            r = Math.round(Math.sqrt(r / totalPixels));
            g = Math.round(Math.sqrt(g / totalPixels));
            b = Math.round(Math.sqrt(b / totalPixels));
            a = Math.round(a / totalPixels);
        } else if (algo === 'dominant') {
            const counts = {};
            let max = 0;
            let dom = [0, 0, 0, 255];
            for (let i = 0; i < imageData.length; i += 4) {
                const key = `${Math.round(imageData[i] / 10) * 10},${Math.round(imageData[i + 1] / 10) * 10},${Math.round(imageData[i + 2] / 10) * 10}`;
                counts[key] = (counts[key] || 0) + 1;
                if (counts[key] > max) {
                    max = counts[key];
                    dom = [imageData[i], imageData[i + 1], imageData[i + 2], imageData[i + 3]];
                }
            }
            [r, g, b, a] = dom;
        }

        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
        const rgba = `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        setResult({ hex, rgba, isDark: brightness < 128 });
    };

    useEffect(() => {
        if (image) analyzeImage(image, algorithm);
    }, [algorithm, image]);

    const copyToClipboard = (text, type) => {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        setCopied(type);
        
        toast.success(`${type.toUpperCase()} color copied!`, {
            duration: 2000,
            position: 'top-right',
            icon: '📋',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });
        
        setTimeout(() => setCopied(null), 2000);
    };

    const handleReset = () => {
        setImage(null);
        setPreviewUrl(null);
        setResult(null);
        setAlgorithm('simple');
        
        toast.success('All reset!', {
            duration: 2000,
            position: 'top-right',
            icon: '🔄',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });
    };

    return (
        <div className="bg-[#F9FAFB] font-manrope text-[#0B1220] min-h-screen">
            {/* Main Content Area */}
            <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Main Workspace (Left) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Upload Zone */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                const file = e.dataTransfer.files[0];
                                if (file) processFile(file);
                            }}
                            className={`bg-[#FFFFFF] rounded-xl border-2 border-dashed transition-all relative overflow-hidden shadow-sm
                                ${isDragging ? 'border-[#3B82F6] bg-[#F9FAFB]' : 'border-[#E5E7EB]'}
                                ${previewUrl ? 'p-2' : 'p-12 min-h-75 flex items-center justify-center'}`}
                        >
                            {!previewUrl ? (
                                <label className="flex flex-col items-center cursor-pointer text-center">
                                    <div className="w-16 h-16 bg-[#F9FAFB] text-[#3B82F6] rounded-full flex items-center justify-center mb-4 border border-[#E5E7EB]">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#111827]">Click or Drag Image Here</h3>
                                    <p className="text-sm text-[#6B7280] mt-1">Supports PNG, JPG, WEBP (Max 10MB)</p>
                                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                </label>
                            ) : (
                                <div className="relative rounded-lg overflow-hidden bg-[#F9FAFB] group">
                                    <img 
                                        src={previewUrl} 
                                        alt="Preview" 
                                        className="max-h-150 w-full object-contain mx-auto rounded-lg" 
                                    />
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={handleReset}
                                            className="bg-[#3B82F6] text-[#FFFFFF] p-2 rounded-lg shadow-lg hover:bg-[#2776f5] transition-colors"
                                            title="Remove image"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Results Display */}
                        {result && (
                            <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] p-6 shadow-sm">
                                <div className="flex flex-col md:flex-row gap-8">
                                    {/* Result Color Preview */}
                                    <div className="flex flex-col items-center gap-3">
                                        <div
                                            className="w-32 h-32 rounded-xl border border-[#E5E7EB] shadow-inner"
                                            style={{ backgroundColor: result.hex }}
                                        />
                                        <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                                            result.isDark 
                                                ? 'bg-[#111827] text-[#FFFFFF] border-[#E5E7EB]' 
                                                : 'bg-[#F9FAFB] text-[#0B1220] border-[#E5E7EB]'
                                        }`}>
                                            {result.isDark ? 'Dark Color' : 'Light Color'}
                                        </div>
                                    </div>

                                    {/* Result Values */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-[#6B7280] uppercase mb-2 block">HEX Color</label>
                                            <div className="flex gap-2">
                                                <div className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] px-4 py-3 rounded-lg font-mono text-lg font-medium text-[#0B1220]">
                                                    {result.hex}
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(result.hex, 'hex')}
                                                    className="px-4 bg-[#3B82F6] text-[#FFFFFF] rounded-lg hover:bg-[#2776f5] transition-colors flex items-center gap-2 shadow-lg shadow-[#3B82F6]/20"
                                                >
                                                    {copied === 'hex' ? <Check size={18} /> : <Copy size={18} />}
                                                    <span className="hidden md:inline">Copy</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-[#6B7280] uppercase mb-2 block">RGBA Color</label>
                                            <div className="flex gap-2">
                                                <div className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] px-4 py-3 rounded-lg font-mono text-lg font-medium text-[#0B1220]">
                                                    {result.rgba}
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(result.rgba, 'rgba')}
                                                    className="px-4 bg-[#3B82F6] text-[#FFFFFF] rounded-lg hover:bg-[#2776f5] transition-colors flex items-center gap-2 shadow-lg shadow-[#3B82F6]/20"
                                                >
                                                    {copied === 'rgba' ? <Check size={18} /> : <Copy size={18} />}
                                                    <span className="hidden md:inline">Copy</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                            <div className="bg-[#F9FAFB] px-4 py-3 border-b border-[#E5E7EB] flex items-center gap-2 font-bold text-[#111827]">
                                <Settings size={18} className="text-[#3B82F6]" />
                                Algorithm Options
                            </div>
                            <div className="p-4 space-y-3">
                                {algorithms.map((algo) => (
                                    <button
                                        key={algo.id}
                                        onClick={() => setAlgorithm(algo.id)}
                                        className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-all text-left group
                                            ${algorithm === algo.id
                                                ? 'border-[#3B82F6] bg-[#F9FAFB]'
                                                : 'border-[#E5E7EB] hover:border-[#3B82F6] hover:bg-[#F9FAFB]'}`}
                                    >
                                        <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0
                                            ${algorithm === algo.id ? 'border-[#3B82F6]' : 'border-[#6B7280]'}`}>
                                            {algorithm === algo.id && <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className={`font-bold text-base ${algorithm === algo.id ? 'text-[#3B82F6]' : 'text-[#111827]'}`}>
                                                {algo.name}
                                            </div>
                                            <p className="text-sm text-[#6B7280] mt-1 leading-relaxed">
                                                {algo.description}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            
                            {/* Info Box */}
                            <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
                                <div className="flex gap-3">
                                    <Info size={18} className="text-[#3B82F6] shrink-0" />
                                    <p className="text-xs text-[#6B7280] leading-relaxed">
                                        Different algorithms may produce different results. Try each one to find the color that best represents your image.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        {result && (
                            <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] p-4">
                                <h4 className="text-sm font-bold text-[#111827] mb-3">Quick Actions</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => copyToClipboard(result.hex, 'hex')}
                                        className="p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#0B1220] hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors"
                                    >
                                        Copy HEX
                                    </button>
                                    <button
                                        onClick={() => copyToClipboard(result.rgba, 'rgba')}
                                        className="p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs font-medium text-[#0B1220] hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors"
                                    >
                                        Copy RGBA
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hidden processing canvas */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Floating dynamic background effect */}
            {result && (
                <div
                    className="fixed inset-0 -z-10 opacity-[0.03] pointer-events-none transition-colors duration-1000"
                    style={{
                        backgroundImage: `radial-gradient(circle at top right, ${result.hex}, transparent 70%)`
                    }}
                />
            )}
        </div>
    );
};

export default ImageAverageColorFind;