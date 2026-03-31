import { useState } from 'react';
import { LayoutGrid, Download, Instagram, AlertCircle, Loader2 } from 'lucide-react';
import { getInstagramPhotos } from '../api/instaDownloaderApi';
import toast from 'react-hot-toast';

const InstaPhotoDownloader = () => {
    const [postUrl, setPostUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [photos, setPhotos] = useState([]);

    const handleGetPhotos = async () => {
        if (!postUrl.trim() || !postUrl.includes('instagram.com')) {
            toast.error("Please enter a valid Instagram URL!", { duration: 1500 });
            return;
        }

        setIsLoading(true);
        setPhotos([]);

        try {
            const data = await getInstagramPhotos(postUrl);

            if (data && data.length > 0) {
                setPhotos(data);
                toast.success(`${data.length} photo(s) found!`, { duration: 1500 });
            } else {
                toast.error("No public media found. Ensure the post is public.", { duration: 1500 });
            }
        } catch {
            toast.error("API Error: Quota exceeded or link restricted.", { duration: 1500 });
        } finally {
            setIsLoading(false);
        }
    };

    const downloadImage = async (imgUrl, id) => {
        try {
            const response = await fetch(imgUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `insta-photo-${id}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Download started!', { duration: 1500 });
        } catch {
            window.open(imgUrl, '_blank');
            toast.error('Failed to download, opening in new tab.', { duration: 1500 });
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] font-manrope p-4 md:p-8">

            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 w-full space-y-1">
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                            <div className="relative flex-1 w-full">
                                <label className="absolute top-2.5 left-5 text-[10px] font-bold text-[#6B7280] uppercase tracking-wider z-10 pointer-events-none">
                                    Instagram Post URL
                                </label>
                                <input
                                    type="text"
                                    value={postUrl}
                                    onChange={(e) => setPostUrl(e.target.value)}
                                    placeholder="e.g. https://www.instagram.com/p/CZpBXgogFSO/"
                                    className="w-full bg-white border border-[#E5E7EB] rounded-lg px-5 pt-6 pb-2.5 outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-[#111827] placeholder:text-[#9CA3AF]"
                                />
                            </div>

                            <button
                                onClick={handleGetPhotos}
                                disabled={isLoading}
                                className="w-full md:w-auto h-14.5 bg-[#3B82F6] hover:bg-[#2776f5] text-white px-10 rounded-full font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 whitespace-nowrap shadow-lg shadow-[#3B82F6]/20"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : <LayoutGrid size={20} />}
                                Get Photos
                            </button>
                        </div>
                        <p className="text-xs text-[#6B7280] italic ml-2">
                            *The post must be public for photos to be downloaded.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {photos.length > 0 ? (
                        photos.map((photo) => (
                            <div key={photo.id} className="bg-white rounded-lg overflow-hidden border border-[#E5E7EB] group animate-in fade-in slide-in-from-bottom-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="aspect-square bg-[#F9FAFB] relative flex items-center justify-center p-1">
                                    <img
                                        src={photo.url}
                                        className="w-full h-full object-contain"
                                        alt="Insta content"
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                        <Instagram size={80} className="text-[#E5E7EB]" />
                                    </div>
                                </div>
                                <button
                                    onClick={() => downloadImage(photo.url, photo.id)}
                                    className="w-full py-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[#3B82F6] flex items-center justify-center gap-2 font-bold text-sm transition-colors border-t border-[#E5E7EB]"
                                >
                                    <Download size={16} />
                                    Download High Quality
                                </button>
                            </div>
                        ))
                    ) : (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="bg-[#F9FAFB] rounded-lg overflow-hidden border border-[#E5E7EB]">
                                <div className="aspect-square flex items-center justify-center">
                                    <Instagram size={80} className="text-[#E5E7EB]" />
                                </div>
                                <div className="w-full py-4 bg-[#F9FAFB] flex items-center justify-center gap-2 text-[#9CA3AF] font-bold text-sm border-t border-[#E5E7EB]">
                                    <Download size={16} />
                                    Download
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstaPhotoDownloader;