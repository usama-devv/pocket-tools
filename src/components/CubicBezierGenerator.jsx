import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Copy, RotateCcw, ChevronDown, Sparkles, Eye, Palette } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import toast from 'react-hot-toast';

// Predefined easing functions
const EASING_FUNCTIONS = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1]
};

// Options for CustomSelect
const easingOptions = Object.keys(EASING_FUNCTIONS).map(key => ({
  value: key,
  name: key.charAt(0).toUpperCase() + key.slice(1)
}));

const CubicBezierGenerator = () => {
  const [p1, setP1] = useState({ x: 0.67, y: 0.84 });
  const [p2, setP2] = useState({ x: 0.45, y: 0.15 });
  const [duration, setDuration] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedEasing, setSelectedEasing] = useState('custom');
  const [copiedCSS, setCopiedCSS] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [dragging, setDragging] = useState(null);
  
  const graphRef = useRef(null);

  const GRAPH_SIZE = 260;
  const PADDING = 30;
  const GRAPH_RANGE = GRAPH_SIZE - 2 * PADDING;

  // Convert normalized coordinates to pixel coordinates
  const toPixels = (x, y) => ({
    x: PADDING + x * GRAPH_RANGE,
    y: GRAPH_SIZE - PADDING - y * GRAPH_RANGE
  });

  // Convert pixel coordinates to normalized coordinates
  const toNormalized = useCallback((px, py) => ({
    x: Math.max(0, Math.min(1, (px - PADDING) / GRAPH_RANGE)),
    y: Math.max(-2, Math.min(2, (GRAPH_SIZE - PADDING - py) / GRAPH_RANGE))
  }), [GRAPH_RANGE]);

  const handleMouseMove = useCallback((e) => {
    if (!dragging || !graphRef.current) return;

    const rect = graphRef.current.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    const normalized = toNormalized(x, y);

    if (dragging === 'p1') {
      setP1(normalized);
      setSelectedEasing('custom');
    } else if (dragging === 'p2') {
      setP2(normalized);
      setSelectedEasing('custom');
    }
  }, [dragging, toNormalized]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleMouseDown = (point) => (e) => {
    e.preventDefault();
    setDragging(point);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  // Generate cubic bezier path for visualization
  const generatePath = () => {
    const start = toPixels(0, 0);
    const end = toPixels(1, 1);
    const cp1 = toPixels(p1.x, p1.y);
    const cp2 = toPixels(p2.x, p2.y);

    return `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;
  };

  const generateControlLines = () => {
    const start = toPixels(0, 0);
    const end = toPixels(1, 1);
    const cp1 = toPixels(p1.x, p1.y);
    const cp2 = toPixels(p2.x, p2.y);

    return {
      line1: `M ${start.x} ${start.y} L ${cp1.x} ${cp1.y}`,
      line2: `M ${end.x} ${end.y} L ${cp2.x} ${cp2.y}`
    };
  };

  const getCSSCode = () => {
    return `animation-timing-function: cubic-bezier(${p1.x.toFixed(2)}, ${p1.y.toFixed(2)}, ${p2.x.toFixed(2)}, ${p2.y.toFixed(2)});\nanimation-duration: ${duration}s;`;
  };

  const getCoordinates = () => {
    return `(${p1.x.toFixed(2)}, ${p1.y.toFixed(2)}, ${p2.x.toFixed(2)}, ${p2.y.toFixed(2)})`;
  };

  const handleCopyCSS = () => {
    navigator.clipboard.writeText(getCSSCode());
    setCopiedCSS(true);
    toast.success('CSS code copied!', {
      duration: 2000,
      icon: '📋',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });
    setTimeout(() => setCopiedCSS(false), 2000);
  };

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`cubic-bezier${getCoordinates()}`);
    setCopiedCoords(true);
    toast.success('Coordinates copied!', {
      duration: 2000,
      icon: '📋',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const handleReset = () => {
    setP1({ x: 0.67, y: 0.84 });
    setP2({ x: 0.45, y: 0.15 });
    setDuration(1);
    setSelectedEasing('custom');
    toast.success('Reset successful!', {
      duration: 2000,
      icon: '🔄',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });
  };

  const handleEasingSelect = (e) => {
    const easingName = e.target.value;
    const coords = EASING_FUNCTIONS[easingName];
    setP1({ x: coords[0], y: coords[1] });
    setP2({ x: coords[2], y: coords[3] });
    setSelectedEasing(easingName);
    toast.success(`Selected: ${easingName}`, {
      duration: 1500,
      icon: '✨',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });
  };

  const playAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), duration * 1000);
  };

  const cp1Pixels = toPixels(p1.x, p1.y);
  const cp2Pixels = toPixels(p2.x, p2.y);
  const controlLines = generateControlLines();

  return (
    <div className="min-h-screen bg-[#F9FAFB] md:p-8 font-manrope">
      <div className="max-w-5xl mx-auto">

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Graph */}
          <div className="bg-[#FFFFFF] rounded-xl shadow-xl border border-[#E5E7EB] p-6">
            <div className="mb-6">
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block mb-2">
                Predefined Easing Functions
              </label>
              <CustomSelect
                label=""
                value={selectedEasing === 'custom' ? '' : selectedEasing}
                onChange={handleEasingSelect}
                options={easingOptions}
                searchable={false}
                size="md"
                placeholder="Choose an easing function"
              />
            </div>

            <div className="bg-linear-to-br from-[#F9FAFB] to-[#FFFFFF] rounded-lg p-4 mb-4 border border-[#E5E7EB]">
              <svg
                ref={graphRef}
                width={GRAPH_SIZE}
                height={GRAPH_SIZE}
                className="mx-auto cursor-crosshair"
                style={{ touchAction: 'none' }}
              >
                {/* Grid */}
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E5E7EB" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect x={PADDING} y={PADDING} width={GRAPH_RANGE} height={GRAPH_RANGE} fill="url(#grid)" />
                
                {/* Axes */}
                <line x1={PADDING} y1={PADDING} x2={PADDING} y2={GRAPH_SIZE - PADDING} stroke="#9CA3AF" strokeWidth="2" />
                <line x1={PADDING} y1={GRAPH_SIZE - PADDING} x2={GRAPH_SIZE - PADDING} y2={GRAPH_SIZE - PADDING} stroke="#9CA3AF" strokeWidth="2" />
                
                {/* Arrow heads */}
                <polygon points={`${PADDING},${PADDING-5} ${PADDING-3},${PADDING+2} ${PADDING+3},${PADDING+2}`} fill="#9CA3AF" />
                <polygon points={`${GRAPH_SIZE-PADDING+5},${GRAPH_SIZE-PADDING} ${GRAPH_SIZE-PADDING-2},${GRAPH_SIZE-PADDING-3} ${GRAPH_SIZE-PADDING-2},${GRAPH_SIZE-PADDING+3}`} fill="#9CA3AF" />
                
                {/* Axis labels */}
                <text x={GRAPH_SIZE / 2} y={GRAPH_SIZE - 8} textAnchor="middle" className="text-xs fill-[#6B7280] font-medium">Time</text>
                <text x="10" y={GRAPH_SIZE / 2} textAnchor="start" className="text-xs fill-[#6B7280] font-medium" transform={`rotate(-90, 10, ${GRAPH_SIZE / 2})`}>Progress</text>
                
                {/* Corner labels */}
                <text x={PADDING - 8} y={GRAPH_SIZE - PADDING + 18} textAnchor="end" className="text-xs fill-[#9CA3AF]">(0,0)</text>
                <text x={GRAPH_SIZE - PADDING + 8} y={PADDING - 8} textAnchor="start" className="text-xs fill-[#9CA3AF]">(1,1)</text>
                
                {/* Control lines */}
                <path d={controlLines.line1} stroke="#10B981" strokeWidth="1.5" strokeDasharray="5,5" fill="none" opacity="0.6" />
                <path d={controlLines.line2} stroke="#EF4444" strokeWidth="1.5" strokeDasharray="5,5" fill="none" opacity="0.6" />
                
                {/* Bezier curve */}
                <path d={generatePath()} stroke="#3B82F6" strokeWidth="3" fill="none" strokeLinecap="round" />
                
                {/* Control points */}
                <circle
                  cx={cp1Pixels.x}
                  cy={cp1Pixels.y}
                  r="7"
                  fill="#10B981"
                  stroke="white"
                  strokeWidth="2.5"
                  className="cursor-move hover:scale-110 transition-transform"
                  onMouseDown={handleMouseDown('p1')}
                  onTouchStart={handleMouseDown('p1')}
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                />
                <circle
                  cx={cp2Pixels.x}
                  cy={cp2Pixels.y}
                  r="7"
                  fill="#EF4444"
                  stroke="white"
                  strokeWidth="2.5"
                  className="cursor-move hover:scale-110 transition-transform"
                  onMouseDown={handleMouseDown('p2')}
                  onTouchStart={handleMouseDown('p2')}
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                />
              </svg>
            </div>

            <div className="text-center">
              <p className="text-xs text-[#6B7280] mb-2 font-medium">Cubic Bezier Coordinates</p>
              <button
                onClick={handleCopyCoords}
                className="text-xl font-mono font-bold text-[#111827] hover:text-[#3B82F6] transition-colors px-4 py-2 rounded-lg hover:bg-[#F9FAFB]"
              >
                {getCoordinates()}
              </button>
              {copiedCoords && <p className="text-xs text-[#10B981] mt-2 font-medium">✓ Copied to clipboard!</p>}
            </div>
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-4">
            {/* Animation Duration */}
            <div className="bg-[#FFFFFF] rounded-xl shadow-xl border border-[#E5E7EB] p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-[#111827] font-medium text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#3B82F6]" />
                  Animation Duration
                </label>
                <span className="text-[#3B82F6] font-bold text-lg bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                  {duration}s
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={duration}
                  onChange={(e) => setDuration(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                />
                <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                  <span>0s</span>
                  <span>2.5s</span>
                  <span>5s</span>
                </div>
              </div>
            </div>

            {/* Coordinates Display */}
            <div className="bg-[#FFFFFF] rounded-xl shadow-xl border border-[#E5E7EB] p-5">
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
                    <h3 className="font-semibold text-[#111827] text-sm">P1 (Green Dot)</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs text-[#6B7280]">X1</label>
                        <span className="text-xs font-bold text-[#3B82F6] bg-[#F9FAFB] px-2 py-0.5 rounded-full border border-[#E5E7EB]">
                          {p1.x.toFixed(2)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={p1.x}
                        onChange={(e) => {
                          setP1({ ...p1, x: parseFloat(e.target.value) });
                          setSelectedEasing('custom');
                        }}
                        className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs text-[#6B7280]">Y1</label>
                        <span className="text-xs font-bold text-[#3B82F6] bg-[#F9FAFB] px-2 py-0.5 rounded-full border border-[#E5E7EB]">
                          {p1.y.toFixed(2)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.01"
                        value={p1.y}
                        onChange={(e) => {
                          setP1({ ...p1, y: parseFloat(e.target.value) });
                          setSelectedEasing('custom');
                        }}
                        className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-[#EF4444] rounded-full"></div>
                    <h3 className="font-semibold text-[#111827] text-sm">P2 (Red Dot)</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs text-[#6B7280]">X2</label>
                        <span className="text-xs font-bold text-[#3B82F6] bg-[#F9FAFB] px-2 py-0.5 rounded-full border border-[#E5E7EB]">
                          {p2.x.toFixed(2)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={p2.x}
                        onChange={(e) => {
                          setP2({ ...p2, x: parseFloat(e.target.value) });
                          setSelectedEasing('custom');
                        }}
                        className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#EF4444]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs text-[#6B7280]">Y2</label>
                        <span className="text-xs font-bold text-[#3B82F6] bg-[#F9FAFB] px-2 py-0.5 rounded-full border border-[#E5E7EB]">
                          {p2.y.toFixed(2)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.01"
                        value={p2.y}
                        onChange={(e) => {
                          setP2({ ...p2, y: parseFloat(e.target.value) });
                          setSelectedEasing('custom');
                        }}
                        className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#EF4444]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animation Preview */}
            <div className="bg-[#FFFFFF] rounded-xl shadow-xl border border-[#E5E7EB] p-5">
              <h3 className="font-semibold text-[#111827] mb-3 text-sm flex items-center gap-2">
                <Play className="w-4 h-4 text-[#3B82F6]" />
                Animation Preview
              </h3>
              <div className="relative h-20 bg-[#F9FAFB] rounded-lg overflow-hidden border border-[#E5E7EB]">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-px h-12 bg-[#E5E7EB]"></div>
                <button
                  onClick={playAnimation}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#2776f5] transition-all hover:scale-105"
                  style={{
                    animation: isAnimating ? `slide ${duration}s cubic-bezier(${p1.x}, ${p1.y}, ${p2.x}, ${p2.y}) forwards` : 'none',
                  }}
                >
                  <Play className="w-4 h-4 ml-0.5" fill="white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CSS Code */}
        <div className="bg-[#111827] rounded-xl shadow-xl border border-[#374151] p-6">
          <h3 className="font-semibold text-[#FFFFFF] mb-3 text-sm flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#3B82F6]" />
            Generated CSS
          </h3>
          <pre className="text-sm text-[#10B981] font-mono whitespace-pre-wrap break-all mb-4 leading-relaxed p-4 bg-[#1F2937] rounded-lg border border-[#374151]">
            <span className="text-[#60A5FA]">animation-timing-function</span>: <span className="text-[#F472B6]">cubic-bezier</span>(<span className="text-[#34D399]">{p1.x.toFixed(2)}</span>, <span className="text-[#34D399]">{p1.y.toFixed(2)}</span>, <span className="text-[#34D399]">{p2.x.toFixed(2)}</span>, <span className="text-[#34D399]">{p2.y.toFixed(2)}</span>);{'\n'}
            <span className="text-[#60A5FA]">animation-duration</span>: <span className="text-[#34D399]">{duration}s</span>;
          </pre>
          <div className="flex justify-center gap-3 max-w-md mx-auto">
            <button
              onClick={handleReset}
              className="px-8 py-2.5 bg-[#1F2937] text-[#FFFFFF] rounded-lg hover:bg-[#374151] transition-colors flex items-center justify-center gap-2 text-sm font-medium border border-[#374151]"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleCopyCSS}
              className={`px-8 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                copiedCSS 
                  ? 'bg-[#10B981] text-[#FFFFFF]' 
                  : 'bg-[#3B82F6] text-[#FFFFFF] hover:bg-[#2776f5]'
              }`}
            >
              <Copy className="w-4 h-4" />
              {copiedCSS ? 'Copied!' : 'Copy CSS'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-[10px] text-[#6B7280]">
          Drag the green and red dots to create custom easing curves • Click on predefined functions for presets
        </div>
      </div>

      <style>{`
        @keyframes slide {
          from {
            left: 0.5rem;
          }
          to {
            left: calc(100% - 3.5rem);
          }
        }
        
        input[type="range"] {
          -webkit-appearance: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: white;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid #3B82F6;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: white;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid #3B82F6;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default CubicBezierGenerator;