import { useState, useRef } from 'react';
import { Upload, RotateCw, Sun, Droplets, FileText, Download, ChevronDown, Image as ImageIcon, File, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PdfScanner() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [scale, setScale] = useState(117);
  const [blur, setBlur] = useState(0);
  const [noise, setNoise] = useState(0);
  const [blackAndWhite, setBlackAndWhite] = useState(false);
  const [paperBorder, setPaperBorder] = useState(false);
  const [highResolution, setHighResolution] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (file) => {
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB', {
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

    // Check file type
    const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
    if (!isValidType) {
      toast.error('Please upload a valid image or PDF file', {
        duration: 3000,
        position: 'top-right',
        icon: '⚠️',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
      return;
    }

    setUploadedFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      toast.success('File uploaded successfully!', {
        duration: 2000,
        position: 'top-right',
        icon: '✅',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const handleRemoveFile = () => {
    setUploadedImage(null);
    setUploadedFileName('');
    setRotation(0);
    setBrightness(1);
    setContrast(1);
    setScale(117);
    setBlur(0);
    setNoise(0);
    setBlackAndWhite(false);
    setPaperBorder(false);
    setHighResolution(false);
    
    toast.success('File removed', {
      duration: 2000,
      position: 'top-right',
      icon: '🗑️',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });
  };

  const getScannedStyle = () => {
    return {
      filter: `
        brightness(${brightness})
        contrast(${contrast})
        blur(${blur}px)
        ${blackAndWhite ? 'grayscale(1)' : 'grayscale(0)'}
      `,
      transform: `rotate(${rotation}deg) scale(${scale / 100})`,
      opacity: noise > 0 ? 0.95 : 1,
    };
  };

  const downloadAsPDF = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    const loadingToast = toast.loading('Generating PDF...', {
      position: 'top-right',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      
      img.crossOrigin = 'anonymous';
      
      img.onload = async () => {
        // Set canvas size
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Fill white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Apply transformations
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale / 100, scale / 100);
        
        // Apply filters
        ctx.filter = `
          brightness(${brightness})
          contrast(${contrast})
          blur(${blur}px)
          ${blackAndWhite ? 'grayscale(1)' : 'grayscale(0)'}
        `;
        
        ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
        ctx.restore();
        
        // Get image data URL
        const imgDataUrl = canvas.toDataURL('image/jpeg', 0.95);
        
        // Create jsPDF instance - import from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => {
          const { jsPDF } = window.jspdf;
          
          // Calculate PDF dimensions (A4 size)
          const pdfWidth = 210; // A4 width in mm
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          
          // Create PDF
          const pdf = new jsPDF({
            orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
            unit: 'mm',
            format: [pdfWidth, pdfHeight]
          });
          
          // Add image to PDF
          pdf.addImage(imgDataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          
          // Save PDF
          pdf.save('scanned-document.pdf');
          
          toast.success('PDF downloaded successfully!', {
            id: loadingToast,
            duration: 2000,
            icon: '📥',
            style: {
              background: '#F9FAFB',
              color: '#0B1220',
              border: '1px solid #E5E7EB',
            },
          });
          setIsProcessing(false);
        };
        
        document.head.appendChild(script);
      };
      
      img.src = uploadedImage;
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF', {
        id: loadingToast,
        duration: 3000,
        icon: '❌',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
      setIsProcessing(false);
    }
    
    setShowDropdown(false);
  };

  const downloadAsImage = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    const loadingToast = toast.loading('Generating image...', {
      position: 'top-right',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      
      img.onload = () => {
        // Set canvas size
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Apply transformations
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale / 100, scale / 100);
        
        // Apply filters
        ctx.filter = `
          brightness(${brightness})
          contrast(${contrast})
          blur(${blur}px)
          ${blackAndWhite ? 'grayscale(1)' : 'grayscale(0)'}
        `;
        
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'scanned-document.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          toast.success('Image downloaded successfully!', {
            id: loadingToast,
            duration: 2000,
            icon: '📥',
            style: {
              background: '#F9FAFB',
              color: '#0B1220',
              border: '1px solid #E5E7EB',
            },
          });
          setIsProcessing(false);
        }, 'image/png');
      };
      
      img.src = uploadedImage;
    } catch (error) {
      console.error('Image generation error:', error);
      toast.error('Failed to generate image', {
        id: loadingToast,
        duration: 3000,
        icon: '❌',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
      setIsProcessing(false);
    }
    
    setShowDropdown(false);
  };

  return (
    <div className="bg-[#F9FAFB] py-8 px-4 sm:px-6 lg:px-8 font-manrope">
      <div className="max-w-5xl mx-auto">

        {/* Upload Area */}
        <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E5E7EB] p-6 mb-8">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-3 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#3B82F6] bg-[#F9FAFB] scale-[1.01]'
                : 'border-[#E5E7EB] hover:border-[#3B82F6] hover:bg-[#F9FAFB]'
            }`}
          >
            <div className={`transition-all duration-300 ${isDragging ? 'scale-105' : ''}`}>
              <Upload className="w-12 h-12 mx-auto mb-4 text-[#3B82F6]" />
              <p className="text-[#111827] text-lg mb-1">
                {isDragging ? 'Drop your file here' : 'Drag your file here, or click to'}
                <span className="text-[#3B82F6] font-semibold ml-1 underline decoration-2 underline-offset-4">
                  browse
                </span>
              </p>
              <p className="text-sm text-[#6B7280]">PDF, DOCX, and Image files (JPEG, PNG, WEBP, GIF)</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          <p className="text-xs text-[#6B7280] mt-3 text-center">
            * Max file size: 10MB
          </p>
        </div>

        {/* Scanner Settings */}
        {uploadedImage && (
          <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E5E7EB] p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#F9FAFB] rounded-lg flex items-center justify-center border border-[#E5E7EB]">
                  <div className="w-3 h-3 border-2 border-[#3B82F6] rounded-sm"></div>
                </div>
                <h2 className="text-lg font-semibold text-[#111827]">Scanner Settings</h2>
              </div>
              <button
                onClick={handleRemoveFile}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors border border-transparent hover:border-[#FEE2E2]"
              >
                <X className="w-4 h-4" />
                Remove File
              </button>
            </div>

            {/* File Info */}
            <div className="bg-[#F9FAFB] rounded-xl p-4 mb-6 border border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFFFFF] rounded-lg flex items-center justify-center border border-[#E5E7EB]">
                  <File className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div>
                  <p className="font-medium text-[#111827]">{uploadedFileName}</p>
                  <p className="text-xs text-[#6B7280]">Ready to scan</p>
                </div>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Rotation */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-[#6B7280] flex items-center gap-2">
                    <RotateCw className="w-4 h-4 text-[#3B82F6]" />
                    Rotation
                  </label>
                  <span className="text-sm font-bold text-[#3B82F6] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                    {rotation}°
                  </span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.1"
                  value={rotation}
                  onChange={(e) => setRotation(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                />
              </div>

              {/* Brightness */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-[#6B7280] flex items-center gap-2">
                    <Sun className="w-4 h-4 text-[#3B82F6]" />
                    Brightness
                  </label>
                  <span className="text-sm font-bold text-[#3B82F6] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                    {brightness.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.01"
                  value={brightness}
                  onChange={(e) => setBrightness(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-[#6B7280] flex items-center gap-2">
                    <Sun className="w-4 h-4 text-[#3B82F6]" />
                    Contrast
                  </label>
                  <span className="text-sm font-bold text-[#3B82F6] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                    {contrast.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.01"
                  value={contrast}
                  onChange={(e) => setContrast(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                />
              </div>

              {/* Scale */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-[#6B7280] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#3B82F6]" />
                    Scale
                  </label>
                  <span className="text-sm font-bold text-[#3B82F6] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                    {scale}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  step="1"
                  value={scale}
                  onChange={(e) => setScale(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                />
              </div>

              {/* Blur */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-[#6B7280] flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-[#3B82F6]" />
                    Blur
                  </label>
                  <span className="text-sm font-bold text-[#3B82F6] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                    {blur.toFixed(2)}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.01"
                  value={blur}
                  onChange={(e) => setBlur(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                />
              </div>

              {/* Noise */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-[#6B7280] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#3B82F6]" />
                    Noise
                  </label>
                  <span className="text-sm font-bold text-[#3B82F6] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                    {noise.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={noise}
                  onChange={(e) => setNoise(parseFloat(e.target.value))}
                  className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={blackAndWhite}
                  onChange={(e) => setBlackAndWhite(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#3B82F6] focus:ring-[#3B82F6] focus:ring-offset-0"
                />
                <span className="text-sm text-[#111827]">Black & White</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paperBorder}
                  onChange={(e) => setPaperBorder(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#3B82F6] focus:ring-[#3B82F6] focus:ring-offset-0"
                />
                <span className="text-sm text-[#111827]">Paper Border</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={highResolution}
                  onChange={(e) => setHighResolution(e.target.checked)}
                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#3B82F6] focus:ring-[#3B82F6] focus:ring-offset-0"
                />
                <span className="text-sm text-[#111827]">High Resolution</span>
              </label>
            </div>
          </div>
        )}

        {/* Preview Section */}
        {uploadedImage && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Original Document */}
            <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#F9FAFB] rounded-lg flex items-center justify-center border border-[#E5E7EB]">
                  <FileText className="w-3 h-3 text-[#3B82F6]" />
                </div>
                <h3 className="text-base font-semibold text-[#111827]">Original Document</h3>
              </div>
              <div className="bg-[#F9FAFB] rounded-xl aspect-square flex items-center justify-center p-4 overflow-hidden border border-[#E5E7EB]">
                <img
                  src={uploadedImage}
                  alt="Original"
                  className="max-w-full max-h-full object-contain rounded"
                />
              </div>
            </div>

            {/* Scanned Output */}
            <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#F9FAFB] rounded-lg flex items-center justify-center border border-[#E5E7EB]">
                  <div className="w-3 h-3 border-2 border-[#3B82F6] rounded-sm"></div>
                </div>
                <h3 className="text-base font-semibold text-[#111827]">Scanned Output</h3>
              </div>
              <div className="bg-linear-to-br from-[#F9FAFB] to-[#F3F4F6] rounded-xl aspect-square flex items-center justify-center p-4 overflow-hidden border border-[#E5E7EB]">
                <img
                  src={uploadedImage}
                  alt="Scanned"
                  className="max-w-full max-h-full object-contain rounded transition-all duration-300"
                  style={getScannedStyle()}
                />
              </div>
            </div>
          </div>
        )}

        {/* Download Button */}
        {uploadedImage && (
          <div className="flex justify-center">
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                disabled={isProcessing}
                className="bg-[#3B82F6] hover:bg-[#2776f5] disabled:bg-[#9CA3AF] text-white font-semibold px-8 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#3B82F6]/20 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-3 border-white/30 border-t-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download
                    <ChevronDown className={`w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
              
              {showDropdown && uploadedImage && !isProcessing && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-[#FFFFFF] rounded-xl shadow-2xl border border-[#E5E7EB] overflow-hidden z-10 min-w-60">
                  <button
                    onClick={downloadAsPDF}
                    className="w-full px-6 py-3.5 text-left hover:bg-[#F9FAFB] transition-colors text-[#0B1220] font-medium flex items-center gap-2 border-b border-[#E5E7EB]"
                  >
                    <FileText className="w-4 h-4 text-[#3B82F6]" />
                    Download as PDF
                  </button>
                  <button
                    onClick={downloadAsImage}
                    className="w-full px-6 py-3.5 text-left hover:bg-[#F9FAFB] transition-colors text-[#0B1220] font-medium flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-[#3B82F6]" />
                    Download as Image
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Global styles - removed jsx attribute */}
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}