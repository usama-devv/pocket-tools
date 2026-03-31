import { useState } from "react";
import CommentsSection from "../../components/CommentsSection";
import BuyMeACoffee from "../../components/BuyMeACoffee";
import SimilarTools from "../../components/SimilarTools";
import BrowserExtensionBanner from "../../components/BrowserExtensionBanner";
import CustomSelect from "../../components/CustomSelect";
import toast from 'react-hot-toast';
import ToolsDetailPageHeader from "../../components/ToolsDetailPageHeader";
import listRandomizer from "../../images/detail-page-images/listRandomizer.svg"

const ListRandomizer = () => {
  const [inputText, setInputText] = useState("");
  const [randomizedList, setRandomizedList] = useState([]);
  const [listFormat, setListFormat] = useState("one-per-line");
  const [numberOfSelections, setNumberOfSelections] = useState("all");
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [uniqueCount, setUniqueCount] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);

  // Options for CustomSelect
  const listFormatOptions = [
    { value: "one-per-line", name: "One per line" },
    { value: "comma-separated", name: "Comma separated" },
    { value: "space-separated", name: "Space separated" }
  ];

  const selectionOptions = [
    { value: "all", name: "Select All" },
    { value: "1", name: "1" },
    { value: "2", name: "2" },
    { value: "3", name: "3" },
    { value: "5", name: "5" },
    { value: "10", name: "10" },
    { value: "20", name: "20" }
  ];

  const parseList = (text) => {
    if (!text.trim()) return [];

    let items = [];
    if (listFormat === "one-per-line") {
      items = text
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item);
    } else if (listFormat === "comma-separated") {
      items = text
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);
    } else if (listFormat === "space-separated") {
      items = text
        .split(" ")
        .map((item) => item.trim())
        .filter((item) => item);
    }

    return items;
  };

  const updateCounts = (text) => {
    const items = parseList(text);
    const total = items.length;
    const unique = new Set(items).size;
    const duplicates = total - unique;

    setTotalCount(total);
    setUniqueCount(unique);
    setDuplicateCount(duplicates);
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    updateCounts(text);
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleRandomize = () => {
    let items = parseList(inputText);

    if (items.length < 2) {
      toast.error("At least 2 unique elements needed for randomization.", { duration: 1500 });
      return;
    }

    if (removeDuplicates) {
      items = [...new Set(items)];
    }

    let shuffled = shuffleArray(items);

    if (numberOfSelections !== "all") {
      const count = parseInt(numberOfSelections);
      shuffled = shuffled.slice(0, Math.min(count, shuffled.length));
    }

    setRandomizedList(shuffled);
    toast.success("List randomized successfully!", { duration: 1500 });
  };

  const handleReset = () => {
    setInputText("");
    setRandomizedList([]);
    setListFormat("one-per-line");
    setNumberOfSelections("all");
    setRemoveDuplicates(true);
    setTotalCount(0);
    setUniqueCount(0);
    setDuplicateCount(0);
    toast.success("Reset done!", { duration: 1500 });
  };

  const formatOutput = (list) => {
    if (listFormat === "one-per-line") {
      return list.join("\n");
    } else if (listFormat === "comma-separated") {
      return list.join(", ");
    } else if (listFormat === "space-separated") {
      return list.join(" ");
    }
    return list.join("\n");
  };

  const handleCopy = () => {
    if (randomizedList.length === 0) {
      toast.error("Nothing to copy!", { duration: 1500 });
      return;
    }
    navigator.clipboard.writeText(formatOutput(randomizedList));
    toast.success("Copied to clipboard!", { duration: 1500 });
  };

  return (
    <>
      <div className="min-h-screen bg-[#F9FAFB] overflow-hidden">
        <ToolsDetailPageHeader title="List Randomizer" icon={listRandomizer}/>
        <div className="max-w-5xl mx-auto px-2 py-8 font-manrope">

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-8">
            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Enter Your List
              </label>
              <textarea
                value={inputText}
                onChange={handleInputChange}
                placeholder="Enter your list items here..."
                className="w-full h-64 px-4 py-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] outline-none transition resize-none text-[#111827] placeholder-[#9CA3AF]"
              />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#F9FAFB] rounded-lg p-4 text-center border border-[#E5E7EB]">
                <p className="text-sm text-[#6B7280] mb-1">Total Count</p>
                <p className="text-3xl font-bold text-[#111827]">{totalCount}</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg p-4 text-center border border-[#E5E7EB]">
                <p className="text-sm text-[#6B7280] mb-1">Unique Count</p>
                <p className="text-3xl font-bold text-[#111827]">
                  {uniqueCount}
                </p>
              </div>
              <div className="bg-[#F9FAFB] rounded-lg p-4 text-center border border-[#E5E7EB]">
                <p className="text-sm text-[#6B7280] mb-1">Duplicate Count</p>
                <p className="text-3xl font-bold text-[#111827]">
                  {duplicateCount}
                </p>
              </div>
            </div>

            {/* Options Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* List Format - CustomSelect */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  List Format
                </label>
                <CustomSelect
                  label=""
                  value={listFormat}
                  onChange={(e) => {
                    setListFormat(e.target.value);
                    updateCounts(inputText);
                  }}
                  options={listFormatOptions}
                  searchable={false}
                  size="md"
                />
              </div>

              {/* Number of Selections - CustomSelect */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Number of Selections
                </label>
                <CustomSelect
                  label=""
                  value={numberOfSelections}
                  onChange={(e) => setNumberOfSelections(e.target.value)}
                  options={selectionOptions}
                  searchable={false}
                  size="md"
                />
              </div>
            </div>

            {/* Remove Duplicates Checkbox */}
            <div className="mb-6">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={removeDuplicates}
                  onChange={(e) => setRemoveDuplicates(e.target.checked)}
                  className="w-5 h-5 text-[#3B82F6] border-[#E5E7EB] rounded focus:ring-[#3B82F6]"
                />
                <span className="ml-2 text-sm font-medium text-[#111827] group-hover:text-[#3B82F6] transition-colors">
                  Remove Duplicates
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-white border border-[#E5E7EB] text-[#6B7280] rounded-lg font-medium hover:bg-[#F9FAFB] hover:text-[#111827] hover:border-[#3B82F6] transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset
              </button>
              <button
                onClick={handleRandomize}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-[#3B82F6] text-white rounded-lg font-medium hover:bg-[#2776f5] transition shadow-lg shadow-[#3B82F6]/20"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
                Randomize
              </button>
            </div>

            {/* Info Message */}
            <div className="flex items-start gap-2 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg mb-6">
              <svg
                className="w-5 h-5 text-[#3B82F6] mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-[#111827]">
                At least 2 unique elements needed for randomization of the list.
              </p>
            </div>

            {/* Output Section */}
            {randomizedList.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-[#111827]">
                    Randomized Result
                  </label>
                  <button
                    onClick={handleCopy}
                    className="text-sm text-[#3B82F6] hover:text-[#2776f5] font-medium"
                  >
                    Copy to Clipboard
                  </button>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-sm text-[#111827] whitespace-pre-wrap font-mono">
                    {formatOutput(randomizedList)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#F9FAFB] flex flex-col space-y-0">
        <CommentsSection toolId="list-randomizer" />
        <BuyMeACoffee />
        <SimilarTools />
        <BrowserExtensionBanner />
        
        {/* Information Section */}
        <div className="max-w-5xl mx-auto p-8 bg-white border border-[#E5E7EB] rounded-xl shadow-sm mt-8">
          <h3 className="font-bold text-xl text-[#111827] mb-4">
            What is List Randomizer?
          </h3>
          <div className="space-y-4 text-[#0B1220] leading-relaxed">
            <p>
              List Randomizer is a{" "}
              <span className="font-bold text-[#3B82F6]">
                free online tool for randomizing lists and making lotteries or
                drawing campaigns{" "}
              </span>
              by making desired number of selection randomly from a given list. If
              you want to make a lottery between your friends or draw a campaign
              or randomize the order of elements in a given list, List Randomizer
              will do it for you just in seconds.
            </p>
            
            <p>
              You can generate randomly ordered lists by using a predefined list
              which may be formatted differently. This tools support lists which
              has one element per line or elements separated with comma,
              semicolon, or space. For each format, you will see stats for total
              number of elements detected, number of unique and duplicate
              elements. You can get rid of duplicate data by checking "Remove
              Duplicates" checkbox.
            </p>
            
            <div className="my-8 p-6 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] text-center">
              <p className="text-[#6B7280] italic">
                [QR Code Sample - Image placeholder]
              </p>
            </div>
            
            <p>
              As you see in the image, if you are 5 people and you want to select 3 people within this group randomly, it is easy to select lucky (or unlucky) ones immediately. You don't need to select people who draw the short straw as online List Randomizer is way faster and chances are exactly equal.
            </p>
            
            <h3 className="font-bold text-xl text-[#111827] mt-8 mb-4">
              How to use Online List Randomizer?
            </h3>
            
            <p>For making lotteries, campaign drawings or just to make list shuffling, here are the basic steps you need to follow:</p>
            
            <ol className="list-decimal list-inside mt-4 space-y-3 text-[#0B1220]">
              <li>
                Enter your list to the text area. It must be formatted as one list element per line, separated by commas, semicolons or spaces.
              </li>
              <li>
                After entering your data as a list, you must choose the format of your data from the list. It is important to choose the right one since it is used for splitting your list into list elements. All counts will be shown under the list for you to preview if everything is okay.
              </li>
              <li>
                Use the checkbox "Remove Duplicates" to set whether you want to remove or keep them.
              </li>
              <li>
                If you want to select limited number of elements from the list, you can set it from the list labeled as "Number of Selections". When the results are shown, selected ones will be shown with green color while others will be shown with red.
              </li>
              <li>
                When you are ready, you can click the button "Randomize" for making your random selection. After the selection, you can copy the results as a list to your clipboard.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListRandomizer;