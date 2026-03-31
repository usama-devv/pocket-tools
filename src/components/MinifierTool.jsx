import { useState } from 'react';
import { RotateCcw, ChevronRight, ChevronsRight, Download, Copy, Loader2, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MinifierTool = ({ type, placeholder }) => {
  const [rawCode, setRawCode] = useState('');
  const [minifiedCode, setMinifiedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedPercent, setSavedPercent] = useState(0);
  const [showFooter, setShowFooter] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- Strict Format Validation Logic ---
  const validateCode = (code) => {
    const trimmed = code.trim();
    if (!trimmed) return null;

    if (type === 'html') {
      const isHtml = new RegExp('<[a-z/][\\s\\S]*>', 'i');
      if (!isHtml.test(trimmed)) return "Invalid HTML: No valid tags detected.";
    } 
    else if (type === 'css') {
      const jsKeywords = ['function', 'const ', 'let ', 'var ', 'console.log', '=>'];
      if (jsKeywords.some(keyword => trimmed.includes(keyword))) {
        return "Format Error: This looks like JavaScript, not CSS.";
      }
      if (!trimmed.includes('{') || !trimmed.includes(':')) return "Invalid CSS: Missing selectors or properties.";
    } 
    else if (type === 'js') {
      const htmlTagPattern = new RegExp('<[a-z/][\\s\\S]*>', 'i');
      if (htmlTagPattern.test(trimmed)) return "Format Error: HTML tags detected in JS Minifier.";
      
      const hasCssTraits = trimmed.includes('{') && trimmed.includes(':') && trimmed.includes(';');
      const hasJsTraits = ['function', 'const', 'let', 'var', 'if', 'for', 'return', 'console', '=>', 'import'].some(k => trimmed.includes(k));
      
      if (hasCssTraits && !hasJsTraits) {
         return "Format Error: This looks like CSS. Please use the CSS Minifier.";
      }
    }
    return null;
  };

  const handleMinify = () => {
    if (!rawCode || rawCode.trim() === "") {
      toast.error('Please enter some code!', { duration: 1500 });
      return;
    }
    
    const validationError = validateCode(rawCode);
    if (validationError) {
      setError(validationError);
      setMinifiedCode('');
      setShowFooter(false);
      return;
    }

    setLoading(true);
    setError(null);
    setShowFooter(false);

    // Regex Definitions
    const allSpaces = new RegExp('\\s+', 'g');
    const htmlComments = new RegExp('', 'g');
    const htmlTagGaps = new RegExp('>\\s+<', 'g');
    const cssComments = new RegExp('\\/\\*[\\s\\S]*?\\*\\/', 'g');
    const cssStructure = new RegExp('\\s*([\\{\\}:;,])\\s*', 'g');
    const jsComments = new RegExp('\\/\\*[\\s\\S]*?\\*\\/|([^\\\\:]|^)\\/\\/.*$', 'gm');
    const jsStructure = new RegExp('\\s*([\\=\\+\\-\\*/%&|^!<>?:;,.\\(\\)\\[\\]\\{\\}])\\s*', 'g');

    setTimeout(() => {
      try {
        let result = rawCode;
        if (type === 'html') {
          result = result.replace(htmlComments, '').replace(allSpaces, ' ').replace(htmlTagGaps, '><');
        } else if (type === 'css') {
          result = result.replace(cssComments, '').replace(allSpaces, ' ').replace(cssStructure, '$1');
        } else if (type === 'js') {
          result = result.replace(jsComments, '$1').replace(allSpaces, ' ').replace(jsStructure, '$1');
        }
        
        const finalResult = result.trim();
        setMinifiedCode(finalResult);
        const savings = ((rawCode.length - finalResult.length) / rawCode.length * 100).toFixed(1);
        setSavedPercent(parseFloat(savings) > 0 ? savings : 0);
        setShowFooter(true);
        toast.success('Code minified!', { duration: 1500 });
      } catch {
        setError("Minification failed. Please check syntax.");
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  const handleReset = () => {
    setRawCode('');
    setMinifiedCode('');
    setSavedPercent(0);
    setShowFooter(false);
    setError(null);
    setCopied(false);
    toast.success('Reset done!', { duration: 1500 });
  };

  const handleCopy = () => {
    if (!minifiedCode) {
      toast.error('Nothing to copy!', { duration: 1500 });
      return;
    }
    navigator.clipboard.writeText(minifiedCode);
    setCopied(true);
    toast.success('Copied!', { duration: 1500 });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!minifiedCode) {
      toast.error('Nothing to download!', { duration: 1500 });
      return;
    }
    
    // --- File Naming Logic ---
    let fileName = "";
    if (type === 'html') {
      fileName = "index.min.html";
    } else if (type === 'css') {
      fileName = "style.min.css";
    } else if (type === 'js') {
      fileName = "script.min.js";
    }

    // Creating Blob with correct MIME type
    const mimeType = type === 'html' ? 'text/html' : (type === 'css' ? 'text/css' : 'application/javascript');
    const blob = new Blob([minifiedCode], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', fileName);
    document.body.appendChild(a); 
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded!', { duration: 1500 });
  };

  
  const isActionDisabled = !minifiedCode || error || loading;

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-2 md:p-10 font-manrope">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ROW 1: EQUAL BOXES */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_50px_1fr] gap-1 items-stretch">
          
          <div className="h-100 flex flex-col bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
            <div className="bg-white px-4 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-widest">
              Raw {type.toUpperCase()} Code
            </div>
            <textarea
              className={`flex-1 p-4 outline-none resize-none font-mono text-sm leading-relaxed text-[#111827] ${error ? 'bg-[#FEF2F2]' : ''}`}
              placeholder={placeholder}
              value={rawCode}
              onChange={(e) => {
                setRawCode(e.target.value);
                if(error) setError(null);
                if(minifiedCode) setMinifiedCode('');
              }}
            />
          </div>

          <div className="flex justify-center items-center">
            <ChevronsRight className="hidden lg:block text-[#9CA3AF]" size={32} />
            <ChevronsRight className="lg:hidden rotate-90 text-[#9CA3AF]" size={32} />
          </div>

          <div className="h-100 relative flex flex-col bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
            <div className="bg-white px-4 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-widest">
              Minified {type.toUpperCase()} Code
            </div>
            <textarea
              readOnly
              className="flex-1 p-4 outline-none resize-none font-mono text-sm text-[#3B82F6] bg-[#F9FAFB]"
              value={minifiedCode}
              placeholder="Result will appear here..."
            />

            {error && (
              <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 text-center z-20 animate-in fade-in zoom-in duration-200">
                <AlertCircle className="text-[#EF4444] mb-3" size={48} />
                <h3 className="text-lg font-bold text-[#111827]">Invalid Format</h3>
                <p className="text-[#EF4444] mt-1 text-sm">{error}</p>
              </div>
            )}

            <div className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out transform ${showFooter && !error ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              <div className="bg-[#F0FDF4] border-t border-[#10B981] py-3 text-center shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
                <span className="text-[#10B981] font-bold text-xl">{savedPercent}%</span>
                <span className="text-[#10B981] ml-2 italic text-sm font-medium">saved</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-4">
          <div className="flex justify-center md:justify-start order-2 md:order-1">
            <button onClick={handleReset} className="flex items-center gap-2 px-8 py-3 rounded-full border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] bg-white transition-all font-semibold active:scale-95 w-full md:w-auto justify-center">
              <RotateCcw size={18} /> Reset
            </button>
          </div>

          <div className="flex justify-center order-1 md:order-2">
            <button 
              onClick={handleMinify} 
              disabled={loading || !rawCode} 
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#3B82F6] text-white hover:bg-[#2776f5] transition-all shadow-lg shadow-[#3B82F6]/20 active:scale-95 disabled:opacity-50 justify-center w-full md:w-auto"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                  <span className="font-bold text-lg uppercase tracking-wide">Minify</span>
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>

          <div className="flex justify-center md:justify-end gap-3 order-3">
            <button 
              onClick={handleDownload} 
              disabled={isActionDisabled} 
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-[#3B82F6] bg-white text-[#3B82F6] hover:bg-[#F9FAFB] transition-all font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed flex-1 md:flex-none"
            >
              <Download size={16} /> Download
            </button>
            <button 
              onClick={handleCopy} 
              disabled={isActionDisabled} 
              className={`flex items-center justify-center gap-2 px-10 py-3 rounded-full border transition-all font-bold text-sm flex-1 md:flex-none disabled:opacity-30 disabled:cursor-not-allowed ${
                copied 
                  ? 'border-[#10B981] text-[#10B981] bg-[#F0FDF4]' 
                  : 'border-[#3B82F6] bg-white text-[#3B82F6] hover:bg-[#F9FAFB]'
              }`}
            >
              {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinifierTool;