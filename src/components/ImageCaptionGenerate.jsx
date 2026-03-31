import { useState } from "react";
import { imageCaptionApi } from "../api/imageCaptionApi";
import { Upload, Copy, Check, Sparkles, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ImageCaptionGenerate = () => {
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // 🔁 Reusable Copy Field
  const CopyField = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Caption copied!', {
        duration: 1500,
        position: 'top-right',
        icon: '📋',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
      setTimeout(() => setCopied(false), 1500);
    };

    return (
      <div className="flex items-center justify-between w-full px-5 py-3 border border-[#E5E7EB] rounded-xl bg-[#FFFFFF] hover:border-[#3B82F6] transition-all group shadow-sm">
        <p className="text-[#0B1220] text-sm flex-1 mr-4">{text}</p>
        <button
          onClick={handleCopy}
          className={`px-4 py-2 text-sm rounded-lg font-medium transition-all flex items-center gap-2 ${
            copied 
              ? 'bg-[#10B981] text-white' 
              : 'bg-[#F9FAFB] text-[#6B7280] hover:bg-[#3B82F6] hover:text-white border border-[#E5E7EB]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
    );
  };

  // 🔁 Handle drag events
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  // 🔁 Handle file upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
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

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    generateCaptions();
    
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

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setCaptions([]);
    toast.success('Image removed', {
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

  // 🔁 Fake API call simulation
  const generateCaptions = () => {
    setLoading(true);
    setCaptions([]);
    
    toast.loading('Generating captions...', {
      id: 'generating',
      position: 'top-right',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });

    setTimeout(() => {
      const allCaptions = imageCaptionApi();
      const randomCaptions = [];
      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * allCaptions.length);
        randomCaptions.push(allCaptions[randomIndex]);
      }
      setCaptions(randomCaptions);
      setLoading(false);
      
      toast.success('Captions generated!', {
        id: 'generating',
        duration: 2000,
        icon: '✨',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
    }, 1500);
  };

  const handleRegenerate = () => {
    if (selectedFile) {
      generateCaptions();
    }
  };

  return (
    <div className="bg-[#F9FAFB] flex flex-col items-center py-8 px-4 font-manrope">
      <div className="w-full max-w-5xl mx-auto">

        {/* Main Card */}
        <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E5E7EB] overflow-hidden">
          {/* Upload Section */}
          <div className="p-6 border-b border-[#E5E7EB]">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-3 border-dashed rounded-xl py-10 px-4 text-center cursor-pointer transition-all duration-300 ${
                isDragging
                  ? 'border-[#3B82F6] bg-[#F9FAFB] scale-[1.01]'
                  : 'border-[#E5E7EB] hover:border-[#3B82F6] hover:bg-[#F9FAFB]'
              }`}
            >
              <label className="cursor-pointer w-full block">
                <div className={`transition-all duration-300 ${isDragging ? 'scale-105' : ''}`}>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F9FAFB] rounded-full mb-4 border border-[#E5E7EB]">
                    <Upload className="w-8 h-8 text-[#3B82F6]" />
                  </div>
                  <p className="text-lg text-[#111827] mb-2">
                    {isDragging ? 'Drop your image here' : 'Drag your image here, or'}
                    <span className="text-[#3B82F6] font-semibold ml-1 underline decoration-2 underline-offset-4">
                      click to browse
                    </span>
                  </p>
                  <p className="text-sm text-[#6B7280]">Supports JPG, PNG, WEBP (Max 10MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* Workspace Display */}
          <div className="bg-[#F9FAFB] p-8 flex flex-col items-center justify-center min-h-80 relative border-b border-[#E5E7EB]">
            {loading ? (
              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-[#FFFFFF] px-6 py-3 rounded-full border border-[#E5E7EB] shadow-sm">
                  <div className="animate-spin rounded-full h-5 w-5 border-3 border-[#E5E7EB] border-t-[#3B82F6]"></div>
                  <span className="text-[#3B82F6] font-medium">AI is thinking...</span>
                </div>
              </div>
            ) : selectedFile ? (
              <div className="relative group">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-96 object-contain rounded-xl shadow-lg border border-[#E5E7EB]"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <ImageIcon className="w-16 h-16 mx-auto text-[#6B7280] mb-3" />
                <p className="text-[#6B7280] text-base">Upload an image to generate captions</p>
              </div>
            )}
          </div>

          {/* Captions Section */}
          <div className="p-6">
            {/* Header with regenerate button */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#111827] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#3B82F6]" />
                Generated Captions
              </h3>
              {selectedFile && (
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    loading
                      ? 'bg-[#E5E7EB] text-[#6B7280] cursor-not-allowed'
                      : 'bg-[#F9FAFB] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white border border-[#E5E7EB]'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Regenerate
                </button>
              )}
            </div>

            {/* Captions list */}
            <div className="space-y-3">
              {loading ? (
                // Skeleton loading state
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between w-full px-5 py-3 border border-[#E5E7EB] rounded-xl bg-[#FFFFFF] animate-pulse"
                  >
                    <div className="h-4 bg-[#E5E7EB] rounded w-2/3"></div>
                    <div className="h-8 bg-[#E5E7EB] rounded w-16"></div>
                  </div>
                ))
              ) : captions.length > 0 ? (
                captions.map((c, i) => <CopyField key={i} text={c} />)
              ) : selectedFile ? (
                <div className="text-center py-8 text-[#6B7280]">
                  <p>No captions generated yet. Click regenerate to get new captions.</p>
                </div>
              ) : (
                // Placeholder captions when no image uploaded
                Array.from({ length: 4 }).map((_, i) => (
                  <CopyField key={i} text="Upload an image to see AI-generated captions" />
                ))
              )}
            </div>

            {/* Info text */}
            <p className="text-xs text-[#6B7280] text-center mt-4">
              AI-generated captions may vary. Click on any caption to copy it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCaptionGenerate;