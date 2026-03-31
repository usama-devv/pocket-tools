import { useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";
import { BrushCleaning, Crop, Download, RotateCw, UploadIcon, X, ZoomIn, ZoomOut } from "lucide-react";
import toast from 'react-hot-toast';
import CustomSelect from "../components/CustomSelect";

export default function ImageCrop() {
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspect, setAspect] = useState(null);
    const [croppedArea, setCroppedArea] = useState(null);
    const [result, setResult] = useState(null);
    const [rotation, setRotation] = useState(0);

    // Aspect ratio options for CustomSelect
    const aspectOptions = [
        { value: "free", name: "Free Selection" },
        { value: "1", name: "1:1 Square" },
        { value: "1.333", name: "4:3 Standard" },
        { value: "1.777", name: "16:9 Widescreen" },
        { value: "1.25", name: "5:4" },
        { value: "1.5", name: "3:2" },
        { value: "1.85", name: "1.85:1 Cinematic" },
        { value: "2.35", name: "2.35:1 Ultra Wide" },
    ];

    const onCropComplete = (_, area) => setCroppedArea(area);

    const handleCrop = async () => {
        if (!croppedArea || !image) {
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
        
        try {
            const cropped = await getCroppedImg(image, croppedArea, rotation);
            setResult(cropped);
            toast.success('Image cropped successfully!', {
                duration: 2000,
                position: 'top-right',
                icon: '✅',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
        } catch (error) {
            console.error("Crop error:", error);
            toast.error('Failed to crop image. Please try again.', {
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

    const handleRotate = () => {
        if (!image) {
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
        setRotation(prev => (prev + 90) % 360);
        toast.success(`Rotated ${(rotation + 90) % 360}°`, {
            duration: 1500,
            position: 'top-right',
            icon: '🔄',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });
    };

    const handleZoomIn = () => {
        if (!image) {
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
        setZoom(z => Math.min(z + 0.2, 3));
    };

    const handleZoomOut = () => {
        if (!image) {
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
        setZoom(z => Math.max(z - 0.2, 0.5));
    };

    const handleReset = () => {
        setImage(null);
        setResult(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        setAspect(null);
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

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

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
            toast.error('Please upload an image file', {
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

        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl);
        setResult(null);
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

    const handleDownload = () => {
        if (!result) {
            toast.error('No cropped image to download!', {
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
        
        toast.success('Download started!', {
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

    const handleAspectChange = (e) => {
        const value = e.target.value;
        setAspect(value === "free" ? null : Number(value));
    };

    return (
        <div className="max-w-5xl mx-auto pt-6 font-manrope px-4 sm:px-6">
            {/* TOP UPLOAD AREA */}
            <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl h-28 flex items-center justify-center text-[#6B7280] hover:border-[#3B82F6] transition-colors group bg-[#F9FAFB]">
                <label className="flex items-center gap-2 cursor-pointer">
                    <UploadIcon className="w-7 h-7 text-[#6B7280] group-hover:text-[#3B82F6] transition-colors" />
                    <span className="text-sm text-[#0B1220]">
                        Drag your image here, or <span className="font-semibold text-[#3B82F6] group-hover:text-[#2776f5]">click to browse</span>
                    </span>
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileUpload}
                    />
                </label>
            </div>

            {/* MAIN CROPPER */}
            <div className="mt-6 border border-[#E5E7EB] rounded-xl bg-[#FFFFFF] h-96 relative overflow-hidden flex items-center justify-center shadow-sm">
                {!image && (
                    <div className="text-[#6B7280] flex flex-col items-center">
                        <svg className="w-12 h-12 mb-2 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-2 text-base font-medium">Upload an image to start cropping</p>
                        <p className="text-xs mt-1">Supported formats: JPG, PNG, GIF, WEBP</p>
                    </div>
                )}

                {image && (
                    <>
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            rotation={rotation}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                        
                        {/* Zoom Controls Overlay */}
                        <div className="absolute bottom-4 right-4 bg-[#FFFFFF] border border-[#E5E7EB] rounded-full shadow-lg flex items-center p-1">
                            <button
                                onClick={handleZoomOut}
                                className="p-2 hover:bg-[#F9FAFB] rounded-full transition-colors text-[#6B7280] hover:text-[#3B82F6]"
                                title="Zoom Out"
                            >
                                <ZoomIn className="w-4 h-4 rotate-180" />
                            </button>
                            <span className="text-xs font-medium text-[#0B1220] px-2 min-w-11.25 text-center">{Math.round(zoom * 100)}%</span>
                            <button
                                onClick={handleZoomIn}
                                className="p-2 hover:bg-[#F9FAFB] rounded-full transition-colors text-[#6B7280] hover:text-[#3B82F6]"
                                title="Zoom In"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setImage(null)}
                            className="absolute top-4 right-4 bg-[#FFFFFF] border border-[#E5E7EB] rounded-full p-2 hover:bg-[#F9FAFB] transition-colors text-[#6B7280] hover:text-[#3B82F6] shadow-lg"
                            title="Remove image"
                        >
                            <X size={18} />
                        </button>
                    </>
                )}
            </div>

            {/* BOTTOM CONTROLS */}
            <div className="mt-6 flex flex-col lg:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
                    {/* Aspect Ratio CustomSelect */}
                    <div className="w-full sm:w-48">
                        <CustomSelect
                            label=""
                            value={aspect === null ? "free" : aspect.toString()}
                            onChange={handleAspectChange}
                            options={aspectOptions}
                            searchable={false}
                            size="md"
                            disabled={!image}
                        />
                    </div>

                    {/* Rotate Button */}
                    <button
                        onClick={handleRotate}
                        disabled={!image}
                        className={`border border-[#E5E7EB] px-5 py-3 rounded-xl flex items-center gap-2 font-medium transition-all min-w-25 justify-center
                            ${image 
                                ? 'text-[#0B1220] hover:border-[#3B82F6] hover:text-[#3B82F6] bg-[#FFFFFF]' 
                                : 'text-[#6B7280] bg-[#F9FAFB] cursor-not-allowed'
                            }`}
                    >
                        <RotateCw className="w-4 h-4" />
                        Rotate
                    </button>

                    {/* Crop Button */}
                    <button
                        onClick={handleCrop}
                        disabled={!image}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all min-w-25 justify-center
                            ${image 
                                ? 'bg-[#3B82F6] text-[#FFFFFF] hover:bg-[#2776f5] shadow-lg shadow-[#3B82F6]/20' 
                                : 'bg-[#E5E7EB] text-[#6B7280] cursor-not-allowed'
                            }`}
                    >
                        <Crop className="w-4 h-4" />
                        Crop
                    </button>
                </div>

                <div className="flex gap-3 w-full lg:w-auto justify-center lg:justify-end">
                    {/* Reset Button */}
                    <button
                        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#E5E7EB] text-[#6B7280] font-medium hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all bg-[#FFFFFF] min-w-25 justify-center"
                        onClick={handleReset}
                    >
                        <BrushCleaning className="w-4 h-4" />
                        Reset
                    </button>

                    {/* Download Button */}
                    <a
                        href={result || "#"}
                        download={result ? "cropped-image.jpg" : undefined}
                        onClick={(e) => {
                            if (!result) {
                                e.preventDefault();
                                handleDownload();
                            } else {
                                handleDownload();
                            }
                        }}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all min-w-25 justify-center
                            ${result 
                                ? 'bg-[#3B82F6] text-[#FFFFFF] hover:bg-[#2776f5] shadow-lg shadow-[#3B82F6]/20 cursor-pointer' 
                                : 'bg-[#E5E7EB] text-[#6B7280] pointer-events-none'
                            }`}
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </a>
                </div>
            </div>

            {/* Result Preview (if cropped) */}
            {result && (
                <div className="mt-6 border border-[#E5E7EB] rounded-xl p-4 bg-[#F9FAFB]">
                    <h3 className="text-sm font-bold text-[#111827] mb-3">Cropped Result</h3>
                    <img 
                        src={result} 
                        alt="Cropped" 
                        className="max-w-full max-h-64 rounded-lg border border-[#E5E7EB] shadow-sm"
                    />
                </div>
            )}
        </div>
    );
}