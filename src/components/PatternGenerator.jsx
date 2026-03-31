import { useState, useEffect } from 'react';
import { Check, Copy, X, Maximize2, Shuffle, RotateCcw, Sparkles, Eye, Palette } from 'lucide-react';
import { patternsData } from '../data/patterns/patternsData';
import CustomSelect from '../components/CustomSelect';
import toast from 'react-hot-toast';

const PatternGenerator = () => {
  const [selectedPattern, setSelectedPattern] = useState(patternsData[0]);
  const [values, setValues] = useState({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Pattern options for CustomSelect
  const patternOptions = patternsData.map(pattern => ({
    value: pattern.id,
    name: pattern.name
  }));

  useEffect(() => {
    const defaultVals = {};
    selectedPattern.inputs.forEach(i => {
      defaultVals[i.id] = i.default;
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues(defaultVals);
  }, [selectedPattern]);

  const handleInputChange = (id, val) => {
    // Check if it's a range input to convert to number
    const input = selectedPattern.inputs.find(i => i.id === id);
    const isRange = input?.type === 'range';
    const finalValue = isRange ? parseInt(val, 10) : val;
    
    setValues(prev => ({ ...prev, [id]: finalValue }));
  };

  const shuffleColors = () => {
    const randomHex = () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    
    setValues(prev => {
      const newValues = { ...prev }; 
      selectedPattern.inputs.forEach(input => {
        if (input.type === 'color') {
          newValues[input.id] = randomHex();
        }
      });
      return newValues;
    });

    toast.success('Colors shuffled!', {
      duration: 2000,
      icon: '🎨',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });
  };

  const getSafeStyle = (patternObj, currentValues) => {
    try {
      if (!patternObj || !patternObj.generate) return {};
      const cssString = patternObj.generate(currentValues);
      
      // String parsing to Object
      const styleObj = {};
      cssString.split(';').forEach(rule => {
        const [prop, val] = rule.split(':');
        if (prop && val) {
          const camelProp = prop.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
          styleObj[camelProp] = val.trim();
        }
      });
      return styleObj;
    } catch (err) {
      console.error("Style Generation Error:", err);
      return { backgroundColor: '#F9FAFB' };
    }
  };

  const copyToClipboard = () => {
    const cssText = selectedPattern.generate(values);
    navigator.clipboard.writeText(cssText);
    setCopied(true);
    
    toast.success('CSS copied to clipboard!', {
      duration: 2000,
      icon: '📋',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const resetToDefault = () => {
    const defaultVals = {};
    selectedPattern.inputs.forEach(i => {
      defaultVals[i.id] = i.default;
    });
    setValues(defaultVals);
    
    toast.success('Reset to default!', {
      duration: 2000,
      icon: '🔄',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });
  };

  const handlePatternChange = (e) => {
    const newPattern = patternsData.find(p => p.id === e.target.value);
    setSelectedPattern(newPattern);
  };

  const currentStyle = getSafeStyle(selectedPattern, values);

  return (
    <div className="min-h-screen bg-[#F9FAFB] md:p-10 font-manrope flex items-center justify-center">
      
      {/* FULL SCREEN MODAL */}
      {isFullScreen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10 bg-[#111827]/80 backdrop-blur-xl">
          <div className="relative w-full h-120 max-w-6xl rounded-xl overflow-hidden shadow-2xl border-4 border-[#FFFFFF] animate-in zoom-in-95 duration-300">
            <div className="absolute inset-0" style={currentStyle}></div>
            <button 
              onClick={() => setIsFullScreen(false)}
              className="absolute top-4 right-4 p-3 bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] rounded-full shadow-lg transition-all hover:scale-110 active:scale-90 border border-[#E5E7EB]"
            >
              <X className="w-5 h-5 text-[#111827]" />
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl bg-[#FFFFFF] rounded-lg border border-[#E5E7EB] overflow-hidden">

        <div className="flex flex-col lg:flex-row">
          
          {/* PREVIEW */}
          <div className="w-full lg:w-1/2 p-8 bg-linear-to-br from-[#F9FAFB] to-[#FFFFFF] flex flex-col items-center justify-center border-r border-[#E5E7EB]">
            <div 
              className="w-full aspect-square rounded-xl shadow-lg border-8 border-[#FFFFFF] transition-all duration-300 overflow-hidden"
              style={currentStyle}
            ></div>
            
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setIsFullScreen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#FFFFFF] text-[#3B82F6] rounded-lg font-medium hover:bg-[#F9FAFB] transition-all border border-[#E5E7EB] shadow-sm"
              >
                <Maximize2 size={18} /> Full Screen
              </button>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="w-full lg:w-1/2 p-6 lg:p-8 space-y-6">
            {/* Pattern Selector with CustomSelect */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block">
                Pattern Design
              </label>
              <CustomSelect
                label=""
                value={selectedPattern.id}
                onChange={handlePatternChange}
                options={patternOptions}
                searchable={true}
                size="lg"
              />
            </div>

            {/* Input Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {selectedPattern.inputs.map((input) => (
                <div key={input.id} className="space-y-2">
                  <label className="text-xs font-medium text-[#111827] flex items-center gap-1">
                    {input.type === 'color' && <Palette className="w-3 h-3 text-[#3B82F6]" />}
                    {input.label}
                  </label>
                  
                  {input.type === 'color' ? (
                    <div className="flex items-center gap-3 p-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg hover:border-[#3B82F6] transition-all">
                      <div className="relative w-8 h-8 shrink-0 overflow-hidden rounded-lg border border-[#E5E7EB] shadow-sm">
                        <input 
                          type="color" 
                          value={values[input.id] || "#000000"}
                          onChange={(e) => handleInputChange(input.id, e.target.value)}
                          className="absolute -inset-4 w-[200%] h-[200%] cursor-pointer border-none"
                        />
                      </div>
                      <span className="text-sm font-mono font-medium text-[#0B1220] uppercase">{values[input.id]}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#6B7280]">{input.min}px</span>
                        <span className="text-xs font-bold text-[#3B82F6] bg-[#F9FAFB] px-2 py-0.5 rounded-full border border-[#E5E7EB]">
                          {values[input.id] || input.default}px
                        </span>
                        <span className="text-xs text-[#6B7280]">{input.max}px</span>
                      </div>
                      <input 
                        type="range" 
                        min={input.min} 
                        max={input.max} 
                        value={values[input.id] || input.default}
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                        className="w-full accent-[#3B82F6] h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Shuffle Button */}
            <button 
              onClick={shuffleColors}
              className="w-full py-3.5 flex items-center justify-center gap-2 bg-[#3B82F6] text-[#FFFFFF] rounded-lg font-semibold hover:bg-[#2776f5] transition-all active:scale-[0.98] shadow-lg shadow-[#3B82F6]/20"
            >
              <Shuffle size={16} /> Shuffle Colors
            </button>
          </div>
        </div>

        {/* CODE PANEL */}
        <div className="p-6 md:p-8 bg-[#111827] border-t border-[#374151]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="w-full md:w-2/3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#3B82F6] rounded-full"></div>
                <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Generated CSS Code</h4>
              </div>
              <div className="bg-[#1F2937] p-4 rounded-lg border border-[#374151] max-h-32 overflow-y-auto custom-scrollbar">
                <code className="text-[#10B981] text-xs sm:text-sm font-mono leading-relaxed block break-all">
                  {selectedPattern.generate(values)}
                </code>
              </div>
              <div className="flex justify-between text-[10px] text-[#6B7280]">
                <span>Length: {selectedPattern.generate(values).length} chars</span>
                <span>Pattern: {selectedPattern.name}</span>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-1/3">
              <button 
                onClick={resetToDefault}
                className="p-3 bg-[#1F2937] hover:bg-[#374151] text-[#9CA3AF] rounded-lg transition-all border border-[#374151]"
                title="Reset to default"
              >
                <RotateCcw size={18} />
              </button>
              <button 
                onClick={copyToClipboard}
                className={`flex-1 py-3 flex items-center justify-center gap-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                  copied 
                  ? 'bg-[#10B981] text-[#FFFFFF]' 
                  : 'bg-[#3B82F6] text-[#FFFFFF] hover:bg-[#2776f5] shadow-lg shadow-[#3B82F6]/20'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy CSS
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#F9FAFB] border-t border-[#E5E7EB] text-center text-[10px] text-[#6B7280]">
          Click on color inputs to change colors • Drag sliders to adjust sizes • Use shuffle for random colors
        </div>
      </div>
    </div>
  );
};

export default PatternGenerator;