import { useState, useEffect } from 'react';
import { Download, Copy, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ThumbnailGrabber = ({ tool, label, icon }) => {
    const [url, setUrl] = useState('');
    const [thumbnails, setThumbnails] = useState([]);
    const [error, setError] = useState('');
    const [copiedIndex, setCopiedIndex] = useState(null);

    // YouTube ID Extraction
    const getYoutubeId = (url) => {
        if (!url) return false;
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : false;
    };

    // Vimeo ID Extraction (Supports: Standard, Channels, Groups)
    const getVimeoId = (url) => {
        if (!url) return false;
        // Handle standard, channels and groups URLs
        const regExp = /(vimeo\.com\/|video\/|channels\/.*\/|groups\/.*\/videos\/)(\d+)(?=\b|\/)/;
        const match = url.match(regExp);
        return (match && match[2]) ? match[2] : false;
    };

    useEffect(() => {
        if (!url) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setThumbnails([]);
            setError('');
            return;
        }

        if (tool === 'youtube') {
            const id = getYoutubeId(url);
            if (id) {
                setError('');
                setThumbnails([
                    { label: 'Maximum Resolution', size: '1280x720', url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg` },
                    { label: 'Standard Definition', size: '640x480', url: `https://img.youtube.com/vi/${id}/sddefault.jpg` },
                    { label: 'High Quality', size: '480x360', url: `https://img.youtube.com/vi/${id}/hqdefault.jpg` },
                    { label: 'Medium Quality', size: '320x180', url: `https://img.youtube.com/vi/${id}/mqdefault.jpg` },
                    { label: 'List Thumbnail', size: '480x360', url: `https://img.youtube.com/vi/${id}/0.jpg` },
                    { label: 'Mini Thumbnail (Scene 1)', size: '120x90', url: `https://img.youtube.com/vi/${id}/1.jpg` },
                    { label: 'Mini Thumbnail (Scene 2)', size: '120x90', url: `https://img.youtube.com/vi/${id}/2.jpg` },
                    { label: 'Mini Thumbnail (Scene 3)', size: '120x90', url: `https://img.youtube.com/vi/${id}/3.jpg` }
                ]);
            } else {
                setThumbnails([]);
                setError('Please enter a valid YouTube URL');
                if (url.length > 25) toast.error('Invalid YouTube URL Format', { duration: 1500 });
            }
        }

        else if (tool === 'vimeo') {
            const id = getVimeoId(url);
            if (id) {
                setError('');
                // Fetching Vimeo Metadata for HD Thumbnails
                fetch(`https://vimeo.com/api/v2/video/${id}.json`)
                    .then(res => res.json())
                    .then(data => {
                        const baseImg = data[0].thumbnail_large.split('_')[0]; // Base URL to inject custom sizes
                        setThumbnails([
                            { label: 'X-Large (HD)', size: '1920x1080', url: `${baseImg}_1920x1080.jpg` },
                            { label: 'Large', size: '1280x720', url: `${baseImg}_1280x720.jpg` },
                            { label: 'Medium', size: '640x360', url: `${baseImg}_640x360.jpg` },
                            { label: 'Small', size: '320x180', url: `${baseImg}_320x180.jpg` },
                            { label: 'X-Small', size: '240x135', url: `${baseImg}_240x135.jpg` }
                        ]);
                    })
                    .catch(() => {
                        setError('Vimeo Video not found');
                        toast.error('Error fetching Vimeo data', { duration: 1500 });
                    });
            } else {
                setThumbnails([]);
                setError('Please enter a valid Vimeo URL');
                if (url.length > 20) toast.error('Invalid Vimeo URL Format', { duration: 1500 });
            }
        }
    }, [url, tool]);

    const handleCopy = (imgUrl, index) => {
        navigator.clipboard.writeText(imgUrl);
        setCopiedIndex(index);
        toast.success('Link copied to clipboard', { duration: 1500 });
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleDownload = async (imgUrl, label) => {
        try {
            const response = await fetch(imgUrl);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${label.toLowerCase().replace(/\s+/g, '-')}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Download started', { duration: 1500 });
        } catch {
            window.open(imgUrl, '_blank');
            toast.success('Opening image...', { duration: 1500 });
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-2 font-manrope">

            <div className="max-w-5xl mx-auto">
                {/* Input Field */}
                <div className="relative mb-4">
                    <div className="absolute top-1.5 left-2.5 px-2 text-xs font-bold text-[#6B7280] uppercase tracking-wider z-10">
                        {label}
                    </div>
                    <input
                        type="text"
                        placeholder={`e.g. ${tool === 'youtube' ? 'https://www.youtube.com/watch?v=XqZsoesa55w' : 'https://vimeo.com/123456789'}`}
                        className={`w-full px-6 py-5 text-lg bg-white border rounded-lg outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all text-[#111827] font-medium ${error ? 'border-[#EF4444]' : 'border-[#E5E7EB]'
                            }`}
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    {error && <p className="text-[#EF4444] text-xs font-bold mt-1 ml-2 uppercase tracking-tight">{error}</p>}
                </div>

                {/* Main Content Area */}
                {thumbnails.length === 0 ? (
                    <div className="bg-white border border-[#E5E7EB] rounded-lg py-32 flex flex-col items-center justify-center text-[#6B7280]">
                        <div className="flex items-center justify-center mb-6">
                            {icon}
                        </div>
                        <p className="text-lg text-center font-bold">Enter a valid {label} to see the thumbnails</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
                        {thumbnails.map((thumb, i) => (
                            <div key={i} className="group bg-white rounded-lg border border-[#E5E7EB] overflow-hidden hover:shadow-lg transition-all">
                                <div className="relative aspect-video bg-[#F9FAFB]">
                                    <img
                                        src={thumb.url}
                                        alt={thumb.label}
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.closest('.group').style.display = 'none'}
                                    />
                                    <div className="absolute top-4 right-4 bg-[#3B82F6] backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-md">
                                        {thumb.size}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-4">
                                        {thumb.label}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleCopy(thumb.url, i)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#E5E7EB] bg-white hover:text-[#111827] text-[#6B7280] rounded-full text-xs font-bold transition-all hover:border-[#3B82F6]"
                                        >
                                            {copiedIndex === i ? <Check size={16} className="text-[#10B981]" /> : <Copy size={16} />}
                                            {copiedIndex === i ? 'COPIED URL' : 'COPY URL'}
                                        </button>
                                        <button
                                            onClick={() => handleDownload(thumb.url, thumb.label)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#3B82F6] hover:bg-[#2776f5] text-white rounded-full text-xs font-bold transition-all shadow-lg shadow-[#3B82F6]/20"
                                        >
                                            <Download size={16} /> DOWNLOAD
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThumbnailGrabber;