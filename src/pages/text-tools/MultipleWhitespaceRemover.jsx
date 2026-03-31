import React, { useState } from "react";
import multipleWhitespaceRemover from "../../images/detail-page-images/multipleWhitespaceRemover.svg";
import ToolsDetailPageHeader from "../../components/ToolsDetailPageHeader";
import { BrushCleaning, Check, Copy } from "lucide-react";
import CommentsSection from "../../components/CommentsSection";
import BuyMeACoffee from "../../components/BuyMeACoffee";
import SimilarTools from "../../components/SimilarTools";
import BrowserExtensionBanner from "../../components/BrowserExtensionBanner";
import toast from 'react-hot-toast';

const MultipleWhitespaceRemover = () => {
    const [text, setText] = useState("");
    const [copied, setCopied] = useState(false);

    const handleRemoveWhitespace = () => {
        if (!text.trim()) {
            toast.error('Please enter some text first!', {
                duration: 3000,
                position: 'top-right',
                icon: '📝',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
            return;
        }

        const cleanedText = text
            .replace(/\s+/g, " ")
            .replace(/\n\s*\n/g, "\n") 
            .trim();

        setText(cleanedText);
        
        toast.success('Multiple spaces removed successfully!', {
            duration: 2000,
            position: 'top-right',
            icon: '✨',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });
    };

    // Clear textarea
    const handleReset = () => {
        if (!text) {
            toast.error('Nothing to reset! Text area is already empty.', {
                duration: 2000,
                position: 'top-right',
                icon: '🧹',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
            return;
        }
        
        setText("");
        toast.success('Text cleared successfully!', {
            duration: 2000,
            position: 'top-right',
            icon: '✅',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });
    };

    // Copy to clipboard
    const handleCopy = async() => {
        if (!text) {
            toast.error('Nothing to copy! Please enter some text first.', {
                duration: 3000,
                position: 'top-right',
                icon: '📋',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
            return;
        }
        
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success('Text copied to clipboard!', {
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
        } catch(error) {
            console.error('Failed to copy text', error);
            toast.error('Failed to copy text. Please try again.', {
                duration: 3000,
                position: 'top-right',
                icon: '❌',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
        }
    };

    return (
        <div className="overflow-x-hidden bg-[#F9FAFB]">
            <ToolsDetailPageHeader title="Multiple Whitespace Remover" icon={multipleWhitespaceRemover} />

            <div className="max-w-5xl mx-auto w-full bg-[#F9FAFB] min-h-screen pt-4 pb-10 px-3 sm:px-4 font-manrope">
                <div className="mb-6 pt-4">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter your text..."
                        className="w-full h-64 md:h-80 p-5 md:p-8 text-lg text-[#0B1220] bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 transition-all resize-none outline-none placeholder-[#6B7280] shadow-sm"
                    />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
                    <div className="w-full md:w-auto flex justify-center md:justify-start">
                        <button
                            onClick={handleRemoveWhitespace}
                            className="bg-[#3B82F6] px-6 py-3 rounded-full font-semibold text-[#FFFFFF] w-full md:w-auto hover:bg-[#2776f5] transition-all shadow-lg active:scale-95"
                        >
                            Remove Multiple Spaces
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-3 sm:gap-5 w-full md:w-auto">
                        <button
                            onClick={handleReset}
                            className="flex justify-center items-center gap-2 rounded-full text-[#6B7280] hover:text-[#3B82F6] border-2 border-[#E5E7EB] hover:border-[#3B82F6] px-7 py-3 font-semibold w-full sm:w-auto bg-[#FFFFFF] transition-all active:scale-95"
                        >
                            <BrushCleaning className="h-4 w-4" />
                            Reset
                        </button>

                        <button
                            type="button"
                            onClick={handleCopy}
                            className={`flex justify-center items-center gap-2 rounded-full border-2 px-7 py-3 font-semibold w-full sm:w-auto transition-all active:scale-95 ${
                                copied 
                                    ? 'bg-[#3B82F6] text-[#FFFFFF] border-[#3B82F6] shadow-lg' 
                                    : 'bg-[#FFFFFF] text-[#6B7280] border-[#E5E7EB] hover:text-[#3B82F6] hover:border-[#3B82F6]'
                            }`}
                        >
                            {copied ? <Check size={18} strokeWidth={3} /> : <Copy size={18} strokeWidth={3} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col space-y-0">
                    <CommentsSection toolId="multiple-whitespace-remover" />
                    <BuyMeACoffee />
                    <SimilarTools />
                    <BrowserExtensionBanner />
                    <div className="max-w-5xl mx-auto py-4 px-0">
                        <div className="bg-[#FFFFFF] rounded-2xl shadow-sm p-6 md:p-10 border border-[#E5E7EB] font-manrope">

                            {/* Section 1: Header & Intro */}
                            <h2 className="text-xl md:text-2xl font-bold text-[#111827] mb-6 font-space-grotesk">
                                What is Online Multiple Whitespace Remover?
                            </h2>

                            <div className="space-y-4 text-[#0B1220] leading-relaxed text-sm md:text-base">
                                <p>
                                    Multiple Whitespace Remover is a free online tool for removing all unwanted multiple whitespaces and line breaks from a text. If you have a long text which includes many double or multiple whitespaces, unwanted multiple line breaks and untrimmed lines, this tool will make your life easier for you.
                                </p>
                                <p>
                                    Sometimes, people need to edit long texts before they publish them. If these texts have unnecessary spaces and line breaks, it may be painful to remove them manually. Online Multiple Whitespace Remover will remove all unnecessary characters for you by substituting multiple whitespaces and line breaks with single one.
                                </p>
                            </div>

                            {/* Section 2: Image Placeholder */}
                            <div className="my-10 flex flex-col items-center">
                                <div className="border border-[#E5E7EB] p-2 bg-[#FFFFFF] shadow-sm max-w-md w-full rounded-lg">
                                    <img
                                        src="https://10015.io/assets/tools/pages/multiple-whitespace-remover/multiple-whitespace-remover.jpg"
                                        alt="white space remover"
                                        className="w-full h-auto rounded"
                                    />
                                </div>
                                <p className="text-xs text-[#6B7280] mt-4 text-center italic">
                                    Before & After of a Cleared Text from Multiple Whitespaces
                                </p>
                            </div>

                            {/* Section 3: Detailed Content */}
                            <div className="space-y-4 text-[#0B1220] leading-relaxed text-sm md:text-base mb-8">
                                <p>
                                    If you have huge gaps between words and paragraphs which shows your text weird and make it hard to read, you need to check all words one by one and remove all unwanted characters manually. Or you can use this tool to remove multiple spaces from a string or a text automatically.
                                </p>
                            </div>

                            {/* Section 4: How to Use */}
                            <h3 className="text-xl font-bold text-[#111827] mb-6 font-space-grotesk">How to use Online Multiple Whitespace Remover?</h3>
                            <p className="text-[#0B1220] mb-4 text-sm md:text-base">You can clear multiple unwanted spaces and line breaks and merge them as a single character by following these steps:</p>
                            <ol className="space-y-4 text-sm md:text-base text-[#0B1220] list-decimal list-inside mb-10">
                                <li className="pl-2">First, paste your string or text in the text area you want to process.</li>
                                <li className="pl-2">Click "Remove Multiple Spaces" button.</li>
                                <li className="pl-2">"Copy" button will help you to copy the cleared text into your clipboard.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultipleWhitespaceRemover;