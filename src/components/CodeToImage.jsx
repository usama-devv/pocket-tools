import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Upload, Download, Copy, Maximize, X } from 'lucide-react';
import { FaSquareXTwitter } from "react-icons/fa6";
import { ImEqualizer } from "react-icons/im";
import CustomSelect from '../components/CustomSelect';
import toast from 'react-hot-toast';

const CodeToImage = () => {
    // Dynamic loading states
    const [Highlighter, setHighlighter] = useState(null);
    const [themes, setThemes] = useState(null);

    const [code, setCode] = useState("// Paste your code here...\nfunction helloWorld() {\n  console.log('Hello from Usama!');\n}");
    const [padding, setPadding] = useState(40);
    const [fontSize, setFontSize] = useState(16);
    const [showSettings, setShowSettings] = useState(false);
    const [isWatermarkEnabled, setIsWatermarkEnabled] = useState(false);
    const [watermark, setWatermark] = useState('Usama');
    const [watermarkType, setWatermarkType] = useState('Text Only');
    const [watermarkPos, setWatermarkPos] = useState('bottom-left');
    const [watermarkColor, setWatermarkColor] = useState('#ffffff');
    const [avatar, setAvatar] = useState(null);
    const [aspect, setAspect] = useState('Wide');
    const [exportOpen, setExportOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const [language, setLanguage] = useState('javascript');
    const [themeKey, setThemeKey] = useState('dracula');
    const [fileName, setFileName] = useState('untitled-code');

    const [fontFamily, setFontFamily] = useState('JetBrains Mono');
    const [tabSize, setTabSize] = useState(4);
    const [shadow, setShadow] = useState('rgba(0, 0, 0, 0.3) 0px 20px 50px');
    const [quality, setQuality] = useState(2);
    const [showLineNumbers, setShowLineNumbers] = useState(true);

    const [bgType, setBgType] = useState('Gradient');
    const [bgValue, setBgValue] = useState('linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)');
    const [uploadedImg, setUploadedImg] = useState(null);

    const canvasRef = useRef(null);
    const settingsRef = useRef(null);

    // Dynamic Imports Logic
    useEffect(() => {
        const loadHighlighter = async () => {
            const { Prism } = await import('react-syntax-highlighter');
            const prismStyles = await import('react-syntax-highlighter/dist/esm/styles/prism');
            setHighlighter(() => Prism);
            setThemes(prismStyles);
        };
        loadHighlighter();
    }, []);

    const languages = [
        { name: 'JavaScript', val: 'javascript', icon: 'JS' }, { name: 'Python', val: 'python', icon: 'PY' },
        { name: 'Java', val: 'java', icon: 'JV' }, { name: 'HTML', val: 'html', icon: 'HT' },
        { name: 'CSS', val: 'css', icon: 'CS' }, { name: 'TypeScript', val: 'typescript', icon: 'TS' },
        { name: 'C++', val: 'cpp', icon: 'C+' }, { name: 'C#', val: 'csharp', icon: 'C#' },
        { name: 'PHP', val: 'php', icon: 'PH' }, { name: 'Kotlin', val: 'kotlin', icon: 'KO' },
        { name: 'Swift', val: 'swift', icon: 'SW' }, { name: 'Go', val: 'go', icon: 'GO' },
        { name: 'Rust', val: 'rust', icon: 'RS' }, { name: 'Ruby', val: 'ruby', icon: 'RB' },
        { name: 'SQL', val: 'sql', icon: 'SQ' }, { name: 'Dart', val: 'dart', icon: 'DT' },
        { name: 'R', val: 'r', icon: 'R' }, { name: 'MATLAB', val: 'matlab', icon: 'MA' },
        { name: 'Scala', val: 'scala', icon: 'SC' }, { name: 'Bash', val: 'bash', icon: 'SH' },
        { name: 'JSON', val: 'json', icon: 'JS' }, { name: 'YAML', val: 'yaml', icon: 'YA' },
        { name: 'Markdown', val: 'markdown', icon: 'MD' }, { name: 'C', val: 'c', icon: 'C' },
        { name: 'Solidity', val: 'solidity', icon: 'SO' }, { name: 'GraphQL', val: 'graphql', icon: 'GQ' },
        { name: 'Haskell', val: 'haskell', icon: 'HS' }, { name: 'Lua', val: 'lua', icon: 'LU' },
        { name: 'Perl', val: 'perl', icon: 'PL' }, { name: 'Docker', val: 'dockerfile', icon: 'DK' },
        { name: 'Objective-C', val: 'objectivec', icon: 'OC' }, { name: 'Elixir', val: 'elixir', icon: 'EX' },
        { name: 'Erlang', val: 'erlang', icon: 'ER' }, { name: 'F#', val: 'fsharp', icon: 'F#' },
        { name: 'Groovy', val: 'groovy', icon: 'GR' }, { name: 'Julia', val: 'julia', icon: 'JL' },
        { name: 'PowerShell', val: 'powershell', icon: 'PS' }, { name: 'Vim-L', val: 'vim', icon: 'VI' },
        { name: 'Sass', val: 'sass', icon: 'SA' }, { name: 'Less', val: 'less', icon: 'LE' },
        { name: 'Stylus', val: 'stylus', icon: 'ST' }, { name: 'Scheme', val: 'scheme', icon: 'SC' },
        { name: 'Arduino', val: 'arduino', icon: 'AR' }, { name: 'COBOL', val: 'cobol', icon: 'CO' },
        { name: 'FORTRAN', val: 'fortran', icon: 'FO' }, { name: 'Lisp', val: 'lisp', icon: 'LI' },
        { name: 'Pascal', val: 'pascal', icon: 'PA' }, { name: 'Smalltalk', val: 'smalltalk', icon: 'ST' }
    ];

    // Language options for CustomSelect
    const languageOptions = languages.map(lang => ({
        value: lang.val,
        name: `[${lang.icon}] ${lang.name}`
    }));

    const availableThemes = themes ? Object.keys(themes).map(key => ({
        value: key,
        name: key.charAt(0).toUpperCase() + key.slice(1)
    })) : [{ value: 'dracula', name: 'Loading...' }];

    useEffect(() => {
        const fontName = fontFamily.replace(/\s+/g, '+');
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => {
            if (document.head.contains(link)) document.head.removeChild(link);
        };
    }, [fontFamily]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setShowSettings(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fonts = [
        "JetBrains Mono", "Fira Code", "Source Code Pro", "Courier New", "Ubuntu Mono",
        "Roboto Mono", "Cascadia Code", "IBM Plex Mono", "Anonymous Pro", "Space Mono",
        "Inconsolata", "PT Mono", "Oxygen Mono", "Nova Mono", "Share Tech Mono",
        "Cutive Mono", "Fantasque Sans Mono", "Victor Mono", "Iosevka", "Hack", "Monoid"
    ];

    const fontOptions = fonts.map(font => ({ value: font, name: font }));

    const shadows = [
        { name: 'None', value: 'none' },
        { name: 'Soft', value: 'rgba(0, 0, 0, 0.1) 0px 4px 12px' },
        { name: 'Medium', value: 'rgba(0, 0, 0, 0.2) 0px 10px 30px' },
        { name: 'Hard', value: 'rgba(0, 0, 0, 0.3) 0px 20px 50px' },
        { name: 'Glow Purple', value: 'rgba(124, 58, 237, 0.3) 0px 15px 35px' },
        { name: 'Glow Blue', value: 'rgba(59, 130, 246, 0.3) 0px 15px 35px' }
    ];

    const shadowOptions = shadows.map(s => ({ value: s.value, name: s.name }));

    const gradients = [
        { name: 'Ocean Breeze', value: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
        { name: 'Purple Bliss', value: 'linear-gradient(to right, #667eea, #764ba2)' },
        { name: 'Morpheus Den', value: 'linear-gradient(to right, #30cfd0, #330867)' },
        { name: 'Can you feel', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { name: 'Celestial', value: 'linear-gradient(135deg, #c33764 0%, #1d2671 100%)' },
        { name: 'Aubergine', value: 'linear-gradient(135deg, #aa076b 0%, #61045f 100%)' },
        { name: 'Mango', value: 'linear-gradient(to right, #ffe259, #ffa751)' },
        { name: 'Virgin America', value: 'linear-gradient(to right, #7b4397, #dc2430)' },
        { name: 'Endless River', value: 'linear-gradient(to right, #43e97b, #38f9d7)' },
        { name: 'Can you feel v2', value: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
        { name: 'Love Couple', value: 'linear-gradient(135deg, #ff9a8b 0%, #fad0c4 100%)' },
        { name: 'Kashmir', value: 'linear-gradient(135deg, #614385 0%, #516395 100%)' },
        { name: 'Frost', value: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
        { name: 'Sunset', value: 'linear-gradient(to right, #ff7e5f, #feb47b)' },
        { name: 'Neon', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
        { name: 'Royal', value: 'linear-gradient(to right, #141e30, #243b55)' },
        { name: 'Peach', value: 'linear-gradient(to right, #ffecd2, #fcb69f)' },
        { name: 'Lush', value: 'linear-gradient(to right, #56ab2f, #a8e063)' },
        { name: 'Fire', value: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)' },
        { name: 'Cosmic', value: 'linear-gradient(135deg, #ff9a8b 0%, #ff6a88 55%, #ff99ac 100%)' },
    ];

    const gradientOptions = gradients.map(g => ({ value: g.value, name: g.name }));

    const solidColors = [
        { name: 'Slate', value: '#64748b' }, { name: 'Indigo', value: '#4f46e5' },
        { name: 'Purple', value: '#7c3aed' }, { name: 'Pink', value: '#ec4899' },
        { name: 'Rose', value: '#f43f5e' }, { name: 'Red', value: '#ef4444' },
        { name: 'Orange', value: '#f97316' }, { name: 'Amber', value: '#f59e0b' },
        { name: 'Yellow', value: '#eab308' }, { name: 'Lime', value: '#84cc16' },
        { name: 'Green', value: '#22c55e' }, { name: 'Emerald', value: '#10b981' },
        { name: 'Teal', value: '#14b8a6' }, { name: 'Cyan', value: '#06b6d4' },
        { name: 'Sky', value: '#0ea5e9' }, { name: 'Blue', value: '#3b82f6' },
        { name: 'Violet', value: '#8b5cf6' }, { name: 'Fuchsia', value: '#d946ef' },
        { name: 'Gray', value: '#6b7280' }, { name: 'Stone', value: '#78716c' },
    ];

    const solidColorOptions = solidColors.map(c => ({ value: c.value, name: c.name }));

    const readyImages = [
        { name: 'Marble White', url: 'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=800' },
        { name: 'Abstract Purple', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800' },
        { name: 'Gradient Mesh', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800' },
        { name: 'Dark Nebula', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800' },
        { name: 'Pink Marble', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe3b?w=800' },
        { name: 'Aurora', url: 'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?w=800' },
        { name: 'Cosmic Dust', url: 'https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?w=800' },
        { name: 'Liquid Flow', url: 'https://images.unsplash.com/photo-1557682257-2f9c97a8d469?w=800' },
        { name: 'Pastel Dream', url: 'https://images.unsplash.com/photo-1557683311-973673baf926?w=800' },
        { name: 'Blue Fog', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
    ];

    const imageOptions = readyImages.map(img => ({ value: img.url, name: img.name }));

    const bgTypeOptions = [
        { value: 'Gradient', name: 'Gradient' },
        { value: 'Solid', name: 'Solid Colors' },
        { value: 'ReadyImage', name: 'Images (Ready-to-use)' },
        { value: 'Upload', name: 'Image (Upload)' },
        { value: 'None', name: 'No background' }
    ];

    const positionOptions = [
        { value: 'top-left', name: 'Top Left' },
        { value: 'top-right', name: 'Top Right' },
        { value: 'bottom-left', name: 'Bottom Left' },
        { value: 'bottom-right', name: 'Bottom Right' }
    ];

    const watermarkTypeOptions = [
        { value: 'Text Only', name: 'Text Only' },
        { value: 'Avatar + Text', name: 'Avatar + Text' },
        { value: 'Twitter Handle', name: 'Twitter Handle' }
    ];

    const qualityOptions = [
        { value: '1', name: '1x' },
        { value: '2', name: '2x' },
        { value: '3', name: '3x' },
        { value: '4', name: '4x' }
    ];

    const tabSizeOptions = [
        { value: '2', name: '2' },
        { value: '4', name: '4' },
        { value: '8', name: '8' }
    ];

    const fontSizeOptions = [12, 14, 16, 18, 20, 24].map(s => ({ value: s.toString(), name: `${s}px` }));

    const aspectOptions = [
        { value: 'Wide', name: 'Wide' },
        { value: 'Compact', name: 'Compact' },
        { value: 'Square', name: 'Square' }
    ];

    const handleExport = async (type) => {
        if (!canvasRef.current) return;
        try {
            const { toPng, toBlob } = await import('html-to-image');
            const options = { quality: 1, pixelRatio: quality };

            if (type === 'download') {
                const dataUrl = await toPng(canvasRef.current, options);
                const link = document.createElement('a');
                link.download = `${fileName}.png`;
                link.href = dataUrl;
                link.click();
                toast.success('Image downloaded!', { duration: 1500 });
            } else {
                const blob = await toBlob(canvasRef.current, options);
                await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
                toast.success('Image copied to clipboard!', { duration: 1500 });
            }
        } catch (err) { 
            console.error("Export failed", err);
            toast.error('Export failed!', { duration: 1500 });
        }
        setExportOpen(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB', { duration: 1500 });
                return;
            }
            const url = URL.createObjectURL(file);
            setUploadedImg(url);
            setBgValue(url);
            toast.success('Image uploaded!', { duration: 1500 });
        }
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Avatar size should be less than 2MB', { duration: 1500 });
                return;
            }
            setAvatar(URL.createObjectURL(file));
            toast.success('Avatar uploaded!', { duration: 1500 });
        }
    };

    const getBackgroundStyle = () => {
        if (bgType === 'None') return { background: 'transparent' };
        if (bgType === 'Solid') return { backgroundColor: bgValue };
        if (bgType === 'Gradient') return { background: bgValue };
        if (bgType === 'Upload' && uploadedImg) return { backgroundImage: `url(${uploadedImg})`, backgroundSize: 'cover', backgroundPosition: 'center' };
        if (bgType === 'ReadyImage') return { backgroundImage: `url(${bgValue})`, backgroundSize: 'cover', backgroundPosition: 'center' };
        return {};
    };

    const getPosClass = () => {
        const positions = { 'top-left': 'top-4 left-4', 'top-right': 'top-4 right-4', 'bottom-left': 'bottom-4 left-4', 'bottom-right': 'bottom-4 right-4' };
        return positions[watermarkPos] || positions['bottom-left'];
    };

    const lineNumbers = code.split('\n').map((_, i) => i + 1).join('\n');

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-2 md:p-10 font-manrope">
            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-20 transition-all">
                    <button onClick={() => setIsFullscreen(false)} className="absolute top-15 right-5 md:top-15 md:right-10 text-white hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={32} />
                    </button>
                    <div className="max-w-5xl w-full shadow-xl animate-in zoom-in-95 duration-300 overflow-auto">
                        <div style={{ padding: `${padding}px`, ...getBackgroundStyle() }} className={`mx-auto transition-all duration-300 flex items-center justify-center relative rounded-lg overflow-hidden ${aspect === 'Wide' ? 'w-full' : aspect === 'Compact' ? 'w-full md:w-3/4' : 'aspect-square max-w-lg'}`}>
                            <div style={{ boxShadow: shadow }} className="bg-[#1F2937] rounded-xl w-full flex flex-col relative overflow-hidden border border-[#374151]">
                                <div className="flex gap-1.5 p-4 bg-black/20">
                                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                                </div>
                                <div className="flex">
                                    {showLineNumbers && (
                                        <pre style={{ fontSize: `${fontSize}px`, fontFamily: `'${fontFamily}', monospace`, lineHeight: '1.6' }} className="p-4 md:p-6 pr-2 text-right text-[#6B7280] select-none border-r border-white/5">{lineNumbers}</pre>
                                    )}
                                    <pre style={{ fontSize: `${fontSize}px`, fontFamily: `'${fontFamily}', monospace`, tabSize: tabSize, lineHeight: '1.6' }} className="w-full h-full p-4 md:p-6 text-[#E5E7EB] whitespace-pre-wrap">{code}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={`max-w-5xl mx-auto space-y-6 transition-all duration-500 ${isFullscreen ? 'blur-xl grayscale' : ''}`}>

                {/* Main Controls */}
                <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-end">
                    <div className="flex-1 space-y-1">
                        <label className="text-xs font-bold text-[#6B7280] uppercase">Language</label>
                        <CustomSelect
                            label=""
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            options={languageOptions}
                            searchable={true}
                            size="md"
                        />
                    </div>
                    <div className="flex-1 space-y-1">
                        <label className="text-xs font-bold text-[#6B7280] uppercase">Theme</label>
                        <CustomSelect
                            label=""
                            value={themeKey}
                            onChange={(e) => setThemeKey(e.target.value)}
                            options={availableThemes}
                            searchable={true}
                            size="md"
                        />
                    </div>
                    <div className="flex-1 space-y-1">
                        <label className="text-xs font-bold text-[#6B7280] uppercase">File Name</label>
                        <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="Untitled" className="w-full h-11.5 bg-white border border-[#E5E7EB] rounded-lg px-4 outline-none focus:ring-2 focus:ring-[#3B82F6]/20 text-[#111827]" />
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }} className="h-11.5 px-6 border border-[#3B82F6] text-[#3B82F6] rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#F9FAFB] transition-colors relative">
                        <ImEqualizer /> Settings
                    </button>
                </div>

                {/* Preview Area */}
                <div className="relative min-h-75 md:min-h-125 flex items-center justify-center bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-4 md:p-12 overflow-hidden">
                    <div className="w-full overflow-x-auto py-4 flex justify-center items-center custom-scrollbar">
                        <div ref={canvasRef} style={{ padding: `${padding}px`, ...getBackgroundStyle() }} className={`transition-all duration-300 flex items-center justify-center relative shrink-0 ${aspect === 'Wide' ? 'w-full min-w-150 md:min-w-0' : aspect === 'Compact' ? 'w-[80%] min-w-125 md:min-w-0' : 'aspect-square w-125'}`}>
                            {isWatermarkEnabled && bgType !== 'None' && (
                                <div className={`absolute ${getPosClass()} flex items-center gap-2 transition-all z-10`} style={{ color: watermarkColor }}>
                                    {watermarkType === 'Avatar + Text' && avatar && <img src={avatar} alt="avatar" className="w-6 h-6 rounded-full object-cover border border-white/20" />}
                                    {watermarkType === 'Twitter Handle' && <FaSquareXTwitter size={14} fill="currentColor" />}
                                    <span className="text-xs font-bold opacity-80 tracking-tight">{watermarkType === 'Twitter Handle' && !watermark.startsWith('@') ? `@${watermark}` : watermark}</span>
                                </div>
                            )}
                            <div style={{ boxShadow: shadow }} className="bg-[#1F2937] rounded-xl w-full flex flex-col relative overflow-hidden transition-all duration-300 border border-[#374151]">
                                <div className="flex gap-1.5 p-4 bg-black/20">
                                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                                </div>
                                <div className="relative">
                                    <textarea value={code} onChange={(e) => setCode(e.target.value)} spellCheck="false" className="absolute inset-0 w-full h-full p-6 bg-transparent text-transparent caret-white outline-none resize-none z-10 leading-[1.6] overflow-hidden whitespace-pre" style={{ fontSize: `${fontSize}px`, fontFamily: `'${fontFamily}', monospace`, paddingLeft: showLineNumbers ? '55px' : '24px' }} />
                                    
                                    {Highlighter && themes ? (
                                        <Highlighter
                                            language={language}
                                            style={themes[themeKey]}
                                            showLineNumbers={showLineNumbers}
                                            lineNumberStyle={{
                                                minWidth: '3em',
                                                paddingRight: '1em',
                                                color: '#6B7280',
                                                textAlign: 'right',
                                                opacity: 0.5,
                                                fontFamily: `'${fontFamily}', monospace`
                                            }}
                                            customStyle={{
                                                margin: 0,
                                                padding: '24px',
                                                fontSize: `${fontSize}px`,
                                                lineHeight: '1.6',
                                                background: 'transparent'
                                            }}
                                            codeTagProps={{
                                                style: {
                                                    fontFamily: `'${fontFamily}', monospace`,
                                                    fontSize: `${fontSize}px`
                                                }
                                            }}
                                        >
                                            {code}
                                        </Highlighter>
                                    ) : (
                                        <pre style={{ padding: '24px', fontSize: `${fontSize}px`, fontFamily: `'${fontFamily}', monospace`, color: '#fff' }}>{code}</pre>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings Panel */}
                    {showSettings && (
                        <div ref={settingsRef} className="absolute top-2 right-2 bottom-2 w-70 md:w-85 bg-white shadow-2xl rounded-2xl border border-[#E5E7EB] z-120 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-5 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#6B7280] uppercase">Font Family</label>
                                    <CustomSelect
                                        label=""
                                        value={fontFamily}
                                        onChange={(e) => setFontFamily(e.target.value)}
                                        options={fontOptions}
                                        searchable={true}
                                        size="md"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[#6B7280] uppercase">Font Size</label>
                                        <CustomSelect
                                            label=""
                                            value={fontSize.toString()}
                                            onChange={(e) => setFontSize(Number(e.target.value))}
                                            options={fontSizeOptions}
                                            searchable={false}
                                            size="md"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[#6B7280] uppercase">Tab Size</label>
                                        <CustomSelect
                                            label=""
                                            value={tabSize.toString()}
                                            onChange={(e) => setTabSize(Number(e.target.value))}
                                            options={tabSizeOptions}
                                            searchable={false}
                                            size="md"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[#6B7280] uppercase">Quality</label>
                                        <CustomSelect
                                            label=""
                                            value={quality.toString()}
                                            onChange={(e) => setQuality(Number(e.target.value))}
                                            options={qualityOptions}
                                            searchable={false}
                                            size="md"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-[#6B7280] uppercase">Shadow</label>
                                        <CustomSelect
                                            label=""
                                            value={shadow}
                                            onChange={(e) => setShadow(e.target.value)}
                                            options={shadowOptions}
                                            searchable={true}
                                            size="md"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-[#6B7280] uppercase">Padding</label>
                                        <span className="text-xs font-bold text-[#3B82F6] bg-[#F9FAFB] px-2 py-0.5 rounded border border-[#E5E7EB]">
                                            {padding}px
                                        </span>
                                    </div>
                                    <input type="range" min="20" max="140" value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="w-full accent-[#3B82F6] h-1 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer" />
                                </div>
                                <label className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-xl cursor-pointer hover:bg-[#F3F4F6] border border-[#E5E7EB]">
                                    <span className="text-sm font-bold text-[#111827]">Line Numbers</span>
                                    <input type="checkbox" checked={showLineNumbers} onChange={(e) => setShowLineNumbers(e.target.checked)} className="w-4 h-4 accent-[#3B82F6]" />
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls Bar */}
                <div className="flex flex-col md:grid md:grid-cols-3 gap-6 items-center py-4 border-b border-[#E5E7EB]">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#111827] cursor-pointer">
                        <input type="checkbox" checked={isWatermarkEnabled} onChange={(e) => setIsWatermarkEnabled(e.target.checked)} className="w-5 h-5 accent-[#3B82F6]" /> Add Watermark
                    </label>
                    <div className="flex justify-center gap-4 md:gap-8">
                        {aspectOptions.map((item) => (
                            <label key={item.value} className="flex items-center gap-2 text-sm font-bold text-[#6B7280] cursor-pointer hover:text-[#3B82F6] transition-colors">
                                <input type="radio" name="aspect" checked={aspect === item.value} onChange={() => setAspect(item.value)} className="w-4 h-4 accent-[#3B82F6]" /> {item.name}
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-center md:justify-end">
                        <button onClick={() => setIsFullscreen(true)} className="flex items-center gap-2 text-sm font-bold text-[#6B7280] hover:text-[#3B82F6] transition-colors">
                            <Maximize size={16} /> Fullscreen Preview
                        </button>
                    </div>
                </div>

                {/* Watermark Settings */}
                {isWatermarkEnabled && (
                    <div className="bg-[#F9FAFB] p-4 md:p-6 rounded-lg border border-[#E5E7EB] animate-in slide-in-from-top-4 duration-300">
                        <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-4">Watermark Settings</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#6B7280] uppercase">Position</label>
                                <CustomSelect
                                    label=""
                                    value={watermarkPos}
                                    onChange={(e) => setWatermarkPos(e.target.value)}
                                    options={positionOptions}
                                    searchable={false}
                                    size="md"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#6B7280] uppercase">Type</label>
                                <CustomSelect
                                    label=""
                                    value={watermarkType}
                                    onChange={(e) => setWatermarkType(e.target.value)}
                                    options={watermarkTypeOptions}
                                    searchable={false}
                                    size="md"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#6B7280] uppercase">Avatar</label>
                                <div className="relative">
                                    <input type="file" onChange={handleAvatarUpload} disabled={watermarkType !== 'Avatar + Text'} className="hidden" id="avatar-up" />
                                    <label htmlFor="avatar-up" className={`h-12 w-full bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-center gap-2 text-sm cursor-pointer ${watermarkType !== 'Avatar + Text' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#F9FAFB]'}`}>
                                        <Upload size={14} /> {avatar ? 'Change' : 'Upload'}
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#6B7280] uppercase">{watermarkType === 'Twitter Handle' ? 'Twitter User' : 'Name'}</label>
                                <input type="text" value={watermark} onChange={(e) => setWatermark(e.target.value)} className="h-12 w-full bg-white border border-[#E5E7EB] rounded-lg px-4 outline-none text-[#111827]" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#6B7280] uppercase">Color</label>
                                <div className="h-12 bg-white border border-[#E5E7EB] rounded-lg px-2 flex items-center gap-2">
                                    <input type="color" value={watermarkColor} onChange={(e) => setWatermarkColor(e.target.value)} className="w-9 h-9 border-none bg-transparent cursor-pointer" />
                                    <span className="uppercase text-sm font-bold text-[#111827]">{watermarkColor}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Background & Export */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 pt-4">
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        {/* Background Type Selector */}
                        <div className="flex flex-col gap-1 flex-1 min-w-50">
                            <label className="text-xs font-bold text-[#6B7280] uppercase">Background Type</label>
                            <CustomSelect
                                label=""
                                value={bgType}
                                onChange={(e) => { 
                                    const newType = e.target.value; 
                                    setBgType(newType); 
                                    if (newType === 'Gradient') setBgValue(gradients[0]?.value || ''); 
                                    if (newType === 'Solid') setBgValue(solidColors[0]?.value || ''); 
                                    if (newType === 'ReadyImage') setBgValue(readyImages[0]?.url || ''); 
                                    if (newType === 'Upload' || newType === 'None') setBgValue(''); 
                                }}
                                options={bgTypeOptions}
                                searchable={false}
                                size="md"
                            />
                        </div>
                        
                        {/* Dynamic Style Selector based on bgType */}
                        {bgType !== 'None' && (
                            <div className="flex flex-col gap-1 flex-1 min-w-50">
                                <label className="text-xs font-bold text-[#6B7280] uppercase">
                                    {bgType === 'Upload' ? 'Select Image' : 'Pick Style'}
                                </label>
                                {bgType === 'Upload' ? (
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageUpload} 
                                        className="h-12 w-full bg-white border border-[#E5E7EB] rounded-lg px-2 text-sm file:mr-4 file:py-1 file:mt-2.5 file:px-3 file:rounded file:border-0 file:bg-[#F9FAFB] file:text-[#3B82F6] hover:file:bg-[#F3F4F6]"
                                    />
                                ) : (
                                    <CustomSelect
                                        label=""
                                        value={bgValue}
                                        onChange={(e) => setBgValue(e.target.value)}
                                        options={
                                            bgType === 'Gradient' ? gradientOptions :
                                            bgType === 'Solid' ? solidColorOptions :
                                            bgType === 'ReadyImage' ? imageOptions : []
                                        }
                                        searchable={true}
                                        size="md"
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Export Button */}
                    <div className="relative w-full md:w-auto">
                        <button 
                            onClick={() => setExportOpen(!exportOpen)} 
                            className="h-14 w-full md:w-auto bg-[#3B82F6] text-white px-10 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-[#2776f5] transition-all"
                        >
                            Export Image <ChevronDown size={20} className={exportOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                        </button>
                        {exportOpen && (
                            <div className="absolute bottom-16 right-0 w-full md:w-64 bg-white rounded-xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-50 py-2">
                                <button onClick={() => handleExport('download')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#111827] hover:bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                    <Download size={18} className="text-[#3B82F6]" /> Download Image
                                </button>
                                <button onClick={() => handleExport('copy')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#111827] hover:bg-[#F9FAFB]">
                                    <Copy size={18} className="text-[#3B82F6]" /> Copy to Clipboard
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeToImage;