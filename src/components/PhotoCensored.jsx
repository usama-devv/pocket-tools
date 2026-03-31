import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, RotateCcw, Download, Eye, Trash2, Palette } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import toast from 'react-hot-toast';

const PhotoCensored = () => {
    const [image, setImage] = useState(null);
    const [censorType, setCensorType] = useState('pixelate');
    const [pixelSize, setPixelSize] = useState(10);
    const [selection, setSelection] = useState(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [startPoint, setStartPoint] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    // Options for CustomSelect
    const censorOptions = [
        { value: 'pixelate', name: 'Pixelate' },
        { value: 'blur', name: 'Blur' },
        { value: 'blackbar', name: 'Black Bar' }
    ];

    const handleImageUpload = (e) => {
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

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new window.Image();
            img.onload = () => {
                setImage(img);
                setProcessedImage(null);
                setSelection(null);
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
            img.src = event.target.result;
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

    const handleDeleteImage = () => {
        setImage(null);
        setProcessedImage(null);
        setSelection(null);
        toast.success('Image removed!', {
            duration: 2000,
            position: 'top-right',
            icon: '🗑️',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });
    };

    const drawImage = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !image) return;

        const ctx = canvas.getContext('2d');
        const maxWidth = 800;
        const maxHeight = 600;

        let width = image.width;
        let height = image.height;

        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(processedImage || image, 0, 0, width, height);

        if (selection && !processedImage) {
            ctx.strokeStyle = '#3B82F6';
            ctx.lineWidth = 3;
            ctx.setLineDash([8, 8]);
            ctx.strokeRect(selection.x, selection.y, selection.width, selection.height);
            
            // Add corner indicators
            ctx.setLineDash([]);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#FFFFFF';
            ctx.strokeRect(selection.x, selection.y, selection.width, selection.height);
        }
    }, [image, processedImage, selection]);

    useEffect(() => {
        if (image) {
            drawImage();
        }
    }, [image, drawImage]);

    const handleMouseDown = (e) => {
        if (!image || processedImage) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        setIsSelecting(true);
        setStartPoint({ x, y });
        setSelection({ x, y, width: 0, height: 0 });
    };

    const handleMouseMove = (e) => {
        if (!isSelecting || !startPoint) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        const width = x - startPoint.x;
        const height = y - startPoint.y;

        setSelection({
            x: width > 0 ? startPoint.x : x,
            y: height > 0 ? startPoint.y : y,
            width: Math.abs(width),
            height: Math.abs(height)
        });
    };

    const handleMouseUp = () => {
        setIsSelecting(false);
        if (selection?.width > 5 && selection?.height > 5) {
            toast.success('Area selected! Click Censor to apply effect', {
                duration: 2000,
                position: 'top-right',
                icon: '✨',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
        }
    };

    const handleTouchStart = (e) => {
        if (!image || processedImage) return;
        e.preventDefault();

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
        const y = (touch.clientY - rect.top) * (canvas.height / rect.height);

        setIsSelecting(true);
        setStartPoint({ x, y });
        setSelection({ x, y, width: 0, height: 0 });
    };

    const handleTouchMove = (e) => {
        if (!isSelecting || !startPoint) return;
        e.preventDefault();

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
        const y = (touch.clientY - rect.top) * (canvas.height / rect.height);

        const width = x - startPoint.x;
        const height = y - startPoint.y;

        setSelection({
            x: width > 0 ? startPoint.x : x,
            y: height > 0 ? startPoint.y : y,
            width: Math.abs(width),
            height: Math.abs(height)
        });
    };

    const handleTouchEnd = () => {
        setIsSelecting(false);
    };

    const applyCensor = () => {
        if (!selection || !image) {
            toast.error('Please select an area first!', {
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

        const canvas = canvasRef.current;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        tempCtx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const imageData = tempCtx.getImageData(
            selection.x,
            selection.y,
            selection.width,
            selection.height
        );

        if (censorType === 'pixelate') {
            pixelateImageData(imageData, pixelSize);
        } else if (censorType === 'blur') {
            blurImageData(imageData, pixelSize);
        } else if (censorType === 'blackbar') {
            blackBarImageData(imageData);
        }

        tempCtx.putImageData(imageData, selection.x, selection.y);

        const processedImg = new window.Image();
        processedImg.onload = () => {
            setProcessedImage(processedImg);
            setSelection(null);
            toast.success('Image censored successfully!', {
                duration: 2000,
                position: 'top-right',
                icon: '🎭',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
        };
        processedImg.src = tempCanvas.toDataURL();
    };

    const pixelateImageData = (imageData, size) => {
        const { data, width, height } = imageData;

        for (let y = 0; y < height; y += size) {
            for (let x = 0; x < width; x += size) {
                let r = 0, g = 0, b = 0, a = 0, count = 0;

                for (let py = 0; py < size && y + py < height; py++) {
                    for (let px = 0; px < size && x + px < width; px++) {
                        const i = ((y + py) * width + (x + px)) * 4;
                        r += data[i];
                        g += data[i + 1];
                        b += data[i + 2];
                        a += data[i + 3];
                        count++;
                    }
                }

                r = Math.floor(r / count);
                g = Math.floor(g / count);
                b = Math.floor(b / count);
                a = Math.floor(a / count);

                for (let py = 0; py < size && y + py < height; py++) {
                    for (let px = 0; px < size && x + px < width; px++) {
                        const i = ((y + py) * width + (x + px)) * 4;
                        data[i] = r;
                        data[i + 1] = g;
                        data[i + 2] = b;
                        data[i + 3] = a;
                    }
                }
            }
        }
    };

    const blurImageData = (imageData, strength) => {
        const { data, width, height } = imageData;
        const original = new Uint8ClampedArray(data);
        const radius = Math.max(1, Math.floor(strength / 2));

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0, a = 0, count = 0;

                for (let ky = -radius; ky <= radius; ky++) {
                    for (let kx = -radius; kx <= radius; kx++) {
                        const px = x + kx;
                        const py = y + ky;

                        if (px >= 0 && px < width && py >= 0 && py < height) {
                            const i = (py * width + px) * 4;
                            r += original[i];
                            g += original[i + 1];
                            b += original[i + 2];
                            a += original[i + 3];
                            count++;
                        }
                    }
                }

                const i = (y * width + x) * 4;
                data[i] = r / count;
                data[i + 1] = g / count;
                data[i + 2] = b / count;
                data[i + 3] = a / count;
            }
        }
    };

    const blackBarImageData = (imageData) => {
        const { data } = imageData;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
            data[i + 3] = 255;
        }
    };

    const handleReset = () => {
        setProcessedImage(null);
        setSelection(null);
        toast.success('Reset successful!', {
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
        if (!processedImage) {
            toast.error('No censored image to download!', {
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

        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = 'censored-image.png';
        link.href = canvas.toDataURL();
        link.click();
        
        toast.success('Image downloaded!', {
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

    return (
        <div className="bg-[#F9FAFB] p-4 md:p-8 font-manrope">
            <div className="max-w-5xl mx-auto">

                {!image ? (
                    /* Upload Area */
                    <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E5E7EB] p-8 md:p-12 mb-8">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-4 border-dashed rounded-xl p-12 md:p-20 text-center cursor-pointer transition-all
                                ${isDragging 
                                    ? 'border-[#3B82F6] bg-[#F9FAFB]' 
                                    : 'border-[#E5E7EB] hover:border-[#3B82F6] hover:bg-[#F9FAFB]'
                                }`}
                        >
                            <Upload className="w-16 h-16 mx-auto text-[#6B7280] mb-4" />
                            <p className="text-lg text-[#0B1220]">
                                {isDragging ? 'Drop your image here' : 'Drag your image here, or click to'} 
                                <span className="text-[#3B82F6] font-semibold ml-1">browse</span>
                            </p>
                            <p className="text-sm text-[#6B7280] mt-2">Supports JPG, PNG, WEBP (Max 10MB)</p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>
                ) : (
                    /* Image Preview */
                    <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E5E7EB] p-6 md:p-8 mb-8">
                        <div className="relative flex justify-center mb-4">
                            <button
                                onClick={handleDeleteImage}
                                className="absolute top-2 right-2 z-10 bg-[#EF4444] hover:bg-[#DC2626] text-white p-2.5 rounded-full shadow-lg transition-all hover:scale-110"
                                title="Delete Image"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                            <canvas
                                ref={canvasRef}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                className="max-w-full h-auto border-2 border-[#E5E7EB] rounded-lg cursor-crosshair touch-none shadow-lg"
                                style={{ maxHeight: '600px' }}
                            />
                        </div>
                        <p className={`text-center text-sm mb-2 font-medium ${processedImage ? 'text-[#10B981]' : 'text-[#3B82F6]'}`}>
                            {processedImage ? '✓ Image censored successfully!' : 'Click and drag to select area to censor'}
                        </p>
                        {selection && !processedImage && (
                            <p className="text-center text-xs text-[#6B7280]">
                                Selected area: {Math.round(selection.width)} x {Math.round(selection.height)} px
                            </p>
                        )}
                    </div>
                )}

                {/* Controls */}
                {image && (
                    <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E5E7EB] p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-[#111827] mb-3 items-center gap-2">
                                    <Eye className="w-4 h-4 text-[#3B82F6]" />
                                    Censor Type
                                </label>
                                <CustomSelect
                                    label=""
                                    value={censorType}
                                    onChange={(e) => setCensorType(e.target.value)}
                                    options={censorOptions}
                                    searchable={false}
                                    size="md"
                                    disabled={!!processedImage}
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-sm font-semibold text-[#111827]">
                                        Pixel Size
                                    </label>
                                    <span className="text-sm font-bold text-[#3B82F6] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                                        {pixelSize}px
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="50"
                                    value={pixelSize}
                                    onChange={(e) => setPixelSize(parseInt(e.target.value))}
                                    disabled={!!processedImage || censorType === 'blackbar'}
                                    className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6] disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                                    <span>Subtle</span>
                                    <span>Strong</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={applyCensor}
                                disabled={!selection || processedImage}
                                className="flex-1 bg-[#3B82F6] hover:bg-[#2776f5] text-white font-semibold py-3 px-6 rounded-xl disabled:bg-[#E5E7EB] disabled:text-[#6B7280] disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#3B82F6]/20"
                            >
                                <Eye className="w-5 h-5" />
                                Apply Censor
                            </button>

                            <button
                                onClick={handleReset}
                                disabled={!processedImage}
                                className="flex-1 bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] text-[#0B1220] font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Reset
                            </button>

                            <button
                                onClick={handleDownload}
                                disabled={!processedImage}
                                className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white font-semibold py-3 px-6 rounded-xl disabled:bg-[#E5E7EB] disabled:text-[#6B7280] disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#10B981]/20"
                            >
                                <Download className="w-5 h-5" />
                                Download
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="mt-6 pt-4 border-t border-[#E5E7EB] grid grid-cols-3 gap-4 text-center text-xs text-[#6B7280]">
                            <div>
                                <p className="font-medium">Status</p>
                                <p className="font-bold text-[#111827] mt-1">
                                    {processedImage ? 'Censored' : image ? 'Ready' : 'No Image'}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium">Selection</p>
                                <p className="font-bold text-[#111827] mt-1">
                                    {selection ? 'Selected' : 'None'}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium">Effect</p>
                                <p className="font-bold text-[#111827] mt-1 capitalize">
                                    {censorType}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhotoCensored;