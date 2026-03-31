import { useState } from 'react';
import SwitchCard from './SwitchCard';
import SwitchCustomizeModal from './SwitchCustomizeModal'; 
import { toggleSwitchDesigns } from '../data/switches/switchData'; 
import { Palette, Grid, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const SwitchGenerator = () => {
    const [primaryColor, setPrimaryColor] = useState('#3B82F6');

    const itemsPerPage = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDesign, setSelectedDesign] = useState(null);
    const [activeTab, setActiveTab] = useState('customize');

    const openModal = (design, tab) => {
        setSelectedDesign(design);
        setActiveTab(tab);
        setIsModalOpen(true);
    };

    const totalPages = Math.ceil(toggleSwitchDesigns.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = toggleSwitchDesigns.slice(indexOfFirstItem, indexOfLastItem);

    const goToNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const goToPrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="max-w-5xl mx-auto min-h-screen bg-[#F9FAFB] font-manrope px-2 sm:px-6 py-8">

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FFFFFF] rounded-lg flex items-center justify-center border border-[#E5E7EB]">
                        <Palette className="w-5 h-5 text-[#3B82F6]" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block mb-1">
                            Global Theme Color
                        </label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-8 h-8 cursor-pointer rounded-lg border-2 border-[#E5E7EB] overflow-hidden"
                            />
                            <span className="text-sm font-bold text-[#0B1220] uppercase">{primaryColor}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-[#FFFFFF] rounded-lg border border-[#E5E7EB]">
                        <span className="text-sm text-[#6B7280]">Total Designs: </span>
                        <span className="font-bold text-[#3B82F6]">{toggleSwitchDesigns.length}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 px-3 py-2.5 bg-[#FFFFFF] rounded-lg border border-[#E5E7EB]">
                        <Grid className="w-4 h-4 text-[#6B7280]" />
                        <span className="text-sm text-[#6B7280]">{currentPage}/{totalPages}</span>
                    </div>
                </div>
            </div>

            {/* Grid */}
            {currentItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-125">
                    {currentItems.map((item) => (
                        <SwitchCard 
                            key={item.id} 
                            design={item}
                            primaryColor={primaryColor}
                            onCustomize={() => openModal(item, 'customize')}
                            onGetCode={() => openModal(item, 'code')} 
                        />
                    ))}
                </div>
            ) : (
                <div className="min-h-125 flex items-center justify-center bg-[#FFFFFF] rounded-xl border border-[#E5E7EB]">
                    <p className="text-[#6B7280]">No toggle switch designs found</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center mt-12 gap-6">
                    <button
                        onClick={goToPrev}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            currentPage === 1 
                                ? 'text-[#9CA3AF] cursor-not-allowed' 
                                : 'text-[#6B7280] hover:text-[#3B82F6] hover:bg-[#FFFFFF] border border-[#E5E7EB]'
                        }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>

                    <div className="flex items-center gap-3">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentPage(index + 1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`transition-all duration-300 rounded-full ${
                                    currentPage === index + 1 
                                        ? 'w-8 h-2.5 bg-[#3B82F6] shadow-sm' 
                                        : 'w-2.5 h-2.5 bg-[#E5E7EB] hover:bg-[#3B82F6]/50'
                                }`}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={goToNext}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            currentPage === totalPages 
                                ? 'text-[#9CA3AF] cursor-not-allowed' 
                                : 'text-[#6B7280] hover:text-[#3B82F6] hover:bg-[#FFFFFF] border border-[#E5E7EB]'
                        }`}
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Mobile Page Info */}
            {totalPages > 1 && (
                <div className="text-center mt-4 text-xs text-[#6B7280] sm:hidden">
                    Page {currentPage} of {totalPages}
                </div>
            )}

            {/* Modal */}
            <SwitchCustomizeModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                design={selectedDesign}
                initialColor={primaryColor}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
        </div>
    );
};

export default SwitchGenerator;