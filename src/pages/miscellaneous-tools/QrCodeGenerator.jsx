import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import BuyMeACoffee from "../../components/BuyMeACoffee";
import CommentsSection from "../../components/CommentsSection";
import BrowserExtensionBanner from "../../components/BrowserExtensionBanner";
import SimilarTools from "../../components/SimilarTools";
import { Download, RotateCcw, Sparkles } from "lucide-react";
import toast from 'react-hot-toast';
import ToolsDetailPageHeader from "../../components/ToolsDetailPageHeader";
import qrCodeGenerator from "../../images/detail-page-images/qrCodeGenerator.svg";

export default function QrCodeGenerator() {
  const [value, setValue] = useState("");
  const qrRef = useRef(null);

  const downloadQr = () => {
    if (!value) {
      toast.error("Please enter text or URL first!", { duration: 1500 });
      return;
    }
    
    const canvas = qrRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.png";
    a.click();
    toast.success("QR Code downloaded!", { duration: 1500 });
  };

  const reset = () => {
    setValue("");
    toast.success("Reset done!", { duration: 1500 });
  };

  return (
    <>
      <div className='min-h-screen bg-[#F9FAFB] overflow-hidden'>
        <ToolsDetailPageHeader title="QR Code Generator" icon={qrCodeGenerator}/>
        <div className="max-w-5xl mx-auto">

          <div className="px-2 py-8">
            {/* Input Section */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter URL or text..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full border border-[#E5E7EB] rounded-lg px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all text-[#111827] placeholder-[#9CA3AF] bg-white"
                />
              </div>

              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 border border-[#E5E7EB] rounded-lg px-6 py-4 text-sm font-medium text-[#6B7280] bg-[#FFFFFF] hover:text-[#111827] hover:border-[#3B82F6] transition-all"
              >
                <RotateCcw size={18} />
                Reset
              </button>
            </div>

            {/* QR Code Display */}
            <div className="flex flex-col items-center gap-6">
              <div
                ref={qrRef}
                className="bg-white p-6 rounded-xl shadow-lg border border-[#E5E7EB]"
              >
                <QRCodeCanvas
                  value={value || " "}
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#111827"
                  level="H"
                  includeMargin
                />
              </div>

              <button
                onClick={downloadQr}
                disabled={!value}
                className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-medium transition-all shadow-lg ${
                  value
                    ? "bg-[#3B82F6] hover:bg-[#2776f5] shadow-[#3B82F6]/20"
                    : "bg-[#9CA3AF] cursor-not-allowed"
                }`}
              >
                <Download size={18} />
                Download QR Code
              </button>

              {!value && (
                <p className="text-xs text-[#6B7280] italic">
                  Enter text or URL to generate QR code
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ===== Extra Sections (Below, Centered) ===== */}
        <div className="flex flex-col space-y-0">
          <CommentsSection toolId="qr-code-generator" />
          <BuyMeACoffee />
          <SimilarTools />
          <BrowserExtensionBanner />
        </div>

        {/* Information Section */}
        <div className="max-w-5xl mx-auto p-8 bg-white border border-[#E5E7EB] rounded-xl shadow-sm mt-8">
          <h3 className="font-bold text-xl text-[#111827] mb-4">
            What is Online QR Code Generator?
          </h3>
          <div className="space-y-4 text-[#0B1220] leading-relaxed">
            <p>
              <span className="font-bold text-[#3B82F6]">QR Code Generator</span> is a{" "}
              <span className="font-bold text-[#111827]">free online tool for generating QR codes</span>. 
              QR Code stands for "Quick Response Code". QR Code is a 2-Dimentional barcode 
              first used in 1994 originated from Japanese automotive industry. Its popularity 
              within other barcode types is its high capacity for storing data. You can store 
              any text-type data in QR Codes, but it is generally used for storing links recently.
            </p>
            
            <p>
              Although there are many usage areas of QR Codes, it is mostly used for giving 
              links to websites and mobile applications on Google Play and Apple Store. Other 
              than that, you can use them to create vCard's (Contact Cards on Mobile), sending 
              e-mails, making, or getting payment etc.
            </p>
            
            <p>
              QR Codes can be scanned by smartphones either natively or by using 3rd party apps. 
              You can search mobile markets if you need a QR Code Scanner.
            </p>
            
            <p>
              QR Codes are formed from a white background and black squares. Longer the text, 
              higher the number of squares. The squares become smaller and smaller if the text 
              become longer.
            </p>

            <div className="my-8 p-8 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] flex flex-col items-center">
              <p className="text-sm text-[#6B7280] mb-3 font-medium">Sample QR Code</p>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-[#E5E7EB]">
                <QRCodeCanvas
                  value="https://example.com"
                  size={120}
                  bgColor="#ffffff"
                  fgColor="#111827"
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="text-xs text-[#6B7280] mt-3 italic">Example: QR Code for example.com</p>
            </div>
          </div>

          <h3 className="font-bold text-xl text-[#111827] mt-8 mb-4">
            How to use Online QR Code Generator?
          </h3>
          <div className="space-y-4">
            <p className="text-[#0B1220]">
              Using Online QR Code Generator is very simple. You just need to follow these steps:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-[#0B1220]">
              <li className="pl-2">
                <span className="font-medium text-[#111827]">Enter your text or URL</span> – 
                Type or paste the content you want to encode in the input field above.
              </li>
              <li className="pl-2">
                <span className="font-medium text-[#111827]">QR Code generates automatically</span> – 
                The QR code updates in real-time as you type.
              </li>
              <li className="pl-2">
                <span className="font-medium text-[#111827]">Download your QR code</span> – 
                Click the download button to save it as a PNG image.
              </li>
              <li className="pl-2">
                <span className="font-medium text-[#111827]">Reset to start over</span> – 
                Use the reset button to clear the input and start fresh.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}