import { useDispatch } from "react-redux";
import { openMail, updateMailContent } from "../../redux/slices/contactSlice";
import { FaGithub, FaLinkedin, FaTools, FaLayerGroup, FaBolt, FaUserShield, FaChartLine } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import BuyMeACoffee from "../../components/BuyMeACoffee";
import zain from "../../assets/zain.jpeg";
import zohaib from "../../assets/zohaib.jpeg";
import huzaifa from "../../assets/huzaifa.jpeg";
import bilal from "../../assets/bilal.jpeg";

const TEAM = {
  leadership: [
    {
      name: "Jahanzaib Ali",
      role: "Lead Developer",
      bio: "Specializing in high-performance web architecture and digital utility optimization.",
      image: "https://ca.slack-edge.com/T03A7U0BX41-U09MCF1CG3G-006b07202d88-512",
      socials: { github: "#", linkedin: "#", twitter: "#" }
    }
  ],
  members: [
    { name: "Usama Masood", role: "Software Engineer", image: "https://ca.slack-edge.com/T03A7U0BX41-U058VJCNFHQ-be97d7bfc798-512", socials: { linkedin: "#", github: "#" } },
    { name: "Zain Ul Hassan", role: "Software Developer", image: zain, socials: { linkedin: "#", github: "#" } },
    { name: "Zohaib Hassan", role: "Software Developer", image: zohaib, socials: { github: "https://github.com/CodeWithZebi" } },
    { name: "Huzaifa Bashir", role: "Software Developer", image: huzaifa, socials: { github: "https://github.com/huzaifabashir1727", linkedin: "https://www.linkedin.com/in/huzaifabashir/" } },
    { name: "Bilal Sajid", role: "Software Developer", image: bilal, socials: { github: "#", linkedin: "#" } },
    { name: "Faraz Ahmad", role: "Software Developer", image: "https://ca.slack-edge.com/T03A7U0BX41-U080DHZ82A0-24641cffc0f5-512", socials: { github: "#", linkedin: "#" } },
  ]
};

function About() {
  const dispatch = useDispatch();

  const handleContactClick = () => {
    dispatch(updateMailContent({
      subject: "Professional Inquiry - Pocket Tools",
      body: "Hello Team, I am interested in your digital tool solutions.",
    }));
    dispatch(openMail());
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#0B1220] font-manrope selection:bg-[#3B82F6]/20">

      {/* 1. HERO SECTION */}
      <section className="relative pt-30 py-20 px-6 bg-white overflow-hidden border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#111827] mb-8">
            The World's Most <span className="text-[#3B82F6]">Efficient</span> Tool Factory.
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-[#6B7280] leading-relaxed mb-10 font-medium">
            Pocket Tools isn't just a website; it's a high-performance ecosystem designed to replace
            hundreds of cluttered bookmarks with a single, unified digital workspace. Since 2020,
            we've been engineering precision tools for developers, designers, and creators.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={handleContactClick} className="px-8 py-4 bg-[#3B82F6] text-white rounded-2xl font-bold hover:bg-[#2776f5] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-black/5">
              Get in Touch <FiChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* 2. CORE CAPABILITIES */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <FaTools />, title: "Precision Engineering", text: "Every tool is optimized for 100% accuracy, from Unit Converters to CSS Generators." },
            { icon: <FaBolt />, title: "Zero Latency", text: "Our tools run locally in your browser. No server delays, no processing wait times." },
            { icon: <FaLayerGroup />, title: "All-in-One Hub", text: "100+ tools across 10 categories including Dev, Design, Marketing, and Utility." },
            { icon: <FaUserShield />, title: "Privacy First", text: "Your data is never uploaded. All processing happens on your machine, guaranteed." }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-3xl border border-[#E5E7EB] bg-white hover:border-[#3B82F6]/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-300 group">
              <div className="text-[#3B82F6] text-3xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="text-lg font-bold mb-2 text-[#111827]">{item.title}</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed font-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. THE MISSION & WHY */}
      <section className="py-20 px-6 bg-[#111827] text-white rounded-[40px] mx-4 shadow-2xl">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-6 italic text-[#3B82F6]">Why Pocket Tools?</h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              The modern web is broken. Most tool websites are filled with intrusive ads,
              outdated 90s interfaces, and privacy-invasive tracking. We saw a need for
              a "Pocket Toolbox" that users could trust.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 text-[#3B82F6]"><FaChartLine /></div>
                <span><strong className="text-white">Scalability:</strong> We add new tools weekly based on industry trends.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 text-[#3B82F6]"><FaBolt /></div>
                <span><strong className="text-white">Clean UI:</strong> Minimalist design that focuses on the task, not the distractions.</span>
              </li>
            </ul>
          </div>
          <div className="bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-md">
            <h3 className="text-2xl font-bold mb-4 text-[#3B82F6]">Our Commitment</h3>
            <p className="text-slate-400 font-medium">
              We commit to keeping Pocket Tools free, fast, and accessible to everyone.
              Whether you're a developer debugging JSON or a student converting PDF files,
              our team ensures the experience is seamless.
            </p>
          </div>
        </div>
      </section>

      {/* 4. TEAM SECTION: Professional Hierarchy */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#111827] mb-4">Meet the Engineers</h2>
          <p className="text-[#6B7280] font-bold uppercase tracking-[0.2em] text-xs">The collective force driving digital innovation.</p>
        </div>

        {/* Lead Section */}
        <div className="flex justify-center mb-20">
          {TEAM.leadership.map((lead, i) => (
            <div key={i} className="group relative bg-white p-8 rounded-4xl border border-[#E5E7EB] shadow-xl shadow-black/2 max-w-md text-center hover:border-[#3B82F6]/30 transition-all">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-28 h-28 rounded-2xl border-4 border-white overflow-hidden shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                <img src={lead.image} alt={lead.name} className="w-full h-full object-cover" />
              </div>
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-[#111827]">{lead.name}</h3>
                <p className="text-[#3B82F6] font-black uppercase tracking-widest text-[10px] mb-4 mt-1 bg-[#3B82F6]/5 inline-block px-3 py-1 rounded-full">{lead.role}</p>
                <p className="text-[#6B7280] mb-6 italic font-medium">"{lead.bio}"</p>
                <div className="flex justify-center gap-4">
                  <a href={lead.socials.github} className="p-2.5 bg-[#F3F4F6] text-[#111827] rounded-xl hover:bg-[#3B82F6] hover:text-white transition-all"><FaGithub /></a>
                  <a href={lead.socials.linkedin} className="p-2.5 bg-[#F3F4F6] text-[#111827] rounded-xl hover:bg-[#3B82F6] hover:text-white transition-all"><FaLinkedin /></a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Members Grid */}
        <div className="flex flex-wrap justify-center items-start gap-8 md:gap-8">
          {TEAM.members.map((m, i) => (
            <div key={i} className="text-center group w-[calc(50%-1rem)] md:w-58">

              {/* Profile Image Container */}
              <div className="w-28 h-28 mx-auto mb-5 rounded-3xl border border-[#E5E7EB] bg-white shadow-sm transition-all duration-500 ease-in-out relative overflow-hidden group-hover:-translate-y-3 group-hover:border-[#3B82F6]/40 group-hover:shadow-[0_20px_25px_-5px_rgba(59,130,246,0.2)]">
                <img
                  src={m.image}
                  alt={m.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Name & Role */}
              <h4 className="font-bold text-[#111827]">{m.name}</h4>
              <p className="text-[#6B7280] text-[11px] font-bold uppercase tracking-wider mb-3">
                {m.role}
              </p>

              {/* Socials */}
              <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                {m.socials.github && (
                  <a href={m.socials.github} target="_blank" rel="noreferrer" className="text-[#6B7280] hover:text-[#3B82F6]">
                    <FaGithub size={16} />
                  </a>
                )}
                {m.socials.linkedin && (
                  <a href={m.socials.linkedin} target="_blank" rel="noreferrer" className="text-[#6B7280] hover:text-[#3B82F6]">
                    <FaLinkedin size={16} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FINAL CTA & SUPPORT */}
      <section className="pb-24 px-6 max-w-5xl mx-auto text-center">
        <div className="p-12 rounded-2xl bg-white border border-[#E5E7EB]">
          <h2 className="text-3xl font-black text-[#111827] mb-4">Want to Join Our Mission?</h2>
          <p className="text-[#6B7280] mb-8 font-medium">We are always looking for open-source contributors and tool ideas.</p>
          <button onClick={handleContactClick} className="px-10 py-4 bg-[#3B82F6] text-white rounded-2xl font-bold shadow-lg shadow-[#3B82F6]/20 hover:bg-[#2776f5] transition-all duration-300">
            Contact the Team
          </button>
        </div>

        <div className="mt-16">
          <BuyMeACoffee />
        </div>
      </section>

    </div>
  );
}

export default About;