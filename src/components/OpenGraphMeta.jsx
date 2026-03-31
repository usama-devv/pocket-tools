import { useState, useRef, useEffect } from 'react';
import { RotateCcw, Code, Copy, Check, ChevronDown, Search, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// --- Custom Dropdown Component ---
const CustomDropdown = ({ value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        onChange({ target: { name: 'type', value: val } });
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="relative w-full h-full" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 pt-6 pb-2 bg-white border border-[#E5E7EB] rounded-lg outline-none cursor-pointer flex justify-between items-center focus-within:border-[#3B82F6] transition-all"
            >
                <span className="text-[#111827] font-medium capitalize">{value.replace('.', ' ')}</span>
                <ChevronDown size={18} className={`text-[#6B7280] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#3B82F6]' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute top-[110%] left-0 w-full bg-white border border-[#E5E7EB] shadow-2xl rounded-xl z-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 border-b border-[#E5E7EB] bg-[#F9FAFB] flex items-center gap-2">
                        <Search size={14} className="text-[#6B7280] ml-2" />
                        <input
                            type="text"
                            placeholder="Search types..."
                            className="w-full p-1 text-xs bg-transparent outline-none text-[#111827]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {options.map((group) => {
                            const filteredItems = group.items.filter(item =>
                                item.name.toLowerCase().includes(searchTerm.toLowerCase())
                            );
                            if (filteredItems.length === 0) return null;

                            return (
                                <div key={group.label}>
                                    <div className="px-4 py-2 text-[10px] font-black text-[#6B7280] uppercase tracking-widest bg-white sticky top-0">
                                        {group.label}
                                    </div>
                                    {filteredItems.map((item) => (
                                        <div
                                            key={item.value}
                                            onClick={() => handleSelect(item.value)}
                                            className={`px-5 py-2.5 text-sm cursor-pointer transition-colors flex justify-between items-center ${
                                                value === item.value 
                                                    ? 'bg-[#F9FAFB] text-[#3B82F6] font-bold' 
                                                    : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
                                            }`}
                                        >
                                            {item.name}
                                            {value === item.value && <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const OpenGraphMeta = () => {
    const [showOptional, setShowOptional] = useState(false);
    const [generatedCode, setGeneratedCode] = useState('');

    const [formData, setFormData] = useState({
        title: '', type: 'website', url: '', image: '',
        siteName: '', description: '', videoUrl: '',
        audioUrl: '', determiner: '', locale: ''
    });

    const typeOptions = [
        { label: 'Standard', items: [{ name: 'Website', value: 'website' }, { name: 'Article', value: 'article' }, { name: 'Book', value: 'book' }, { name: 'Profile', value: 'profile' }] },
        { label: 'Music', items: [{ name: 'Song', value: 'music.song' }, { name: 'Album', value: 'music.album' }, { name: 'Playlist', value: 'music.playlist' }, { name: 'Radio Station', value: 'music.radio_station' }] },
        { label: 'Video', items: [{ name: 'Movie', value: 'video.movie' }, { name: 'Episode', value: 'video.episode' }, { name: 'TV Show', value: 'video.tv_show' }] },
        { label: 'Other', items: [{ name: 'Place', value: 'place' }, { name: 'Product', value: 'product' }, { name: 'Business', value: 'business.business' }] }
    ];

    // URL Validator Function
    const isValidUrl = (urlString) => {
        try {
            return Boolean(new URL(urlString));
        } catch {
            return false;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setFormData({
            title: '', type: 'website', url: '', image: '',
            siteName: '', description: '', videoUrl: '',
            audioUrl: '', determiner: '', locale: ''
        });
        setGeneratedCode('');
        toast.success("Form has been reset", { duration: 1500 });
    };

    const generateMeta = () => {
        // 1. Check Required Fields
        if (!formData.title || !formData.url || !formData.image) {
            toast.error("Please fill all required fields (*)", { duration: 1500 });
            return;
        }

        // 2. Validate URLs
        if (!isValidUrl(formData.url)) {
            toast.error("Please enter a valid URL", { duration: 1500 });
            return;
        }
        if (!isValidUrl(formData.image)) {
            toast.error("Please enter a valid Image URL", { duration: 1500 });
            return;
        }

        // 3. Optional URLs Validation (Only if provided)
        if (showOptional) {
            if (formData.videoUrl && !isValidUrl(formData.videoUrl)) {
                toast.error("Invalid Video URL provided", { duration: 1500 });
                return;
            }
            if (formData.audioUrl && !isValidUrl(formData.audioUrl)) {
                toast.error("Invalid Audio URL provided", { duration: 1500 });
                return;
            }
        }

        let code = `\n`;
        if (formData.title) code += `<meta property="og:title" content="${formData.title}">\n`;
        if (formData.type) code += `<meta property="og:type" content="${formData.type}">\n`;
        if (formData.url) code += `<meta property="og:url" content="${formData.url}">\n`;
        if (formData.image) code += `<meta property="og:image" content="${formData.image}">\n`;

        if (showOptional) {
            if (formData.siteName) code += `<meta property="og:site_name" content="${formData.siteName}">\n`;
            if (formData.description) code += `<meta property="og:description" content="${formData.description}">\n`;
            if (formData.videoUrl) code += `<meta property="og:video" content="${formData.videoUrl}">\n`;
            if (formData.audioUrl) code += `<meta property="og:audio" content="${formData.audioUrl}">\n`;
            if (formData.determiner) code += `<meta property="og:determiner" content="${formData.determiner}">\n`;
            if (formData.locale) code += `<meta property="og:locale" content="${formData.locale}">\n`;
        }
        setGeneratedCode(code.trim());
        toast.success("Meta tags generated successfully!", { duration: 1500 });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCode);
        toast.success("Meta code copied to clipboard!", { duration: 1500 });
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-manrope">

            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-[#111827] mb-6 tracking-tight">Required Metadata</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="relative group">
                            <label className="absolute top-1.5 left-3 text-[10px] font-black text-[#6B7280] uppercase tracking-wider z-10 group-focus-within:text-[#3B82F6]">
                                Title <span className="text-[#EF4444]">*</span>
                            </label>
                            <input 
                                name="title" 
                                value={formData.title} 
                                onChange={handleChange} 
                                type="text" 
                                placeholder="e.g. My Awesome Website" 
                                className="w-full px-4 pt-6 pb-2 bg-white border border-[#E5E7EB] rounded-lg outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all font-medium text-[#111827] placeholder:text-[#9CA3AF]" 
                            />
                        </div>
                        <div className="relative group">
                            <label className="absolute top-1.5 left-3 text-[10px] font-black text-[#6B7280] uppercase tracking-wider z-10 group-focus-within:text-[#3B82F6]">
                                Type <span className="text-[#EF4444]">*</span>
                            </label>
                            <CustomDropdown value={formData.type} onChange={handleChange} options={typeOptions} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative group">
                            <label className="absolute top-1.5 left-3 text-[10px] font-black text-[#6B7280] uppercase tracking-wider z-10 group-focus-within:text-[#3B82F6]">
                                URL <span className="text-[#EF4444]">*</span>
                            </label>
                            <input 
                                name="url" 
                                value={formData.url} 
                                onChange={handleChange} 
                                type="text" 
                                placeholder="https://example.com" 
                                className="w-full px-4 pt-6 pb-2 bg-white border border-[#E5E7EB] rounded-lg outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all font-medium text-[#111827] placeholder:text-[#9CA3AF]" 
                            />
                        </div>
                        <div className="relative group">
                            <label className="absolute top-1.5 left-3 text-[10px] font-black text-[#6B7280] uppercase tracking-wider z-10 group-focus-within:text-[#3B82F6]">
                                Image <span className="text-[#EF4444]">*</span>
                            </label>
                            <input 
                                name="image" 
                                value={formData.image} 
                                onChange={handleChange} 
                                type="text" 
                                placeholder="https://example.com/image.jpg" 
                                className="w-full px-4 pt-6 pb-2 bg-white border border-[#E5E7EB] rounded-lg outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all font-medium text-[#111827] placeholder:text-[#9CA3AF]" 
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-8 border-t border-[#E5E7EB] pt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-[#111827]">Optional Metadata</h2>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={showOptional} 
                                onChange={(e) => setShowOptional(e.target.checked)} 
                                className="w-4 h-4 rounded text-[#3B82F6] border-[#E5E7EB] focus:ring-[#3B82F6]" 
                            />
                            <span className="text-sm font-bold text-[#6B7280] group-hover:text-[#3B82F6] transition-colors">Show</span>
                        </label>
                    </div>
                    {showOptional && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            {[
                                { name: 'siteName', label: 'Site Name', placeholder: 'e.g. My Brand' },
                                { name: 'description', label: 'Description', placeholder: 'A short description...' },
                                { name: 'videoUrl', label: 'Video URL', placeholder: 'https://...' },
                                { name: 'audioUrl', label: 'Audio URL', placeholder: 'https://...' },
                                { name: 'determiner', label: 'Determiner', placeholder: 'e.g. a, an, the' },
                                { name: 'locale', label: 'Locale', placeholder: 'e.g. en_US' }
                            ].map((field) => (
                                <div key={field.name} className="relative group">
                                    <label className="absolute top-1.5 left-3 text-[10px] font-black text-[#6B7280] uppercase tracking-wider z-10 group-focus-within:text-[#3B82F6]">{field.label}</label>
                                    <input 
                                        name={field.name} 
                                        value={formData[field.name]} 
                                        onChange={handleChange} 
                                        type="text" 
                                        placeholder={field.placeholder} 
                                        className="w-full px-4 pt-6 pb-2 bg-white border border-[#E5E7EB] rounded-lg outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all font-medium text-[#111827] placeholder:text-[#9CA3AF]" 
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-10">
                    <button 
                        onClick={handleReset} 
                        className="flex items-center gap-2 px-8 py-3 bg-white border border-[#E5E7EB] text-[#6B7280] font-bold rounded-full hover:bg-[#F9FAFB] hover:text-[#111827] hover:border-[#3B82F6] transition-all"
                    >
                        <RotateCcw size={18} /> Reset
                    </button>
                    <button 
                        onClick={generateMeta} 
                        className="flex items-center gap-2 px-10 py-3 bg-[#3B82F6] text-white font-bold rounded-full hover:bg-[#2776f5] transition-all shadow-lg shadow-[#3B82F6]/20"
                    >
                        <Code size={18} /> Generate
                    </button>
                </div>

                {generatedCode && (
                    <div className="mt-12 animate-in zoom-in-95 duration-300">
                        <div className="relative group">
                            <label className="absolute top-1.5 left-4 px-2 text-xs font-black text-[#3B82F6] uppercase tracking-widest z-10">Generated Open Graph Meta</label>
                            <div className="w-full bg-white p-6 rounded-lg font-mono text-sm leading-relaxed overflow-x-auto border border-[#E5E7EB] text-[#111827]">
                                {generatedCode.split('\n').map((line, i) => (
                                    <div key={i} className="whitespace-pre">{line}</div>
                                ))}
                            </div>
                            <p className="text-start mt-2 text-[#6B7280] text-xs font-medium italic">* Paste Open Graph meta tags between the &lt;head&gt; tags of your website.</p>
                        </div>
                        <div className="flex justify-center mt-6">
                            <button 
                                onClick={copyToClipboard} 
                                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#3B82F6] active:scale-95"
                            >
                                <Copy size={18} /> COPY META CODE
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OpenGraphMeta;