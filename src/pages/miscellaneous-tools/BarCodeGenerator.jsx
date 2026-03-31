import { useState, useRef } from "react";
import Barcode from "react-barcode";
import BuyMeACoffee from "../../components/BuyMeACoffee";
import CommentsSection from "../../components/CommentsSection";
import BrowserExtensionBanner from "../../components/BrowserExtensionBanner";
import SimilarTools from "../../components/SimilarTools";
import CustomSelect from "../../components/CustomSelect";
import { Download, RotateCcw, Sparkles, Barcode as BarcodeIcon } from "lucide-react";
import toast from 'react-hot-toast';
import ToolsDetailPageHeader from "../../components/ToolsDetailPageHeader";
import barcodeGenerator from "../../images/detail-page-images/barcodeGenerator.svg"

const BarcodeGenerator = () => {
  const [value, setValue] = useState("");
  const [format, setFormat] = useState("CODE128");
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [generated, setGenerated] = useState(false);
  const barcodeRef = useRef(null);

  const formats = [
    "CODE128",
    "CODE39",
    "EAN13",
    "EAN8",
    "UPC",
    "ITF14",
    "MSI",
    "pharmacode",
  ];

  // Options for CustomSelect
  const formatOptions = formats.map(fmt => ({
    value: fmt,
    name: fmt
  }));

  const generateBarcode = () => {
    if (!value.trim()) {
      toast.error("Please enter a barcode value", { duration: 1500 });
      return;
    }
    setGenerated(true);
    toast.success("Barcode generated!", { duration: 1500 });
  };

  const resetBarcode = () => {
    setValue("");
    setFormat("CODE128");
    setWidth(2);
    setHeight(100);
    setDisplayValue(true);
    setGenerated(false);
    toast.success("Reset done!", { duration: 1500 });
  };

  const downloadBarcode = () => {
    if (!generated || !barcodeRef.current) {
      toast.error("Please generate a barcode first", { duration: 1500 });
      return;
    }

    const svg = barcodeRef.current.querySelector("svg");
    if (svg) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const data = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        const link = document.createElement("a");
        link.download = `barcode-${value}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast.success("Barcode downloaded!", { duration: 1500 });
      };

      img.src = url;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F9FAFB] overflow-hidden">
        <ToolsDetailPageHeader title="BarCode Generator" icon={barcodeGenerator}/>
        <div className="max-w-5xl mx-auto font-manrope">

          {/* Main Content */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-8 mt-10">
            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Barcode Value
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter barcode value"
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] outline-none transition text-[#111827] placeholder-[#9CA3AF] bg-white"
              />
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Format - CustomSelect */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Barcode Format
                </label>
                <CustomSelect
                  label=""
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  options={formatOptions}
                  searchable={true}
                  size="md"
                />
              </div>

              {/* Display Value Checkbox */}
              <div className="flex items-end">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={displayValue}
                    onChange={(e) => setDisplayValue(e.target.checked)}
                    className="w-5 h-5 text-[#3B82F6] border-[#E5E7EB] rounded focus:ring-[#3B82F6]"
                  />
                  <span className="ml-2 text-sm font-medium text-[#111827] group-hover:text-[#3B82F6] transition-colors">
                    Display Value
                  </span>
                </label>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Width Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[#111827]">
                    Barcode Line Width
                  </label>
                  <span className="text-sm font-bold text-[#3B82F6] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                    {width}px
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                />
                <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                  <span>Thin</span>
                  <span>Thick</span>
                </div>
              </div>

              {/* Height Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-[#111827]">
                    Barcode Line Height
                  </label>
                  <span className="text-sm font-bold text-[#3B82F6] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                    {height}px
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="5"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                />
                <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                  <span>Short</span>
                  <span>Tall</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={resetBarcode}
                className="flex-1 px-6 py-3 bg-white border border-[#E5E7EB] text-[#6B7280] rounded-lg font-medium hover:bg-[#F9FAFB] hover:text-[#111827] hover:border-[#3B82F6] transition flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                Reset
              </button>
              <button
                onClick={generateBarcode}
                className="flex-1 px-6 py-3 bg-[#3B82F6] text-white rounded-lg font-medium hover:bg-[#2776f5] transition flex items-center justify-center gap-2 shadow-lg shadow-[#3B82F6]/20"
              >
                <BarcodeIcon size={18} />
                Generate
              </button>
            </div>

            {/* Barcode Display */}
            <div className="bg-[#F9FAFB] rounded-xl p-8 flex items-center justify-center min-h-50 border-2 border-dashed border-[#E5E7EB]">
              {generated && value ? (
                <div ref={barcodeRef}>
                  <Barcode
                    value={value}
                    format={format}
                    width={width}
                    height={height}
                    displayValue={displayValue}
                    fontSize={16}
                    margin={10}
                    background="transparent"
                    lineColor="#111827"
                  />
                </div>
              ) : (
                <p className="text-[#6B7280] text-sm">
                  Your barcode will appear here
                </p>
              )}
            </div>

            {/* Download Button */}
            {generated && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={downloadBarcode}
                  className="px-8 py-3 bg-[#10B981] text-white rounded-lg font-medium hover:bg-[#059669] transition flex items-center gap-2 shadow-lg shadow-[#10B981]/20"
                >
                  <Download size={18} />
                  Download Barcode
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ===== Extra Sections (Below, Centered) ===== */}
        <div className="max-w-5xl mx-auto flex flex-col space-y-0 mt-8">
          <CommentsSection toolId="barcode-generator" />
          <BuyMeACoffee />
          <SimilarTools />
          <BrowserExtensionBanner />
        </div>

        {/* Information Section */}
        <div className="max-w-5xl mx-auto p-8 bg-white border border-[#E5E7EB] rounded-xl shadow-sm mt-8">
          <h3 className="font-bold text-xl text-[#111827] mb-4">
            What is Online Barcode Generator?
          </h3>
          <div className="space-y-4 text-[#0B1220] leading-relaxed">
            <p>
              <span className="font-bold text-[#3B82F6]">Barcode Generator</span> is a{" "}
              <span className="font-bold text-[#111827]">free online tool for generating barcodes</span>{" "}
              in different forms and formats. Barcodes are images used to represent
              data in machine-readable format. There are used in many different
              areas to easily track "something" such as market products, cargo
              packages, patients in hospitals, books, pharmaceuticals etc. Optical
              readers -more specifically barcode readers- are used to scan this
              data from images or stickers. Main method for identifying the data
              is calculate the varying spacing and width of parallel lines. These
              types of barcodes are also named as linear barcodes.
            </p>

            <p>
              There are many different barcode formats. Most widely used formats
              are EAN-8, EAN-13, and UPC. They are used on many retail products.
              <span className="font-bold text-[#111827]"> You can generate barcodes in Code 128, EAN / UPC, Code 39, ITF-14, MSI, Pharmacode and Codabar formats</span>{" "}
              by using Barcode Generator. Here are short definitions of these
              barcode formats.
            </p>

            <div className="my-8 p-6 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] text-center">
              <p className="text-sm text-[#6B7280] mb-3 font-medium">Sample Barcode</p>
              <div className="bg-white p-4 rounded-lg inline-block shadow-sm border border-[#E5E7EB]">
                <Barcode
                  value="12345678"
                  format="CODE128"
                  width={1.5}
                  height={50}
                  displayValue={true}
                  fontSize={12}
                  margin={5}
                  background="transparent"
                  lineColor="#111827"
                />
              </div>
              <p className="text-xs text-[#6B7280] mt-3 italic">Example: CODE128 barcode for "12345678"</p>
            </div>

            <div className="space-y-4">
              <ul className="list-disc pl-5 space-y-3 text-[#0B1220]">
                <li>
                  <span className="font-bold text-[#111827]">Code 128:</span> It is a linear barcode both used for
                  symbolizing numeric-only or alphanumeric barcodes. 128 stands
                  for the 128 characters defined in ASCII standards. You can use
                  both numbers and letters in this format. It's commonly used in
                  packaging and shipping for product transportation.
                </li>
                <li>
                  <span className="font-bold text-[#111827]">EAN / UPC:</span> EAN and UPS stands for European Article Number
                  (or International Article Number) and Universal Product Code,
                  respectively. They are used to identify retail products
                  worldwide. UPC is a 12-digit number while EAN differs in length
                  for different EAN formats like EAN-13, EAN-8 etc.
                </li>
                <li>
                  <span className="font-bold text-[#111827]">Code 39:</span> It is a variable length barcode format which
                  you are allowed to enter 43 different characters including
                  letters (A-Z), numbers and some special characters.
                </li>
                <li>
                  <span className="font-bold text-[#111827]">MSI:</span> It is a barcode symbology created by MSI Data
                  Corporation which is also known as Modified Plessey. It is
                  numeric-only and has an optional "check digit" calculation.
                </li>
                <li>
                  <span className="font-bold text-[#111827]">Codabar:</span> It is a barcode format mostly used in libraries.
                </li>
                <li>
                  <span className="font-bold text-[#111827]">Pharmacode:</span> Pharmaceutical Binary Code or Pharmacode is
                  used in pharmaceutical industry. It is a numeric-only format
                  which can be between the range 3 to 131070.
                </li>
              </ul>
            </div>
          </div>

          <h3 className="font-bold text-xl text-[#111827] mt-8 mb-4">
            How to use Online Barcode Generator?
          </h3>
          <div className="space-y-4">
            <p className="text-[#0B1220]">
              You can create your barcode by following these steps:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-[#0B1220]">
              <li className="pl-2">
                <span className="font-medium text-[#111827]">Enter the barcode value</span> – 
                Make sure it's compatible with your selected format.
              </li>
              <li className="pl-2">
                <span className="font-medium text-[#111827]">Select a barcode format</span> – 
                Choose from Code 128, EAN-13, UPC, EAN-8, Code 39, ITF-14, MSI, and Pharmacode.
              </li>
              <li className="pl-2">
                <span className="font-medium text-[#111827]">Adjust height and width</span> – 
                Use the sliders to customize the appearance.
              </li>
              <li className="pl-2">
                <span className="font-medium text-[#111827]">Toggle value display</span> – 
                Show or hide the text value under the barcode.
              </li>
              <li className="pl-2">
                <span className="font-medium text-[#111827]">Generate and download</span> – 
                Click "Generate" then "Download" to save as PNG.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
};

export default BarcodeGenerator;