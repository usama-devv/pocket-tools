import { useState } from 'react';
import { Sparkles, MonitorPlay, Download, ChevronDown, Check, Loader2, X, Copy } from 'lucide-react';
import { fetchAIColors } from '../api/colorGenerateApi';
import CustomSelect from '../components/CustomSelect';
import toast from 'react-hot-toast';

const AIColorGenerator = () => {
    const [config, setConfig] = useState({ theme: "Light", prompt: "" });
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    const [colors, setColors] = useState(null);
    const [copiedText, setCopiedText] = useState("");

    // Theme options for CustomSelect
    const themeOptions = [
        { value: "Light", name: "Light" },
        { value: "Dark", name: "Dark" }
    ];

    const handleQuickCopy = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        toast.success('Copied!', { duration: 1500 });
        setTimeout(() => setCopiedText(""), 2000);
    };

    const handleGenerate = async () => {
        if (!config.prompt || config.prompt.trim() === '') {
            toast.error("Please enter a prompt first!", { duration: 1500 });
            return;
        }

        setLoading(true);
        try {
            const data = await fetchAIColors(config.prompt, config.theme);
            setColors(data);
            toast.success("Palette generated successfully!", { duration: 1500 });
        } catch (err) {
            toast.error(err.message || "Generation failed!", { duration: 1500 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-10 font-manrope">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* ROW 1: Input & Dropdown/Button */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-7 relative">
                        <div className="border border-[#E5E7EB] rounded-lg px-4 py-2 bg-white focus-within:ring-2 focus-within:ring-[#3B82F6] transition-all">
                            <label className="block text-xs font-medium text-[#6B7280] mb-1">Prompt</label>
                            <input
                                type="text"
                                value={config.prompt}
                                onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
                                placeholder="Enter prompt to generate color palette..."
                                className="w-full outline-none text-[#111827] bg-transparent"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-5 flex gap-3">
                        <div className="flex-1">
                            <CustomSelect
                                label="Theme"
                                value={config.theme}
                                onChange={(e) => setConfig({ ...config, theme: e.target.value })}
                                options={themeOptions}
                                searchable={false}
                                size="md"
                            />
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="bg-[#3B82F6] hover:bg-[#2776f5] text-white px-8 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-[#3B82F6]/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                            Generate
                        </button>
                    </div>
                </div>

                {/* ROW 2: Color Palette Boxes */}
                <div className="text-center space-y-4">
                    <h3 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider">Color Palette</h3>
                    <div className="flex flex-wrap justify-center">
                        {(colors?.palette || Array(12).fill("#E5E7EB")).map((color, i) => (
                            <div
                                key={i}
                                style={{ backgroundColor: color }}
                                className="w-6 h-6 md:w-10 md:h-10 border border-[#E5E7EB] first:rounded-l-lg last:rounded-r-lg transition-colors duration-500"
                            />
                        ))}
                    </div>
                </div>

                {/* ROW 3 & 4: 2x2 Grid Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['Primary', 'Accent', 'Background', 'Text'].map((label) => {
                        const colorData = colors?.main[label.toLowerCase()];
                        return (
                            <div key={label} className="space-y-2">
                                <span className="text-sm font-semibold text-[#6B7280]">{label}</span>
                                <div className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden flex h-35">
                                    {/* Section 1: Color Preview / Loader */}
                                    <div
                                        style={{ backgroundColor: colorData?.hex || '#F9FAFB' }}
                                        className="w-1/3 flex items-center justify-center border-r border-[#E5E7EB] transition-colors duration-500"
                                    >
                                        {!colorData && (
                                            loading ? <Loader2 className="animate-spin text-[#3B82F6]" size={32} /> : <span className="text-6xl text-[#9CA3AF] font-light">?</span>
                                        )}
                                    </div>
                                    {/* Section 2 & 3: HEX and RGBA Details */}
                                    <div className="w-2/3 p-6 flex flex-col justify-center space-y-4">
                                        {/* HEX Row */}
                                        <div className="group relative">
                                            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Hex</p>
                                            <div
                                                onClick={() => handleQuickCopy(colorData?.hex)}
                                                className="flex items-center gap-2 cursor-pointer group/item"
                                            >
                                                <p className="text-lg font-mono font-bold text-[#111827] transition-colors group-hover/item:text-[#3B82F6]">
                                                    {colorData?.hex || "—"}
                                                </p>
                                                <div className="opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity">
                                                    {copiedText === colorData?.hex ? (
                                                        <Check className="w-4 h-4 text-[#10B981]" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-[#6B7280] hover:text-[#3B82F6]" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* RGBA Row */}
                                        <div className="group relative">
                                            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">RGBA</p>
                                            <div
                                                onClick={() => handleQuickCopy(colorData?.rgba)}
                                                className="flex items-center gap-2 cursor-pointer group/item"
                                            >
                                                <p className="text-sm font-mono text-[#6B7280] transition-colors group-hover/item:text-[#3B82F6]">
                                                    {colorData?.rgba || "—"}
                                                </p>
                                                <div className="opacity-100 md:opacity-0 md:group-hover/item:opacity-100 transition-opacity">
                                                    {copiedText === colorData?.rgba ? (
                                                        <Check className="w-4 h-4 text-[#10B981]" />
                                                    ) : (
                                                        <Copy className="w-4 h-4 text-[#6B7280] hover:text-[#3B82F6]" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* LAST ROW: Action Buttons */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={!colors}
                        className="border-2 border-[#3B82F6] text-[#3B82F6] px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-[#F9FAFB] transition-all w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MonitorPlay size={20} /> Preview on Design
                    </button>
                    <button
                        onClick={() => setIsExportOpen(true)}
                        disabled={!colors}
                        className="bg-[#3B82F6] hover:bg-[#2776f5] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-[#3B82F6]/20 transition-all w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download size={20} /> Export Colors
                    </button>
                </div>
            </div>
            {/* Modal Component Call */}
            <PreviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                colors={colors}
            />
            <ExportModal
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                colors={colors}
            />
        </div>
    );
};

const PreviewModal = ({ isOpen, onClose, colors }) => {
    if (!isOpen || !colors) return null;

    const { primary, accent, background, text } = colors.main;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <div
                className="w-full max-w-lg overflow-hidden rounded-lg shadow-xl transition-all animate-in zoom-in duration-300 border border-[#E5E7EB]"
                style={{ backgroundColor: background.hex }}
            >
                <div className="p-8 md:p-12 text-center">
                    {/* Main Heading */}
                    <h2
                        className="mb-4 text-xl md:text-2xl font-semibold leading-relaxed"
                        style={{ color: text.hex }}
                    >
                        This is a dialog box colored with the AI-generated color palette.
                        <br />
                        <span className="text-sm md:text-base font-normal opacity-80">
                            Both of the buttons below will close the dialog.
                        </span>
                    </h2>

                    {/* Buttons Group */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        {/* Cancel Button (Accent Color) */}
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-8 py-3 rounded-full font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-lg"
                            style={{ backgroundColor: accent.hex }}
                        >
                            Cancel
                        </button>

                        {/* Confirm Button (Primary Color) */}
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-8 py-3 rounded-full font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-lg"
                            style={{ backgroundColor: primary.hex }}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ExportModal = ({ isOpen, onClose, colors }) => {
    const [activeTab, setActiveTab] = useState('css');
    const [copied, setCopied] = useState(false);

    if (!isOpen || !colors) return null;

    const { primary, accent, background, text } = colors.main;

    // Format 1: CSS Variables Logic
    const generateCSSVariables = () => {
        return `:root {
  --primary-100: ${primary.hex};
  --primary-200: ${primary.hex}cc;
  --primary-300: ${primary.hex}99;
  --accent-100: ${accent.hex};
  --accent-200: ${accent.hex}cc;
  --accent-300: ${accent.hex}99;
  --background-100: ${background.hex};
  --background-200: ${background.hex}cc;
  --background-300: ${background.hex}99;
  --text-100: ${text.hex};
  --text-200: ${text.hex}cc;
  --text-300: ${text.hex}99;
}`;
    };

    // Format 2: Free Text Logic 
    const generateFreeText = () => {
        return `Primary-100: ${primary.hex};
Primary-200: ${primary.hex};
Primary-300: ${primary.hex};
Accent-100: ${accent.hex};
Accent-200: ${accent.hex};
Accent-300: ${accent.hex};
Background-100: ${background.hex};
Background-200: ${background.hex};
Background-300: ${background.hex};
Text-100: ${text.hex};
Text-200: ${text.hex};
Text-300: ${text.hex};`;
    };

    const handleCopy = () => {
        const textToCopy = activeTab === 'css' ? generateCSSVariables() : generateFreeText();
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        toast.success('Copied!', { duration: 1500 });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-lg shadow-xl flex flex-col max-h-[75vh] overflow-hidden animate-in fade-in zoom-in duration-200 border border-[#E5E7EB]">

                {/* Header with Tabs  */}
                <div className="relative flex items-center justify-center p-3 border-b border-[#E5E7EB]">
                    {/* Tabs Container */}
                    <div className="flex bg-[#F3F4F6] p-1 rounded-xl w-70">
                        <button
                            onClick={() => setActiveTab('css')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all text-center ${
                                activeTab === 'css' 
                                    ? 'bg-[#3B82F6] text-white shadow-md' 
                                    : 'text-[#6B7280] hover:text-[#111827]'
                            }`}
                        >
                            CSS Variables
                        </button>
                        <button
                            onClick={() => setActiveTab('free')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all text-center ${
                                activeTab === 'free' 
                                    ? 'bg-[#3B82F6] text-white shadow-md' 
                                    : 'text-[#6B7280] hover:text-[#111827]'
                            }`}
                        >
                            Free Text
                        </button>
                    </div>

                    {/* Close Icon */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 p-2 hover:bg-[#F9FAFB] rounded-full text-[#6B7280] hover:text-[#EF4444]"
                    >
                        <X className='w-6 h-6 stroke-3' />
                    </button>
                </div>

                {/* Code Content Area */}
                <div className="p-4 bg-[#F9FAFB] flex-1 overflow-y-auto font-mono text-sm">
                    <div className="bg-white p-5 rounded-lg border border-[#E5E7EB] min-h-75 whitespace-pre-wrap">
                        {activeTab === 'css' ? (
                            <pre className="text-[#111827]">
                                <span className="text-[#8B5CF6]">:root</span> {'{\n'}
                                <div className="pl-4">
                                    {generateCSSVariables().split('\n').slice(1, -1).map((line, i) => (
                                        <div key={i} className="py-0.5">
                                            <span className="text-[#6B7280]">{line.split(':')[0]}:</span>
                                            <span className="text-[#3B82F6]">{line.split(':')[1]}</span>
                                        </div>
                                    ))}
                                </div>
                                {'}'}
                            </pre>
                        ) : (
                            <pre className="text-[#111827] leading-relaxed">
                                {generateFreeText().split('\n').map((line, i) => (
                                    <div key={i} className="py-0.5">
                                        <span className="text-[#6B7280]">{line.split(':')[0]}:</span>
                                        <span className="text-[#3B82F6] ml-1">{line.split(':')[1]}</span>
                                    </div>
                                ))}
                            </pre>
                        )}
                    </div>
                </div>

                {/* Footer with Dynamic Button Text */}
                <div className="p-4 flex justify-center bg-white border-t border-[#E5E7EB]">
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white transition-all transform active:scale-95 shadow-lg ${
                            copied 
                                ? 'bg-[#10B981] hover:bg-[#059669]' 
                                : 'bg-[#3B82F6] hover:bg-[#2776f5]'
                        }`}
                    >
                        <Copy className='w-4 h-4' />
                        {copied
                            ? 'Copied!'
                            : activeTab === 'css'
                                ? 'Copy CSS'
                                : 'Copy Colors'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIColorGenerator;