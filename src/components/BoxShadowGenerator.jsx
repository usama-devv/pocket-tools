import { useState } from 'react';
import { Copy, RotateCcw, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const BoxShadowGenerator = () => {
  const initialSettings = {
    shape: 'box',
    hOffset: -1,
    vOffset: 0.5,
    blur: 10,
    spread: 3,
    bgColor: '#F9FAFB',
    boxColor: '#3B82F6',
    shadowColor: '#E5E7EB',
    isInset: true,
  };

  const [settings, setSettings] = useState(initialSettings);
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setSettings(initialSettings);
    toast.success('Reset done!', { duration: 1500 });
  };

  const generateCSS = () => {
    const { hOffset, vOffset, blur, spread, shadowColor, isInset } = settings;
    const shadowStr = `${isInset ? 'inset ' : ''}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${shadowColor}`;
    return shadowStr;
  };

  const fullCSS = `box-shadow: ${generateCSS()}; \n-webkit-box-shadow: ${generateCSS()}; \n-moz-box-shadow: ${generateCSS()};`;


  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullCSS);
    setCopied(true);
    toast.success('CSS copied!', { duration: 1500 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-2 md:p-12 font-manrope">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-xl shadow border border-[#E5E7EB] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E7EB]">

            {/* Column 1: Preview Area */}
            <div className="p-8 bg-[#F9FAFB] flex flex-col items-center">
              <div className="flex bg-white p-1 rounded-xl shadow-sm border border-[#E5E7EB] mb-10 w-full justify-between">
                {['box', 'circle', 'header'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSettings({ ...settings, shape: mode })}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                      settings.shape === mode 
                        ? 'bg-[#3B82F6] text-white shadow-md' 
                        : 'text-[#6B7280] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              <div
                className="w-full h-80 flex items-center justify-center rounded-2xl border-2 border-dashed border-[#E5E7EB] relative overflow-hidden"
                style={{ backgroundColor: settings.bgColor }}
              >
                <div
                  className={`transition-all duration-300 ease-out ${
                    settings.shape === 'circle' ? 'rounded-full w-40 h-40' :
                    settings.shape === 'header' ? 'w-full h-20 absolute top-0 left-0' : 'w-40 h-40 rounded-2xl'
                  }`}
                  style={{
                    backgroundColor: settings.boxColor,
                    boxShadow: generateCSS()
                  }}
                />
                {settings.shape === 'header' && (
                  <span className="text-[#6B7280] text-sm mt-20">Header Preview</span>
                )}
              </div>
            </div>

            {/* Column 2: Controls (Sliders) */}
            <div className="p-8 space-y-8">
              <h3 className="text-sm font-bold text-[#6B7280] uppercase tracking-widest mb-4">Geometry</h3>
              <Slider 
                label="Horizontal Offset" 
                value={settings.hOffset} 
                suffix="px" 
                min={-50} 
                max={50} 
                onChange={(v) => setSettings({ ...settings, hOffset: v })} 
              />
              <Slider 
                label="Vertical Offset" 
                value={settings.vOffset} 
                suffix="px" 
                min={-50} 
                max={50} 
                onChange={(v) => setSettings({ ...settings, vOffset: v })} 
              />
              <Slider 
                label="Blur Radius" 
                value={settings.blur} 
                suffix="px" 
                min={0} 
                max={100} 
                onChange={(v) => setSettings({ ...settings, blur: v })} 
              />
              <Slider 
                label="Spread Distance" 
                value={settings.spread} 
                suffix="px" 
                min={-50} 
                max={50} 
                onChange={(v) => setSettings({ ...settings, spread: v })} 
              />
            </div>

            {/* Column 3: Customization (Colors & Inset) */}
            <div className="p-8 space-y-6">
              <h3 className="text-sm font-bold text-[#6B7280] uppercase tracking-widest mb-4">Appearance</h3>
              <ColorPicker 
                label="Background" 
                value={settings.bgColor} 
                onChange={(v) => setSettings({ ...settings, bgColor: v })} 
              />
              <ColorPicker 
                label="Box Color" 
                value={settings.boxColor} 
                onChange={(v) => setSettings({ ...settings, boxColor: v })} 
              />
              <ColorPicker 
                label="Shadow Color" 
                value={settings.shadowColor} 
                onChange={(v) => setSettings({ ...settings, shadowColor: v })} 
              />

              <div
                onClick={() => setSettings({ ...settings, isInset: !settings.isInset })}
                className={`mt-4 p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  settings.isInset 
                    ? 'border-[#3B82F6] bg-[#F9FAFB]' 
                    : 'border-[#E5E7EB] bg-white hover:border-[#9CA3AF]'
                }`}
              >
                <span className={`font-bold ${settings.isInset ? 'text-[#3B82F6]' : 'text-[#6B7280]'}`}>
                  Inset Shadow
                </span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  settings.isInset 
                    ? 'bg-[#3B82F6] border-[#3B82F6]' 
                    : 'border-[#E5E7EB]'
                }`}>
                  {settings.isInset && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
              </div>
            </div>
          </div>

          {/* Code Export Section */}
          <div className="p-8 bg-[#111827] border-t border-[#374151]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">CSS Output</span>
              <div className="flex gap-3">
                <button 
                  onClick={handleReset} 
                  className="p-2 hover:bg-[#1F2937] rounded-lg transition text-[#9CA3AF] hover:text-white" 
                  title="Reset"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all ${
                    copied 
                      ? 'bg-[#10B981] text-white' 
                      : 'bg-[#3B82F6] text-white hover:bg-[#2776f5]'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> 
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> 
                      Copy CSS
                    </>
                  )}
                </button>
              </div>
            </div>
            <pre className="font-mono text-sm leading-relaxed overflow-x-auto p-4 bg-[#1F2937] rounded-xl border border-[#374151]">
              <code className="text-[#10B981]">{fullCSS}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner architecture
const Slider = ({ label, value, min, max, suffix, onChange }) => (
  <div className="group">
    <div className="flex justify-between mb-2">
      <span className="text-sm font-semibold text-[#111827]">{label}</span>
      <span className="text-sm font-mono bg-[#F9FAFB] px-2 py-0.5 rounded text-[#3B82F6] border border-[#E5E7EB]">
        {value}{suffix}
      </span>
    </div>
    <input
      type="range" 
      min={min} 
      max={max} 
      step="0.5" 
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
    />
  </div>
);

const ColorPicker = ({ label, value, onChange }) => (
  <div className="group">
    <span className="text-xs font-bold text-[#6B7280] uppercase mb-2 block">{label}</span>
    <div className="relative flex items-center">
      <input
        type="color" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute w-10 h-10 opacity-0 cursor-pointer z-10"
      />
      <div className="w-full p-3 bg-white border border-[#E5E7EB] rounded-xl flex items-center gap-3 shadow-sm hover:border-[#3B82F6] transition-colors">
        <div className="w-6 h-6 rounded-md shadow-inner border border-[#E5E7EB]" style={{ backgroundColor: value }} />
        <span className="font-mono text-sm uppercase text-[#111827]">{value}</span>
      </div>
    </div>
  </div>
);

export default BoxShadowGenerator;