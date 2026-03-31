import { useState, useEffect, useRef, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import toast from 'react-hot-toast';

const BorderRadiusGenerator = () => {
    // 8 values representing the 8 handles (percentages)
    const [v, setV] = useState({
        tlx: 30, tly: 30, trx: 70, try: 30,
        brx: 70, bry: 70, blx: 30, bly: 70
    });

    const [previewType, setPreviewType] = useState('Image');
    const [dim, setDim] = useState({ w: 400, h: 400 });
    const [merge, setMerge] = useState(false);
    const [hide, setHide] = useState(false);
    const [active, setActive] = useState(null);
    const [copied, setCopied] = useState(false);

    const boxRef = useRef(null);

    // Options for CustomSelect
    const previewOptions = [
        { value: 'Image', name: 'Image' },
        { value: 'Gradient', name: 'Gradient' },
        { value: 'Solid Color', name: 'Solid Color' }
    ];

    // When Merge is toggled, reset to circle (50%) or default 8-point
    useEffect(() => {
        if (merge) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setV({ tlx: 50, tly: 50, trx: 50, try: 50, brx: 50, bry: 50, blx: 50, bly: 50 });
        } else {
            setV({ tlx: 30, tly: 30, trx: 70, try: 30, brx: 70, bry: 70, blx: 30, bly: 70 });
        }
    }, [merge]);

    const getCSS = () => {
        const { tlx, tly, trx, try: ty, brx, bry, blx, bly } = v;
        return `${Math.round(tlx)}% ${Math.round(100 - trx)}% ${Math.round(100 - brx)}% ${Math.round(blx)}% / ${Math.round(tly)}% ${Math.round(ty)}% ${Math.round(100 - bry)}% ${Math.round(100 - bly)}%`;
    };

    const handleMove = useCallback((e) => {
        if (!active || !boxRef.current) return;

        const rect = boxRef.current.getBoundingClientRect();
        const x = Math.round(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
        const y = Math.round(Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)));

        setV(prev => {
            const n = { ...prev };
            if (merge) {
                // 4 Handles mapping centered on edges
                if (active === 'top') { n.tlx = x; n.trx = x; }
                if (active === 'right') { n.try = y; n.bry = y; }
                if (active === 'bottom') { n.blx = x; n.brx = x; }
                if (active === 'left') { n.tly = y; n.bly = y; }
            } else {
                // 8 Handles mapping - Fixed handle IDs
                if (active === 'tlx') n.tlx = x; if (active === 'tly') n.tly = y;
                if (active === 'trx') n.trx = x; if (active === 'try') n.try = y;
                if (active === 'brx') n.brx = x; if (active === 'bry') n.bry = y;
                if (active === 'blx') n.blx = x; if (active === 'bly') n.bly = y;
            }
            return n;
        });
    }, [active, merge]);

    useEffect(() => {
        const up = () => setActive(null);
        if (active) {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', up);
        }
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', up);
        };
    }, [active, handleMove]);

    const handleReset = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setV({
            tlx: 30, tly: 30, trx: 70, try: 30,
            brx: 70, bry: 70, blx: 30, bly: 70
        });
        setMerge(false);
        setHide(false);
        setPreviewType('Image');
        setDim({ w: 400, h: 400 });
        toast.success('Reset done!', { duration: 1500 });
    };

    const copyToClipboard = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(`border-radius: ${getCSS()};`);
        setCopied(true);
        toast.success('CSS copied!', { duration: 1500 });
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-2 md:p-12 flex flex-col items-center font-manrope">
            <div className="w-full max-w-5xl">

                <div className="bg-white rounded-2xl md:rounded-lg shadow-xl border border-[#E5E7EB] p-5 md:p-8">

                    <div className="relative w-full aspect-square md:aspect-video bg-[#F9FAFB] rounded-2xl flex items-center justify-center mb-8 md:mb-10 border border-[#E5E7EB] overflow-hidden shadow-inner">
                        <div
                            ref={boxRef}
                            style={{
                                width: `${dim.w}px`,
                                height: `${dim.h}px`,
                                transform: `scale(${typeof window !== 'undefined' && window.innerWidth < 640 ? 0.6 : 1})`
                            }}
                            className={`relative transition-all duration-300 flex items-center justify-center ${!hide ? 'border-2 border-dashed border-[#9CA3AF]' : 'border-transparent'}`}
                        >
                            <div
                                style={{ borderRadius: getCSS() }}
                                className="w-full h-full shadow-2xl relative z-10 overflow-hidden"
                            >
                                {previewType === 'Image' && (
                                    <img
                                        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000"
                                        className="w-full h-full object-cover select-none pointer-events-none"
                                        alt="Scenic View"
                                    />
                                )}
                                {previewType === 'Gradient' && (
                                    <div className="w-full h-full bg-linear-to-br from-[#3B82F6] to-[#8B5CF6]" />
                                )}
                                {previewType === 'Solid Color' && (
                                    <div className="w-full h-full bg-[#111827]" />
                                )}
                            </div>

                            {!hide && (
                                <div className="absolute inset-0 z-20 pointer-events-none">
                                    <div className="relative w-full h-full pointer-events-auto">
                                        {merge ? (
                                            <>
                                                <Dot t={0} l={v.tlx} onD={() => setActive('top')} circle />
                                                <Dot t={v.try} l={100} onD={() => setActive('right')} circle />
                                                <Dot t={100} l={v.blx} onD={() => setActive('bottom')} circle />
                                                <Dot t={v.tly} l={0} onD={() => setActive('left')} circle />
                                            </>
                                        ) : (
                                            <>
                                                <Dot t={0} l={v.tlx} onD={() => setActive('tlx')} c="bg-[#3B82F6]" />
                                                <Dot t={v.tly} l={0} onD={() => setActive('tly')} c="bg-[#EC4899]" />
                                                <Dot t={0} l={v.trx} onD={() => setActive('trx')} c="bg-[#EC4899]" />
                                                <Dot t={v.try} l={100} onD={() => setActive('try')} c="bg-[#3B82F6]" />
                                                <Dot t={100} l={v.brx} onD={() => setActive('brx')} c="bg-[#3B82F6]" />
                                                <Dot t={v.bry} l={100} onD={() => setActive('bry')} c="bg-[#EC4899]" />
                                                <Dot t={100} l={v.blx} onD={() => setActive('blx')} c="bg-[#EC4899]" />
                                                <Dot t={v.bly} l={0} onD={() => setActive('bly')} c="bg-[#3B82F6]" />
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-8">
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Preview Type</label>
                            <CustomSelect
                                label=""
                                value={previewType}
                                onChange={(e) => setPreviewType(e.target.value)}
                                options={previewOptions}
                                searchable={false}
                                size="md"
                            />
                        </div>
                        <Slider label="Width" val={dim.w} set={(n) => setDim({ ...dim, w: n })} />
                        <Slider label="Height" val={dim.h} set={(n) => setDim({ ...dim, h: n })} />
                    </div>

                    {/* Checkboxes */}
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-8 pb-8 border-b border-[#E5E7EB] items-start sm:items-center">
                        <Toggle label="Merge Edge Radiuses" check={merge} set={setMerge} />
                        <Toggle label="Hide Guides" check={hide} set={setHide} />
                    </div>

                    {/* Code Output Area */}
                    <div className="bg-[#111827] rounded-xl md:rounded-2xl p-6 md:p-8 text-center shadow-xl relative group overflow-hidden border border-[#374151]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#3B82F6] to-[#8B5CF6]"></div>
                        <code className="text-sm md:text-base font-mono text-[#10B981] block mb-8 md:mb-10 select-all tracking-tight break-all">
                            <span className="text-[#F472B6] font-bold">border-radius:</span> {getCSS()};
                        </code>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 relative z-10">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="w-full sm:w-auto px-8 py-3.5 bg-[#1F2937] text-white rounded-full hover:bg-[#374151] font-bold transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-95 border border-[#374151]"
                            >
                                <RotateCcw size={18} className="group-hover:-rotate-45 transition-transform duration-300" />
                                Reset
                            </button>

                            <button
                                type="button"
                                onClick={copyToClipboard}
                                className={`w-full sm:w-auto px-10 py-3.5 rounded-full font-bold transition-all shadow-lg flex items-center gap-2 min-w-full sm:min-w-40 justify-center cursor-pointer active:scale-95 ${copied
                                        ? 'bg-[#10B981] text-white'
                                        : 'bg-[#3B82F6] text-white hover:bg-[#2776f5]'
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <Check size={18} strokeWidth={3} className="animate-in zoom-in" />
                                        <span className="animate-in fade-in">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={18} />
                                        Copy Code
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Internal Components
const Dot = ({ t, l, onD, c, circle }) => (
    <div
        onMouseDown={onD}
        style={{ top: `${t}%`, left: `${l}%` }}
        className={`absolute w-5 h-5 border-2 border-white shadow-xl cursor-pointer -translate-x-1/2 -translate-y-1/2 z-50 hover:scale-150 transition-transform active:scale-95 ${circle ? 'bg-[#3B82F6] rounded-full' : (c + ' rounded-sm')
            }`}
    />
);

const Slider = ({ label, val, set }) => (
    <div className="space-y-3">
        <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">{label}</label>
            <span className="text-xs font-bold text-[#3B82F6] bg-[#F9FAFB] px-2 py-0.5 rounded-full border border-[#E5E7EB]">
                {val}px
            </span>
        </div>
        <input
            type="range"
            min="100"
            max="600"
            value={val}
            onChange={(e) => set(parseInt(e.target.value))}
            className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
        />
        <div className="flex justify-between text-xs text-[#6B7280]">
            <span>100px</span>
            <span>350px</span>
            <span>600px</span>
        </div>
    </div>
);

const Toggle = ({ label, check, set }) => (
    <label className="flex items-center gap-4 cursor-pointer select-none group">
        <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${check
                ? 'bg-[#3B82F6] border-[#3B82F6]'
                : 'bg-white border-[#E5E7EB]'
            }`}>
            {check && <Check size={16} className="text-white" strokeWidth={4} />}
        </div>
        <span className={`text-sm font-medium ${check ? 'text-[#111827]' : 'text-[#6B7280]'}`}>{label}</span>
        <input type="checkbox" className="hidden" checked={check} onChange={(e) => set(e.target.checked)} />
    </label>
);

export default BorderRadiusGenerator;