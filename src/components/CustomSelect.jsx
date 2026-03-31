import React, { useState, useRef, useEffect } from 'react';

const CustomSelect = ({ label, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className="relative group w-full" ref={dropdownRef}>
      {/* Muted Text: #6B7280 */}
      <label className="text-[10px] sm:text-xs font-bold text-[#6B7280] mb-1.5 block uppercase tracking-wider font-manrope">
        {label}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-[#FFFFFF] border ${
            isOpen ? 'border-[#3B82F6] ring-4 ring-[#3B82F6]/10' : 'border-[#E5E7EB]'
          } p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm font-medium text-[#0B1220] text-left
            hover:border-[#3B82F6] transition-all flex justify-between items-center group/btn`}
        >
          <span className="truncate">{selectedOption?.name}</span>
          <svg 
            className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 group-hover/btn:text-[#3B82F6] ${
              isOpen ? 'rotate-180 text-[#3B82F6]' : ''
            }`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu: Surface #FFFFFF */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
              {options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange({ target: { value: opt.value } });
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2.5 text-xs sm:text-sm cursor-pointer transition-all
                    ${value === opt.value 
                      ? 'bg-[#F9FAFB] text-[#3B82F6] font-semibold' 
                      : 'text-[#0B1220] hover:bg-[#F9FAFB] hover:text-[#2776f5]'
                    }`}
                >
                  {opt.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;