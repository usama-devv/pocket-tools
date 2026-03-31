import { FiLock, FiEye, FiServer, FiGlobe, FiDatabase, FiCheckCircle, FiFileText, FiShield } from "react-icons/fi";

export default function PrivacyAndPolicy() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] py-16 px-4 sm:px-6 lg:px-8 font-manrope">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-white rounded-xl p-10 md:p-16 shadow-sm border border-[#E5E7EB] text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3B82F6]/10 text-[#3B82F6] rounded-2xl mb-6 shadow-sm">
            <FiLock size={32} />
          </div>
          <h1 className="text-4xl font-black text-[#111827] mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-[#6B7280] max-w-xl mx-auto leading-relaxed font-medium">
            At <strong>Pocket Tools</strong>, we take your digital footprint seriously. This comprehensive policy 
            explains how we handle data across our ecosystem of online utilities.
          </p>
          <div className="mt-6 inline-block px-4 py-1 bg-[#F3F4F6] rounded-full text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.2em]">
            Compliance Version 2.0 • Feb 2026
          </div>
        </div>

        <div className="space-y-10">
          
          {/* 1. Client-Side Processing*/}
          <section className="bg-white p-8 md:p-12 rounded-xl border border-[#E5E7EB] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
              <FiShield size={180} />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
              <FiCheckCircle className="text-[#3B82F6]" /> 1. Client-Side Processing
            </h2>
            <div className="text-[#6B7280] leading-relaxed space-y-4 font-medium">
              <p>
                Our core mission is to provide secure tools. Unlike traditional web services, <strong>Pocket Tools</strong> utilizes 
                <span className="text-[#3B82F6]"> Client-Side Rendering (CSR)</span> for the majority of its functions. 
              </p>
              <p>
                When you use our JSON formatters, Image optimizers, or Code generators, the conversion happens <strong>locally in your browser</strong>. 
                Your sensitive data never leaves your machine and is never uploaded to our servers, ensuring 100% privacy for your creative and technical work.
              </p>
            </div>
          </section>

          {/* 2. Information We Collect */}
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white p-8 md:p-10 rounded-xl border border-[#E5E7EB] shadow-sm">
              <h2 className="text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
                <FiDatabase className="text-[#3B82F6]" /> 2. Information We Collect
              </h2>
              <div className="space-y-6 text-[#6B7280] font-medium">
                <div>
                  <h4 className="font-bold text-[#111827] mb-2">A. Personal Information</h4>
                  <p>We only collect personal data (such as name or email) when you voluntarily provide it through contact forms or support requests. This information is used strictly to respond to your inquiries.</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#111827] mb-2">B. Technical Log Data</h4>
                  <p>Our servers record standard "Log Data" (IP address, browser type). We use this strictly to prevent DDoS attacks and improve site stability.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Advertising & Cookies */}
          <section className="bg-[#111827] rounded-xl p-8 md:p-12 text-white shadow-xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FiEye className="text-[#3B82F6]" /> 3. Cookies & Ads
            </h2>
            <div className="space-y-6 opacity-90 leading-relaxed font-medium">
              <p>
                To keep our tools free, we partner with <strong>Google AdSense</strong>. 
                These partners use cookies to serve ads based on your visit.
              </p>
              <ul className="list-none space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#3B82F6] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3B82F6] shrink-0"></span>
                  <span><strong>Google DART Cookie:</strong> Used to serve ads based on your visit to Pocket Tools.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B82F6] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3B82F6] shrink-0"></span>
                  <span><strong>Opt-Out:</strong> Visit <a href="https://www.google.com/settings/ads" className="text-[#3B82F6] underline hover:text-white transition-colors">Google Ads Settings</a> to manage your preferences.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 4. Your Legal Rights */}
          <section className="bg-white p-8 md:p-10 rounded-xl border border-[#E5E7EB] shadow-sm">
            <h2 className="text-2xl font-bold text-[#111827] mb-6 flex items-center gap-3">
              <FiFileText className="text-[#3B82F6]" /> 4. Your Legal Rights
            </h2>
            <p className="text-[#6B7280] mb-6 font-medium">Under GDPR or CCPA compliance, you have the following rights:</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Access your personal data",
                "Request data deletion",
                "Object to processing",
                "Data portability",
                "Withdraw consent",
                "Non-discrimination"
              ].map((right, idx) => (
                <div key={idx} className="flex items-center gap-2 p-4 bg-[#F3F4F6] rounded-xl border border-[#E5E7EB] text-sm font-bold text-[#111827]">
                  <div className="w-2 h-2 bg-[#3B82F6] rounded-full"></div>
                  {right}
                </div>
              ))}
            </div>
          </section>

          {/* 5. Data Retention */}
          <section className="bg-white p-8 md:p-10 rounded-xl border border-[#E5E7EB] shadow-sm">
            <h2 className="text-2xl font-bold text-[#111827] mb-4 flex items-center gap-2">
              <FiServer className="text-[#3B82F6]" /> 5. Data Retention
            </h2>
            <p className="text-[#6B7280] leading-relaxed font-medium">
              We retain personal information only as long as necessary. 
              Logs are typically anonymized within 30-90 days. We employ 
              <strong className="text-[#111827]"> AES-256 encryption</strong> for any data stored on our backup systems.
            </p>
          </section>

          {/* Contact Footer */}
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#F3F4F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white rounded-full mb-4 border border-[#E5E7EB]">
              <FiGlobe />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-2 tracking-tight">Privacy Questions?</h3>
            <p className="text-[#6B7280] mb-8 text-sm font-medium">Our Data Protection Officer is ready to assist you.</p>
            <a 
              href="mailto:contact@pockettools.com" 
              className="px-16 py-4 bg-[#3B82F6] text-white rounded-full font-bold shadow-lg shadow-[#3B82F6]/20 hover:bg-[#2776f5] transition-all inline-block active:scale-95"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}