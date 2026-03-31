import { useState } from 'react';
import { RefreshCw, Copy, Check, ChevronsRight, ChevronsDown } from 'lucide-react';
import toast from 'react-hot-toast';

export const EncodeDecodeTools = ({ encodeFn, decodeFn, inputLabel, outputLabel }) => {
    const [mode, setMode] = useState('encode');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleAction = () => {
        setError('');
        if (!input.trim()) { 
            setOutput(''); 
            toast.error('Please enter some text!', { duration: 1500 });
            return; 
        }

        try {
            const result = mode === 'encode' ? encodeFn(input) : decodeFn(input);
            setOutput(result);
        } catch {
            setOutput('');
            setError('Invalid format for conversion.');
        }
    };

    const resetFields = () => {
        setInput(''); 
        setOutput(''); 
        setError('');
        toast.success('Reset done!', { duration: 1500 }); // ✅ Reset py toast aayega
    };

    const copyToClipboard = () => {
        if (output) {
            navigator.clipboard.writeText(output);
            setCopied(true);
            toast.success('Copied!', { duration: 1500 });
            setTimeout(() => setCopied(false), 2000);
        } else {
            toast.error('Nothing to copy!', { duration: 1500 });
        }
    };

    const handleTabChange = (newMode) => {
        setMode(newMode);
        setInput('');
        setOutput('');
        setError('');
        // ❌ Tab change py toast nahi aayega
    };

    return (
        <div className="w-full max-w-5xl mx-auto font-manrope mt-10 mb-12">
            {/* Tabs */}
            <div className="flex justify-center mb-10">
                <div className="bg-[#F3F4F6] p-1.5 rounded-xl flex w-full max-w-md">
                    <button onClick={() => handleTabChange('encode')}
                        className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                            mode === 'encode' 
                                ? 'bg-[#3B82F6] text-white shadow-md' 
                                : 'text-[#6B7280] hover:text-[#111827]'
                        }`}>
                        Encoder
                    </button>
                    <button onClick={() => handleTabChange('decode')}
                        className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                            mode === 'decode' 
                                ? 'bg-[#3B82F6] text-white shadow-md' 
                                : 'text-[#6B7280] hover:text-[#111827]'
                        }`}>
                        Decoder
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-center mb-6">
                {/* Input Section */}
                <div className="relative border border-[#E5E7EB] rounded-2xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#3B82F6] transition-all">
                    <div className="sticky top-0 left-0 right-0 bg-white px-6 py-3 z-10">
                        <span className="text-[#6B7280] text-sm font-bold uppercase tracking-wider">
                            {mode === 'encode' ? inputLabel : outputLabel}
                        </span>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full h-74 p-6 pt-4 outline-none resize-none bg-white block text-[#111827]"
                        placeholder="Enter here..."
                    />
                </div>

                <div className="flex justify-center">
                    <ChevronsRight className="text-[#9CA3AF] hidden md:block" size={32} />
                    <ChevronsDown className="text-[#9CA3AF] block md:hidden" size={32} />
                </div>

                {/* Output Section */}
                <div className="relative border border-[#E5E7EB] rounded-2xl bg-white overflow-hidden transition-all">
                    <div className="sticky top-0 left-0 right-0 bg-white px-6 py-3 z-10">
                        <span className="text-[#6B7280] text-sm font-bold uppercase tracking-wider">
                            {mode === 'encode' ? outputLabel : inputLabel}
                        </span>
                    </div>
                    <textarea
                        value={output}
                        readOnly
                        className="w-full h-74 p-6 pt-4 bg-white outline-none resize-none block text-[#111827]"
                        placeholder="Output..."
                    />
                    {error && <p className="absolute bottom-4 left-4 text-[#EF4444] text-xs z-20">{error}</p>}
                </div>
            </div>

            {/* Buttons Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mt-6">
                <div className="flex justify-center order-1 md:order-2">
                    <button onClick={handleAction} className="w-full md:w-auto px-8 py-3 bg-[#3B82F6] hover:bg-[#2776f5] text-white rounded-full font-bold shadow-lg shadow-[#3B82F6]/20 flex items-center justify-center gap-2 transition-transform active:scale-95">
                        {mode === 'encode' ? 'Encode' : 'Decode'} <span className="text-xl">›</span>
                    </button>
                </div>
                <div className="flex flex-1 justify-start order-2 md:order-1">
                    <button onClick={resetFields} className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 border border-[#E5E7EB] rounded-full text-[#6B7280] font-bold bg-[#FFFFFF] hover:text-[#111827] transition-all">
                        <RefreshCw size={18} /> Reset
                    </button>
                </div>
                <div className="flex flex-1 justify-end order-3">
                    <button onClick={copyToClipboard} className={`w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 border rounded-full font-bold transition-all ${
                        copied 
                            ? 'bg-[#10B981] border-[#10B981] text-white' 
                            : 'bg-white text-[#3B82F6] border-[#3B82F6] hover:bg-[#F9FAFB]'
                    }`}>
                        {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
            </div>
        </div>
    );
};