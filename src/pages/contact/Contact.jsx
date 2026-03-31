import { useState } from "react";
import { useDispatch } from "react-redux";
import { openMail, updateMailContent } from "../../redux/slices/contactSlice";
import { FiMail, FiMessageSquare, FiSend, FiClock, FiGlobe, FiUser, FiEdit3, FiZap } from "react-icons/fi";
import BuyMeACoffee from "../../components/BuyMeACoffee";

function Contact() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateMailContent({
        subject: `Support Request from ${formData.name}`,
        body: `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`,
      })
    );
    dispatch(openMail());
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] py-20 px-4 sm:px-6 lg:px-8 font-manrope">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3B82F6]/10 text-[#3B82F6] rounded-2xl mb-6">
            <FiMessageSquare size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-4 tracking-tight">
            Get in <span className="text-[#3B82F6]">Touch</span>
          </h1>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto font-medium leading-relaxed">
            Have a question or a tool suggestion? Our team is ready to engineer 
            the solutions you need.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch">
          
          {/* Left Column: 3 Info Cards to Consume Space */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <div className="flex-1 bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 bg-[#F3F4F6] text-[#3B82F6] rounded-lg group-hover:bg-[#3B82F6] group-hover:text-white transition-colors">
                  <FiClock />
                </div>
                <h3 className="font-bold text-[#111827]">Response Time</h3>
              </div>
              <p className="text-sm text-[#6B7280] font-medium leading-relaxed">Mon - Fri, 9am to 6pm (IST). Rapid response guaranteed.</p>
            </div>

            <div className="flex-1 bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 bg-[#F3F4F6] text-[#3B82F6] rounded-lg group-hover:bg-[#3B82F6] group-hover:text-white transition-colors">
                  <FiGlobe />
                </div>
                <h3 className="font-bold text-[#111827]">Global Support</h3>
              </div>
              <p className="text-sm text-[#6B7280] font-medium leading-relaxed">Available worldwide. Supporting creators across all timezones.</p>
            </div>

            {/* New 3rd Card to fill space */}
            <div className="flex-1 bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 bg-[#F3F4F6] text-[#3B82F6] rounded-lg group-hover:bg-[#3B82F6] group-hover:text-white transition-colors">
                  <FiZap />
                </div>
                <h3 className="font-bold text-[#111827]">Rapid Engineering</h3>
              </div>
              <p className="text-sm text-[#6B7280] font-medium leading-relaxed">Missing a tool? Suggest it and our team will prioritize its build.</p>
            </div>
          </div>

          {/* Main Contact Form Section */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 md:p-10 shadow-xl shadow-black/2 border border-[#E5E7EB] flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-[#111827] mb-6 flex items-center gap-2">
              <FiEdit3 className="text-[#3B82F6]" /> Send a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input
                    required
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-[#F3F4F6] border-none rounded-xl text-[#111827] focus:ring-2 focus:ring-[#3B82F6] transition-all placeholder:text-[#6B7280] font-medium outline-none"
                  />
                </div>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-[#F3F4F6] border-none rounded-xl text-[#111827] focus:ring-2 focus:ring-[#3B82F6] transition-all placeholder:text-[#6B7280] font-medium outline-none"
                  />
                </div>
              </div>

              <div className="relative">
                <textarea
                  required
                  name="message"
                  rows="6"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-4 bg-[#F3F4F6] border-none rounded-xl text-[#111827] focus:ring-2 focus:ring-[#3B82F6] transition-all placeholder:text-[#6B7280] font-medium resize-none outline-none"
                ></textarea>
              </div>

              {/* Corrected Button: Brand Accent Color */}
              <button
                type="submit"
                className="group w-full py-4 bg-[#3B82F6] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#3B82F6]/20 hover:bg-[#2776f5] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span>Send Message</span>
                <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#6B7280] font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Support engineers are currently online
            </div>
          </div>
        </div>

        <div className="mt-10">
          <BuyMeACoffee />
        </div>
      </div>
    </div>
  );
}

export default Contact;