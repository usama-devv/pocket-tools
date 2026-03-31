import { useState, useEffect } from 'react';
import WebFont from 'webfontloader';
import { Settings, RefreshCw, User, FileText, Layout, ChevronDown, Mail, Phone, MapPin } from 'lucide-react';
import CustomSelect from './CustomSelect'; 
import toast from 'react-hot-toast';

const FontFinder = () => {
    
    const [headingFont, setHeadingFont] = useState('Bacasime Antique');
    const [bodyFont, setBodyFont] = useState('Noto Sans Meroitic');
    const [hSize, setHSize] = useState(27);
    const [bSize, setBSize] = useState(16);
    const [hWeight, setHWeight] = useState(700);
    const [bWeight, setBWeight] = useState(400);
    const [view, setView] = useState('Profile');
    const [showHeadingDetails, setShowHeadingDetails] = useState(false);
    const [showBodyDetails, setShowBodyDetails] = useState(false);

    const FONT_LIST = [
        { value: 'Bacasime Antique', name: 'Bacasime Antique' },
        { value: 'Noto Sans Meroitic', name: 'Noto Sans Meroitic' },
        { value: 'Roboto', name: 'Roboto' },
        { value: 'Playfair Display', name: 'Playfair Display' },
        { value: 'Montserrat', name: 'Montserrat' },
        { value: 'Lora', name: 'Lora' },
        { value: 'Oswald', name: 'Oswald' },
        { value: 'Open Sans', name: 'Open Sans' },
        { value: 'Poppins', name: 'Poppins' },
        { value: 'Raleway', name: 'Raleway' }
    ];

    const weightOptions = [
        { value: 100, name: 'Thin 100' },
        { value: 200, name: 'Extra Light 200' },
        { value: 300, name: 'Light 300' },
        { value: 400, name: 'Regular 400' },
        { value: 500, name: 'Medium 500' },
        { value: 600, name: 'Semi Bold 600' },
        { value: 700, name: 'Bold 700' },
        { value: 800, name: 'Extra Bold 800' },
        { value: 900, name: 'Black 900' }
    ];

    useEffect(() => {
        WebFont.load({
            google: { families: [headingFont, bodyFont] }
        });
    }, [headingFont, bodyFont]);

    const handleShuffle = () => {
        const randomH = FONT_LIST[Math.floor(Math.random() * FONT_LIST.length)];
        const randomB = FONT_LIST[Math.floor(Math.random() * FONT_LIST.length)];
        setHeadingFont(randomH.value);
        setBodyFont(randomB.value);
        
        toast.success('Font pair shuffled!', {
            duration: 2000,
            position: 'top-right',
            icon: '🎲',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });
    };

    const handleGetFontPair = () => {
        toast.success('Font pair code copied to clipboard!', {
            duration: 2000,
            position: 'top-right',
            icon: '📋',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });
    };

    const headingFontOptions = FONT_LIST;
    const bodyFontOptions = FONT_LIST;

    return (
        <div className="w-full bg-[#F9FAFB] min-h-screen p-4 md:p-10 font-manrope">
            <div className="max-w-5xl mx-auto bg-[#FFFFFF] rounded-4xl shadow-xl border border-[#E5E7EB]">

                {/* --- Top Controls Section --- */}
                <div className="p-6 md:p-10 border-b border-[#E5E7EB]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Heading Font Column */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">
                                <span>Heading Font</span>
                                <div className="flex gap-4 lowercase font-medium text-[#6B7280]">
                                    <button 
                                        onClick={() => setShowHeadingDetails(!showHeadingDetails)}
                                        className="flex items-center gap-1 hover:text-[#3B82F6] transition-colors"
                                    >
                                        <Settings size={12} /> Font Details
                                    </button>
                                    <button className="hover:text-[#3B82F6] transition-colors">Filter</button>
                                </div>
                            </div>
                            
                            {/* Font Details Dropdown */}
                            {showHeadingDetails && (
                                <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] mb-2 text-xs text-[#0B1220]">
                                    <p><span className="font-bold">Family:</span> {headingFont}</p>
                                    <p><span className="font-bold">Category:</span> Serif</p>
                                    <p><span className="font-bold">Popularity:</span> #124</p>
                                    <p><span className="font-bold">Weights:</span> 400, 700</p>
                                </div>
                            )}
                            
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <CustomSelect
                                        label=""
                                        value={headingFont}
                                        onChange={(e) => setHeadingFont(e.target.value)}
                                        options={headingFontOptions}
                                        searchable={true}
                                        size="md"
                                    />
                                </div>
                                <input 
                                    type="number" 
                                    value={hSize} 
                                    onChange={(e) => setHSize(e.target.value)} 
                                    className="w-20 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl text-center font-bold text-[#0B1220] focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 outline-none transition-all"
                                />
                                <div className="w-24">
                                    <CustomSelect
                                        label=""
                                        value={hWeight}
                                        onChange={(e) => setHWeight(Number(e.target.value))}
                                        options={weightOptions}
                                        searchable={false}
                                        size="sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Body Font Column */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">
                                <span>Body Font</span>
                                <div className="flex gap-4 lowercase font-medium text-[#6B7280]">
                                    <button 
                                        onClick={() => setShowBodyDetails(!showBodyDetails)}
                                        className="flex items-center gap-1 hover:text-[#3B82F6] transition-colors"
                                    >
                                        <Settings size={12} /> Font Details
                                    </button>
                                    <button className="hover:text-[#3B82F6] transition-colors">Filter</button>
                                </div>
                            </div>
                            
                            {/* Font Details Dropdown */}
                            {showBodyDetails && (
                                <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] mb-2 text-xs text-[#0B1220]">
                                    <p><span className="font-bold">Family:</span> {bodyFont}</p>
                                    <p><span className="font-bold">Category:</span> Sans Serif</p>
                                    <p><span className="font-bold">Popularity:</span> #89</p>
                                    <p><span className="font-bold">Weights:</span> 300, 400, 500, 700</p>
                                </div>
                            )}
                            
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <CustomSelect
                                        label=""
                                        value={bodyFont}
                                        onChange={(e) => setBodyFont(e.target.value)}
                                        options={bodyFontOptions}
                                        searchable={true}
                                        size="md"
                                    />
                                </div>
                                <input 
                                    type="number" 
                                    value={bSize} 
                                    onChange={(e) => setBSize(e.target.value)} 
                                    className="w-20 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl text-center font-bold text-[#0B1220] focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 outline-none transition-all"
                                />
                                <div className="w-24">
                                    <CustomSelect
                                        label=""
                                        value={bWeight}
                                        onChange={(e) => setBWeight(Number(e.target.value))}
                                        options={weightOptions}
                                        searchable={false}
                                        size="sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Mode Switcher & Buttons --- */}
                    <div className="flex flex-wrap justify-between items-end mt-12 gap-6">
                        <div>
                            <p className="text-[10px] font-bold text-[#6B7280] uppercase mb-3 tracking-wider">Preview Content Type</p>
                            <div className="inline-flex bg-[#F9FAFB] p-1 rounded-full border border-[#E5E7EB]">
                                {['Profile', 'Article', 'Card'].map((item) => (
                                    <button 
                                        key={item} 
                                        onClick={() => setView(item)} 
                                        className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                            view === item 
                                                ? 'bg-[#FFFFFF] shadow text-[#3B82F6] border border-[#E5E7EB]' 
                                                : 'text-[#6B7280] hover:text-[#3B82F6]'
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleShuffle} 
                                className="flex items-center gap-1.5 text-xs font-bold text-[#6B7280] hover:text-[#3B82F6] uppercase tracking-tight transition-colors"
                            >
                                Shuffle <RefreshCw size={14} />
                            </button>
                            <div className="flex gap-2">
                                <button className="bg-[#3B82F6] text-[#FFFFFF] p-2.5 rounded-xl hover:bg-[#2776f5] transition-all active:scale-95">
                                    <User size={18} />
                                </button>
                                <button className="bg-[#3B82F6] text-[#FFFFFF] p-2.5 rounded-xl hover:bg-[#2776f5] transition-all active:scale-95">
                                    <FileText size={18} />
                                </button>
                                <button className="bg-[#3B82F6] text-[#FFFFFF] px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#2776f5] transition-all active:scale-95 shadow-lg shadow-[#3B82F6]/20">
                                    <Layout size={18} /> Both
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Dynamic Preview Content --- */}
                <div className="p-8 md:p-16 transition-all duration-300 min-h-125">
                    {view === 'Profile' && (
                        <div className="fade-in">
                            <div className="flex flex-col md:flex-row gap-10 items-center md:items-start mb-12">
                                <img 
                                    src="https://i.pravatar.cc/150?u=jane" 
                                    alt="User" 
                                    className="w-44 h-44 rounded-full shadow-2xl border-4 border-[#FFFFFF] ring-2 ring-[#E5E7EB]" 
                                />
                                <div className="text-center md:text-left pt-4">
                                    <h1 
                                        style={{ 
                                            fontFamily: headingFont, 
                                            fontSize: `${hSize}px`,
                                            fontWeight: hWeight
                                        }} 
                                        className="mb-1 leading-tight text-[#111827]"
                                    >
                                        Jane Doe
                                    </h1>
                                    <p 
                                        style={{ 
                                            fontFamily: bodyFont, 
                                            fontSize: `${bSize}px`,
                                            fontWeight: bWeight
                                        }} 
                                        className="text-[#6B7280] mb-6 italic"
                                    >
                                        UI/UX Lead at Cool Company
                                    </p>
                                    <div style={{ fontFamily: bodyFont }} className="text-[13px] text-[#6B7280] space-y-2 font-medium">
                                        <p className="flex items-center gap-2 justify-center md:justify-start">
                                            <Mail size={14} className="text-[#3B82F6]" /> jane.doe@coolcompany.com
                                        </p>
                                        <p className="flex items-center gap-2 justify-center md:justify-start">
                                            <Phone size={14} className="text-[#3B82F6]" /> +1 123 456 78 90
                                        </p>
                                        <p className="flex items-center gap-2 justify-center md:justify-start">
                                            <MapPin size={14} className="text-[#3B82F6]" /> New York, USA
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div>
                                    <h2 
                                        style={{ 
                                            fontFamily: headingFont, 
                                            fontSize: `${hSize * 0.8}px`,
                                            fontWeight: hWeight
                                        }} 
                                        className="mb-4 text-[#111827]"
                                    >
                                        Biography
                                    </h2>
                                    <p 
                                        style={{ 
                                            fontFamily: bodyFont, 
                                            fontSize: `${bSize}px`,
                                            fontWeight: bWeight
                                        }} 
                                        className="text-[#0B1220] leading-relaxed max-w-4xl"
                                    >
                                        I'm Jane Doe, UI/UX lead of Cool Company based in New York. I'm a fictional character yet I have tons of things to talk about to extend the biography then you can preview how it looks.
                                    </p>
                                </div>
                                <div>
                                    <h2 
                                        style={{ 
                                            fontFamily: headingFont, 
                                            fontSize: `${hSize * 0.8}px`,
                                            fontWeight: hWeight
                                        }} 
                                        className="mb-4 text-[#111827]"
                                    >
                                        Hobbies
                                    </h2>
                                    <p 
                                        style={{ 
                                            fontFamily: bodyFont, 
                                            fontSize: `${bSize}px`,
                                            fontWeight: bWeight
                                        }} 
                                        className="text-[#0B1220] leading-relaxed max-w-4xl"
                                    >
                                        I like to use 10015 Tools on my spare time. My favorite tool is Google Fonts Pair Finder which give suggestions about font pairs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'Article' && (
                        <div className="max-w-3xl mx-auto space-y-6 fade-in">
                            <h1 
                                style={{ 
                                    fontFamily: headingFont, 
                                    fontSize: `${hSize * 1.4}px`,
                                    fontWeight: hWeight
                                }} 
                                className="leading-tight text-[#111827]"
                            >
                                The Art of Choosing Typography
                            </h1>
                            <p 
                                style={{ 
                                    fontFamily: bodyFont, 
                                    fontSize: `${bSize}px`,
                                    fontWeight: bWeight
                                }} 
                                className="text-[#0B1220] leading-loose"
                            >
                                Typography is more than just selecting a font. It's about readability and communicating a message through visual structure.
                                A good pair of fonts creates hierarchy and makes the content digestible for the user.
                            </p>
                        </div>
                    )}

                    {view === 'Card' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-6 border border-[#E5E7EB] rounded-3xl shadow-sm bg-[#F9FAFB] hover:shadow-md transition-shadow">
                                    <h3 
                                        style={{ 
                                            fontFamily: headingFont, 
                                            fontSize: `${hSize * 0.7}px`,
                                            fontWeight: hWeight
                                        }} 
                                        className="mb-3 text-[#111827]"
                                    >
                                        Feature {i}
                                    </h3>
                                    <p 
                                        style={{ 
                                            fontFamily: bodyFont, 
                                            fontSize: `${bSize * 0.9}px`,
                                            fontWeight: bWeight
                                        }} 
                                        className="text-[#6B7280]"
                                    >
                                        Selected pairing applied to card layout.
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- Bottom Final Action --- */}
                <div className="p-10 flex justify-center bg-[#F9FAFB] border-t border-[#E5E7EB]">
                    <button 
                        onClick={handleGetFontPair}
                        className="bg-[#3B82F6] text-[#FFFFFF] px-10 py-4 rounded-full font-black text-sm tracking-widest shadow-2xl hover:bg-[#2776f5] transition-all active:scale-95 uppercase"
                    >
                        &lt;/&gt; Get Font Pair
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FontFinder;