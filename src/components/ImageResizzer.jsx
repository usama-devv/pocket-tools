import { useState, useRef } from 'react';
import { Upload, Lock, Unlock, Download, Image as ImageIcon, X, Settings, FileImage, Percent } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import toast from 'react-hot-toast';

export default function ImageResizzer() {
    const [file, setFile] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
    const [resizeDimensions, setResizeDimensions] = useState({ width: '', height: '' });
    const [lockAspectRatio, setLockAspectRatio] = useState(true);
    const [resizedImage, setResizedImage] = useState(null);
    const [outputFormat, setOutputFormat] = useState('jpeg');
    const [activeTab, setActiveTab] = useState('dimensions');
    const [percentage, setPercentage] = useState(100);

    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    const formatOptions = [
        { value: 'jpeg', name: 'JPG (JPEG)' },
        { value: 'png', name: 'PNG' },
        { value: 'webp', name: 'WEBP' },
    ];

    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        processFile(selectedFile);
    };

    const processFile = (selectedFile) => {
        if (!selectedFile) return;

        if (!selectedFile.type.startsWith('image/')) {
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
        if (selectedFile.size > 10 * 1024 * 1024) {
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
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                setOriginalDimensions({ width: img.width, height: img.height });
                setResizeDimensions({ width: img.width, height: img.height });
                setPercentage(100);
                setFile(selectedFile);
                setImageSrc(event.target.result);
                setResizedImage(null);

                // Auto-detect format
                if (selectedFile.type.includes('png')) setOutputFormat('png');
                else if (selectedFile.type.includes('webp')) setOutputFormat('webp');
                else setOutputFormat('jpeg');

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
        reader.readAsDataURL(selectedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        processFile(e.dataTransfer.files?.[0]);
    };

    // Switch Tabs and Sync Values
    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        if (tab === 'percentage') {
            if (originalDimensions.width > 0 && resizeDimensions.width) {
                setPercentage(Math.round((resizeDimensions.width / originalDimensions.width) * 100));
            }
        } 
    };

    const handleDimensionChange = (type, value) => {
        const val = value === '' ? '' : parseInt(value);

        let newWidth = resizeDimensions.width;
        let newHeight = resizeDimensions.height;

        if (type === 'width') {
            newWidth = val;
            if (lockAspectRatio && newWidth !== '' && originalDimensions.width > 0) {
                newHeight = Math.round(newWidth * (originalDimensions.height / originalDimensions.width));
            }
        } else {
            newHeight = val;
            if (lockAspectRatio && newHeight !== '' && originalDimensions.height > 0) {
                newWidth = Math.round(newHeight * (originalDimensions.width / originalDimensions.height));
            }
        }

        setResizeDimensions({ width: newWidth, height: newHeight });

        // Update percentage state for consistency if we switch back
        if (newWidth && originalDimensions.width > 0) {
            setPercentage(Math.round((newWidth / originalDimensions.width) * 100));
        }
    };

    const handlePercentageChange = (value) => {
        const val = value === '' ? '' : parseInt(value);
        setPercentage(val);

        if (val !== '' && originalDimensions.width > 0) {
            const newWidth = Math.round(originalDimensions.width * (val / 100));
            const newHeight = Math.round(originalDimensions.height * (val / 100));
            setResizeDimensions({ width: newWidth, height: newHeight });
        }
    };

    const handleResize = () => {
        if (!imageSrc || !canvasRef.current) {
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

        if (!resizeDimensions.width || !resizeDimensions.height) {
            toast.error('Please enter valid dimensions', {
                duration: 3000,
                position: 'top-right',
                icon: '📏',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = resizeDimensions.width;
            canvas.height = resizeDimensions.height;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, resizeDimensions.width, resizeDimensions.height);

            const mimeType = outputFormat === 'png' ? 'image/png' : outputFormat === 'webp' ? 'image/webp' : 'image/jpeg';
            const quality = outputFormat === 'jpeg' ? 0.9 : 1.0;
            const dataUrl = canvas.toDataURL(mimeType, quality);
            setResizedImage(dataUrl);

            toast.success('Image resized successfully!', {
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
        img.src = imageSrc;
    };

    const handleDownload = () => {
        if (!resizedImage) return;
        
        const link = document.createElement('a');
        link.download = `resized-${resizeDimensions.width}x${resizeDimensions.height}.${outputFormat}`;
        link.href = resizedImage;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

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

    const reset = () => {
        setFile(null);
        setImageSrc(null);
        setResizedImage(null);
        setOriginalDimensions({ width: 0, height: 0 });
        setResizeDimensions({ width: '', height: '' });
        setPercentage(100);
        setActiveTab('dimensions');
        
        toast.success('All settings reset!', {
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
        <div className="min-h-screen bg-[#F9FAFB] font-manrope text-[#0B1220]">
            <main className="max-w-5xl mx-auto pb-4 px-4 sm:px-6">
                {/* Main Tool Container */}
                <div className="bg-[#FFFFFF] rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden min-h-screen flex flex-col md:flex-row">
                    {!file ? (
                        /* Upload View */
                        <div className="w-full flex flex-col items-center justify-center p-8 sm:p-12 text-center">
                            <div
                                className="w-full max-w-2xl border-2 border-dashed border-[#E5E7EB] rounded-2xl bg-[#F9FAFB] p-12 sm:p-16 flex flex-col items-center justify-center cursor-pointer hover:border-[#3B82F6] hover:bg-[#FFFFFF] transition-all group"
                                onClick={() => fileInputRef.current.click()}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <div className="w-16 h-16 bg-[#F9FAFB] text-[#3B82F6] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-[#E5E7EB]">
                                    <Upload size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-[#111827] mb-2">Select Image File</h3>
                                <p className="text-[#6B7280] mb-8">Drag & Drop or Click to Choose</p>
                                <button className="bg-[#3B82F6] text-[#FFFFFF] px-8 py-3 rounded-lg font-semibold hover:bg-[#2776f5] transition-colors shadow-lg shadow-[#3B82F6]/20">
                                    Browse Files
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                            </div>
                            <div className="mt-8 flex gap-6 text-sm text-[#6B7280] font-medium uppercase tracking-wider">
                                <span className="px-3 py-1 bg-[#F9FAFB] rounded-full border border-[#E5E7EB]">JPG</span>
                                <span className="px-3 py-1 bg-[#F9FAFB] rounded-full border border-[#E5E7EB]">PNG</span>
                                <span className="px-3 py-1 bg-[#F9FAFB] rounded-full border border-[#E5E7EB]">WEBP</span>
                            </div>
                        </div>
                    ) : (
                        /* Workspace View */
                        <>
                            {/* Left: Preview Area */}
                            <div className="flex-1 bg-[#F9FAFB] border-r border-[#E5E7EB] relative flex flex-col">
                                <div className="p-4 border-b border-[#E5E7EB] flex justify-between items-center bg-[#FFFFFF]">
                                    <div className="flex items-center gap-2 text-sm font-medium text-[#0B1220]">
                                        <FileImage size={16} className="text-[#3B82F6]" />
                                        <span className="truncate max-w-50">{file.name}</span>
                                    </div>
                                    <button onClick={reset} className="text-[#6B7280] hover:text-[#3B82F6] transition-colors p-1">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
                                    <div className="relative shadow-md border border-[#E5E7EB] bg-[#FFFFFF]">
                                        {/* Checkered background */}
                                        <div className="absolute inset-0 z-0 opacity-20"
                                            style={{ backgroundImage: 'linear-gradient(45deg, #E5E7EB 25%, transparent 25%), linear-gradient(-45deg, #E5E7EB 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #E5E7EB 75%), linear-gradient(-45deg, transparent 75%, #E5E7EB 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}>
                                        </div>
                                        <img
                                            src={resizedImage || imageSrc}
                                            alt="Preview"
                                            className="relative z-10 max-w-full max-h-125 object-contain block transition-all duration-300"
                                            style={{ minWidth: '100px' }}
                                        />
                                    </div>
                                </div>

                                <div className="p-3 bg-[#FFFFFF] border-t border-[#E5E7EB] flex flex-wrap justify-center gap-4 sm:gap-6 text-xs font-medium text-[#6B7280]">
                                    <div>Original: <span className="text-[#111827] font-bold">{originalDimensions.width} x {originalDimensions.height}</span></div>
                                    {resizeDimensions.width && (
                                        <div className="flex items-center gap-2">
                                            Resized:
                                            <span className="text-[#3B82F6] font-bold bg-[#F9FAFB] px-2 py-0.5 rounded border border-[#E5E7EB]">
                                                {resizeDimensions.width} x {resizeDimensions.height}
                                            </span>
                                            <span className="text-[#6B7280] bg-[#F9FAFB] px-2 py-0.5 rounded-full text-[10px]">
                                                {percentage}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Settings Sidebar */}
                            <div className="w-full md:w-96 bg-[#FFFFFF] flex flex-col h-full z-20 shadow-[-1px_0_10px_rgba(0,0,0,0.02)]">
                                <div className="p-6 flex-1 overflow-y-auto">
                                    {/* Section: Resize By */}
                                    <div className="mb-8">
                                        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">Resize By</label>
                                        <div className="flex bg-[#F9FAFB] p-1 rounded-lg border border-[#E5E7EB]">
                                            <button
                                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'dimensions' ? 'bg-[#FFFFFF] text-[#3B82F6] shadow-sm border border-[#E5E7EB]' : 'text-[#6B7280] hover:text-[#3B82F6]'}`}
                                                onClick={() => handleTabSwitch('dimensions')}
                                            >
                                                Dimensions
                                            </button>
                                            <button
                                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'percentage' ? 'bg-[#FFFFFF] text-[#3B82F6] shadow-sm border border-[#E5E7EB]' : 'text-[#6B7280] hover:text-[#3B82F6]'}`}
                                                onClick={() => handleTabSwitch('percentage')}
                                            >
                                                Percentage
                                            </button>
                                        </div>
                                    </div>

                                    {/* Dynamic Section: Dimensions OR Percentage */}
                                    {activeTab === 'dimensions' ? (
                                        <div className="mb-8 relative">
                                            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">Dimensions</label>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1">
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm font-semibold text-[#0B1220] focus:ring-4 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] outline-none transition-all pl-3"
                                                            placeholder="Width"
                                                            value={resizeDimensions.width}
                                                            onChange={(e) => handleDimensionChange('width', e.target.value)}
                                                        />
                                                        <span className="absolute right-3 top-2.5 text-xs text-[#6B7280] font-medium pointer-events-none">PX</span>
                                                    </div>
                                                </div>

                                                {/* Lock Icon Button */}
                                                <button
                                                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                                                    className={`p-1.5 rounded-md transition-colors ${lockAspectRatio ? 'text-[#3B82F6] bg-[#F9FAFB] border border-[#E5E7EB]' : 'text-[#6B7280] hover:bg-[#F9FAFB] border border-transparent'}`}
                                                    title="Toggle Aspect Ratio"
                                                >
                                                    {lockAspectRatio ? <Lock size={16} /> : <Unlock size={16} />}
                                                </button>

                                                <div className="flex-1">
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm font-semibold text-[#0B1220] focus:ring-4 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] outline-none transition-all pl-3"
                                                            placeholder="Height"
                                                            value={resizeDimensions.height}
                                                            onChange={(e) => handleDimensionChange('height', e.target.value)}
                                                        />
                                                        <span className="absolute right-3 top-2.5 text-xs text-[#6B7280] font-medium pointer-events-none">PX</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center gap-1.5">
                                                <input
                                                    type="checkbox"
                                                    id="lock-aspect"
                                                    checked={lockAspectRatio}
                                                    onChange={() => setLockAspectRatio(!lockAspectRatio)}
                                                    className="rounded border-[#E5E7EB] text-[#3B82F6] focus:ring-[#3B82F6] w-3.5 h-3.5"
                                                />
                                                <label htmlFor="lock-aspect" className="text-[11px] text-[#6B7280]">Lock Aspect Ratio</label>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-8 relative">
                                            <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">Percentage</label>
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="200"
                                                    value={percentage}
                                                    onChange={(e) => handlePercentageChange(e.target.value)}
                                                    className="flex-1 h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                                                />
                                                <div className="relative w-24 shrink-0">
                                                    <input
                                                        type="number"
                                                        className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm font-semibold text-[#0B1220] focus:ring-4 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] outline-none transition-all pl-3"
                                                        value={percentage}
                                                        onChange={(e) => handlePercentageChange(e.target.value)}
                                                    />
                                                    <Percent size={14} className="absolute right-3 top-3 text-[#6B7280] pointer-events-none" />
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs text-[#6B7280]">
                                                Target Size: <span className="font-semibold text-[#111827]">{resizeDimensions.width} x {resizeDimensions.height} px</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Section: Output Format with CustomSelect */}
                                    <div className="mb-8">
                                        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">Output Format</label>
                                        <CustomSelect
                                            label=""
                                            value={outputFormat}
                                            onChange={(e) => setOutputFormat(e.target.value)}
                                            options={formatOptions}
                                            searchable={false}
                                            size="md"
                                        />
                                    </div>

                                    {/* Quality Info */}
                                    <div className="mb-8 p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                                        <p className="text-xs text-[#6B7280]">
                                            <span className="font-bold text-[#3B82F6]">Quality:</span> {
                                                outputFormat === 'jpeg' ? 'High (90%)' : 
                                                outputFormat === 'png' ? 'Lossless' : 'High Quality'
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-6 border-t border-[#E5E7EB] bg-[#F9FAFB]">
                                    {!resizedImage ? (
                                        <button
                                            onClick={handleResize}
                                            className="w-full bg-[#3B82F6] hover:bg-[#2776f5] text-[#FFFFFF] font-semibold py-3 rounded-lg shadow-lg shadow-[#3B82F6]/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Settings size={18} /> Resize Image
                                        </button>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <button
                                                onClick={handleDownload}
                                                className="w-full bg-[#3B82F6] hover:bg-[#2776f5] text-[#FFFFFF] font-semibold py-3 rounded-lg shadow-lg shadow-[#3B82F6]/20 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Download size={18} /> Download Image
                                            </button>
                                            <button
                                                onClick={() => setResizedImage(null)}
                                                className="w-full bg-[#FFFFFF] border border-[#E5E7EB] hover:bg-[#F9FAFB] text-[#0B1220] font-medium py-2.5 rounded-lg transition-all text-sm"
                                            >
                                                Back to Settings
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Helper Canvas */}
                <canvas ref={canvasRef} className="hidden"></canvas>
            </main>
        </div>
    );
}