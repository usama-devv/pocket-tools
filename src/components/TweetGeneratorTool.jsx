import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Repeat2,
  Heart,
  BarChart2,
  ChevronDown,
  Download,
  Copy,
  Upload,
  Check,
  Bookmark,
  Share,
  User,
  BadgeCheck,
  X,
  FolderOpen
} from "lucide-react";
import toast from 'react-hot-toast';

const TweetGeneratorTool = () => {
  const [theme, setTheme] = useState("Light");
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [name, setName] = useState("Usama Masood");
  const [username, setUsername] = useState("usama");
  const [isVerified, setIsVerified] = useState(true);
  const [tweetDate, setTweetDate] = useState("2026-01-28T17:07");
  const [tweetText, setTweetText] = useState(
    "This is a sample tweet. @mentions, #hashtags, https://links.com are all automatically converted."
  );
  const [stats, setStats] = useState({
    reply: 0,
    retweet: 0,
    like: 0,
    view: 0,
  });

  const [avatar, setAvatar] = useState(null);
  const [tweetImages, setTweetImages] = useState([]);

  const themeRef = useRef(null);
  const exportRef = useRef(null);
  const avatarInputRef = useRef(null);
  const tweetCardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeRef.current && !themeRef.current.contains(event.target))
        setIsThemeOpen(false);
      if (exportRef.current && !exportRef.current.contains(event.target))
        setIsExportOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = async (action) => {
    setIsProcessing(true);
    try {
      const { toPng, toBlob } = await import("html-to-image");
      if (!tweetCardRef.current) return;

      if (action === "download") {
        const dataUrl = await toPng(tweetCardRef.current, {
          cacheBust: true,
          pixelRatio: 3,
          backgroundColor:
            theme === "Light"
              ? "#ffffff"
              : theme === "Dark"
              ? "#111827"
              : "#15202b",
        });
        const link = document.createElement("a");
        link.download = `tweet-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        toast.success("Tweet downloaded successfully!", { duration: 1500 });
      } else if (action === "copy") {
        const blob = await toBlob(tweetCardRef.current, { pixelRatio: 3 });
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        toast.success("Tweet copied to clipboard!", { duration: 1500 });
      }
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Something went wrong!", { duration: 1500 });
    } finally {
      setIsProcessing(false);
      setIsExportOpen(false);
    }
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // File size validation (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB", { duration: 1500 });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "avatar") {
        setAvatar(reader.result);
        toast.success("Avatar uploaded!", { duration: 1500 });
      } else if (tweetImages.length < 4) {
        setTweetImages([...tweetImages, reader.result]);
        toast.success("Image uploaded!", { duration: 1500 });
      }
    };
    reader.readAsDataURL(file);
  };

  const getCardThemeStyles = () => {
    if (theme === "Dark") return "bg-[#111827] text-white border-[#374151]";
    if (theme === "Dim") return "bg-[#15202b] text-white border-[#2D3748]";
    return "bg-white text-[#111827] border-[#E5E7EB]";
  };

  const renderImageGrid = () => {
    const count = tweetImages.length;
    if (count === 0) return null;
    const gridConfigs = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-2",
      4: "grid-cols-2",
    };

    return (
      <div
        className={`mt-3 grid gap-0.5 rounded-2xl overflow-hidden border ${
          theme === "Light" ? "border-[#E5E7EB]" : "border-[#374151]"
        } ${gridConfigs[count]}`}
      >
        {tweetImages.map((img, i) => (
          <div
            key={i}
            className={`relative ${
              count === 3 && i === 0 ? "row-span-2 h-full" : "h-32 md:h-48"
            }`}
          >
            <img src={img} className="w-full h-full object-cover" alt="tweet" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-manrope p-1 md:p-8 relative">

      <div className="max-w-5xl mx-auto space-y-6">
        {/* PREVIEW */}
        <div className="w-full bg-white border border-[#E5E7EB] rounded-lg p-4 md:p-16 flex justify-center items-center overflow-hidden">
          <div
            ref={tweetCardRef}
            className={`w-full max-w-137.5 border rounded-lg p-3 md:p-4 transition-all duration-300 ${getCardThemeStyles()}`}
          >
            <div className="flex gap-2 md:gap-3">
              <div
                onClick={() => avatarInputRef.current.click()}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F3F4F6] overflow-hidden shrink-0 cursor-pointer border border-[#E5E7EB]"
              >
                {avatar ? (
                  <img
                    src={avatar}
                    className="w-full h-full object-cover"
                    alt="avatar"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#6B7280]">
                    <User size={20} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-1 overflow-hidden">
                    <div className="flex items-center gap-1">
                      <span className="font-bold truncate text-sm md:text-base text-[#111827]">
                        {name}
                      </span>
                      {isVerified && (
                        <BadgeCheck
                          size={17}
                          className="text-[#3B82F6] fill-[#3B82F6] shrink-0"
                          stroke="white"
                          strokeWidth={1.5}
                        />
                      )}
                    </div>
                    <span className="text-[#6B7280] truncate text-xs md:text-sm">
                      @{username}
                    </span>
                  </div>
                  <div className="text-[#6B7280] font-bold tracking-widest text-xs">
                    ···
                  </div>
                </div>
                <p className="mt-1 text-sm md:text-base leading-normal whitespace-pre-wrap wrap-break-word text-[#111827]">
                  {tweetText}
                </p>
                {renderImageGrid()}

                <div className="mt-3 text-[#6B7280] text-sm">
                  {tweetDate.replace("T", " ")}
                </div>

                <div className="mt-4 flex justify-between text-[#6B7280] max-w-full">
                  <div className="flex items-center gap-1 md:gap-1.5">
                    <MessageCircle size={17} />
                    <span className="text-[10px] md:text-xs">
                      {stats.reply}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-1.5">
                    <Repeat2 size={17} />
                    <span className="text-[10px] md:text-xs">
                      {stats.retweet}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-1.5">
                    <Heart size={17} />
                    <span className="text-[10px] md:text-xs">{stats.like}</span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-1.5">
                    <BarChart2 size={17} />
                    <span className="text-[10px] md:text-xs">{stats.view}</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <Bookmark size={17} />
                    <Share size={17} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Theme Dropdown */}
            <div className="relative" ref={themeRef}>
              <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest absolute top-2 left-4 z-10">
                Theme
              </label>
              <button
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="w-full h-14 bg-white border border-[#E5E7EB] rounded-lg px-4 pt-5 flex items-center justify-between font-semibold text-[#111827]"
              >
                {theme}{" "}
                <ChevronDown
                  size={18}
                  className={`text-[#6B7280] transition-transform ${isThemeOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isThemeOpen && (
                <div className="absolute top-full mt-2 w-full bg-white border border-[#E5E7EB] rounded-lg z-50 overflow-hidden shadow-lg">
                  {["Light", "Dim", "Dark"].map((t) => (
                    <div
                      key={t}
                      onClick={() => {
                        setTheme(t);
                        setIsThemeOpen(false);
                      }}
                      className={`px-4 py-3 hover:bg-[#F9FAFB] hover:text-[#3B82F6] cursor-pointer text-sm font-semibold flex justify-between items-center ${
                        theme === t ? "text-[#3B82F6] bg-[#F9FAFB]" : "text-[#6B7280]"
                      }`}
                    >
                      {t}{" "}
                      {theme === t && (
                        <Check size={14} className="text-[#3B82F6]" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar Upload */}
            <div
              onClick={() => avatarInputRef.current.click()}
              className="relative border border-[#E5E7EB] bg-white rounded-lg h-14 flex items-center px-4 pt-2 cursor-pointer hover:border-[#3B82F6] transition-colors"
            >
              <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest absolute top-2 left-4">
                Avatar
              </label>
              <input
                type="file"
                ref={avatarInputRef}
                onChange={(e) => handleImageUpload(e, "avatar")}
                className="hidden"
                accept="image/*"
              />
              <div className="pt-4 flex items-center gap-2 text-sm text-[#6B7280]">
                <FolderOpen size={16} className="text-[#3B82F6]" />{" "}
                <span className="truncate text-sm font-medium text-[#111827]">Click to upload</span>
              </div>
            </div>

            {/* Tweet Images Upload */}
            <div className="relative border border-[#E5E7EB] bg-white rounded-lg h-14 flex items-center px-4 pt-2 cursor-pointer hover:border-[#3B82F6] transition-colors overflow-hidden">
              <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest absolute top-2 left-4">
                Tweet Images ({tweetImages.length}/4)
              </label>
              <input
                type="file"
                onChange={(e) => handleImageUpload(e, "content")}
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
              />
              <div className="pt-4 flex items-center gap-2 text-sm text-[#6B7280]">
                <FolderOpen size={16} className="text-[#3B82F6]" />{" "}
                <span className="truncate text-sm font-medium text-[#111827]">Click to Upload</span>
                {tweetImages.length > 0 && (
                  <span className="bg-[#F9FAFB] text-[#3B82F6] px-2 rounded-full text-[10px] font-bold ml-1 border border-[#E5E7EB]">
                    {tweetImages.length}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Name Input */}
            <div className="relative bg-white border border-[#E5E7EB] rounded-lg">
              <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest absolute top-2 left-4">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 px-4 pt-5 outline-none focus:ring-1 focus:ring-[#3B82F6] font-semibold text-[#111827] bg-transparent rounded-lg"
              />
            </div>

            {/* Username Input */}
            <div className="relative border border-[#E5E7EB] bg-white rounded-lg">
              <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest absolute top-2 left-4">
                Username
              </label>
              <div className="flex items-center h-14 px-4">
                <span className="text-[#6B7280] pt-5">@</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 pt-5 outline-none font-medium ml-1 min-w-0 text-[#111827] bg-transparent"
                />
                <button
                  onClick={() => setIsVerified(!isVerified)}
                  className={`shrink-0 px-6 py-2 rounded-full text-xs font-bold transition-colors border ${
                    isVerified
                      ? "bg-[#3B82F6] text-white border-[#3B82F6]"
                      : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#3B82F6] hover:text-[#3B82F6]"
                  }`}
                >
                  Verified
                </button>
              </div>
            </div>

            {/* Tweet Date */}
            <div className="relative border border-[#E5E7EB] bg-white rounded-lg">
              <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest absolute top-2 left-4 z-10">
                Tweet Date
              </label>
              <div className="relative flex items-center">
                <input
                  type="datetime-local"
                  value={tweetDate}
                  onChange={(e) => setTweetDate(e.target.value)}
                  className="w-full h-14 px-4 pt-5 outline-none text-sm font-medium bg-transparent text-[#111827] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Tweet Text */}
          <div className="relative border border-[#E5E7EB] bg-white rounded-lg">
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest absolute top-2 left-4">
              Tweet Text
            </label>
            <textarea
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              className="w-full min-h-30 px-4 pt-8 outline-none focus:ring-1 focus:ring-[#3B82F6] resize-none text-[#111827] bg-transparent rounded-lg"
            />
            <span className="absolute top-2 right-4 text-[10px] font-bold text-[#9CA3AF]">
              {tweetText.length}/4000
            </span>
          </div>

          {/* Stats Inputs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Reply", "Retweet", "Like", "View"].map((field) => (
              <div key={field} className="relative border border-[#E5E7EB] bg-white rounded-lg">
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest absolute top-2 left-4">
                  {field}
                </label>
                <input
                  type="number"
                  value={stats[field.toLowerCase()]}
                  onChange={(e) =>
                    setStats({
                      ...stats,
                      [field.toLowerCase()]: e.target.value,
                    })
                  }
                  className="w-full h-14 px-4 pt-5 outline-none font-semibold text-[#111827] bg-transparent rounded-lg"
                />
              </div>
            ))}
          </div>

          {/* Export Button */}
          <div
            className="flex justify-center relative w-full pt-4 pb-4"
            ref={exportRef}
          >
            <button
              disabled={isProcessing}
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="w-full md:w-auto bg-[#3B82F6] hover:bg-[#2776f5] text-white px-10 py-4 rounded-full font-bold flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-[#3B82F6]/20"
            >
              {isProcessing ? "Processing..." : "Export Tweet Image"}{" "}
              <ChevronDown
                size={20}
                className={`transition-transform ${isExportOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isExportOpen && (
              <div className="absolute top-full w-full md:w-64 bg-white border border-[#E5E7EB] rounded-lg overflow-hidden py-2 z-50 shadow-xl">
                <div
                  onClick={() => handleExport("download")}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9FAFB] hover:text-[#3B82F6] cursor-pointer text-[#111827] font-medium text-sm transition-colors"
                >
                  <Download size={18} className="text-[#3B82F6]" /> Download PNG
                </div>
                <div
                  onClick={() => handleExport("copy")}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#F9FAFB] hover:text-[#3B82F6] cursor-pointer text-[#111827] font-medium text-sm border-t border-[#E5E7EB] transition-colors"
                >
                  <Copy size={18} className="text-[#3B82F6]" /> Copy to Clipboard
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetGeneratorTool;