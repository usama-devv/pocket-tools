import { useState, useRef, useEffect } from 'react';
import { Palette, Code } from 'lucide-react';

const SwitchCard = ({ design, primaryColor, onCustomize, onGetCode }) => {

    const [isChecked, setIsChecked] = useState(false);
    const containerRef = useRef(null);

    const uniqueId = `switch-${design.id}`;

    const dynamicCSS = design.getCss(primaryColor).replaceAll(`.${design.id}`, `#${uniqueId}`);

    const finalHtml = design.html
        .replaceAll('id="cb', `id="${uniqueId}`)
        .replaceAll('for="cb', `for="${uniqueId}`)
        .replaceAll('id="switch', `id="${uniqueId}`)
        .replaceAll('for="switch', `for="${uniqueId}`)
        .replace('<input', `<input onchange="window.toggleSwitch_${uniqueId}(event)"`);

    useEffect(() => {
        window[`toggleSwitch_${uniqueId}`] = (event) => {
            setIsChecked(event.target.checked);
        };

        return () => {
            delete window[`toggleSwitch_${uniqueId}`];
        };
    }, [uniqueId]);

    return (
        <div className="flex flex-col items-center gap-3 group">
            {/* Dynamic Style */}
            <style>{`
                #container-${uniqueId} ${dynamicCSS}
            `}</style>

            {/* Main Card Container */}
            <div
                id={`container-${uniqueId}`}
                ref={containerRef}
                className={`relative w-full h-48 bg-[#FFFFFF] border rounded-xl flex items-center justify-center transition-all duration-300 overflow-hidden
                ${isChecked 
                    ? 'border-[#3B82F6] ring-2 ring-[#3B82F6]/20 shadow-md' 
                    : 'border-[#E5E7EB] hover:border-[#3B82F6] hover:bg-[#F9FAFB]'}`}
            >
                {/* DYNAMIC SWITCH DESIGN */}
                <div className="flex items-center gap-3 select-none scale-[1]">
                    <div
                        dangerouslySetInnerHTML={{ __html: finalHtml }}
                        className="flex items-center justify-center"
                    />
                </div>

                {/* Action Buttons Section */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[#F9FAFB]/90 flex items-center justify-center gap-2 lg:translate-y-full lg:group-hover:translate-y-0 translate-y-0 transition-transform duration-300 ease-in-out border-t border-[#E5E7EB]">
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => onCustomize(design)}
                            className="bg-[#3B82F6] text-[#FFFFFF] px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#2776f5] transition active:scale-95 shadow-sm"
                        >
                            <span className="mr-1">✎</span> Customize
                        </button>
                        <button
                            onClick={() => onGetCode(design)}
                            className="bg-[#3B82F6] text-[#FFFFFF] px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#2776f5] transition active:scale-95 shadow-sm"
                        >
                            <span className="mr-1">{'<>'}</span> Get Code
                        </button>
                    </div>
                </div>
            </div>

            <p className={`text-sm font-medium transition-colors uppercase tracking-tighter ${
                isChecked ? 'text-[#3B82F6]' : 'text-[#6B7280] group-hover:text-[#3B82F6]'
            }`}>
                {design.name}
            </p>
        </div>
    );
};

export default SwitchCard;