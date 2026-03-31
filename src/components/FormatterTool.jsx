import { useState, useEffect } from 'react';
import { RotateCcw, ChevronRight, ChevronsRight, Download, Copy, Loader2, Check, AlertCircle } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import toast from 'react-hot-toast';

const FormatterTool = ({ type, placeholder }) => {
    const [rawCode, setRawCode] = useState('');
    const [formattedCode, setFormattedCode] = useState('');
    const [indentSize, setIndentSize] = useState('2');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [beautifyLib, setBeautifyLib] = useState(null);

    // Dynamic import of js-beautify
    useEffect(() => {
        const loadBeautify = async () => {
            try {
                const beautify = await import('js-beautify');
                setBeautifyLib(beautify);
            } catch (err) {
                console.error('Failed to load beautify library:', err);
                setError('Failed to load formatter library. Please refresh the page.');
            }
        };
        loadBeautify();
    }, []);

    // Options for CustomSelect
    const indentOptions = [
        { value: '1', name: '1 space' },
        { value: '2', name: '2 spaces' },
        { value: '3', name: '3 spaces' },
        { value: '4', name: '4 spaces' },
        { value: '5', name: '5 spaces' }
    ];

    const validateCode = (code) => {
        const trimmed = code.trim();
        if (!trimmed) return null;

        if (type === 'html') {
            const isHtml = new RegExp('<[a-z/][\\s\\S]*>', 'i');
            if (!isHtml.test(trimmed)) return "Invalid HTML: No valid tags detected.";
        }
        else if (type === 'css') {
            const jsKeywords = ['function', 'const ', 'let ', 'var ', 'console.log', '=>'];
            if (jsKeywords.some(keyword => trimmed.includes(keyword))) {
                return "Format Error: This looks like JavaScript, not CSS.";
            }
            if (!trimmed.includes('{') || !trimmed.includes(':')) return "Invalid CSS: Missing selectors or properties.";
        }
        else if (type === 'js') {
            const htmlTagPattern = new RegExp('<[a-z/][\\s\\S]*>', 'i');
            if (htmlTagPattern.test(trimmed)) return "Format Error: HTML tags detected in JS Formatter.";
            const hasCssTraits = trimmed.includes('{') && trimmed.includes(':') && trimmed.includes(';');
            const hasJsTraits = ['function', 'const', 'let', 'var', 'if', 'for', 'return', 'console', '=>', 'import'].some(k => trimmed.includes(k));
            if (hasCssTraits && !hasJsTraits) {
                return "Format Error: This looks like CSS. Please use the CSS Formatter.";
            }
        }
        return null;
    };

    const handleFormat = () => {
        if (!rawCode.trim()) {
            toast.error('Please enter some code!', { duration: 1500 });
            return;
        }

        if (!beautifyLib) {
            toast.error('Formatter library not loaded. Please wait or refresh.', { duration: 1500 });
            return;
        }

        const validationError = validateCode(rawCode);
        if (validationError) {
            setError(validationError);
            setFormattedCode('');
            return;
        }

        setLoading(true);
        setError(null);

        const options = {
            indent_size: parseInt(indentSize),
            indent_char: " ",
            indent_inner_html: true,
            preserve_newlines: true,
            max_preserve_newlines: 2,
            brace_style: "collapse",
        };

        setTimeout(() => {
            try {
                let result = "";
                if (type === 'html') result = beautifyLib.html(rawCode, options);
                else if (type === 'css') result = beautifyLib.css(rawCode, options);
                else if (type === 'js') result = beautifyLib.js(rawCode, options);
                setFormattedCode(result);
                toast.success('Code formatted!', { duration: 1500 });
            } catch {
                setError("Formatting failed. Please check syntax.");
            } finally {
                setLoading(false);
            }
        }, 600);
    };

    const handleReset = () => {
        setRawCode('');
        setIndentSize('2');
        setFormattedCode('');
        setError(null);
        setCopied(false);
        toast.success('Reset done!', { duration: 1500 });
    };

    const handleCopy = () => {
        if (!formattedCode) {
            toast.error('Nothing to copy!', { duration: 1500 });
            return;
        }
        navigator.clipboard.writeText(formattedCode);
        setCopied(true);
        toast.success('Copied!', { duration: 1500 });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!formattedCode) {
            toast.error('Nothing to download!', { duration: 1500 });
            return;
        }
        const fileNames = { html: 'index.html', css: 'style.css', js: 'script.js' };
        const fileName = fileNames[type] || 'code.txt';
        const blob = new Blob([formattedCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Downloaded!', { duration: 1500 });
    };

    // --- Logic for Button States ---
    const isFormatDisabled = !rawCode.trim() || loading || !beautifyLib;
    const isActionDisabled = !formattedCode || !!error || loading;

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-2 md:p-10 font-manrope">
            <div className="max-w-5xl mx-auto space-y-6">

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_50px_1fr] gap-1 items-stretch">
                    <div className="flex flex-col gap-3">
                        <div className="w-full">
                            <label className="block text-xs font-semibold text-[#6B7280] mb-2">Indent Size</label>
                            <CustomSelect
                                label=""
                                value={indentSize}
                                onChange={(e) => setIndentSize(e.target.value)}
                                options={indentOptions}
                                searchable={false}
                                size="md"
                            />
                        </div>

                        <div className="h-85 flex flex-col bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
                            <div className="bg-white px-4 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-widest">Raw {type.toUpperCase()} Code</div>
                            <textarea
                                className={`flex-1 p-4 outline-none resize-none font-mono text-sm leading-relaxed text-[#111827] ${error ? 'bg-[#FEF2F2]' : ''}`}
                                placeholder={placeholder}
                                value={rawCode}
                                onChange={(e) => {
                                    setRawCode(e.target.value);
                                    if (error) setError(null);
                                    if (formattedCode) setFormattedCode('');
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center items-center pt-2">
                        <ChevronsRight className="hidden lg:block text-[#9CA3AF]" size={32} />
                        <ChevronsRight className="lg:hidden rotate-90 text-[#9CA3AF]" size={32} />
                    </div>

                    <div className="h-102 relative flex flex-col bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
                        <div className="bg-white px-4 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-widest">Formatted {type.toUpperCase()} Code</div>
                        <textarea
                            readOnly
                            className="flex-1 p-4 outline-none resize-none font-mono text-sm text-[#3B82F6] bg-[#F9FAFB]"
                            value={formattedCode}
                            placeholder={!beautifyLib ? "Loading formatter library..." : "Result will appear here..."}
                        />
                        {error && (
                            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in zoom-in duration-200">
                                <AlertCircle className="text-[#EF4444] mb-3" size={48} />
                                <h3 className="text-lg font-bold text-[#111827]">Invalid Format</h3>
                                <p className="text-[#EF4444] mt-1 text-sm">{error}</p>
                            </div>
                        )}
                        {!beautifyLib && !error && (
                            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in zoom-in duration-200">
                                <Loader2 className="text-[#3B82F6] animate-spin mb-3" size={48} />
                                <h3 className="text-lg font-bold text-[#111827]">Loading Formatter</h3>
                                <p className="text-[#6B7280] mt-1 text-sm">Please wait...</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-4">
                    <div className="flex justify-center md:justify-start order-2 md:order-1">
                        <button 
                            onClick={handleReset} 
                            className="flex items-center gap-2 px-8 py-3 rounded-full border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] bg-white transition-all font-semibold active:scale-95 w-full md:w-auto justify-center"
                        >
                            <RotateCcw size={18} /> Reset
                        </button>
                    </div>

                    <div className="flex justify-center order-1 md:order-2">
                        <button
                            onClick={handleFormat}
                            disabled={isFormatDisabled}
                            className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#3B82F6] hover:bg-[#2776f5] text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed justify-center w-full md:w-auto shadow-lg shadow-[#3B82F6]/20"
                        >
                            {loading ? <Loader2 className="animate-spin" size={24} /> : (
                                <>
                                    <span className="font-bold text-md tracking-wide">Format</span>
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex justify-center md:justify-end gap-3 order-3">
                        <button
                            onClick={handleDownload}
                            disabled={isActionDisabled}
                            className="flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-[#3B82F6] bg-white text-[#3B82F6] hover:bg-[#F9FAFB] transition-all font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed flex-1 md:flex-none"
                        >
                            <Download size={16} /> Download
                        </button>
                        <button
                            onClick={handleCopy}
                            disabled={isActionDisabled}
                            className={`flex items-center justify-center gap-2 px-10 py-3 rounded-full border transition-all font-bold text-sm flex-1 md:flex-none disabled:opacity-30 disabled:cursor-not-allowed ${
                                copied 
                                    ? 'border-[#10B981] text-[#10B981] bg-[#F0FDF4]' 
                                    : 'border-[#3B82F6] bg-white text-[#3B82F6] hover:bg-[#F9FAFB]'
                            }`}
                        >
                            {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormatterTool;