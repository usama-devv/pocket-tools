import React, { useState, useRef, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Check,
  Upload,
  Download,
  Copy,
  Image as ChevronRight,
  User,
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  Instagram,
} from "lucide-react";
import toast from 'react-hot-toast';

const InstaPostGenerator = () => {
  const [postData, setPostData] = useState({
    theme: "Light",
    username: "usama",
    isVerified: false,
    location: "New York, USA",
    postDate: "2026-01-28T15:51",
    postText:
      "This is a sample post text. @mentions, #hashtags, https://links.com are all automatically converted.",
    avatar: null,
    postImages: [],
    imageCount: 1,
    currentImgIndex: 0,
    likeCount: "1,234",
    commentCount: "1,234",
    isLiked: true,
    isTagged: false,
    hasStory: false,
    showComments: false,
    comments: [
      { username: "usama", text: "I liked the post. Thanks for sharing." },
      { username: "ali", text: "🔥🔥🔥" },
    ],
  });

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [loading, setLoading] = useState(false);

  const postRef = useRef(null);
  const avatarInputRef = useRef(null);
  const postImageInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-area")) {
        setActiveDropdown(null);
        setShowExportMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field, value) => {
    setPostData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e, field) => {
    const files = Array.from(e.target.files);
    
    // File size validation (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (files.some(file => file.size > maxSize)) {
      toast.error('File size should be less than 5MB', { duration: 1500 });
      return;
    }

    if (field === "avatar") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          handleInputChange("avatar", event.target.result);
          toast.success('Avatar uploaded!', { duration: 1500 });
        };
        reader.readAsDataURL(file);
      }
    } else {
      const readers = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(readers).then((images) => {
        setPostData((prev) => ({
          ...prev,
          postImages: [...prev.postImages, ...images].slice(0, prev.imageCount),
        }));
        toast.success(`${images.length} image(s) uploaded!`, { duration: 1500 });
      });
    }
  };

  const updateComment = (index, field, value) => {
    setPostData((prev) => {
      const newComments = [...prev.comments];
      newComments[index] = { ...newComments[index], [field]: value };
      return { ...prev, comments: newComments };
    });
  };

  const exportImage = async (type) => {
    if (!postRef.current) return;
    setLoading(true);
    try {
      const htmlToImage = await import("html-to-image");
      const options = {
        pixelRatio: 3,
        backgroundColor: postData.theme === "Dark" ? "#000000" : "#ffffff",
      };
      if (type === "download") {
        const dataUrl = await htmlToImage.toPng(postRef.current, options);
        const link = document.createElement("a");
        link.download = `insta-post-${postData.username}.png`;
        link.href = dataUrl;
        link.click();
        toast.success("Post downloaded! ✅", { duration: 1500 });
      } else {
        const blob = await htmlToImage.toBlob(postRef.current, options);
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        toast.success("Copied to clipboard! 📋", { duration: 1500 });
      }
    } catch {
      toast.error("Error exporting image", { duration: 1500 });
    }
    setLoading(false);
    setShowExportMenu(false);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-2 font-manrope">

      <div className="max-w-5xl mx-auto space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* LEFT: PREVIEW */}
          <div className="flex justify-center h-full">
            <div
              ref={postRef}
              className={`w-full max-w-117.5 self-start rounded-lg overflow-hidden shadow-sm border border-[#E5E7EB] ${
                postData.theme === "Dark"
                  ? "bg-[#111827] text-white"
                  : "bg-white text-[#111827]"
              }`}
            >
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => avatarInputRef.current.click()}
                    className={`w-10 h-10 rounded-full cursor-pointer overflow-hidden shrink-0 ${
                      postData.hasStory
                        ? "p-0.5 bg-linear-to-tr from-yellow-400 via-red-500 to-purple-600"
                        : "bg-[#F3F4F6]"
                    }`}
                  >
                    <div className="w-full h-full rounded-full border-2 border-white bg-[#F3F4F6] overflow-hidden">
                      {postData.avatar ? (
                        <img
                          src={postData.avatar}
                          className="w-full h-full object-cover"
                          alt="avatar"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6B7280]">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-sm leading-tight">
                        {postData.username}
                      </span>
                      {postData.isVerified && (
                        <BadgeCheck
                          size={16}
                          className="text-[#3B82F6] fill-[#3B82F6]"
                          stroke="white"
                          strokeWidth={1.5}
                        />
                      )}
                      <span className="text-[#6B7280] text-sm ml-1">
                        • 1h
                      </span>
                    </div>
                    <span className="text-xs opacity-80">
                      {postData.location}
                    </span>
                  </div>
                </div>
                <MoreHorizontal size={18} className="text-[#6B7280]" />
              </div>

              <div className="aspect-square border-t border-b border-[#E5E7EB] bg-[#F9FAFB] relative group flex items-center justify-center overflow-hidden">
                {postData.postImages.length > 0 ? (
                  <img
                    src={postData.postImages[postData.currentImgIndex]}
                    className="w-full h-full object-cover"
                    alt="post"
                  />
                ) : (
                  <div
                    className="text-[#9CA3AF] flex flex-col items-center cursor-pointer"
                    onClick={() => postImageInputRef.current.click()}
                  >
                    <Instagram size={170} strokeWidth={2} />
                  </div>
                )}
                {postData.isTagged && (
                  <div className="absolute bottom-3 left-3 z-10 animate-in fade-in zoom-in duration-200">
                    <div className="bg-[#111827]/60 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-white/20">
                      <User size={14} className="text-white" fill="white" />
                    </div>
                  </div>
                )}
                {postData.postImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        handleInputChange(
                          "currentImgIndex",
                          Math.max(0, postData.currentImgIndex - 1)
                        )
                      }
                      className="absolute left-2 bg-white/70 hover:bg-white p-1 rounded-full text-[#111827] transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() =>
                        handleInputChange(
                          "currentImgIndex",
                          Math.min(
                            postData.postImages.length - 1,
                            postData.currentImgIndex + 1
                          )
                        )
                      }
                      className="absolute right-2 bg-white/70 hover:bg-white p-1 rounded-full text-[#111827] transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Heart
                      size={24}
                      className={
                        postData.isLiked 
                          ? "text-[#EF4444] fill-[#EF4444]" 
                          : "text-[#6B7280]"
                      }
                    />
                    <MessageCircle size={24} className="text-[#6B7280]" />
                    <Send size={24} className="text-[#6B7280]" />
                  </div>
                  <Bookmark size={24} className="text-[#6B7280]" />
                </div>
                <p className="font-semibold text-sm text-[#111827]">
                  {postData.likeCount} likes
                </p>
                <div className="text-sm text-[#111827]">
                  <span className="font-semibold mr-2">
                    {postData.username}
                  </span>
                  {postData.postText}
                </div>
                {postData.showComments && (
                  <div className="mt-2 space-y-1 text-sm">
                    <p className="text-[#6B7280]">
                      View all {postData.commentCount} comments
                    </p>
                    {postData.comments.map((c, i) => (
                      <div key={i} className="flex items-start gap-2 text-[#111827]">
                        <span className="font-semibold">{c.username}</span>
                        <span className="flex-1">{c.text}</span>
                        <Heart size={12} className="text-[#6B7280] mt-1" />
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-[#6B7280] text-[10px] uppercase mt-1">
                  {new Date(postData.postDate).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTROLS */}
          <div className="space-y-6 h-full">
            <h2 className="text-xl font-bold text-[#111827]">Post Body</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Theme Dropdown */}
              <div className="relative dropdown-area border border-[#E5E7EB] rounded-lg">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(
                      activeDropdown === "theme" ? null : "theme"
                    );
                  }}
                  className="bg-white px-4 py-2 rounded-lg cursor-pointer flex justify-between items-center"
                >
                  <div>
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">
                      Theme
                    </label>
                    <span className="text-sm font-medium text-[#111827]">
                      {postData.theme}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-[#6B7280]" />
                </div>
                {activeDropdown === "theme" && (
                  <div className="absolute top-full w-full bg-white rounded-lg mt-1 z-50 border border-[#E5E7EB] overflow-hidden shadow-lg">
                    {["Light", "Dark"].map((t) => (
                      <div
                        key={t}
                        onClick={() => {
                          handleInputChange("theme", t);
                          setActiveDropdown(null);
                        }}
                        className="px-6 py-4 text-sm font-medium hover:bg-[#F9FAFB] hover:text-[#3B82F6] cursor-pointer text-[#111827]"
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white px-4 py-2 rounded-lg flex items-end border border-[#E5E7EB]">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={postData.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                    className="w-full bg-transparent outline-none font-medium text-sm text-[#111827]"
                  />
                </div>
                <button
                  onClick={() =>
                    handleInputChange("isVerified", !postData.isVerified)
                  }
                  className={`px-6 py-2.5 rounded-full text-xs font-bold transition-colors ${
                    postData.isVerified
                      ? "bg-[#3B82F6] text-white"
                      : "border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]"
                  }`}
                >
                  Verified
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="bg-white px-4 py-2 rounded-lg border border-[#E5E7EB]">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={postData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full bg-transparent outline-none font-medium text-sm text-[#111827]"
                />
              </div>
              <div className="bg-white px-4 py-2 rounded-lg border border-[#E5E7EB]">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">
                  Post Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={postData.postDate}
                  onChange={(e) =>
                    handleInputChange("postDate", e.target.value)
                  }
                  className="w-full bg-transparent outline-none font-medium text-sm cursor-pointer text-[#111827]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div
                onClick={() => avatarInputRef.current.click()}
                className="bg-white border border-[#E5E7EB] px-4 py-2 rounded-lg cursor-pointer hover:border-[#3B82F6] transition-colors"
              >
                <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">
                  Avatar
                </label>
                <div className="flex items-center gap-2 text-sm font-medium text-[#111827]">
                  <Upload size={16} className="text-[#3B82F6]" /> Click to upload
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "avatar")}
                />
              </div>
              <div
                onClick={() => postImageInputRef.current.click()}
                className="bg-white border border-[#E5E7EB] px-4 py-2 rounded-lg cursor-pointer hover:border-[#3B82F6] transition-colors"
              >
                <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">
                  Post Image
                </label>
                <div className="flex items-center gap-2 text-sm font-medium text-[#111827]">
                  <Upload size={16} className="text-[#3B82F6]" /> Multi Upload
                </div>
                <input
                  ref={postImageInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "postImage")}
                />
              </div>
            </div>

            <div className="bg-white border border-[#E5E7EB] px-4 py-2 rounded-lg">
              <label className="text-[10px] font-bold text-[#6B7280] uppercase">
                Post Text
              </label>
              <textarea
                value={postData.postText}
                onChange={(e) => handleInputChange("postText", e.target.value)}
                className="w-full bg-transparent outline-none font-medium text-sm pt-1 resize-none h-16 text-[#111827]"
              />
            </div>

            {/* Stats Section */}
            <div className="pt-4">
              <h3 className="text-lg font-bold text-[#111827] mb-4">Stats & States</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Count Dropdown */}
                <div className="relative dropdown-area">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(
                        activeDropdown === "count" ? null : "count"
                      );
                    }}
                    className="bg-white border border-[#E5E7EB] px-4 py-2 rounded-lg cursor-pointer flex justify-between items-center h-full"
                  >
                    <div>
                      <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">
                        Count
                      </label>
                      <span className="text-sm font-bold text-[#111827]">
                        {postData.imageCount}
                      </span>
                    </div>
                    <ChevronDown size={14} className="text-[#6B7280]" />
                  </div>
                  {activeDropdown === "count" && (
                    <div className="absolute top-full w-full bg-white rounded-lg mt-1 z-50 max-h-40 overflow-y-auto border border-[#E5E7EB] shadow-lg">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            handleInputChange("imageCount", i + 1);
                            setActiveDropdown(null);
                          }}
                          className="px-4 py-2 text-sm hover:bg-[#F9FAFB] hover:text-[#3B82F6] cursor-pointer text-[#111827]"
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bg-white border border-[#E5E7EB] px-4 py-2 rounded-lg">
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">
                    Likes
                  </label>
                  <input
                    type="text"
                    value={postData.likeCount}
                    onChange={(e) =>
                      handleInputChange("likeCount", e.target.value)
                    }
                    className="w-full bg-transparent outline-none font-bold text-sm text-[#111827]"
                  />
                </div>
                <div className="bg-white border border-[#E5E7EB] px-4 py-2 rounded-lg">
                  <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">
                    Comments
                  </label>
                  <input
                    type="text"
                    value={postData.commentCount}
                    onChange={(e) =>
                      handleInputChange("commentCount", e.target.value)
                    }
                    className="w-full bg-transparent outline-none font-bold text-sm text-[#111827]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                {[
                  { label: "Is post liked by viewer?", key: "isLiked" },
                  { label: "Is someone tagged?", key: "isTagged" },
                  { label: "Has an Instagram story?", key: "hasStory" },
                  { label: "Are comments displayed?", key: "showComments" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        postData[item.key]
                          ? "bg-[#3B82F6] border-[#3B82F6]"
                          : "bg-white border-[#E5E7EB]"
                      }`}
                    >
                      {postData[item.key] && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={postData[item.key]}
                      onChange={() =>
                        handleInputChange(item.key, !postData[item.key])
                      }
                    />
                    <span className="text-xs font-medium text-[#6B7280] group-hover:text-[#3B82F6] transition-colors">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Editing Section */}
        {postData.showComments && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#111827] px-2">Comments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {postData.comments.map((comment, i) => (
                <React.Fragment key={i}>
                  <div className="bg-white px-4 py-2 rounded-lg border border-[#E5E7EB]">
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">
                      User {i + 1}
                    </label>
                    <input
                      type="text"
                      value={comment.username}
                      onChange={(e) =>
                        updateComment(i, "username", e.target.value)
                      }
                      className="w-full bg-transparent outline-none font-bold text-sm text-[#111827]"
                    />
                  </div>
                  <div className="bg-white px-4 py-2 rounded-lg border border-[#E5E7EB]">
                    <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">
                      Text {i + 1}
                    </label>
                    <input
                      type="text"
                      value={comment.text}
                      onChange={(e) => updateComment(i, "text", e.target.value)}
                      className="w-full bg-transparent outline-none font-medium text-sm text-[#111827]"
                    />
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* EXPORT SECTION */}
        <div className="text-center space-y-6 pt-10">
          <p className="text-xs text-[#6B7280]">
            By using Instagram Post Generator, you agree to our{" "}
            <span className="text-[#3B82F6] font-bold cursor-pointer hover:underline">Usage Policy</span>.
          </p>
          <div className="relative inline-block dropdown-area">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowExportMenu(!showExportMenu);
              }}
              disabled={loading}
              className="bg-[#3B82F6] text-white px-10 py-4 rounded-full font-bold flex items-center gap-3 active:scale-95 transition-all hover:bg-[#2776f5] shadow-lg shadow-[#3B82F6]/20 disabled:opacity-50"
            >
              {loading ? 'Exporting...' : 'Export Instagram Post'}
              <ChevronDown size={18} />
            </button>
            {showExportMenu && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-65 bg-white rounded-lg border border-[#E5E7EB] p-1 z-100 overflow-hidden shadow-xl">
                <button
                  onClick={() => exportImage("download")}
                  className="w-full flex items-center gap-3 px-6 py-4 hover:bg-[#F9FAFB] hover:text-[#3B82F6] rounded-lg text-sm font-medium text-left text-[#111827] transition-colors"
                >
                  <Download size={16} className="text-[#3B82F6]" /> Download Image
                </button>
                <button
                  onClick={() => exportImage("copy")}
                  className="w-full flex items-center gap-3 px-6 py-4 hover:bg-[#F9FAFB] hover:text-[#3B82F6] rounded-lg text-sm font-medium text-left text-[#111827] transition-colors border-t border-[#E5E7EB]"
                >
                  <Copy size={16} className="text-[#3B82F6]" /> Copy to Clipboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstaPostGenerator;