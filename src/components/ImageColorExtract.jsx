import { Copy, Check, Upload, Settings } from "lucide-react";
import { useState } from "react";
import toast from 'react-hot-toast';
import CustomSelect from '../components/CustomSelect';

export default function ImageColorExtract() {
  const [image, setImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [count, setCount] = useState(5);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  // Color count options for CustomSelect
  const countOptions = [...Array(10)].map((_, i) => ({
    value: (i + 1).toString(),
    name: `${i + 1} ${i === 0 ? 'Color' : 'Colors'}`
  }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file) => {
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
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file', {
        duration: 3000,
        position: 'top-right',
        icon: '🖼️',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
      return;
    }

    setIsExtracting(true);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      extractColors(reader.result, count);
      
      toast.success('Image uploaded successfully!', {
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

  const extractColors = (src, colorCount) => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const pixels = ctx.getImageData(0, 0, img.width, img.height).data;
      const map = {};

      // SAMPLE EVERY 10th PIXEL (IMPORTANT)
      for (let i = 0; i < pixels.length; i += 40) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        const key = `${Math.round(r / 10) * 10},${Math.round(
          g / 10
        ) * 10},${Math.round(b / 10) * 10}`;

        map[key] = (map[key] || 0) + 1;
      }

      const sorted = Object.entries(map)
        .sort((a, b) => b[1] - a[1])
        .slice(0, colorCount)
        .map(([rgb]) => {
          const [r, g, b] = rgb.split(",").map(Number);
          return {
            rgb: `rgb(${r}, ${g}, ${b})`,
            hex: `#${((1 << 24) + (r << 16) + (g << 8) + b)
              .toString(16)
              .slice(1)}`
          };
        });

      setColors(sorted);
      setIsExtracting(false);
      
      toast.success(`${colorCount} colors extracted!`, {
        duration: 2000,
        position: 'top-right',
        icon: '🎨',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
    };
  };

  const handleCountChange = (e) => {
    const newCount = Number(e.target.value);
    setCount(newCount);
    if (image) {
      setIsExtracting(true);
      extractColors(image, newCount);
    }
  };

  const copyAll = () => {
    if (colors.length === 0) {
      toast.error('No colors to copy!', {
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

    const text = colors.map((c) => c.hex).join(", ");
    navigator.clipboard.writeText(text);
    
    toast.success('All colors copied to clipboard!', {
      duration: 2000,
      position: 'top-right',
      icon: '📋',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });
  };

  const copyColor = (color, index) => {
    navigator.clipboard.writeText(color.hex);
    setCopiedIndex(index);
    
    toast.success(`${color.hex} copied!`, {
      duration: 1500,
      position: 'top-right',
      icon: '🎨',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });
    
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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
    if (file) processFile(file);
  };

  const handleReset = () => {
    setImage(null);
    setColors([]);
    setCount(5);
    setCopiedIndex(null);
    
    toast.success('All reset!', {
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

  // Helper function to determine text color based on background
  const getTextColor = (hexColor) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate brightness (YIQ formula)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return white for dark backgrounds, dark for light backgrounds
    return brightness < 128 ? '#FFFFFF' : '#111827';
  };

  return (
    <div className="max-w-5xl mx-auto pt-4 px-4 sm:px-6 font-manrope">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer
          ${isDragging 
            ? 'border-[#3B82F6] bg-[#F9FAFB]' 
            : 'border-[#E5E7EB] hover:border-[#3B82F6] hover:bg-[#F9FAFB]'
          } bg-[#FFFFFF]`}
      >
        <input 
          type="file" 
          className="hidden" 
          onChange={handleImage} 
          accept="image/*"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer block">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#F9FAFB] rounded-full flex items-center justify-center border border-[#E5E7EB]">
            <Upload className="w-8 h-8 text-[#3B82F6]" />
          </div>
          <p className="text-[#0B1220] text-lg font-medium mb-1">
            {isDragging ? 'Drop your image here' : 'Drag your image here'}
          </p>
          <p className="text-[#6B7280] text-sm">
            or <span className="text-[#3B82F6] font-semibold hover:text-[#2776f5]">browse files</span>
          </p>
          <p className="text-[#6B7280] text-xs mt-2">Supports PNG, JPG, WEBP (Max 10MB)</p>
        </label>
      </div>

      {/* Image Preview */}
      {image && (
        <div className="relative mt-6 mx-auto max-w-md">
          <img
            src={image}
            alt="Preview"
            className="w-full rounded-xl shadow-lg border border-[#E5E7EB]"
          />
          {isExtracting && (
            <div className="absolute inset-0 bg-[#FFFFFF]/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-[#0B1220] font-medium">Extracting colors...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
        <div className="w-full sm:w-64">
          <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">
            Color Count
          </label>
          <CustomSelect
            label=""
            value={count.toString()}
            onChange={handleCountChange}
            options={countOptions}
            searchable={false}
            size="md"
            disabled={isExtracting}
          />
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          {image && (
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-[#E5E7EB] text-[#6B7280] rounded-xl hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all bg-[#FFFFFF] flex-1 sm:flex-none"
            >
              <Settings className="h-4 w-4" />
              Reset
            </button>
          )}
          
          <button
            onClick={copyAll}
            disabled={colors.length === 0 || isExtracting}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all flex-1 sm:flex-none
              ${colors.length > 0 && !isExtracting
                ? 'bg-[#3B82F6] text-[#FFFFFF] hover:bg-[#2776f5] shadow-lg shadow-[#3B82F6]/20' 
                : 'bg-[#E5E7EB] text-[#6B7280] cursor-not-allowed'
              }`}
          >
            <Copy className="h-4 w-4" />
            Copy All
          </button>
        </div>
      </div>

      {/* Color Cards */}
      {colors.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          {colors.map((c, i) => {
            const textColor = getTextColor(c.hex);
            
            return (
              <div 
                key={i} 
                className="group bg-[#FFFFFF] rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div 
                  className="h-20 relative cursor-pointer"
                  style={{ background: c.hex }}
                  onClick={() => copyColor(c, i)}
                >
                  <div 
                    className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm`}
                    style={{ backgroundColor: `${c.hex}80` }}
                  >
                    {copiedIndex === i ? (
                      <Check className="w-6 h-6" style={{ color: textColor }} />
                    ) : (
                      <Copy className="w-5 h-5" style={{ color: textColor }} />
                    )}
                  </div>
                </div>
                <div className="p-3 text-center">
                  <p className="font-mono font-bold text-sm text-[#111827]">{c.hex}</p>
                  <p className="text-xs text-[#6B7280] mt-1 font-mono truncate">{c.rgb}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {image && colors.length === 0 && !isExtracting && (
        <div className="mt-12 text-center p-8 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
          <p className="text-[#6B7280]">No colors could be extracted from this image.</p>
          <p className="text-xs text-[#6B7280] mt-2">Try a different image or adjust the color count.</p>
        </div>
      )}
    </div>
  );
}