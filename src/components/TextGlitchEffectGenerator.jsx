import { useState } from "react";
import { Copy, RotateCcw, Check } from "lucide-react";
import CustomSelect from "../components/CustomSelect";
import toast from "react-hot-toast";

const TextGlitchEffectGenerator = () => {
  const [glitchType, setGlitchType] = useState("Glitch with Color");
  const [text, setText] = useState("Glitch");
  const [fontSize, setFontSize] = useState(80);
  const [bgColor, setBgColor] = useState("#111827");
  const [textColor, setTextColor] = useState("#ffffff");
  const [glitchColor1, setGlitchColor1] = useState("#3B82F6");
  const [glitchColor2, setGlitchColor2] = useState("#EC4899");
  const [copied, setCopied] = useState(false);

  const glitchOptions = [
    { value: "Glitch with Color", name: "Glitch with Color" },
    { value: "Glitch with Noise", name: "Glitch with Noise" },
    { value: "Glitch with Transformation", name: "Glitch with Transformation" },
    { value: "All-in-One", name: "All-in-One" },
  ];


  const generateCSS = () => {
    const isColor = glitchType === "Glitch with Color" || glitchType === "All-in-One";
    const isNoise = glitchType === "Glitch with Noise" || glitchType === "All-in-One";
    const isTransform = glitchType === "Glitch with Transformation" || glitchType === "All-in-One";

    const animSpeed1 = isColor && !isTransform && !isNoise ? "0.2s" : "2.5s";
    const animSpeed2 = isColor && !isTransform && !isNoise ? "0.3s" : "2.5s";

    return `.glitch-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background-color: ${bgColor};
  padding: 40px 20px;
}

.glitch {
  position: relative;
  font-size: ${fontSize}px;
  font-weight: bold;
  color: ${textColor};
  letter-spacing: 3px;
  font-family: 'Arial Black', sans-serif;
}

.glitch::before,
.glitch::after {
  content: attr(data-glitch);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  left: 2px;
  text-shadow: -2px 0 ${isColor ? glitchColor1 : "transparent"};
  animation: glitch-1 ${animSpeed1} cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
}

.glitch::after {
  left: -2px;
  text-shadow: 2px 0 ${isColor ? glitchColor2 : "transparent"};
  animation: glitch-2 ${animSpeed2} cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
}

@keyframes glitch-1 {
  0% { transform: translateX(0); clip-path: inset(0 0 0 0); ${isColor ? `text-shadow: 2px 0 ${glitchColor1}, -2px 0 ${glitchColor2};` : ""} }
  20% { transform: translateX(${isTransform ? "-3px" : "0"}); clip-path: inset(${isNoise ? "40% 0 10% 0" : "0 0 0 0"}); ${isColor ? `text-shadow: -2px 0 ${glitchColor1}, 2px 0 ${glitchColor2};` : ""} }
  40% { transform: translateX(${isTransform ? "3px" : "0"}); clip-path: inset(${isNoise ? "80% 0 5% 0" : "0 0 0 0"}); ${isColor ? `text-shadow: 2px 0 ${glitchColor2}, -2px 0 ${glitchColor1};` : ""} }
  60% { transform: translateX(${isTransform ? "-5px" : "0"}); clip-path: inset(${isNoise ? "10% 0 70% 0" : "0 0 0 0"}); ${isColor ? `text-shadow: -2px 0 ${glitchColor2}, 2px 0 ${glitchColor1};` : ""} }
  80% { transform: translateX(${isTransform ? "5px" : "0"}); clip-path: inset(${isNoise ? "50% 0 30% 0" : "0 0 0 0"}); ${isColor ? `text-shadow: 2px 0 ${glitchColor1}, -2px 0 ${glitchColor2};` : ""} }
  100% { transform: translateX(0); clip-path: inset(0 0 0 0); }
}

@keyframes glitch-2 {
  0% { transform: translateX(0); clip-path: inset(0 0 0 0); ${isColor ? `text-shadow: -2px 0 ${glitchColor2}, 2px 0 ${glitchColor1};` : ""} }
  20% { transform: translateX(${isTransform ? "3px" : "0"}); clip-path: inset(${isNoise ? "15% 0 45% 0" : "0 0 0 0"}); ${isColor ? `text-shadow: 2px 0 ${glitchColor1}, -2px 0 ${glitchColor2};` : ""} }
  40% { transform: translateX(${isTransform ? "-3px" : "0"}); clip-path: inset(${isNoise ? "45% 0 15% 0" : "0 0 0 0"}); ${isColor ? `text-shadow: -2px 0 ${glitchColor1}, 2px 0 ${glitchColor2};` : ""} }
  60% { transform: translateX(${isTransform ? "5px" : "0"}); clip-path: inset(${isNoise ? "70% 0 5% 0" : "0 0 0 0"}); ${isColor ? `text-shadow: 2px 0 ${glitchColor2}, -2px 0 ${glitchColor1};` : ""} }
  80% { transform: translateX(${isTransform ? "-5px" : "0"}); clip-path: inset(${isNoise ? "5% 0 85% 0" : "0 0 0 0"}); ${isColor ? `text-shadow: -2px 0 ${glitchColor2}, 2px 0 ${glitchColor1};` : ""} }
  100% { transform: translateX(0); clip-path: inset(0 0 0 0); }
}`;
  };

  const handleCopy = () => {
    const code = `<div class="glitch-wrapper">\n  <div class="glitch" data-glitch="${text}">${text}</div>\n</div>\n\n<style>\n${generateCSS()}\n</style>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied!", { duration: 1500 });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setGlitchType("Glitch with Color");
    setText("Glitch");
    setFontSize(80);
    setBgColor("#111827");
    setTextColor("#ffffff");
    setGlitchColor1("#3B82F6");
    setGlitchColor2("#EC4899");
    toast.success("Reset done!", { duration: 1500 });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-6 font-sans">
      <style>{generateCSS().replace(/.glitch-wrapper/g, ".preview-box")}</style>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* TOP CONTROLS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* CUSTOM SELECT */}
          <div className="md:col-span-4">
            <CustomSelect
              label="Glitch Effect"
              value={glitchType}
              onChange={(e) => setGlitchType(e.target.value)}
              options={glitchOptions}
              searchable={false}
              size="md"
            />
          </div>

          <div className="md:col-span-4 bg-white border border-[#E5E7EB] rounded-lg p-3 px-4 shadow-sm min-h-16 flex flex-col justify-center">
            <label className="block text-xs text-[#6B7280] mb-0.5 font-semibold">Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text..."
              className="w-full bg-transparent text-[15px] font-medium outline-none text-[#111827]"
            />
          </div>

          <div className="md:col-span-4 bg-white border border-[#E5E7EB] rounded-lg p-3 px-4 shadow-sm flex flex-col justify-center min-h-16">
            <label className="text-xs text-[#6B7280] mb-1 font-semibold">
              Font Size: <span className="text-[#3B82F6] font-bold">{fontSize}px</span>
            </label>
            <input
              type="range"
              min="30"
              max="150"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-1.5 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
            />
          </div>
        </div>

        {/* PREVIEW CONTAINER */}
        <div className="preview-box rounded-xl shadow-sm overflow-hidden min-h-87.5 flex items-center justify-center transition-all duration-300 border border-[#E5E7EB]">
          <div className="glitch" data-glitch={text}>{text}</div>
        </div>

        {/* COLOR CONTROLS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Background Color", val: bgColor, set: setBgColor },
            { label: "Text Color", val: textColor, set: setTextColor },
            { label: "Glitch Color #1", val: glitchColor1, set: setGlitchColor1 },
            { label: "Glitch Color #2", val: glitchColor2, set: setGlitchColor2 },
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-[#E5E7EB] rounded-lg p-3 px-4 flex items-center gap-3 shadow-sm hover:border-[#3B82F6] transition-colors">
              <div className="w-9 h-9 rounded shadow-inner overflow-hidden relative shrink-0 border border-[#E5E7EB]">
                <input
                  type="color"
                  value={item.val}
                  onChange={(e) => item.set(e.target.value)}
                  className="absolute -inset-2 w-14 h-14 cursor-pointer"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-tight mb-0.5">{item.label}</span>
                <input
                  type="text"
                  value={item.val}
                  onChange={(e) => item.set(e.target.value)}
                  className="text-[13px] font-mono font-semibold outline-none w-20 uppercase text-[#111827]"
                />
              </div>
            </div>
          ))}
        </div>

        {/* CODE BOX */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-2 border-b border-[#E5E7EB] bg-[#F9FAFB] flex justify-between items-center">
            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">HTML & CSS Code</span>
          </div>
          <pre className="p-6 text-[13px] leading-relaxed font-mono overflow-x-auto max-h-64 bg-white">
            <code className="text-[#3B82F6]">{"<div"}</code> <code className="text-[#EC4899]">{"class"}</code>=<code className="text-[#10B981]">{'"glitch-wrapper"'}</code>{">"}{"\n"}
            {"  "}<code className="text-[#3B82F6]">{"<div"}</code> <code className="text-[#EC4899]">{"class"}</code>=<code className="text-[#10B981]">{'"glitch"'}</code> <code className="text-[#EC4899]">{"data-glitch"}</code>=<code className="text-[#10B981]">{`"${text}"`}</code>{">"}{text}<code className="text-[#3B82F6]">{"</div>"}\n</code>
            <code className="text-[#3B82F6]">{"</div>"}</code>
            {"\n\n"}
            <code className="text-[#3B82F6]">{"<style>"}</code>{"\n"}
            <code className="text-[#111827]">{generateCSS()}</code>{"\n"}
            <code className="text-[#3B82F6]">{"</style>"}</code>
          </pre>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 justify-center pt-4 pb-12">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-10 py-3 bg-white border border-[#E5E7EB] text-[#6B7280] rounded-full font-bold hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all active:scale-95 shadow-sm"
          >
            <RotateCcw size={18} /> Reset
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-14 py-3 rounded-full font-bold transition-all active:scale-95 shadow-lg ${
              copied ? "bg-[#10B981] text-white" : "bg-[#3B82F6] text-white hover:bg-[#2776f5]"
            }`}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "Copied!" : "Copy Snippet"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextGlitchEffectGenerator;