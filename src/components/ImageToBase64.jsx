import { Check, Copy, X, Upload, Image as ImageIcon, FileCode } from "lucide-react";
import { useState, useRef } from "react";
import CustomSelect from '../components/CustomSelect';
import toast from 'react-hot-toast';

export default function ImageToBase64() {
    const [image, setImage] = useState(null);
    const [base64, setBase64] = useState("");
    const [copied, setCopied] = useState(false);
    const [mime, setMime] = useState("");
    const [format, setFormat] = useState("data");
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Format options for CustomSelect
    const formatOptions = [
        { value: "raw", name: "Raw Base64" },
        { value: "data", name: "Data URI" },
        { value: "html-img", name: "HTML Image Tag" },
        { value: "css-bg", name: "CSS Background Image" },
        { value: "link", name: "Hyperlink" },
        { value: "download", name: "Downloadable Hyperlink" },
        { value: "favicon", name: "HTML Favicon" },
    ];

    const handleFile = (file) => {
        if (!file) return;

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

        setMime(file.type);
        const reader = new FileReader();
        reader.onload = () => {
            setBase64(reader.result.split(",")[1]);
            toast.success('Image converted to Base64!', {
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
        setImage(URL.createObjectURL(file));
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
        handleFile(e.dataTransfer.files[0]);
    };

    const getOutput = () => {
        if (!base64 || !mime) return "";
        
        switch (format) {
            case "raw":
                return base64;

            case "data":
                return `data:${mime};base64,${base64}`;

            case "html-img":
                return `<img src="data:${mime};base64,${base64}" alt="Base64 Image" />`;

            case "css-bg":
                return `background-image: url("data:${mime};base64,${base64}");`;

            case "link":
                return `<a href="data:${mime};base64,${base64}" target="_blank" rel="noopener noreferrer">Open Base64 Image</a>`;

            case "download":
                return `<a download="image.${mime.split('/')[1] || 'png'}" href="data:${mime};base64,${base64}">Download Image</a>`;

            case "favicon":
                return `<link rel="icon" type="${mime}" href="data:${mime};base64,${base64}">`;

            default:
                return "";
        }
    };

    const handleCopy = () => {
        if (!base64) {
            toast.error('No Base64 to copy! Upload an image first.', {
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

        navigator.clipboard.writeText(getOutput());
        setCopied(true);
        toast.success('Copied to clipboard!', {
            duration: 2000,
            position: 'top-right',
            icon: '📋',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const handleRemove = () => {
        setImage(null);
        setBase64("");
        setMime("");
        toast.success('Image removed', {
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

    const handleBrowseClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="bg-[#F9FAFB] p-4 md:p-8 font-manrope">
            <div className="max-w-5xl mx-auto">

                {/* Upload Area */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleBrowseClick}
                    className={`border-3 border-dashed rounded-xl p-8 md:p-10 text-center cursor-pointer transition-all duration-300 bg-[#FFFFFF] ${
                        isDragging
                            ? 'border-[#3B82F6] bg-[#F9FAFB] scale-[1.01]'
                            : 'border-[#E5E7EB] hover:border-[#3B82F6] hover:bg-[#F9FAFB]'
                    }`}
                >
                    <div className={`transition-all duration-300 ${isDragging ? 'scale-105' : ''}`}>
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F9FAFB] rounded-full mb-4 border border-[#E5E7EB]">
                            <Upload className="w-8 h-8 text-[#3B82F6]" />
                        </div>
                        <p className="text-lg text-[#111827] mb-2">
                            {isDragging ? 'Drop your image here' : 'Drag your image here, or'}
                            <span className="text-[#3B82F6] font-semibold ml-1 underline decoration-2 underline-offset-4">
                                click to browse
                            </span>
                        </p>
                        <p className="text-sm text-[#6B7280]">Supports JPG, PNG, GIF, WEBP (Max 5MB)</p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files[0])}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-8 mb-6">
                    {/* Image Preview Area */}
                    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-center min-h-64 relative shadow-sm">
                        {image ? (
                            <>
                                {/* Delete Button */}
                                <button
                                    onClick={handleRemove}
                                    className="absolute top-2 right-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-full p-2 shadow-md transition-all hover:scale-110 z-10"
                                    title="Remove Image"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                <div className="flex flex-col items-center w-full">
                                    <img
                                        src={image}
                                        alt="Preview"
                                        className="max-h-48 object-contain rounded-lg"
                                    />
                                    <div className="mt-3 text-xs text-[#6B7280] bg-[#F9FAFB] px-3 py-1.5 rounded-full border border-[#E5E7EB]">
                                        {mime?.split('/')[1]?.toUpperCase() || 'Image'} · {Math.round((base64?.length || 0) * 0.75)} bytes
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center">
                                <ImageIcon className="w-12 h-12 mx-auto text-[#6B7280] mb-2" />
                                <p className="text-[#6B7280] text-sm">
                                    Upload an image to preview
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Output Section */}
                    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-4 shadow-sm">
                        <div>
                            <label className="block text-sm font-medium text-[#6B7280] mb-2">
                                Output Format
                            </label>
                            <CustomSelect
                                label=""
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                options={formatOptions}
                                searchable={false}
                                size="md"
                                disabled={!base64}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#6B7280] mb-2">
                                Base64 Output
                            </label>
                            <textarea
                                readOnly
                                value={getOutput() || "Upload an image to generate Base64..."}
                                className="w-full h-40 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 text-sm font-mono text-[#0B1220] resize-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 outline-none transition-all"
                                placeholder="Base64 output will appear here..."
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleCopy}
                                disabled={!base64}
                                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                                    copied
                                        ? "bg-[#10B981] hover:bg-[#059669] text-white shadow-[#10B981]/20"
                                        : base64
                                        ? "bg-[#3B82F6] hover:bg-[#2776f5] text-white shadow-[#3B82F6]/20"
                                        : "bg-[#E5E7EB] text-[#6B7280] cursor-not-allowed"
                                }`}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-5 h-5" />
                                        Copy Base64
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Character Count */}
                        {base64 && (
                            <div className="text-xs text-[#6B7280] flex justify-between items-center pt-2 border-t border-[#E5E7EB]">
                                <span>Length: {base64.length} characters</span>
                                <span className="font-mono bg-[#F9FAFB] px-2 py-1 rounded border border-[#E5E7EB]">
                                    ~{Math.round(base64.length / 1024)} KB
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}