import { useState, useRef, useEffect } from 'react';
import { Upload, Copy, Check, Eye, Droplet, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

const ImageColorPick = () => {
    const [selectedColor, setSelectedColor] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [fileName, setFileName] = useState("");
    const [copiedField, setCopiedField] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const canvasRef = useRef(null);
    const magnifierRef = useRef(null);
    const fileInputRef = useRef(null);

    // Round Eyedropper Style Cursor
    const roundCursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='none' stroke='%233B82F6' stroke-width='2'/><circle cx='16' cy='16' r='2' fill='%233B82F6'/></svg>") 16 16, crosshair`;

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) processFile(file);
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

        // Check file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload a valid image file', {
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

        const nameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
        setFileName(nameWithoutExtension || file.name);

        const reader = new FileReader();
        reader.onload = (event) => {
            setImageSrc(event.target.result);
            setSelectedColor(null);
            
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
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    useEffect(() => {
        if (imageSrc) {
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
            img.src = imageSrc;
        }
    }, [imageSrc]);

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
            clientX: e.clientX,
            clientY: e.clientY
        };
    };

    const pickColor = (e) => {
        if (!imageSrc) return;
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const [r, g, b] = pixel;
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        setSelectedColor({
            hex,
            rgb: `rgb(${r}, ${g}, ${b})`,
            hsl: rgbToHsl(r, g, b)
        });
        
        toast.success('Color picked!', {
            duration: 1500,
            position: 'top-right',
            icon: '🎨',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });
    };

    const handleMouseMove = (e) => {
        if (!imageSrc) return;
        const { x, y, clientX, clientY } = getCoordinates(e);
        const mag = magnifierRef.current;
        const magCtx = mag.getContext('2d');

        mag.style.display = 'block';
        mag.style.left = `${clientX + 20}px`;
        mag.style.top = `${clientY + 20}px`;

        magCtx.imageSmoothingEnabled = false;
        magCtx.clearRect(0, 0, 120, 120);
        magCtx.drawImage(canvasRef.current, x - 5, y - 5, 10, 10, 0, 0, 120, 120);

        // Crosshair inside magnifier
        magCtx.strokeStyle = '#3B82F6';
        magCtx.lineWidth = 2;
        magCtx.strokeRect(58, 58, 4, 4);
        
        // Center dot
        magCtx.fillStyle = '#FFFFFF';
        magCtx.beginPath();
        magCtx.arc(60, 60, 2, 0, 2 * Math.PI);
        magCtx.fill();
        magCtx.strokeStyle = '#3B82F6';
        magCtx.lineWidth = 1;
        magCtx.stroke();
    };

    const rgbToHsl = (r, g, b) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) h = s = 0;
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
            else if (max === g) h = (b - r) / d + 2;
            else h = (r - g) / d + 4;
            h /= 6;
        }
        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    };

    const copyToClipboard = async (text, label) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(label);
            
            toast.success(`${label} copied to clipboard!`, {
                duration: 1500,
                position: 'top-right',
                icon: '📋',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
            
            setTimeout(() => setCopiedField(null), 1500);
        } catch (err) {
            console.error(err);
            toast.error('Failed to copy', {
                duration: 2000,
                position: 'top-right',
                icon: '❌',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
        }
    };

    const handleReset = () => {
        setImageSrc(null);
        setSelectedColor(null);
        setFileName("");
        setCopiedField(null);
        
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
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center py-10 px-4 font-manrope">
            <div className="w-full max-w-5xl mx-auto bg-[#FFFFFF] rounded-2xl shadow border border-[#E5E7EB]">
                {/* Header */}
                <div className="p-6 border-b border-[#E5E7EB]">
                    <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                        <Droplet className="w-5 h-5 text-[#3B82F6]" />
                        Image Color Picker
                    </h2>
                    <p className="text-sm text-[#6B7280] mt-1">
                        Click anywhere on the image to pick a color
                    </p>
                </div>

                {/* Upload Section */}
                <div 
                    className="p-6 border-b border-[#E5E7EB]"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div
                        onClick={() => fileInputRef.current.click()}
                        className={`w-full border-2 border-dashed rounded-xl py-12 text-center cursor-pointer transition-all
                            ${isDragging 
                                ? 'border-[#3B82F6] bg-[#F9FAFB]' 
                                : 'border-[#E5E7EB] hover:border-[#3B82F6] hover:bg-[#F9FAFB]'
                            }`}
                    >
                        <div className="w-16 h-16 mx-auto mb-4 bg-[#F9FAFB] rounded-full flex items-center justify-center border border-[#E5E7EB]">
                            <Upload className="w-8 h-8 text-[#3B82F6]" />
                        </div>
                        <p className="text-[#0B1220] font-medium">
                            {isDragging ? 'Drop your image here' : 'Drag image here'}
                        </p>
                        <p className="text-[#6B7280] text-sm mt-1">
                            or click to <span className="text-[#3B82F6] font-semibold hover:text-[#2776f5]">browse files</span>
                        </p>
                        <p className="text-[#6B7280] text-xs mt-2">Supports PNG, JPG, WEBP (Max 10MB)</p>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileUpload} 
                            className="hidden" 
                            accept="image/*" 
                        />
                    </div>
                </div>

                {/* Workspace Display */}
                <div className="bg-[#F9FAFB] p-8 flex flex-col items-center justify-center min-h-100">
                    {imageSrc ? (
                        <div className="relative shadow-2xl rounded-lg overflow-hidden flex flex-col border border-[#E5E7EB]">
                            <canvas
                                ref={canvasRef}
                                onClick={pickColor}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={() => magnifierRef.current.style.display = 'none'}
                                className="max-w-full max-h-125 bg-[#FFFFFF] block"
                                style={{ cursor: roundCursor }}
                            />
                            <div className="bg-[#FFFFFF] py-3 px-4 flex justify-between items-center border-t border-[#E5E7EB]">
                                <span className="text-xs font-medium text-[#6B7280]">
                                    <Palette className="w-3.5 h-3.5 inline mr-1 text-[#3B82F6]" />
                                    {fileName}
                                </span>
                                <button
                                    onClick={handleReset}
                                    className="text-xs text-[#6B7280] hover:text-[#3B82F6] transition-colors"
                                >
                                    Upload New
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <Eye className="w-12 h-12 mx-auto mb-3 text-[#6B7280]" />
                            <p className="text-[#6B7280]">Please upload an image to start picking colors</p>
                        </div>
                    )}

                    <canvas
                        ref={magnifierRef}
                        width="120" height="120"
                        className="fixed pointer-events-none rounded-full border-4 border-[#FFFFFF] shadow-xl z-50 hidden"
                    />
                </div>

                {/* Result Card */}
                {selectedColor && (
                    <div className="p-8 flex justify-center border-t border-[#E5E7EB]">
                        <div className="flex flex-col md:flex-row w-full max-w-md bg-[#FFFFFF] rounded-xl shadow-lg overflow-hidden border border-[#E5E7EB]">
                            <div
                                className="w-full md:w-36 h-36 md:h-auto transition-all"
                                style={{ backgroundColor: selectedColor.hex }}
                            />
                            <div className="flex-1 p-6 space-y-4">
                                <ColorField 
                                    label="HEX" 
                                    value={selectedColor.hex} 
                                    isCopied={copiedField === 'HEX'} 
                                    onCopy={() => copyToClipboard(selectedColor.hex, 'HEX')} 
                                />
                                <ColorField 
                                    label="RGB" 
                                    value={selectedColor.rgb} 
                                    isCopied={copiedField === 'RGB'} 
                                    onCopy={() => copyToClipboard(selectedColor.rgb, 'RGB')} 
                                />
                                <ColorField 
                                    label="HSL" 
                                    value={selectedColor.hsl} 
                                    isCopied={copiedField === 'HSL'} 
                                    onCopy={() => copyToClipboard(selectedColor.hsl, 'HSL')} 
                                    isLast 
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ColorField = ({ label, value, onCopy, isCopied, isLast }) => (
    <div className={`flex flex-col ${!isLast ? 'border-b border-[#E5E7EB] pb-3' : ''}`}>
        <span className="text-[10px] font-black text-[#6B7280] tracking-widest mb-1">{label}</span>
        <div className="flex justify-between items-center group h-6">
            <span className="font-mono text-sm font-medium text-[#0B1220]">{value}</span>
            <button
                onClick={onCopy}
                className={`p-1.5 rounded-full transition-all ${
                    isCopied 
                        ? 'text-[#10B981] bg-[#F9FAFB]' 
                        : 'text-[#6B7280] hover:text-[#3B82F6] hover:bg-[#F9FAFB]'
                }`}
                title={`Copy ${label}`}
            >
                {isCopied ? (
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                ) : (
                    <Copy className="w-4 h-4" strokeWidth={2} />
                )}
            </button>
        </div>
    </div>
);

export default ImageColorPick;