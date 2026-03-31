import { useState, useRef } from 'react';
import {
    Upload,
    Download,
    RotateCcw,
    Sliders,
    Check,
    FlipHorizontal,
    FlipVertical,
    Eye,
    Sun,
    Moon,
    Droplet,
    Palette,
    Image as ImageIcon
} from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import toast from 'react-hot-toast';

// Filter definitions matching the specific tool requirements
const FILTERS = [
    {
        id: 'lighten',
        label: 'Lighten',
        icon: Sun,
        min: 0, max: 100, step: 1, defaultValue: 20, unit: '%'
    },
    {
        id: 'darken',
        label: 'Darken',
        icon: Moon,
        min: 0, max: 80, step: 1, defaultValue: 40, unit: '%'
    },
    {
        id: 'brighten',
        label: 'Brighten',
        icon: Sun,
        min: 100, max: 200, step: 1, defaultValue: 120, unit: '%'
    },
    {
        id: 'saturate',
        label: 'Saturate',
        icon: Droplet,
        min: 100, max: 300, step: 1, defaultValue: 150, unit: '%'
    },
    {
        id: 'de-saturate',
        label: 'De-saturate',
        icon: Droplet,
        min: 0, max: 100, step: 1, defaultValue: 0, unit: '%'
    },
    {
        id: 'grayscale',
        label: 'Grayscale',
        icon: Palette,
        min: 0, max: 100, step: 1, defaultValue: 100, unit: '%'
    },
    {
        id: 'hue',
        label: 'Hue',
        icon: Palette,
        min: 0, max: 360, step: 1, defaultValue: 90, unit: '°'
    },
    {
        id: 'invert',
        label: 'Invert',
        icon: RotateCcw,
        min: 0, max: 100, step: 1, defaultValue: 100, unit: '%'
    },
    {
        id: 'blur',
        label: 'Blur',
        icon: Eye,
        min: 0, max: 20, step: 1, defaultValue: 5, unit: 'px'
    },
    {
        id: 'fisheye',
        label: 'Fisheye',
        icon: Eye,
        min: 0, max: 50, step: 1, defaultValue: 15, unit: ''
    },
    {
        id: 'flip_h',
        label: 'Flip Horizontal',
        icon: FlipHorizontal,
        type: 'action'
    },
    {
        id: 'flip_v',
        label: 'Flip Vertical',
        icon: FlipVertical,
        type: 'action'
    },
];

// Filter options for CustomSelect
const filterOptions = FILTERS.map(filter => ({
    value: filter.id,
    name: filter.label
}));

export default function ImageFilter() {
    const [originalImage, setOriginalImage] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);

    // Controls state
    const [selectedFilterId, setSelectedFilterId] = useState(FILTERS[0].id);
    const [sliderValue, setSliderValue] = useState(FILTERS[0].defaultValue);
    const [isProcessing, setIsProcessing] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    // References
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const activeFilter = FILTERS.find(f => f.id === selectedFilterId);

    // --- Handlers ---

    const handleFileUpload = (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file', {
                duration: 3000,
                position: 'top-right',
                icon: '🖼️',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
            return;
        }

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
            const imgObj = new Image();
            imgObj.onload = () => {
                setOriginalImage(e.target.result);
                setCurrentImage(e.target.result);
                setSelectedFilterId(FILTERS[0].id);
                setSliderValue(FILTERS[0].defaultValue);
                
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
            imgObj.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFilterChange = (e) => {
        const id = e.target.value;
        const newFilter = FILTERS.find(f => f.id === id);
        setSelectedFilterId(id);
        if (newFilter.type !== 'action') {
            setSliderValue(newFilter.defaultValue);
        }
    };

    const handleReset = () => {
        setCurrentImage(originalImage);
        setSelectedFilterId(FILTERS[0].id);
        setSliderValue(FILTERS[0].defaultValue);
        
        toast.success('All filters reset!', {
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

    const handleDownload = () => {
        if (!currentImage) {
            toast.error('No image to download!', {
                duration: 3000,
                position: 'top-right',
                icon: '⚠️',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
            return;
        }
        
        const link = document.createElement('a');
        link.download = 'filtered-image.png';
        link.href = currentImage;
        link.click();
        
        toast.success('Image downloaded successfully!', {
            duration: 2000,
            position: 'top-right',
            icon: '📥',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });
    };

    // --- Image Processing Logic ---

    const applyFilter = async () => {
        if (!currentImage || !canvasRef.current) {
            toast.error('Please upload an image first!', {
                duration: 3000,
                position: 'top-right',
                icon: '📸',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
            return;
        }
        
        setIsProcessing(true);

        setTimeout(() => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0);
                processImageContext(ctx, canvas.width, canvas.height);

                setCurrentImage(canvas.toDataURL('image/png'));
                setIsProcessing(false);
                
                toast.success('Filter applied successfully!', {
                    duration: 2000,
                    position: 'top-right',
                    icon: '✨',
                    style: {
                        background: '#F9FAFB',
                        color: '#0B1220',
                        border: '1px solid #E5E7EB',
                    },
                });
            };

            img.src = currentImage;
        }, 50);
    };

    const processImageContext = (ctx, width, height) => {
        const val = sliderValue;
        ctx.save();

        switch (selectedFilterId) {
            case 'brighten':
                ctx.filter = `brightness(${val}%)`;
                ctx.drawImage(ctx.canvas, 0, 0);
                break;
            case 'darken':
                ctx.filter = `brightness(${100 - val}%)`;
                ctx.drawImage(ctx.canvas, 0, 0);
                break;
            case 'lighten':
                ctx.filter = `brightness(${100 + val}%)`;
                ctx.drawImage(ctx.canvas, 0, 0);
                break;
            case 'saturate':
                ctx.filter = `saturate(${val}%)`;
                ctx.drawImage(ctx.canvas, 0, 0);
                break;
            case 'de-saturate':
                ctx.filter = `saturate(${100 - val}%)`;
                ctx.drawImage(ctx.canvas, 0, 0);
                break;
            case 'grayscale':
                ctx.filter = `grayscale(${val}%)`;
                ctx.drawImage(ctx.canvas, 0, 0);
                break;
            case 'hue':
                ctx.filter = `hue-rotate(${val}deg)`;
                ctx.drawImage(ctx.canvas, 0, 0);
                break;
            case 'invert':
                ctx.filter = `invert(${val}%)`;
                ctx.drawImage(ctx.canvas, 0, 0);
                break;
            case 'blur':
                ctx.filter = `blur(${val}px)`;
                ctx.drawImage(ctx.canvas, 0, 0);
                break;
            case 'flip_h':
                ctx.translate(width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(ctx.canvas, 0, 0, width, height, 0, 0, width, height);
                break;
            case 'flip_v':
                ctx.translate(0, height);
                ctx.scale(1, -1);
                ctx.drawImage(ctx.canvas, 0, 0, width, height, 0, 0, width, height);
                break;
            case 'fisheye':
                applyFisheye(ctx, width, height, val);
                break;
            default:
                break;
        }
        ctx.restore();
    };

    const applyFisheye = (ctx, w, h, intensity) => {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        const result = ctx.createImageData(w, h);
        const resData = result.data;
        const strength = (intensity / 100);
        const cx = w / 2;
        const cy = h / 2;

        for (let y = 0; y < h; y++) {
            const ny = (y - cy) / h;
            for (let x = 0; x < w; x++) {
                const nx = (x - cx) / w;
                const r = Math.sqrt(nx * nx + ny * ny);

                if (0 <= r && r <= 0.5) {
                    const nr = r + (strength * (r * r * r));
                    const theta = Math.atan2(ny, nx);
                    const nx2 = nr * Math.cos(theta);
                    const ny2 = nr * Math.sin(theta);
                    const u = (nx2 * w) + cx;
                    const v = (ny2 * h) + cy;
                    const srcX = Math.floor(u);
                    const srcY = Math.floor(v);

                    if (srcX >= 0 && srcX < w && srcY >= 0 && srcY < h) {
                        const destIndex = (y * w + x) * 4;
                        const srcIndex = (srcY * w + srcX) * 4;
                        resData[destIndex] = data[srcIndex];
                        resData[destIndex + 1] = data[srcIndex + 1];
                        resData[destIndex + 2] = data[srcIndex + 2];
                        resData[destIndex + 3] = data[srcIndex + 3];
                    }
                }
            }
        }
        ctx.putImageData(result, 0, 0);
    };

    const getPreviewStyle = () => {
        if (!activeFilter || activeFilter.type === 'action') return {};
        if (activeFilter.id === 'fisheye') return {};

        let filterString = '';
        const val = sliderValue;

        switch (activeFilter.id) {
            case 'brighten': filterString = `brightness(${val}%)`; break;
            case 'darken': filterString = `brightness(${100 - val}%)`; break;
            case 'lighten': filterString = `brightness(${100 + val}%)`; break;
            case 'saturate': filterString = `saturate(${val}%)`; break;
            case 'de-saturate': filterString = `saturate(${100 - val}%)`; break;
            case 'grayscale': filterString = `grayscale(${val}%)`; break;
            case 'hue': filterString = `hue-rotate(${val}deg)`; break;
            case 'invert': filterString = `invert(${val}%)`; break;
            case 'blur': filterString = `blur(${val}px)`; break;
            default: return {};
        }
        return { filter: filterString };
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-[#0B1220] font-manrope selection:bg-[#3B82F6]/20">
            <main className="max-w-5xl mx-auto p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Column: Image / Canvas */}
                    <div className="flex-1 min-w-0">
                        <div
                            className={`bg-[#FFFFFF] rounded-xl shadow-sm border-2 relative min-h-125 flex items-center justify-center overflow-hidden transition-all
                                ${dragActive ? 'border-[#3B82F6] bg-[#F9FAFB]' : 'border-dashed border-[#E5E7EB]'} 
                                ${!currentImage ? 'cursor-pointer hover:border-[#3B82F6] hover:bg-[#F9FAFB]' : ''}
                            `}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => !currentImage && fileInputRef.current?.click()}
                        >
                            {!currentImage ? (
                                <div className="text-center p-8 max-w-sm mx-auto">
                                    <div className="w-16 h-16 bg-[#F9FAFB] text-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-5 border border-[#E5E7EB]">
                                        <Upload size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#111827] mb-2">
                                        Drag & Drop Image Here
                                    </h3>
                                    <p className="text-[#6B7280] text-sm mb-6">
                                        Or browse to upload from your device
                                    </p>
                                    <button className="bg-[#3B82F6] hover:bg-[#2776f5] text-[#FFFFFF] px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-[#3B82F6]/20 active:scale-95">
                                        Browse File
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full h-full bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4zjQaG5QAAADBJREFUOE9j/P//PwM1gImBSoARuW7dugEMDAwMZDIwMDD8//9/6H///o1mHhYjAwAeLg4UDk5b33kAAAAASUVORK5CYII=')] bg-repeat relative flex items-center justify-center p-4">
                                    <img
                                        src={currentImage}
                                        alt="Preview"
                                        className="max-w-full max-h-150 object-contain shadow-2xl rounded-lg"
                                        style={getPreviewStyle()}
                                    />

                                    {activeFilter?.id === 'fisheye' && (
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#111827]/80 text-[#FFFFFF] text-xs px-4 py-2 rounded-full backdrop-blur-sm pointer-events-none border border-[#E5E7EB]">
                                            Preview disabled for Fisheye. Click Apply to see effect.
                                        </div>
                                    )}

                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute top-4 right-4 bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] text-[#0B1220] p-2.5 rounded-lg shadow-sm border border-[#E5E7EB] backdrop-blur-sm transition-all hover:scale-105"
                                        title="Upload New Image"
                                    >
                                        <Upload size={20} />
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e.target.files[0])}
                            />
                        </div>
                    </div>

                    {/* Right Column: Tools Panel */}
                    <div className="w-full lg:w-96 shrink-0 flex flex-col gap-4">
                        {/* Filter Settings Card */}
                        <div className={`bg-[#FFFFFF] rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden transition-opacity ${!currentImage ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
                            <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                                <div className="flex items-center gap-2 text-[#111827] font-bold">
                                    <Sliders size={18} className="text-[#3B82F6]" />
                                    <h2>Filter Settings</h2>
                                </div>
                            </div>

                            <div className="p-5 space-y-6">
                                {/* 1. Filter Select with CustomSelect */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block">Select Filter</label>
                                    <CustomSelect
                                        label=""
                                        value={selectedFilterId}
                                        onChange={handleFilterChange}
                                        options={filterOptions}
                                        searchable={true}
                                        size="md"
                                    />
                                </div>

                                {/* 2. Slider (Conditional) */}
                                {activeFilter?.type !== 'action' && (
                                    <div className="space-y-3 bg-[#F9FAFB] p-4 rounded-lg border border-[#E5E7EB]">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Value</label>
                                            <span className="text-xs font-mono font-medium text-[#3B82F6] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#E5E7EB]">
                                                {sliderValue}{activeFilter?.unit}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min={activeFilter?.min}
                                            max={activeFilter?.max}
                                            step={activeFilter?.step}
                                            value={sliderValue}
                                            onChange={(e) => setSliderValue(Number(e.target.value))}
                                            className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6] hover:accent-[#2776f5]"
                                        />
                                        <div className="flex justify-between text-[10px] text-[#6B7280] font-medium">
                                            <span>{activeFilter?.min}</span>
                                            <span>{activeFilter?.max}</span>
                                        </div>
                                    </div>
                                )}

                                {/* 3. Apply Button */}
                                <button
                                    onClick={applyFilter}
                                    disabled={isProcessing}
                                    className="w-full flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#2776f5] text-[#FFFFFF] text-sm font-bold py-3.5 px-4 rounded-lg transition-all shadow-lg shadow-[#3B82F6]/20 active:translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Check size={18} />
                                            APPLY FILTER
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-center text-[#6B7280]">
                                    Click Apply to save the current effect before adding more.
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className={`grid grid-cols-2 gap-3 transition-opacity ${!currentImage ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
                            <button
                                onClick={handleReset}
                                className="flex items-center justify-center gap-2 bg-[#FFFFFF] border border-[#E5E7EB] hover:bg-[#F9FAFB] hover:border-[#3B82F6] text-[#6B7280] hover:text-[#3B82F6] py-3 px-4 rounded-xl transition-all text-sm font-bold shadow-sm"
                            >
                                <RotateCcw size={16} />
                                RESET
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-[#2776f5] text-[#FFFFFF] py-3 px-4 rounded-xl transition-all text-sm font-bold shadow-lg shadow-[#3B82F6]/20"
                            >
                                <Download size={16} />
                                DOWNLOAD
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Hidden Canvas */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}