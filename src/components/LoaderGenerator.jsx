import { useState, useMemo } from 'react';
import LoaderCard from './LoaderCard';
import CustomizeModal from './CustomizationModal';
import { loadersData } from '../data/loaders/loadersData';
import CustomSelect from './CustomSelect';
import { Grid, ChevronLeft, ChevronRight } from 'lucide-react';

const LoaderGenerator = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Loaders');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLoader, setSelectedLoader] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [settings, setSettings] = useState({
    primaryColor: '#3B82F6',
    secondaryColor: '#E5E7EB',
    size: 45,
    speed: '1.5s'
  });

  // Category options for CustomSelect
  const categoryOptions = [
    { value: 'All Loaders', name: 'All Loaders' },
    { value: 'Spinners', name: 'Spinners' },
    { value: 'Progress Loaders', name: 'Progress Loaders' },
    { value: 'Dot Loaders', name: 'Dot Loaders' },
    { value: 'Bar Loaders', name: 'Bar Loaders' }
  ];

  // --- 1. Filter Logic  ---
  const filteredLoaders = useMemo(() => {
    if (selectedCategory === 'All Loaders') return loadersData;
    
    return loadersData.filter(loader => {
      const id = loader.id.toLowerCase();
      if (selectedCategory === 'Spinners') return id.includes('spinner');
      if (selectedCategory === 'Progress Loaders') return id.includes('progress');
      if (selectedCategory === 'Dot Loaders') return id.includes('dots') || (id.startsWith('l') && loader.category === 'Dots');
      if (selectedCategory === 'Bar Loaders') return id.includes('bar') && !id.includes('dots') && !id.includes('spinner');
      return true;
    });
  }, [selectedCategory]);

  const itemsPerPage = 6;
  
  // --- 2. Pagination Calculations ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLoaders = filteredLoaders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLoaders.length / itemsPerPage);

  const handleCustomize = (loader) => {
    setSelectedLoader(loader);
    setIsModalOpen(true);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto font-manrope px-4 sm:px-6 py-6">

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="w-full sm:w-64">
          <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2 block">
            CSS Loader categories
          </label>
          <CustomSelect
            label=""
            value={selectedCategory}
            onChange={handleCategoryChange}
            options={categoryOptions}
            searchable={false}
            size="md"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-[#FFFFFF] rounded-lg border border-[#E5E7EB]">
            <span className="text-sm text-[#6B7280]">Total Loaders: </span>
            <span className="font-bold text-[#3B82F6]">{filteredLoaders.length}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Grid className="w-4 h-4 text-[#6B7280]" />
            <span className="text-sm text-[#6B7280]">{currentPage}/{totalPages}</span>
          </div>
        </div>
      </div>

      <CustomizeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        loader={selectedLoader}
        settings={settings}
        setSettings={setSettings}
      />

      {/* Grid Section */}
      {currentLoaders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-125">
          {currentLoaders.map((loader) => (
            <LoaderCard 
              key={loader.id} 
              title={loader.name} 
              html={loader.html}
              css={loader.getCss(
                settings.primaryColor, 
                settings.secondaryColor, 
                settings.size, 
                settings.speed
              )}
              onCustomize={() => handleCustomize(loader)} 
            />
          ))}
        </div>
      ) : (
        <div className="min-h-125 flex items-center justify-center bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
          <p className="text-[#6B7280]">No loaders found in this category</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center mt-12 gap-6">
          <button
            onClick={() => {
              setCurrentPage(prev => Math.max(prev - 1, 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              currentPage === 1 
                ? 'text-[#9CA3AF] cursor-not-allowed' 
                : 'text-[#6B7280] hover:text-[#3B82F6] hover:bg-[#F9FAFB] border border-[#E5E7EB]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-3 items-center">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentPage(i + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`transition-all duration-300 ${
                  currentPage === i + 1
                    ? 'w-8 h-2.5 bg-[#3B82F6] rounded-full shadow-sm'
                    : 'w-2.5 h-2.5 bg-[#E5E7EB] rounded-full hover:bg-[#3B82F6]/50'
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              setCurrentPage(prev => Math.min(prev + 1, totalPages));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              currentPage === totalPages 
                ? 'text-[#9CA3AF] cursor-not-allowed' 
                : 'text-[#6B7280] hover:text-[#3B82F6] hover:bg-[#F9FAFB] border border-[#E5E7EB]'
            }`}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Info for Mobile */}
      {totalPages > 1 && (
        <div className="text-center mt-4 text-xs text-[#6B7280] sm:hidden">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </div>
  );
};

export default LoaderGenerator;