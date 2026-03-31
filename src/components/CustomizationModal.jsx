import { useState } from 'react';
import { X, Palette, Code, Copy, Check, Settings, Eye } from 'lucide-react';
import CustomSelect from './CustomSelect';
import toast from 'react-hot-toast';

const CustomizationModal = ({ isOpen, onClose, loader, settings, setSettings }) => {
    const [activeTab, setActiveTab] = useState('customize');
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    // Size options for CustomSelect
    const sizeOptions = [
        { value: 'small', name: 'Small' },
        { value: 'medium', name: 'Medium' },
        { value: 'large', name: 'Large' }
    ];

    // Speed options for CustomSelect
    const speedOptions = [
        { value: '2s', name: 'Slow (2s)' },
        { value: '1.5s', name: 'Average (1.5s)' },
        { value: '1s', name: 'Fast (1s)' },
        { value: '0.5s', name: 'Very Fast (0.5s)' }
    ];

    // Size numeric conversion for calculations
    const sizeMap = { small: 30, medium: 50, large: 80 };
    const currentSize = sizeMap[settings.size] || 50;

    // Generate Dynamic Code for "Get Code" tab
    const generatedCss = loader?.getCss 
        ? loader.getCss(settings.primaryColor, settings.secondaryColor, currentSize, settings.speed)
        : "";

    const handleCopy = () => {
        const fullCode = `/* CSS */\n${generatedCss}\n\n\n${loader?.html}`;
        navigator.clipboard.writeText(fullCode);
        setCopied(true);
        
        toast.success('Code copied to clipboard!', {
            duration: 2000,
            position: 'top-right',
            icon: '📋',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });
        
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/60 backdrop-blur-sm p-0 md:p-4 font-manrope">
            <div className="bg-[#FFFFFF] rounded-none md:rounded-2xl shadow-2xl w-full h-full md:h-auto md:max-w-3xl flex flex-col md:max-h-[80vh] relative overflow-hidden border border-[#E5E7EB]">

                {/* --- TABS HEADER --- */}
                <div className="flex justify-center items-center p-4 border-b border-[#E5E7EB] relative shrink-0 bg-[#F9FAFB]">
                    <div className="flex bg-[#FFFFFF] p-1 rounded-lg border border-[#E5E7EB]">
                        <button
                            onClick={() => setActiveTab('customize')}
                            className={`flex items-center gap-2 px-4 md:px-9 py-2 md:py-3 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                                activeTab === 'customize' 
                                    ? 'bg-[#3B82F6] text-[#FFFFFF] shadow-md' 
                                    : 'text-[#6B7280] hover:text-[#3B82F6]'
                            }`}
                        >
                            <Palette className="w-4 h-4" />
                            Customize
                        </button>
                        <button
                            onClick={() => setActiveTab('code')}
                            className={`flex items-center gap-2 px-4 md:px-9 py-2 md:py-3 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                                activeTab === 'code' 
                                    ? 'bg-[#3B82F6] text-[#FFFFFF] shadow-md' 
                                    : 'text-[#6B7280] hover:text-[#3B82F6]'
                            }`}
                        >
                            <Code className="w-4 h-4" />
                            Get the code
                        </button>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="absolute right-4 md:right-6 text-[#6B7280] hover:text-[#EF4444] transition-colors p-2 rounded-full hover:bg-[#FEE2E2]"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">

                    {/* --- LEFT: PREVIEW AREA --- */}
                    <div className="flex-1 flex flex-col items-center justify-center bg-linear-to-br from-[#FFFFFF] to-[#F9FAFB] p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#E5E7EB] min-h-75 md:min-h-0">
                        <div className="relative flex items-center justify-center min-h-32 md:min-h-50">
                            {/* Dynamic CSS Injection */}
                            <style>{generatedCss}</style>

                            {/* Real Loader Rendering */}
                            {loader ? (
                                <div
                                    dangerouslySetInnerHTML={{ __html: loader.html }}
                                    className="transition-all"
                                />
                            ) : (
                                <div className="w-12 h-12 border-4 border-[#E5E7EB] border-t-[#3B82F6] rounded-full animate-spin"></div>
                            )}
                        </div>

                        <div className="mt-8 md:mt-12 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Eye className="w-4 h-4 text-[#3B82F6]" />
                                <p className="text-[#6B7280] text-[10px] md:text-xs font-bold uppercase tracking-widest">
                                    Live Preview
                                </p>
                            </div>
                            <h3 className="text-[#111827] font-bold text-base md:text-lg">{loader?.name || "Loading..."}</h3>
                        </div>
                    </div>

                    {/* --- RIGHT: CONTROLS --- */}
                    <div className="w-full md:w-80 bg-[#F9FAFB] p-6 overflow-y-auto">
                        {activeTab === 'customize' ? (
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
                                    <Settings className="w-4 h-4 text-[#3B82F6]" />
                                    <h4 className="text-sm font-bold text-[#111827]">Customization Options</h4>
                                </div>

                                {/* Primary Color */}
                                <div>
                                    <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">
                                        Primary Color
                                    </label>
                                    <div className="flex items-center gap-2 p-1.5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg hover:border-[#3B82F6] transition-colors">
                                        <input
                                            type="color"
                                            value={settings.primaryColor}
                                            onChange={(e) => handleChange('primaryColor', e.target.value)}
                                            className="w-8 h-8 rounded cursor-pointer border-2 border-[#E5E7EB]"
                                        />
                                        <span className="flex-1 text-[#0B1220] font-mono text-sm uppercase px-2">
                                            {settings.primaryColor}
                                        </span>
                                    </div>
                                </div>

                                {/* Secondary Color */}
                                <div>
                                    <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">
                                        Secondary Color
                                    </label>
                                    <div className="flex items-center gap-2 p-1.5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg hover:border-[#3B82F6] transition-colors">
                                        <input
                                            type="color"
                                            value={settings.secondaryColor}
                                            onChange={(e) => handleChange('secondaryColor', e.target.value)}
                                            className="w-8 h-8 rounded cursor-pointer border-2 border-[#E5E7EB]"
                                        />
                                        <span className="flex-1 text-[#0B1220] font-mono text-sm uppercase px-2">
                                            {settings.secondaryColor}
                                        </span>
                                    </div>
                                </div>

                                {/* Size Select with CustomSelect */}
                                <div>
                                    <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">
                                        Size
                                    </label>
                                    <CustomSelect
                                        label=""
                                        value={settings.size}
                                        onChange={(e) => handleChange('size', e.target.value)}
                                        options={sizeOptions}
                                        searchable={false}
                                        size="md"
                                    />
                                </div>

                                {/* Speed Select with CustomSelect */}
                                <div>
                                    <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">
                                        Animation Speed
                                    </label>
                                    <CustomSelect
                                        label=""
                                        value={settings.speed}
                                        onChange={(e) => handleChange('speed', e.target.value)}
                                        options={speedOptions}
                                        searchable={false}
                                        size="md"
                                    />
                                </div>

                                {/* Current Settings Summary */}
                                <div className="mt-4 p-3 bg-[#FFFFFF] rounded-lg border border-[#E5E7EB]">
                                    <p className="text-xs text-[#6B7280] flex items-center justify-between">
                                        <span>Current Size:</span>
                                        <span className="font-bold text-[#3B82F6]">{currentSize}px</span>
                                    </p>
                                    <p className="text-xs text-[#6B7280] flex items-center justify-between mt-1">
                                        <span>Speed:</span>
                                        <span className="font-bold text-[#3B82F6]">{settings.speed}</span>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* --- CODE VIEW --- */
                            <div className="flex flex-col h-full">
                                <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB] mb-4">
                                    <Code className="w-4 h-4 text-[#3B82F6]" />
                                    <p className="text-[#111827] text-sm font-bold">Source Code</p>
                                </div>
                                
                                <div className="bg-[#111827] p-4 rounded-xl border border-[#374151] flex-1 overflow-auto max-h-75 shadow-inner">
                                    <pre className="text-[#10B981] font-mono text-[10px] md:text-xs whitespace-pre-wrap leading-relaxed">
                                        {`/* CSS */\n${generatedCss}\n\n/* HTML */\n${loader?.html}`}
                                    </pre>
                                </div>
                                
                                <button
                                    onClick={handleCopy}
                                    className={`mt-6 w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                                        copied 
                                            ? 'bg-[#10B981] text-[#FFFFFF] shadow-lg shadow-[#10B981]/20' 
                                            : 'bg-[#3B82F6] text-[#FFFFFF] hover:bg-[#2776f5] shadow-lg shadow-[#3B82F6]/20'
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
                                            Copy Everything
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomizationModal;