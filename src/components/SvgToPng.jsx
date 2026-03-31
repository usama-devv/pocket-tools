import { Check, ChevronRightIcon, FileDown, FileText, RotateCcw, Trash2, UploadCloud } from 'lucide-react';
import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

const SvgToPng = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState('');
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [scale, setScale] = useState(1);
    const [imagePreview, setImagePreview] = useState(null);
    const [svgContent, setSvgContent] = useState(null);
    const [appliedScale, setAppliedScale] = useState(1);
    const [isApplied, setIsApplied] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            handleFileUpload(file);
        }
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleFileUpload = (file) => {
        // Check file type
        if (!file.name.toLowerCase().endsWith('.svg') && !file.type.includes('svg')) {
            toast.error('Please upload a valid SVG file', {
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

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size should be less than 5MB', {
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

        // Update filename
        const newName = file.name.replace('.svg', '.png') || file.name + '.png';
        setFileName(newName);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            setSvgContent(content);

            // Create preview URL
            const blob = new Blob([content], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            setImagePreview(url);

            // Extract SVG dimensions
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(content, 'image/svg+xml');
            const svgElement = svgDoc.querySelector('svg');

            if (svgElement) {
                let width = parseInt(svgElement.getAttribute('width'));
                let height = parseInt(svgElement.getAttribute('height'));

                if (isNaN(width) || isNaN(height)) {
                    const viewBox = svgElement.getAttribute('viewBox');
                    if (viewBox) {
                        const parts = viewBox.split(' ');
                        if (parts.length >= 4) {
                            width = parseInt(parts[2]);
                            height = parseInt(parts[3]);
                        }
                    }
                }
                if (isNaN(width) || isNaN(height)) {
                    width = 512;
                    height = 512;
                }

                setImageSize({ width, height });
                setScale(1);
                setAppliedScale(1);
                setIsApplied(true);
                
                toast.success('SVG uploaded successfully!', {
                    duration: 2000,
                    position: 'top-right',
                    icon: '✅',
                    style: {
                        background: '#F9FAFB',
                        color: '#0B1220',
                        border: '1px solid #E5E7EB',
                    },
                });
            }
        };

        reader.onerror = () => {
            toast.error('Failed to read SVG file', {
                duration: 3000,
                position: 'top-right',
                icon: '❌',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
        };

        reader.readAsText(file);
    };

    const handleBrowseClick = () => {
        fileInputRef.current.click();
    };

    const handleScaleChange = (e) => {
        const value = parseFloat(e.target.value);
        if (value >= 0.5 && value <= 5) {
            setScale(value);
            setIsApplied(value === appliedScale);
        }
    };

    const handleApply = () => {
        if (scale !== appliedScale) {
            setAppliedScale(scale);
            setIsApplied(true);
            toast.success(`Scale applied: ${scale}x`, {
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

    const handleReset = () => {
        setScale(1);
        setAppliedScale(1);
        setIsApplied(true);
        toast.success('Scale reset to 1x', {
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

    const handleDelete = () => {
        setFileName('');
        setImagePreview(null);
        setSvgContent(null);
        setImageSize({ width: 0, height: 0 });
        setScale(1);
        setAppliedScale(1);
        setIsApplied(false);
        toast.success('File removed', {
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

    const handleDownload = () => {
        if (!fileName || !svgContent) {
            toast.error('Please upload an SVG file first', {
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

        try {
            // Create canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas dimensions based on applied scale
            const scaledWidth = Math.round(imageSize.width * appliedScale);
            const scaledHeight = Math.round(imageSize.height * appliedScale);
            canvas.width = scaledWidth;
            canvas.height = scaledHeight;

            // Create image element
            const img = new window.Image();

            // Create blob from SVG content
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);

            img.onload = () => {
                // Clear and draw
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

                // Create download
                const downloadUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = fileName;
                link.href = downloadUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                toast.success(`Downloaded: ${fileName}`, {
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

            img.onerror = () => {
                toast.error('Error loading SVG. Please try with a different file.', {
                    duration: 3000,
                    position: 'top-right',
                    icon: '❌',
                    style: {
                        background: '#F9FAFB',
                        color: '#0B1220',
                        border: '1px solid #E5E7EB',
                    },
                });
                URL.revokeObjectURL(url);
            };

            img.src = url;

        } catch (error) {
            console.error('Download error:', error);
            toast.error('Error generating PNG. Please try again.', {
                duration: 3000,
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

    // Calculate preview dimensions
    const getPreviewDimensions = () => {
        if (!imageSize.width || !imageSize.height) return { width: 200, height: 200 };

        const maxWidth = 400;
        const maxHeight = 300;

        let width = imageSize.width * appliedScale;
        let height = imageSize.height * appliedScale;

        // Maintain aspect ratio
        if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
        }

        if (height > maxHeight) {
            width = (maxHeight / height) * width;
            height = maxHeight;
        }

        return { width: Math.round(width), height: Math.round(height) };
    };

    const previewDims = getPreviewDimensions();

    return (
        <div className="bg-[#F9FAFB] font-manrope flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-5xl bg-[#FFFFFF] rounded-lg shadow border border-[#E5E7EB] p-6 md:p-8">

                {/* Drag and drop area */}
                <div
                    className={`border-3 border-dashed rounded-xl p-8 md:p-10 mb-6 text-center transition-all duration-200 cursor-pointer ${
                        isDragging
                            ? 'border-[#3B82F6] bg-[#F9FAFB]'
                            : 'border-[#E5E7EB] hover:border-[#3B82F6] hover:bg-[#F9FAFB]'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleBrowseClick}
                >
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-[#F9FAFB] border border-[#E5E7EB]">
                            <UploadCloud className='w-8 h-8 text-[#3B82F6]' />
                        </div>

                        <p className="text-lg font-medium text-[#111827] mb-2">
                            {isDragging ? 'Drop your SVG here' : 'Drag your SVG here, or click to browse'}
                        </p>

                        {/* SVG -> PNG visual */}
                        <div className="flex items-center justify-center space-x-4 my-4">
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 flex items-center justify-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                                    <span className="font-bold text-[#3B82F6] text-lg">SVG</span>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <ChevronRightIcon className='w-6 h-6 text-[#6B7280]' />
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 flex items-center justify-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                                    <span className="font-bold text-[#10B981] text-lg">PNG</span>
                                </div>
                            </div>
                        </div>

                        <button
                            className="mt-2 px-6 py-3 bg-[#3B82F6] hover:bg-[#2776f5] text-white font-medium rounded-lg transition-colors duration-200 shadow-lg shadow-[#3B82F6]/20"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleBrowseClick();
                            }}
                        >
                            Browse Files
                        </button>
                        
                        <p className="text-xs text-[#6B7280] mt-4">Supported: SVG files (Max 5MB)</p>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".svg,image/svg+xml"
                        onChange={handleFileInput}
                    />
                </div>

                {/* Image Preview with Delete */}
                {imagePreview && (
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-medium text-[#111827]">Preview:</h3>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-1 text-[#EF4444] hover:text-[#DC2626] px-3 py-1.5 rounded-lg hover:bg-[#FEF2F2] transition-colors"
                            >
                                <Trash2 className='w-4 h-4' />
                                Remove
                            </button>
                        </div>
                        <div className="flex justify-center items-center bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] p-4">
                            <img
                                src={imagePreview}
                                alt="SVG Preview"
                                style={{
                                    width: `${previewDims.width}px`,
                                    height: `${previewDims.height}px`,
                                    maxWidth: '100%',
                                    objectFit: 'contain'
                                }}
                                className="rounded"
                                onError={(e) => {
                                    console.error('Image load error');
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* File info */}
                {fileName && (
                    <div className="bg-[#F9FAFB] rounded-xl p-5 mb-6 border border-[#E5E7EB]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 flex items-center justify-center bg-[#FFFFFF] rounded-lg border border-[#E5E7EB]">
                                    <FileText className='w-6 h-6 text-[#3B82F6]' />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[#111827] text-lg">
                                        {fileName}
                                    </h3>
                                    <div className="text-[#6B7280] text-sm">
                                        <p>Original: {imageSize.width} x {imageSize.height}</p>
                                        <p className={`font-medium ${isApplied ? 'text-[#10B981]' : 'text-[#3B82F6]'}`}>
                                            {isApplied ? '✓ Applied: ' : 'Preview: '}
                                            {scale}x → {Math.round(imageSize.width * scale)} x {Math.round(imageSize.height * scale)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scale controls */}
                {fileName && (
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-[#111827]">Scale: <span className="text-[#3B82F6] font-bold">{scale.toFixed(1)}x</span></h3>
                            <span className="text-sm text-[#6B7280] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                                0.5x to 5x
                            </span>
                        </div>

                        <div className="mb-6">
                            <input
                                type="range"
                                min="0.5"
                                max="5"
                                step="0.1"
                                value={scale}
                                onChange={handleScaleChange}
                                className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                            />
                            <div className="flex justify-between text-xs text-[#6B7280] mt-2">
                                <span>0.5x</span>
                                <span>1x</span>
                                <span>2x</span>
                                <span>3x</span>
                                <span>4x</span>
                                <span>5x</span>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                className={`flex-1 py-3.5 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                                    isApplied
                                        ? 'bg-[#10B981] hover:bg-[#059669]'
                                        : 'bg-[#3B82F6] hover:bg-[#2776f5]'
                                } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                                    isApplied ? 'shadow-[#10B981]/20' : 'shadow-[#3B82F6]/20'
                                }`}
                                onClick={handleApply}
                                disabled={!fileName || isApplied}
                            >
                                {isApplied ? (
                                    <>
                                        <Check className='w-5 h-5' />
                                        Applied
                                    </>
                                ) : (
                                    'Apply Scale'
                                )}
                            </button>

                            <button
                                className="flex-1 py-3.5 bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] text-[#0B1220] font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                onClick={handleReset}
                                disabled={!fileName}
                            >
                                <RotateCcw className='w-4 h-4' />
                                Reset
                            </button>

                            <button
                                className="flex-1 py-3.5 bg-[#3B82F6] hover:bg-[#2776f5] text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#3B82F6]/20"
                                onClick={handleDownload}
                                disabled={!fileName}
                            >
                                <FileDown className="w-4 h-4" />
                                Download PNG
                            </button>
                        </div>
                    </div>
                )}

                {/* Status info */}
                {fileName && (
                    <div className={`p-4 rounded-lg border ${
                        isApplied 
                            ? 'bg-[#F0FDF4] border-[#DCFCE7]' 
                            : 'bg-[#F9FAFB] border-[#E5E7EB]'
                    }`}>
                        <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                                isApplied ? 'bg-[#10B981]' : 'bg-[#3B82F6]'
                            } text-white`}>
                                {isApplied ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <span className="text-sm font-bold">i</span>
                                )}
                            </div>
                            <span className={`font-medium ${
                                isApplied ? 'text-[#166534]' : 'text-[#1E40AF]'
                            }`}>
                                {isApplied
                                    ? `Scale ${appliedScale}x applied. Ready to download!`
                                    : `Adjust scale (${scale}x) and click "Apply" to confirm`
                                }
                            </span>
                        </div>
                        {fileName && (
                            <p className={`text-sm mt-1 ml-9 ${
                                isApplied ? 'text-[#166534]' : 'text-[#1E40AF]'
                            }`}>
                                PNG: {Math.round(imageSize.width * (isApplied ? appliedScale : scale))} x {Math.round(imageSize.height * (isApplied ? appliedScale : scale))} px
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SvgToPng;