import { useState, useRef } from 'react';
import { FolderOpen, Link, Upload, RotateCcw, Download, Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';

const InstagramFiltersTool = () => {
    const [mode, setMode] = useState('uploadFile');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('Normal');
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);
    const imageRef = useRef(null);

    const placeholderImg = "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=400&auto=format&fit=crop&q=60";

    const filters = [
        { name: 'Normal', class: '' },
        { name: 'Clarendon', class: 'contrast(120%) brightness(110%) saturate(125%) hue-rotate(-10deg)' },
        { name: 'Gingham', class: 'sepia(20%) contrast(90%) brightness(110%)' },
        { name: 'Moon', class: 'grayscale(100%) contrast(110%) brightness(110%)' },
        { name: 'Lark', class: 'contrast(110%) brightness(110%) saturate(130%)' },
        { name: 'Reyes', class: 'sepia(30%) brightness(110%) contrast(85%)' },
        { name: 'Juno', class: 'contrast(115%) brightness(110%) saturate(140%) hue-rotate(-20deg)' },
        { name: 'Slumber', class: 'brightness(105%) contrast(90%) saturate(60%)' },
        { name: 'Crema', class: 'sepia(10%) contrast(95%) brightness(105%) saturate(85%)' },
        { name: 'Ludwig', class: 'brightness(105%) contrast(105%) saturate(110%)' },
        { name: 'Aden', class: 'hue-rotate(-20deg) contrast(90%) brightness(115%) saturate(85%)' },
        { name: 'Perpetua', class: 'contrast(110%) brightness(110%) saturate(110%) hue-rotate(-30deg)' },
    ];

    const handleFileUpload = (file) => {
        if (file && file.type.startsWith('image/')) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size should be less than 10MB', { duration: 1500 });
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target.result);
                setSelectedFilter('Normal');
                toast.success("Image uploaded successfully!", { duration: 1500 });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlSubmit = () => {
        if (!imageUrl) {
            toast.error('Please enter an image URL', { duration: 1500 });
            return;
        }

        setLoading(true);
        // Proxy bypass for CORS
        const proxiedUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = proxiedUrl;

        img.onload = () => {
            setUploadedImage(proxiedUrl);
            setSelectedFilter('Normal');
            setLoading(false);
            toast.success("Image loaded from URL!", { duration: 1500 });
        };

        img.onerror = () => {
            setLoading(false);
            toast.error("Security Error: This website blocks direct linking. Try downloading the image first.", { duration: 1500 });
        };
    };

    const handleDownload = () => {
        if (!uploadedImage) {
            toast.error('No image to download!', { duration: 1500 });
            return;
        }

        const canvas = document.createElement('canvas');
        const img = imageRef.current;
        if (!img.complete || img.naturalWidth === 0) {
            toast.error("Image is still loading. Please wait.", { duration: 1500 });
            return;
        }

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');

        const currentFilter = filters.find(f => f.name === selectedFilter).class;
        ctx.filter = currentFilter === '' ? 'none' : currentFilter;

        try {
            ctx.drawImage(img, 0, 0);
            const link = document.createElement('a');
            link.download = `insta-filter-${selectedFilter.toLowerCase()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast.success("Image downloaded successfully!", { duration: 1500 });
        } catch {
            toast.error("CORS Restriction: Cannot download this URL image. Please upload a file instead.", { duration: 1500 });
        }
    };

    const handleReset = () => {
        setSelectedFilter('Normal');
        setUploadedImage(null);
        setImageUrl('');
        toast.success("Settings reset.", { duration: 1500 });
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] py-10 px-4 font-manrope relative overflow-x-hidden">

            <div className="max-w-5xl mx-auto space-y-6">

                {/* Row 1: Tabs */}
                <div className="flex justify-center">
                    <div className="bg-[#F3F4F6] p-1.5 rounded-xl flex w-full max-w-sm border border-[#E5E7EB]">
                        <button 
                            onClick={() => setMode('uploadFile')} 
                            className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                mode === 'uploadFile' 
                                    ? 'bg-[#3B82F6] text-white shadow-md' 
                                    : 'text-[#6B7280] hover:text-[#111827]'
                            }`}
                        >
                            <FolderOpen size={16} /> Upload File
                        </button>
                        <button 
                            onClick={() => setMode('uploadFromUrl')} 
                            className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                mode === 'uploadFromUrl' 
                                    ? 'bg-[#3B82F6] text-white shadow-md' 
                                    : 'text-[#6B7280] hover:text-[#111827]'
                            }`}
                        >
                            <Link size={16} /> Upload from URL
                        </button>
                    </div>
                </div>

                {/* Row 2: Input Area */}
                <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
                    {mode === 'uploadFile' ? (
                        <div
                            onDrop={(e) => { e.preventDefault(); handleFileUpload(e.dataTransfer.files[0]); }}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onClick={() => fileInputRef.current?.click()}
                            className={`m-4 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                                isDragging 
                                    ? 'border-[#3B82F6] bg-[#F9FAFB]' 
                                    : 'border-[#E5E7EB] hover:border-[#3B82F6] hover:bg-[#F9FAFB]'
                            }`}
                        >
                            <Upload className="mx-auto mb-4 text-[#6B7280]" size={32} />
                            <p className="text-[#111827]">Drag your image here, or <span className="text-[#3B82F6] font-bold">browse</span></p>
                            <p className="text-xs text-[#6B7280] mt-1">Supports JPG, PNG, WEBP (Max 10MB)</p>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files[0])} className="hidden" />
                        </div>
                    ) : (
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-3">
                                <input
                                    type="text"
                                    placeholder="Paste Image URL here..."
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="bg-white flex-1 border border-[#E5E7EB] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-[#111827] placeholder-[#9CA3AF]"
                                />
                                <button 
                                    onClick={handleUrlSubmit} 
                                    disabled={loading}
                                    className="bg-[#3B82F6] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#2776f5] transition-all shadow-lg shadow-[#3B82F6]/20 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? 'Loading...' : 'Load Image'}
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-[#6B7280] ml-1 italic">Note: Make sure the URL is public and direct.</p>
                        </div>
                    )}
                </div>

                {/* Row 3: Preview Box */}
                <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 min-h-100 flex items-center justify-center overflow-hidden relative">
                    {uploadedImage ? (
                        <img
                            ref={imageRef}
                            src={uploadedImage}
                            alt="Main Preview"
                            crossOrigin="anonymous"
                            className="max-w-full max-h-137.5 rounded-lg transition-all duration-500"
                            style={{ filter: filters.find(f => f.name === selectedFilter).class }}
                        />
                    ) : (
                        <div className="text-center space-y-4">
                            <Settings2 className="mx-auto text-[#E5E7EB] animate-pulse" size={64} />
                            <p className="text-[#6B7280] font-medium">Upload an image before starting to apply filters</p>
                        </div>
                    )}
                </div>

                {/* Row 4: Filters Palette */}
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                    <div className="flex gap-2 min-w-max px-2">
                        {filters.map((filter) => (
                            <div
                                key={filter.name}
                                onClick={() => setSelectedFilter(filter.name)}
                                className="flex flex-col items-center gap-2 cursor-pointer group"
                            >
                                <span className={`text-xs font-bold uppercase tracking-tight transition-all ${
                                    selectedFilter === filter.name 
                                        ? 'text-[#3B82F6] scale-110' 
                                        : 'text-[#6B7280] group-hover:text-[#111827]'
                                }`}>
                                    {filter.name}
                                </span>
                                <div className={`w-19 h-19 rounded-lg overflow-hidden border-2 transition-all ${
                                    selectedFilter === filter.name 
                                        ? 'border-[#3B82F6] ring-4 ring-[#3B82F6]/20' 
                                        : 'border-[#E5E7EB] group-hover:border-[#9CA3AF]'
                                }`}>
                                    <img
                                        src={uploadedImage || placeholderImg}
                                        alt={filter.name}
                                        crossOrigin="anonymous"
                                        className="w-full h-full object-cover"
                                        style={{ filter: filter.class }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Row 5: Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 pb-10">
                    <button 
                        onClick={handleReset} 
                        className="flex-1 sm:flex-none items-center justify-center gap-2 px-14 py-3 rounded-full border-2 border-[#E5E7EB] bg-white font-bold text-[#6B7280] hover:text-[#111827] hover:border-[#3B82F6] transition-all flex active:scale-95"
                    >
                        <RotateCcw size={18} /> Reset
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={!uploadedImage}
                        className="flex-1 sm:flex-none items-center justify-center gap-2 px-12 py-3 rounded-full bg-[#3B82F6] text-white font-bold shadow-lg shadow-[#3B82F6]/20 hover:bg-[#2776f5] transition-all flex active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download size={18} /> Download
                    </button>
                </div>

            </div>
        </div>
    );
};

export default InstagramFiltersTool;