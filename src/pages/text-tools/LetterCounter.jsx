import { useState, useEffect, useRef } from 'react';
import letterCounter from "../../images/detail-page-images/letterCounter.svg";
import ToolsDetailPageHeader from "../../components/ToolsDetailPageHeader";
import { ChevronDown } from 'lucide-react';
import CommentsSection from '../../components/CommentsSection';
import BuyMeACoffee from '../../components/BuyMeACoffee';
import SimilarTools from '../../components/SimilarTools';
import BrowserExtensionBanner from '../../components/BrowserExtensionBanner';

const LetterCounter = () => {
    const [text, setText] = useState('');
    const [counts, setCounts] = useState({ sentence: 0, word: 0, letter: 0 });
    const [filter, setFilter] = useState('All');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // categories mapping for display names
    const categoryNames = {
        'All': 'All',
        'meta': 'Meta (Facebook)',
        'google': 'Google / SEO',
        'insta': 'Instagram',
        'twitter': 'Twitter (X)',
        'youtube': 'YouTube',
        'snapchat': 'Snapchat',
        'pinterest': 'Pinterest'
    };

    const socialLimits = [
        { name: 'Meta Title', minMax: 'Max', limit: 55, type: 'Letter', category: 'meta' },
        { name: 'Meta Description', minMax: 'Max', limit: 160, type: 'Letter', category: 'meta' },
        { name: 'Google Ideal Post Content', minMax: 'Min', limit: 300, type: 'Word', category: 'google' },
        { name: 'Instagram Captions/Comments', minMax: 'Max', limit: 2200, type: 'Letter', category: 'insta' },
        { name: 'Twitter Post', minMax: 'Max', limit: 280, type: 'Letter', category: 'twitter' },
        { name: 'Twitter Username', minMax: 'Max', limit: 20, type: 'Letter', category: 'twitter' },
        { name: 'Facebook Wall Post (Truncation)', minMax: 'Max', limit: 477, type: 'Letter', category: 'meta' },
        { name: 'Facebook Comment', minMax: 'Max', limit: 8000, type: 'Letter', category: 'meta' },
        { name: 'YouTube Video Title', minMax: 'Max', limit: 70, type: 'Letter', category: 'youtube' },
        { name: 'YouTube Video Description', minMax: 'Max', limit: 5000, type: 'Letter', category: 'youtube' },
        { name: 'Snapchat Caption', minMax: 'Max', limit: 250, type: 'Letter', category: 'snapchat' },
        { name: 'Pinterest Pin Description', minMax: 'Max', limit: 500, type: 'Letter', category: 'pinterest' },
    ];

    useEffect(() => {
        const letters = text.length;
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCounts({ sentence: sentences, word: words, letter: letters });
    }, [text]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredLimits = filter === 'All'
        ? socialLimits
        : socialLimits.filter(item => item.category === filter);

    return (
        <div className="bg-[#F9FAFB] min-h-screen font-manrope overflow-x-hidden">
            <ToolsDetailPageHeader title="Letter Counter" icon={letterCounter} />

            <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
                <div className="mb-6">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter your text..."
                        className="w-full h-64 md:h-80 p-5 md:p-8 text-lg text-gray-700 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all resize-none shadow-sm placeholder-gray-300"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'sentence', value: counts.sentence },
                        { label: 'word', value: counts.word },
                        { label: 'letter', value: counts.letter }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm text-center">
                            <div className="text-4xl md:text-5xl font-bold text-[#111827] mb-1">{item.value}</div>
                            <div className="text-[#6B7280] uppercase tracking-widest text-[10px] font-bold">{item.label}</div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                    <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-lg font-bold text-[#111827]">Web and Social Media Limits</h3>

                        {/* Custom Dropdown */}
                        <div className="relative w-full md:w-72" ref={dropdownRef}>
                            <label className="absolute -top-2 left-3 px-1 bg-white text-[10px] text-[#9CA3AF] font-bold uppercase z-20">
                                Limit Category
                            </label>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`w-full flex items-center justify-between bg-white border rounded-lg px-4 py-3 text-sm text-gray-700 transition-all ${isDropdownOpen ? 'border-[#3B82F6] ring-2 ring-[#3B82F6]/10' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <span>{categoryNames[filter]}</span>
                                <ChevronDown className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} size={18} />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {Object.entries(categoryNames).map(([key, label]) => (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setFilter(key);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${filter === key ? 'bg-[#3B82F6]/10 text-[#3B82F6] font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-175">
                            <thead>
                                <tr className="bg-gray-50 text-[#6B7280] text-[10px] uppercase font-bold border-b border-gray-100">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Min/Max</th>
                                    <th className="px-6 py-4">Limit</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4 text-center">Current Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {filteredLimits.length > 0 ? (
                                    filteredLimits.map((item, index) => {
                                        const currentVal = item.type === 'Letter' ? counts.letter : counts.word;
                                        const isExceeded = item.minMax === 'Max' ? currentVal > item.limit : false;
                                        const isEmpty = currentVal === 0;

                                        return (
                                            <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                                                <td className="px-6 py-4 font-semibold text-[#1F2937]">{item.name}</td>
                                                <td className="px-6 py-4 text-gray-500">{item.minMax}</td>
                                                <td className="px-6 py-4 font-bold text-[#374151]">{item.limit}</td>
                                                <td className="px-6 py-4 text-gray-500">{item.type}</td>
                                                <td className="px-6 py-4">
                                                    <div className={`flex items-center justify-center gap-2 font-bold text-[10px] tracking-wide px-3 py-1 rounded-full ${isEmpty ? 'text-gray-400 bg-gray-100/50' : isExceeded ? 'text-red-500 bg-red-50' : 'text-[#3B82F6] bg-[#3B82F6]/10'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${isEmpty ? 'bg-gray-300' : isExceeded ? 'bg-red-500' : 'bg-[#3B82F6]'}`}></span>
                                                        {isEmpty ? 'EMPTY' : isExceeded ? 'EXCEEDED' : 'GOOD'}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-gray-400 italic">No limits found for this category.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex flex-col space-y-0">
                    <CommentsSection toolId="letter-counter" />
                    <BuyMeACoffee />
                    <SimilarTools />
                    <BrowserExtensionBanner />
                    
                    <div className="py-8">
                        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-16 font-manrope">
                            <section className="mb-12">
                                <h2 className="text-[24px] font-bold text-[#111827] mb-6 font-space-grotesk">What is Online Letter Counter?</h2>
                                <div className="space-y-5 text-[16px] text-[#374151] leading-[1.7]">
                                    <p>Letter Counter is a <span className='font-semibold border-b-2 border-[#3B82F6]/30'>free online tool for counting letters, words, and sentences in a text</span> even while you are typing.</p>
                                    <p>In web and social media, there are lots of character and word limits to optimize the content. All social media sites like Facebook, Twitter, Instagram, YouTube, Snapchat, Pinterest etc. use title, post, comment, username limits.</p>
                                    <p>For example, you have a website, and you will post new content on your site. You must set your meta title and description for SEO purposes. Ideal title is 55 characters. Page description must be limited with 160 characters.</p>
                                </div>
                                <div className="mt-10 mb-2 flex flex-col items-center">
                                    <div className="border border-gray-100 p-2 bg-white shadow-sm max-w-2xl w-full rounded-lg">
                                        <img src="https://10015.io/assets/tools/pages/letter-counter/letter-count-limits-on-google.png" alt="Letter Count Limits" className="w-full h-auto rounded-sm" />
                                    </div>
                                    <p className="text-[14px] text-gray-400 mt-4 italic">Letter Count Limits on Google Search Result</p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-[24px] font-bold text-[#111827] mb-6 font-space-grotesk">How to use Online Letter Counter?</h2>
                                <p className="text-[16px] text-[#374151] mb-6">You can count letters, words, and sentences by following these steps:</p>
                                <ol className="space-y-4 text-[16px] text-[#374151]">
                                    <li className="flex gap-2"><span className="font-bold text-[#3B82F6]">1.</span><span>Enter your text in text area.</span></li>
                                    <li className="flex gap-2"><span className="font-bold text-[#3B82F6]">2.</span><span>It will automatically calculate letter, word and sentence count.</span></li>
                                    <li className="flex gap-2"><span className="font-bold text-[#3B82F6]">3.</span><span>Check if your text passes social media and web standards.</span></li>
                                </ol>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LetterCounter;