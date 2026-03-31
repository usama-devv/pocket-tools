import { useState, useEffect } from 'react';
import { Palette, Code } from 'lucide-react';

const CheckboxCard = ({ design, primaryColor, onCustomize, onGetCode }) => {

    const [isChecked, setIsChecked] = useState(false);

    const uniqueId = `cb-${design.id}`;

    const dynamicCSS = design.getCss(primaryColor).replaceAll(`.${design.id}`, `#${uniqueId}`);

    const finalHtml = design.html
        .replaceAll('id="cb', `id="${uniqueId}`)
        .replaceAll('for="cb', `for="${uniqueId}`)
        .replace('<input', `<input onchange="window.toggleCheckbox_${uniqueId}(event)"`);

    useEffect(() => {
        window[`toggleCheckbox_${uniqueId}`] = (event) => {
            setIsChecked(event.target.checked);
        };

        return () => {
            delete window[`toggleCheckbox_${uniqueId}`];
        };
    }, [uniqueId]);

    return (
        <div className="flex flex-col items-center gap-3 group">
            {/* Dynamic Style */}
            <style>{`
                #container-${uniqueId} ${dynamicCSS}
                
                /* Ensure checkbox is clickable */
                #container-${uniqueId} input[type="checkbox"] {
                    cursor: pointer;
                }
            `}</style>

            {/* Main Card Container */}
            <div
                id={`container-${uniqueId}`}
                className={`relative w-full h-48 bg-[#FFFFFF] border rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg
                ${isChecked 
                    ? 'border-[#3B82F6] ring-2 ring-[#3B82F6]/20 shadow-lg shadow-[#3B82F6]/10' 
                    : 'border-[#E5E7EB] hover:border-[#3B82F6] hover:bg-[#F9FAFB]'}`}
            >
                {/* --- DYNAMIC CHECKBOX DESIGN --- */}
                <div className="flex items-center gap-3 select-none scale-[1.5]">
                    <div
                        dangerouslySetInnerHTML={{ __html: finalHtml }}
                        className="flex items-center justify-center"
                    />
                    <span className={`text-sm font-normal ml-2 transition-colors ${
                        isChecked ? 'text-[#3B82F6]' : 'text-[#6B7280]'
                    }`}>
                        Checkbox
                    </span>
                </div>

                {/* Top-right Badge */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-medium text-[#6B7280] bg-[#F9FAFB] px-2 py-1 rounded-full border border-[#E5E7EB]">
                        {design.name.split(' ')[0]}
                    </span>
                </div>

                {/* Action Buttons Section */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[#FFFFFF]/95 backdrop-blur-sm flex items-center justify-center gap-2 lg:translate-y-full lg:group-hover:translate-y-0 translate-y-0 transition-transform duration-300 ease-in-out border-t border-[#E5E7EB]">
                    <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => onCustomize(design)}
                            className="flex items-center gap-1.5 bg-[#3B82F6] text-[#FFFFFF] px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#2776f5] transition-all active:scale-95 shadow-md shadow-[#3B82F6]/20"
                        >
                            <Palette className="w-3.5 h-3.5" />
                            Customize
                        </button>
                        <button
                            onClick={() => onGetCode(design)}
                            className="flex items-center gap-1.5 bg-[#F9FAFB] text-[#0B1220] px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#FFFFFF] hover:text-[#3B82F6] transition-all active:scale-95 border border-[#E5E7EB]"
                        >
                            <Code className="w-3.5 h-3.5" />
                            Get Code
                        </button>
                    </div>
                </div>

                {/* Checked Indicator */}
                {isChecked && (
                    <div className="absolute top-2 left-2 w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse"></div>
                )}
            </div>

            {/* Design Name with Accent Dot */}
            <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    isChecked ? 'bg-[#3B82F6]' : 'bg-[#E5E7EB]'
                }`}></div>
                <p className={`text-sm font-medium transition-colors uppercase tracking-tighter ${
                    isChecked ? 'text-[#3B82F6]' : 'text-[#6B7280] group-hover:text-[#3B82F6]'
                }`}>
                    {design.name}
                </p>
            </div>
        </div>
    );
};

export default CheckboxCard;