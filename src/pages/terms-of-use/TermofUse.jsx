import { FiShield, FiInfo, FiAlertCircle, FiMail, FiCheckCircle } from "react-icons/fi";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] pt-20 py-12 px-4 sm:px-6 lg:px-8 font-manrope">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl overflow-hidden border border-[#E5E7EB]">
        
        {/* Header Section */}
        <div className="bg-[#111827] p-10 text-center text-white">
          <FiShield className="mx-auto text-5xl text-[#3B82F6] mb-4" />
          <h1 className="text-4xl font-extrabold tracking-tight">Website Terms of Use</h1>
          <p className="mt-2 text-[#6B7280]">Version 1.1 • Last Updated: February 2026</p>
        </div>

        <div className="p-8 md:p-12 space-y-10 text-[#0B1220] leading-relaxed">
          
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FiInfo className="text-[#3B82F6] text-xl" />
              <h2 className="text-2xl font-bold text-[#111827]">Agreement to Terms</h2>
            </div>
            <p className="mb-4">
              Welcome to <strong>Pocket Tools</strong>. These Terms of Use constitute a legally binding agreement made between you and Pocket Tools (located at <a href="https://pockettools.com" className="text-[#3B82F6] hover:text-[#2776f5] hover:underline font-medium">https://pockettools.com</a>) concerning your access to and use of our website.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg italic text-sm text-amber-900">
              BY ACCESSING OR USING THE SITE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS. YOU MUST BE AT LEAST 18 YEARS OLD TO USE THIS SERVICE.
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="bg-[#F3F4F6] p-6 rounded-2xl border border-[#E5E7EB]">
            <h2 className="text-xl font-bold text-[#111827] mb-4 flex items-center gap-2">
              <FiCheckCircle className="text-emerald-600" /> Intellectual Property Rights
            </h2>
            <p className="text-sm text-[#6B7280]">
              Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, and graphics on the Site (collectively, the "Content") are owned or controlled by us. You are granted a limited license to access and use the Site solely for personal, non-commercial purposes.
            </p>
          </section>

          {/* User Prohibitions */}
          <section>
            <h2 className="text-xl font-bold text-[#111827] mb-4 flex items-center gap-2">
              <FiAlertCircle className="text-red-500" /> Prohibited Activities
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {[
                "Systematically retrieve data to create a collection/database.",
                "Trick, defraud, or mislead us and other users.",
                "Circumvent, disable, or interfere with security features.",
                "Engage in any automated use of the system (bots/scripts).",
                "Use the Site to compete with us or for revenue-generation.",
                "Attempt to reverse engineer any of the tools software."
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2 bg-white p-3 rounded-lg border border-[#E5E7EB] shadow-sm">
                  <span className="text-[#3B82F6] font-bold">•</span> {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Disclaimer */}
          <section className="border-t border-[#E5E7EB] pt-8">
            <h2 className="text-xl font-bold text-[#111827] mb-4">Service Disclaimer</h2>
            <p className="text-sm italic text-[#6B7280]">
              THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. You agree that your use of the site and our services will be at your sole risk. To the fullest extent permitted by law, we disclaim all warranties, express or implied, in connection with the site and your use thereof. We make no guarantees that the tools will be 100% error-free or uninterrupted.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="border-t border-[#E5E7EB] pt-8">
            <h2 className="text-xl font-bold text-[#111827] mb-4">Limitation of Liability</h2>
            <p className="text-sm text-[#6B7280]">
              In no event will we or our directors/employees be liable to you or any third party for any direct, indirect, consequential, exemplary, or punitive damages, including lost profit or lost data, arising from your use of the site. Our liability to you for any cause whatsoever will at all times be limited to $50.00 USD.
            </p>
          </section>

          {/* Third Party Links */}
          <section className="bg-[#3B82F6]/5 p-6 rounded-2xl border border-[#3B82F6]/10">
            <h2 className="text-xl font-bold text-[#111827] mb-2">Third-Party Links & Ads</h2>
            <p className="text-sm text-[#6B7280]">
              Our site may contain advertisements from Google and other third-party vendors. These vendors use cookies (like DART cookies) to serve ads based on your visit. We do not monitor or control these third-party websites. Please review their policies before engaging with them.
            </p>
          </section>

          {/* Contact Section */}
          <section className="text-center pt-10">
            <div className="inline-block bg-[#F3F4F6] px-6 py-3 rounded-full border border-[#E5E7EB]">
              <p className="text-xs md:text-sm font-semibold flex items-center justify-center gap-2">
                <FiMail className="text-[#3B82F6] w-5 h-5" /> Have questions? 
                <a href="mailto:contact@pockettools.com" className="text-[#3B82F6] hover:text-[#2776f5] hover:underline transition-colors">
                  contact@pockettools.com
                </a>
              </p>
            </div>
            <p className="mt-6 text-xs text-[#6B7280] italic">
              Copyright © 2026 Pocket Tools. All rights reserved.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}