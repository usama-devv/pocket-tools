import { useState } from "react";
import { generateIBAN, COUNTRIES } from "../../utils/ibanUtils";
import BuyMeACoffee from "../../components/BuyMeACoffee";
import CommentsSection from "../../components/CommentsSection";
import BrowserExtensionBanner from "../../components/BrowserExtensionBanner";
import SimilarTools from "../../components/SimilarTools";
import CustomSelect from "../../components/CustomSelect";
import { Sparkles, Copy, Download, RotateCcw, AlertCircle } from "lucide-react";
import toast from 'react-hot-toast';
import ToolsDetailPageHeader from "../../components/ToolsDetailPageHeader";
import fakeIbanGenerator from "../../images/detail-page-images/fakeIbanGenerator.svg";

export default function FakeIbanGenerator() {
  const [country, setCountry] = useState("GB");
  const [count, setCount] = useState(5);
  const [ibans, setIbans] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Options for CustomSelect
  const countryOptions = Object.entries(COUNTRIES).map(([code, name]) => ({
    value: code,
    name: `${name} (${code})`
  }));

  const countOptions = [1, 5, 10, 20, 25, 50, 100].map(n => ({
    value: n.toString(),
    name: n === 1 ? "1 IBAN" : `${n} IBANs`
  }));

  const generate = () => {
    const list = Array.from({ length: count }, () => generateIBAN(country));
    setIbans(list);
    toast.success(`${count} IBAN${count > 1 ? 's' : ''} generated!`, { duration: 1500 });
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("IBAN copied!", { duration: 1500 });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    if (ibans.length === 0) {
      toast.error("No IBANs to copy!", { duration: 1500 });
      return;
    }
    navigator.clipboard.writeText(ibans.join('\n'));
    toast.success("All IBANs copied!", { duration: 1500 });
  };

  const handleReset = () => {
    setIbans([]);
    setCountry("GB");
    setCount(5);
    setCopiedIndex(null);
    toast.success("Reset done!", { duration: 1500 });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] overflow-hidden">
      <ToolsDetailPageHeader title="Fake IBAN Generator" icon={fakeIbanGenerator}/>
      <div className="max-w-5xl mx-auto font-manrope">

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-8 mt-10">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Country Select */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Country
              </label>
              <CustomSelect
                label=""
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                options={countryOptions}
                searchable={true}
                size="md"
              />
            </div>

            {/* Count Select - CustomSelect */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Number of IBANs
              </label>
              <CustomSelect
                label=""
                value={count.toString()}
                onChange={(e) => setCount(Number(e.target.value))}
                options={countOptions}
                searchable={false}
                size="md"
              />
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <button
                onClick={generate}
                className="w-full bg-[#3B82F6] text-white rounded-lg px-6 py-3 hover:bg-[#2776f5] transition font-medium shadow-lg shadow-[#3B82F6]/20 flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                Generate
              </button>
            </div>
          </div>

          {/* Results */}
          {ibans.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-[#111827]">
                  Generated IBANs ({ibans.length})
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] rounded-lg hover:border-[#3B82F6] transition"
                  >
                    <RotateCcw size={14} />
                    Reset
                  </button>
                  <button
                    onClick={copyAll}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#3B82F6] hover:text-white border border-[#3B82F6] hover:bg-[#3B82F6] rounded-lg transition"
                  >
                    <Copy size={14} />
                    Copy All
                  </button>
                </div>
              </div>

              <div className="bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-4 space-y-2 max-h-96 overflow-y-auto">
                {ibans.map((iban, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between font-mono text-sm border border-[#E5E7EB] rounded-lg px-4 py-3 bg-white hover:border-[#3B82F6] transition-colors"
                  >
                    <span className="text-[#111827]">{iban}</span>
                    <button
                      onClick={() => copyToClipboard(iban, idx)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-[#F9FAFB] rounded-lg"
                    >
                      {copiedIndex === idx ? (
                        <span className="text-xs text-[#10B981] font-medium">Copied!</span>
                      ) : (
                        <Copy size={16} className="text-[#6B7280] hover:text-[#3B82F6]" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {ibans.length === 0 && (
            <div className="text-center py-16 bg-[#F9FAFB] rounded-xl border border-dashed border-[#E5E7EB]">
              <AlertCircle className="w-12 h-12 text-[#6B7280] mx-auto mb-3" />
              <p className="text-[#111827] font-medium">No IBANs generated yet</p>
              <p className="text-xs text-[#6B7280] mt-1">Select a country and click generate to create fake IBANs</p>
            </div>
          )}
        </div>

        {/* ===== Extra Sections (Below, Centered) ===== */}
        <div className="flex flex-col space-y-0 mt-12">
          <CommentsSection toolId="fake-iban-generator" />
          <BuyMeACoffee />
          <SimilarTools />
          <BrowserExtensionBanner />
        </div>

        {/* Information Section */}
        <div className="max-w-5xl mx-auto p-8 bg-white border border-[#E5E7EB] rounded-xl shadow-sm mt-8">
          <h3 className="font-bold text-xl text-[#111827] mb-4">
            What is Online Fake IBAN Generator?
          </h3>
          <div className="space-y-4 text-[#0B1220] leading-relaxed">
            <p>
              <span className="font-bold text-[#3B82F6]">Fake IBAN Generator</span> is a{" "}
              <span className="font-bold text-[#111827]">free online tool for generating valid fake IBANs for testing purposes</span>.
              It allows you to select a specific country and generate multiple fake
              IBANs at once. These generated IBANs follow the correct format and
              structure for each country, including the country code, check digits,
              and proper length, but they are completely fictional and not linked to
              any real bank accounts.
            </p>

            <p>
              The IBAN system is used in many countries around the world to identify
              bank accounts for international transactions. Each country has its own
              specific format requirements for IBANs, including length and
              structure.
            </p>

            <div className="my-8 p-6 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <h4 className="font-bold text-[#111827] mb-3">IBAN Structure</h4>
              <p className="text-sm text-[#0B1220] mb-4">
                An IBAN consists of up to 34 alphanumeric characters, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-[#6B7280]">
                <li>A two-letter country code (e.g., "GB" for the United Kingdom)</li>
                <li>Two check digits</li>
                <li>A Basic Bank Account Number (BBAN) that includes bank and branch identifiers and the account number</li>
              </ul>
              <p className="text-sm text-[#0B1220] mt-4">
                The length of an IBAN varies by country, with each country having
                its own specific format. For example, IBANs from Germany have 22
                characters, while those from the UK have 22 characters, and those
                from France have 27 characters.
              </p>
            </div>

            <h3 className="font-bold text-xl text-[#111827] mt-8 mb-4">
              When to use Random IBAN Generator?
            </h3>
            <div className="space-y-4">
              <p>Random IBANs are useful in several scenarios:</p>
              <ul className="list-disc list-inside space-y-2 text-[#0B1220]">
                <li>Software development and testing of financial applications</li>
                <li>UI/UX design mockups for banking or fintech applications</li>
                <li>Educational purposes to demonstrate IBAN formats</li>
                <li>Data anonymization when sharing examples</li>
                <li>Test environments where real banking data cannot be used</li>
              </ul>
            </div>

            <div className="my-8 p-6 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
              <p className="text-sm text-[#0B1220]">
                <span className="font-bold text-[#111827]">Supported Countries:</span> IBAN generator is available for more than 35+ countries including; Albania, Austria, Belgium, Bulgaria, Croatia, Cyprus, Czech Republic, Denmark, Egypt, Estonia, Finland, France, Germany, Greece, Hungary, Ireland, Italy, Latvia, Lithuania, Luxembourg, Malta, Netherlands, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, Sweden, United Kingdom, Switzerland, Norway, Iceland, Saudi Arabia, Turkey, and United Arab Emirates.
              </p>
            </div>

            <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-lg p-4">
              <p className="text-sm text-[#EF4444] flex items-start gap-2">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>
                  <span className="font-bold">Important Note:</span> The IBANs generated by this tool are completely fictional and should never be used for actual financial transactions. They are intended for testing and educational purposes only.
                </span>
              </p>
            </div>
          </div>

          <h3 className="font-bold text-xl text-[#111827] mt-8 mb-4">
            How to use Fake IBAN Generator?
          </h3>
          <div className="space-y-4">
            <p className="text-[#0B1220]">Using the Fake IBAN Generator is simple:</p>
            <ol className="list-decimal list-inside space-y-3 text-[#0B1220]">
              <li className="pl-2">
                <span className="font-medium text-[#111827]">Select a country</span> – 
                Choose the country from the dropdown menu.
              </li>
              <li className="pl-2">
                <span className="font-medium text-[#111827]">Choose the number of IBANs</span> – 
                Select how many IBANs you want to generate (1, 5, 10, 20, 25, 50, or 100).
              </li>
              <li className="pl-2">
                <span className="font-medium text-[#111827]">Click Generate</span> – 
                The IBANs will appear in the results section.
              </li>
              <li className="pl-2">
                <span className="font-medium text-[#111827]">Copy individual IBANs</span> – 
                Hover over any IBAN and click the copy icon.
              </li>
              <li className="pl-2">
                <span className="font-medium text-[#111827]">Copy all at once</span> – 
                Use the "Copy All" button to copy all generated IBANs.
              </li>
            </ol>
            <p className="text-sm text-[#6B7280] mt-4">
              All generation is done client-side in your browser, and no data is sent to any server. This ensures that your test data remains private and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}