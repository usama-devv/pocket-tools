import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { PiShareNetworkFill } from "react-icons/pi";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaCopy,
  FaCheck,
} from "react-icons/fa";
import { closeShareModal } from "../../redux/slices/modalSlice";
import toast from 'react-hot-toast';

const ShareModal = () => {
  const dispatch = useDispatch();

  const { isOpen, title } = useSelector((state) => state.share || { isOpen: false, title: "" });

  const [activeTab, setActiveTab] = useState("category");
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareTitle, setShareTitle] = useState("");

  useEffect(() => {
    if (isOpen) {
      const currentPageUrl = window.location.href;
      const baseUrl = window.location.origin;
      
      if (activeTab === "category") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShareUrl(currentPageUrl);
        setShareTitle(title || document.title || "Pocket Tools");
      } else {
        setShareUrl(baseUrl);
        setShareTitle("Pocket Tools - Collection of Free Online Tools");
      }
    }
  }, [isOpen, activeTab, title]);

  if (!isOpen) return null;
  
  const shareFacebook = () => {
    try {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`,
        "_blank",
        "noopener,noreferrer,width=600,height=400"
      );
      toast.success('Shared on Facebook!', {
        duration: 2000,
        icon: '👍',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
    } catch (error) {
      console.error("Facebook share error:", error);
    }
  };

  const shareTwitter = () => {
    try {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(shareTitle)}`,
        "_blank",
        "noopener,noreferrer,width=600,height=400"
      );
      toast.success('Shared on Twitter!', {
        duration: 2000,
        icon: '🐦',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
    } catch (error) {
      console.error("Twitter share error:", error);
    }
  };

  const shareLinkedIn = () => {
    try {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl
        )}`,
        "_blank",
        "noopener,noreferrer,width=600,height=400"
      );
      toast.success('Shared on LinkedIn!', {
        duration: 2000,
        icon: '💼',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
    } catch (error) {
      console.error("LinkedIn share error:", error);
    }
  };

  const shareEmail = () => {
    try {
      window.location.href = `mailto:?subject=${encodeURIComponent(
        shareTitle
      )}&body=${encodeURIComponent(shareUrl)}`;
      toast.success('Email client opened!', {
        duration: 2000,
        icon: '📧',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
    } catch (error) {
      console.error("Email share error:", error);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!', {
        duration: 2000,
        icon: '📋',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy error:", err);
      toast.error('Failed to copy link', {
        duration: 3000,
        icon: '❌',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
    }
  };

  const shareActions = [
    shareFacebook,
    shareTwitter,
    shareLinkedIn,
    shareEmail,
    copyLink,
  ];

  const socialIcons = [
    { icon: <FaFacebookF />, name: 'Facebook', color: '#1877F2' },
    { icon: <FaTwitter />, name: 'Twitter', color: '#1DA1F2' },
    { icon: <FaLinkedinIn />, name: 'LinkedIn', color: '#0A66C2' },
    { icon: <FaEnvelope />, name: 'Email', color: '#EA4335' },
    { icon: copied ? <FaCheck /> : <FaCopy />, name: copied ? 'Copied!' : 'Copy Link', color: '#3B82F6' },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCopied(false); 
  };

  const handleClose = () => {
    dispatch(closeShareModal());
    setActiveTab("category");
    setCopied(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="bg-[#FFFFFF] rounded-2xl shadow-2xl w-[90%] max-w-md p-5 flex flex-col items-center gap-4 border border-[#E5E7EB] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-[#111827]">Share this tool</h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-[#F9FAFB] rounded-full transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#F9FAFB] rounded-xl p-1 w-full border border-[#E5E7EB]">
          <button
            onClick={() => handleTabChange("category")}
            className={`flex items-center justify-center flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all gap-1.5
              ${
                activeTab === "category"
                  ? "bg-[#3B82F6] text-[#FFFFFF] shadow-md"
                  : "text-[#6B7280] hover:text-[#3B82F6] hover:bg-[#FFFFFF]"
              }
            `}
          >
            <IoSettingsOutline className="h-4 w-4" />
            <span>Share Category</span>
          </button>

          <button
            onClick={() => handleTabChange("page")}
            className={`flex items-center justify-center flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all gap-1.5
              ${
                activeTab === "page"
                  ? "bg-[#3B82F6] text-[#FFFFFF] shadow-md"
                  : "text-[#6B7280] hover:text-[#3B82F6] hover:bg-[#FFFFFF]"
              }
            `}
          >
            <IoHomeOutline className="h-4 w-4" />
            <span>Share Pocket Tools</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="border border-[#E5E7EB] rounded-xl p-6 text-center w-full flex justify-center items-center flex-col gap-4 bg-[#F9FAFB]">
          <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">
            {activeTab === "category" ? "You are currently sharing" : "Share our main website"}
          </p>

          <h3 className="text-lg sm:text-xl font-bold text-[#111827] px-2">
            {activeTab === "category" 
              ? (title || "Tool Category")
              : "Pocket Tools - Free Online Tools"
            }
          </h3>

          <div className="flex justify-center">
            <div className="w-12 h-12 bg-[#FFFFFF] rounded-full flex items-center justify-center border border-[#E5E7EB] shadow-sm">
              <PiShareNetworkFill className="h-6 w-6 text-[#3B82F6]" />
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
            {socialIcons.map((item, i) => (
              <button
                key={i}
                onClick={shareActions[i]}
                className="group relative"
                title={item.name}
              >
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full
                    text-white text-base sm:text-lg transition-all
                    hover:scale-110 active:scale-95 shadow-md hover:shadow-lg
                    ${i === 4 && copied ? 'bg-[#10B981]' : ''}`}
                  style={{ 
                    backgroundColor: i === 4 && copied ? '#10B981' : item.color 
                  }}
                >
                  {item.icon}
                </div>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.name}
                </span>
              </button>
            ))}
          </div>

          {/* Direct Link Display */}
          <div className="w-full mt-2">
            <div className="flex items-center gap-2 p-2 bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 text-xs text-[#0B1220] bg-transparent outline-none truncate"
              />
              <button
                onClick={copyLink}
                className="px-3 py-1.5 bg-[#3B82F6] text-[#FFFFFF] text-xs font-bold rounded-md hover:bg-[#2776f5] transition-colors whitespace-nowrap"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Tab-specific message */}
          <p className="text-[10px] text-[#6B7280] mt-1">
            {activeTab === "category" 
              ? "Share this specific tool with your community"
              : "Share Pocket Tools with others"
            }
          </p>
        </div>

        {/* Footer Note */}
        <p className="text-[10px] text-[#6B7280] mt-1">
          Help others discover {activeTab === "category" ? "this tool" : "Pocket Tools"}
        </p>
      </div>
    </div>
  );
};

export default ShareModal;