import { useState, useRef } from 'react';
import { Upload, Copy, Download, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SvgStrokeToFill() {
  const [convertedSvg, setConvertedSvg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const uploadAreaRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'image/svg+xml') {
      processFile(file);
    } else {
      toast.error('Please upload a valid SVG file', {
        duration: 3000,
        position: 'top-right',
        icon: '⚠️',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'image/svg+xml') {
      processFile(file);
    } else {
      toast.error('Please upload a valid SVG file', {
        duration: 3000,
        position: 'top-right',
        icon: '⚠️',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const processFile = (file) => {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB', {
        duration: 3000,
        position: 'top-right',
        icon: '📁',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setTimeout(() => {
        try {
          convertStrokeToFill(content);
          toast.success('SVG converted successfully!', {
            duration: 2000,
            position: 'top-right',
            icon: '✅',
            style: {
              background: '#F9FAFB',
              color: '#0B1220',
              border: '1px solid #E5E7EB',
            },
          });
        } catch {
          toast.error('Failed to convert SVG', {
            duration: 3000,
            position: 'top-right',
            icon: '❌',
            style: {
              background: '#F9FAFB',
              color: '#0B1220',
              border: '1px solid #E5E7EB',
            },
          });
        } finally {
          setIsProcessing(false);
        }
      }, 500);
    };
    
    reader.onerror = () => {
      toast.error('Failed to read file', {
        duration: 3000,
        position: 'top-right',
        icon: '❌',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
      setIsProcessing(false);
    };
    
    reader.readAsText(file);
  };

  const convertStrokeToFill = (svgString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svg = doc.querySelector('svg');

    if (!svg) {
      throw new Error('Invalid SVG file');
    }

    // Remove fill="none" from svg element
    if (svg.getAttribute('fill') === 'none') {
      svg.removeAttribute('fill');
    }

    // Process all elements with stroke
    const strokedElements = svg.querySelectorAll('[stroke]');
    
    strokedElements.forEach(el => {
      const stroke = el.getAttribute('stroke');
      
      if (stroke && stroke !== 'none') {
        // Set fill to stroke color
        el.setAttribute('fill', stroke);
        
        // Remove all stroke-related attributes
        el.removeAttribute('stroke');
        el.removeAttribute('stroke-width');
        el.removeAttribute('stroke-linecap');
        el.removeAttribute('stroke-linejoin');
        el.removeAttribute('stroke-dasharray');
        el.removeAttribute('stroke-dashoffset');
        el.removeAttribute('stroke-miterlimit');
        el.removeAttribute('stroke-opacity');
      }
    });

    // Add fill-rule="evenodd" to paths if not present
    const paths = svg.querySelectorAll('path');
    paths.forEach(path => {
      if (!path.getAttribute('fill-rule')) {
        path.setAttribute('fill-rule', 'evenodd');
      }
    });

    const serializer = new XMLSerializer();
    let converted = serializer.serializeToString(svg);
    
    // Clean up the output
    converted = converted
      .replace(/\s+/g, ' ')
      .replace(/> </g, '><')
      .trim();

    setConvertedSvg(converted);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(convertedSvg);
    setCopied(true);
    toast.success('SVG code copied!', {
      duration: 2000,
      position: 'top-right',
      icon: '📋',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([convertedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.replace('.svg', '-converted.svg') || 'converted.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('SVG downloaded!', {
      duration: 2000,
      position: 'top-right',
      icon: '📥',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });
  };

  const handleReset = () => {
    setConvertedSvg('');
    setFileName('');
    setCopied(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Reset successful', {
      duration: 2000,
      position: 'top-right',
      icon: '🔄',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });
  };

  return (
    <div className="bg-[#F9FAFB] p-3 sm:p-6 lg:p-8 font-manrope">
      <div className="max-w-5xl mx-auto">

        {/* Main Card */}
        <div className="bg-[#FFFFFF] rounded-xl shadow border border-[#E5E7EB] overflow-hidden">
          {/* Upload Section */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div
              ref={uploadAreaRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadAreaClick}
              className={`relative border-3 border-dashed rounded-xl p-8 sm:p-10 text-center transition-all duration-300 cursor-pointer ${
                isDragging
                  ? 'border-[#3B82F6] bg-[#F9FAFB] scale-[1.01]'
                  : 'border-[#E5E7EB] hover:border-[#3B82F6] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className={`transition-all duration-300 ${isDragging ? 'scale-105' : ''}`}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F9FAFB] rounded-full mb-4 border border-[#E5E7EB]">
                  <Upload className="w-8 h-8 text-[#3B82F6]" />
                </div>
                <h2 className="text-lg sm:text-xl text-[#111827] mb-2 font-semibold">
                  {isDragging ? 'Drop your SVG here' : 'Drag your SVG here, or click to'}
                  <span className="text-[#3B82F6] font-bold ml-1 underline decoration-2 underline-offset-4">
                    browse
                  </span>
                </h2>
                <p className="text-sm text-[#6B7280] mt-2">Supported: SVG files (Max 5MB)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,image/svg+xml"
                  onChange={handleFileSelect}
                  className="hidden"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="px-6 pb-6 text-center">
              <div className="inline-flex items-center gap-3 bg-[#F9FAFB] px-6 py-3 rounded-full border border-[#E5E7EB]">
                <div className="animate-spin rounded-full h-5 w-5 border-3 border-[#E5E7EB] border-t-[#3B82F6]"></div>
                <span className="text-[#3B82F6] font-medium">Converting SVG...</span>
              </div>
            </div>
          )}

          {/* Results Section */}
          {convertedSvg && !isProcessing && (
            <>
              {/* File Info Bar */}
              <div className="bg-[#F9FAFB] px-4 sm:px-6 lg:px-8 py-3 border-t border-[#E5E7EB] flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 bg-[#10B981]/10 rounded-lg flex items-center justify-center shrink-0 border border-[#10B981]/20">
                    <Check className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#6B7280]">Converted File</p>
                    <p className="font-semibold text-sm text-[#111827] truncate">
                      {fileName.replace('.svg', '-converted.svg')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="p-2 hover:bg-[#FFFFFF] rounded-lg transition-colors shrink-0 border border-transparent hover:border-[#E5E7EB]"
                  title="Upload new file"
                >
                  <X className="w-5 h-5 text-[#6B7280] hover:text-[#3B82F6]" />
                </button>
              </div>

              {/* Preview and Code Section */}
              <div className="p-4 sm:p-6 lg:p-8 bg-[#F9FAFB] space-y-4">
                {/* Preview */}
                <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] overflow-hidden">
                  <div className="bg-linear-to-r from-[#111827] to-[#1F2937] px-4 py-3">
                    <h3 className="text-base font-semibold text-white">Preview</h3>
                  </div>
                  <div className="p-4 sm:p-6 flex items-center justify-center min-h-48 bg-linear-to-br from-[#F9FAFB] to-[#FFFFFF]">
                    <div
                      className="w-full max-w-50 sm:max-w-62.5 flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: convertedSvg }}
                    />
                  </div>
                </div>

                {/* Code Display */}
                <div className="bg-[#111827] rounded-xl overflow-hidden border border-[#374151]">
                  <div className="bg-[#1F2937] px-4 py-3 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-white">Converted SVG Code</h3>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-[#EF4444] rounded-full"></div>
                      <div className="w-3 h-3 bg-[#F59E0B] rounded-full"></div>
                      <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-4 overflow-x-auto max-h-96">
                    <pre className="text-xs sm:text-sm text-[#10B981] font-mono whitespace-pre-wrap break-all leading-relaxed">
                      {convertedSvg}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#FFFFFF] border-2 border-[#E5E7EB] text-[#0B1220] rounded-xl hover:border-[#3B82F6] hover:text-[#3B82F6] hover:bg-[#F9FAFB] transition-all duration-200 font-semibold shadow-sm hover:shadow group"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5 text-[#10B981]" />
                        <span className="text-[#10B981]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Copy SVG Code
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#3B82F6] text-[#FFFFFF] rounded-xl hover:bg-[#2776f5] transition-all duration-200 font-semibold shadow-lg shadow-[#3B82F6]/20 hover:shadow-xl group"
                  >
                    <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Download SVG
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}