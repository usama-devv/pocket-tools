import { useState, useRef, useEffect } from 'react'
import caseConverter from "../../images/detail-page-images/caseConverter.svg"
import ToolsDetailPageHeader from '../../components/ToolsDetailPageHeader'
import { RotateCcw, Copy, Check, ChevronDown, Globe } from 'lucide-react';
import CommentsSection from '../../components/CommentsSection';
import BuyMeACoffee from '../../components/BuyMeACoffee';
import BrowserExtensionBanner from '../../components/BrowserExtensionBanner';
import SimilarTools from '../../components/SimilarTools';

const CaseConverter = () => {
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);
    const [selectedLocale, setSelectedLocale] = useState('en-US');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const locales = [
        { code: 'en-US', label: 'English (United States)' },
        { code: 'en-GB', label: 'English (United Kingdom)' },
        { code: 'es-ES', label: 'Spanish (Spain)' },
        { code: 'fr-FR', label: 'French (France)' },
        { code: 'de-DE', label: 'German (Germany)' },
        { code: 'tr-TR', label: 'Turkish (Türkiye)' },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const transforms = {
        sentence: (str) => str.toLocaleLowerCase(selectedLocale).replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toLocaleUpperCase(selectedLocale)),
        upper: (str) => str.toLocaleUpperCase(selectedLocale),
        lower: (str) => str.toLocaleLowerCase(selectedLocale),
        title: (str) => str.toLocaleLowerCase(selectedLocale).replace(/\b\w/g, (c) => c.toLocaleUpperCase(selectedLocale)),
        mixed: (str) => str.split('').map((c, i) => i % 2 === 0 ? c.toLocaleUpperCase(selectedLocale) : c.toLocaleLowerCase(selectedLocale)).join(''),
        inverse: (str) => str.split('').map((c) => c === c.toLocaleUpperCase(selectedLocale) ? c.toLocaleLowerCase(selectedLocale) : c.toLocaleUpperCase(selectedLocale)).join(''),
    };

    const handleTransform = (type) => {
        if (!text) return;
        setText(transforms[type](text));
    };

    const handleCopy = async () => {
        if (!text) return;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const currentLocaleLabel = locales.find(l => l.code === selectedLocale)?.label;

    return (
        <div className="overflow-x-hidden bg-[#F9FAFB]">
            <ToolsDetailPageHeader title="Case Converter" icon={caseConverter} />

            <div className="w-full min-h-screen pt-2 md:pt-4 pb-10 font-manrope px-3 sm:px-4">
                <div className="max-w-5xl mx-auto pt-4 mb-6">
                    
                    {/* CUSTOM DROPDOWN - Original Size Ke Sath */}
                    <div className="mb-4 md:mb-6" ref={dropdownRef}>
                        <div className="w-full px-4 py-2 md:px-6 md:py-2 bg-white rounded-lg border border-[#E5E7EB] shadow-sm relative">
                            <label className="block text-[10px] md:text-[11px] uppercase tracking-widest text-[#6B7280] font-bold mb-1">
                                Language / Locale
                            </label>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full flex items-center justify-between bg-transparent text-[#0B1220] text-sm md:text-base focus:outline-none cursor-pointer pr-2 font-medium py-1"
                            >
                                <span className="truncate">{currentLocaleLabel}</span>
                                <ChevronDown size={16} className={`text-[#6B7280] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white border border-[#E5E7EB] rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                    {locales.map((loc) => (
                                        <button
                                            key={loc.code}
                                            onClick={() => {
                                                setSelectedLocale(loc.code);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-5 py-3 text-sm transition-colors flex items-center justify-between ${
                                                selectedLocale === loc.code 
                                                ? 'bg-[#3B82F6]/5 text-[#3B82F6] font-bold' 
                                                : 'text-[#0B1220] hover:bg-gray-50'
                                            }`}
                                        >
                                            {loc.label}
                                            {selectedLocale === loc.code && <Check size={14} />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-6 md:mb-8">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter your text..."
                            className="w-full h-64 sm:h-80 md:h-100 p-4 sm:p-6 md:p-8 text-lg md:text-xl text-[#0B1220] bg-white rounded-xl border border-[#E5E7EB] focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/5 focus:outline-none transition-all resize-none shadow-sm placeholder-gray-300"
                        />
                    </div>

                    <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 w-full xl:w-auto">
                            {Object.keys(transforms).map((key) => (
                                <button
                                    key={key}
                                    onClick={() => handleTransform(key)}
                                    className="px-3 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white border border-[#E5E7EB] text-[#111827] font-bold hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all whitespace-nowrap text-[12px] sm:text-sm active:scale-95 shadow-sm"
                                >
                                    {key === 'mixed' ? 'MiXeD CaSe' : key === 'inverse' ? 'iNvErSe cAsE' :
                                        key === 'upper' ? 'UPPER CASE' : key === 'lower' ? 'lower case' :
                                            key === 'sentence' ? 'Sentence case' : 'Title Case'}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-row items-center gap-2 sm:gap-3 w-full xl:w-auto">
                            <button
                                onClick={() => setText('')}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:px-8 sm:py-3 rounded-full bg-white border border-[#E5E7EB] text-[#6B7280] font-bold hover:bg-[#F9FAFB] transition-colors text-[12px] sm:text-sm active:scale-95"
                            >
                                <RotateCcw size={16} strokeWidth={2.5} />
                                <span>Reset</span>
                            </button>
                            <button
                                onClick={handleCopy}
                                className={`flex-[1.5] flex items-center justify-center gap-2 px-6 py-2.5 sm:px-12 sm:py-3 rounded-full font-bold text-[12px] sm:text-sm transition-all active:scale-95 shadow-md ${copied ? 'bg-green-500 text-white' : 'bg-[#3B82F6] text-white hover:bg-[#2776f5]'}`}
                            >
                                {copied ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} strokeWidth={2.5} />}
                                {copied ? 'Copied!' : 'Copy Text'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-0">
                    <CommentsSection toolId="case-converter" />
                    <BuyMeACoffee />
                    <SimilarTools />
                    <BrowserExtensionBanner />

                    <div className="max-w-5xl mx-auto py-2 px-0 w-full">
                        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-[#E5E7EB]">
                            <h1 className="text-2xl font-bold text-[#111827] mb-6 font-space-grotesk">What is Online Case Converter?</h1>

                            <div className="space-y-4 text-[#0B1220] leading-relaxed mb-8 font-manrope text-sm md:text-base">
                                <p>
                                    Case Converter is a{" "}
                                    <span className="relative inline-block">
                                        <span className="relative z-10 font-semibold italic text-[#111827]">"free online tool for converting text to different cases"</span>
                                        <span className="absolute left-0 bottom-0 w-full h-1 bg-[#3B82F6]/20 rounded-full z-0"></span>
                                    </span>. If you have a wrongly formatted text you want to convert it to a specific case, online case converter will assist you to perform it immediately. Its language-sensitive case conversion feature allows you to convert text to different cases for different languages. It is a useful tool for writers, editors, and content creators to format their text in a proper way.
                                </p>

                                <p>
                                    If you have a text other than English and it contains language-specific characters that needs to be treated differently than English, you can convert your text into different locales. Online Case Converter supports multiple languages such as English, German, French, Spanish, Italian, Dutch, Portuguese, Russian, Turkish, Arabic, Chinese, Japanese, Korean, and more.
                                </p>

                                <p>
                                    There are uppercase and lowercase letters in alphabets. You can use either one of them in your text or a mixture. These patterns define different cases. Here is an image showing uppercase and lowercase letters in English alphabet. You can convert cases for different alphabets with Online Case Converter.
                                </p>
                            </div>

                            <div className="my-8 bg-[#111827] rounded-xl p-6 md:p-8 text-center font-manrope shadow-lg">
                                <div className="text-white text-lg sm:text-2xl md:text-3xl font-bold tracking-widest mb-2 break-all opacity-90">
                                    ABCDEFGHIJKLMNOPQRSTUVWXYZ
                                </div>
                                <div className="text-white text-lg sm:text-2xl md:text-3xl font-bold tracking-widest break-all opacity-90">
                                    abcdefghijklmnopqrstuvwxyz
                                </div>
                            </div>
                            <p className="text-center text-[#6B7280] text-sm mb-8 font-medium italic">Uppercase and Lowercase Letters</p>

                            <p className="text-[#0B1220] mb-4 font-manrope font-bold text-lg">Here is a list of available cases with their detailed explanations and examples.</p>

                            <ul className="space-y-6 text-[#0B1220] mb-8 font-manrope text-sm md:text-base">
                                <li>
                                    <span className="font-bold text-[#111827]">Sentence Case:</span> First letter of all sentences will be uppercase while remaining will be lowercase. Sentences will be identified with punctuations which ends a sentence such as dot, question mark or exclamation mark.
                                    <div className="text-[#6B7280] italic mt-1 font-medium">Example: "This is the first sentence. This is the second one."</div>
                                </li>

                                <li>
                                    <span className="font-bold text-[#111827]">Title Case:</span> First letters of each word are uppercase while remaining will be lowercase.
                                    <div className="text-[#6B7280] italic mt-1 font-medium">Example: "This Is An Example For Title Case"</div>
                                </li>

                                <li>
                                    <span className="font-bold text-[#111827]">Uppercase:</span> All letters in the text will be uppercase.
                                    <div className="text-[#6B7280] italic mt-1 font-medium">Example: "ALL LETTERS ARE IN UPPERCASE."</div>
                                </li>

                                <li>
                                    <span className="font-bold text-[#111827]">Lowercase:</span> All letters in the text will be lowercase.
                                    <div className="text-[#6B7280] italic mt-1 font-medium">Example: "all letters are in lowercase."</div>
                                </li>

                                <li>
                                    <span className="font-bold text-[#111827]">Mixed Case:</span> It is a sequence of one letter uppercase, one letter lowercase for each word.
                                    <div className="text-[#6B7280] italic mt-1 font-medium">Example: "OnE LeTtEr UpPeRcAsE, OnE LeRtEr LoWeRcAsE In EaCh WoRd."</div>
                                </li>

                                <li>
                                    <span className="font-bold text-[#111827]">Inverse Case:</span> It is a sequence of one letter lowercase, one letter uppercase for each word.
                                    <div className="text-[#6B7280] italic mt-1 font-medium">Example: "oNe lEtTeR lOwErCaSe, oNe lEtTeR uPpErCaSe iN eAcH wOrD."</div>
                                </li>
                            </ul>

                            <h2 className="text-2xl font-bold text-[#111827] mb-6 font-space-grotesk">How to use Online Case Converter?</h2>

                            <p className="text-[#0B1220] mb-6 font-medium">You can convert you text into any case by following these steps.</p>

                            <ol className="space-y-4 text-[#0B1220] mb-8 list-decimal list-inside font-manrope text-sm md:text-base">
                                <li>First, paste your text in the text area you want to convert.</li>
                                <li className="leading-relaxed">Select the case from the list you want to convert. It converts the text immediately after you select the case. If you modify your text and want to apply the same format again, just use the "Apply" button.</li>
                                <li className="leading-relaxed">You can use <span className="text-[#3B82F6] font-bold">Copy</span> button to copy the converted text into your clipboard. In addition, you can download the output as a .txt file by using the "Download" button.</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CaseConverter