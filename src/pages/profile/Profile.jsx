import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../authProviders";
import { clearUser } from "../../redux/slices/authSlice";
import { setFavourites } from "../../redux/slices/favouritesSlice";
import { FiMail, FiChevronDown, FiUser, FiLogOut, FiMessageSquare, FiClock, FiPlusCircle } from "react-icons/fi";
import profile from "../../assets/profile.png";
import CategoryCard from "../../components/category-card/CategoryCard";
import BugReportCard from "../../components/BugReportCard";
import { db } from "../../firebase"; 
import { collection, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore";

function Profile() {
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites.items);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("favorites");
  const [bugReports, setBugReports] = useState([]);
  const [comments, setComments] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCloudFavourites = async () => {
      if (user?.uid && favourites.length === 0) {
        try {
          const userFavRef = doc(db, "user_favourites", user.uid);
          const docSnap = await getDoc(userFavRef);
          if (docSnap.exists()) {
            dispatch(setFavourites(docSnap.data().items || []));
          }
        } catch (err) { console.error("Fav Sync Error:", err); }
      }
    };
    fetchCloudFavourites();
  }, [user?.uid, dispatch, favourites.length]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return; 
      
      setLoadingData(true);
      try {
        if (activeTab === "bugs") {
          const q = query(collection(db, "bug_reports"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
          const snap = await getDocs(q);
          setBugReports(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }

        if (activeTab === "comments") {
          const q = query(collection(db, "comments"), where("userId", "==", user.uid));
          const snap = await getDocs(q);
          const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          const sorted = data.sort((a, b) => {
            const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds * 1000 || 0);
            const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds * 1000 || 0);
            return dateB - dateA;
          });
          setComments(sorted);
        }
      } catch (err) { 
        console.error(`${activeTab} Fetch Error:`, err); 
      } finally { 
        setLoadingData(false); 
      }
    };

    fetchData();
  }, [user?.uid, activeTab]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tabs = [
    { id: "favorites", label: `Favorites (${favourites.length})` },
    { id: "comments", label: `Comments (${comments.length})` },
    { id: "requests", label: "Requests" },
    { id: "bugs", label: `Bugs (${bugReports.length})` },
    { id: "products", label: "Products" }
  ];

  const handleLogout = async () => {
    try { await logout(); dispatch(clearUser()); navigate("/"); } catch (err) { console.error(err); }
  };

  if (authLoading) return <div className="flex justify-center items-center min-h-screen text-[#3B82F6] font-medium bg-[#F3F4F6] font-manrope">Loading...</div>;
  if (!user) return <div className="text-center mt-20 text-[#6B7280] font-medium font-manrope">Please login to view profile.</div>;

  return (
    <div className="min-h-screen bg-[#F3F4F6] px-4 py-8 flex flex-col items-center gap-8 pt-24 font-manrope">
      {/* Header Profile Card */}
      <div className="w-full max-w-4xl bg-[#FFFFFF] rounded-lg border border-[#E5E7EB] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-[#F3F4F6] shadow-md">
            <img src={user.photoURL || profile} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-1 right-1 bg-emerald-500 w-5 h-5 rounded-full border-4 border-white"></div>
        </div>

        <div className="flex flex-col text-center sm:text-left flex-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1220] tracking-tight">{user?.displayName || "Anonymous User"}</h2>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-[#6B7280] mt-2 font-medium">
            <FiMail className="text-[#3B82F6]" />
            <span className="text-sm sm:text-base">{user.email}</span>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-2.5 bg-[#F3F4F6] text-[#0B1220] rounded-xl font-bold hover:bg-[#dd1616] hover:text-white transition-all duration-300 active:scale-95 border border-[#E5E7EB]">
          <FiLogOut /> Logout
        </button>
      </div>

      {/* Tabs Section */}
      <div className="w-full max-w-4xl bg-[#FFFFFF] rounded-lg border border-[#E5E7EB] overflow-visible">
        {/* Custom Mobile Dropdown */}
        <div className="sm:hidden p-4 relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-full flex items-center justify-between px-5 py-4 bg-[#F3F4F6] text-[#0B1220] rounded-lg font-bold border border-[#E5E7EB]">
            {tabs.find(t => t.id === activeTab)?.label}
            <FiChevronDown className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isDropdownOpen && (
            <div className="absolute left-4 right-4 mt-2 bg-white rounded-lg border border-[#E5E7EB] z-50 overflow-hidden">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsDropdownOpen(false); }} className={`w-full text-left px-5 py-4 text-sm font-semibold transition-colors ${activeTab === tab.id ? "bg-[#3B82F6] text-white" : "text-[#6B7280] hover:bg-[#F3F4F6]"}`}>
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex p-2 gap-1 bg-[#F9FAFB] rounded-t-lg border-b border-[#E5E7EB]">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 py-3 px-2 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === tab.id ? "bg-white text-[#3B82F6] ring-1 ring-[#E5E7EB]" : "text-[#6B7280] hover:text-[#0B1220] hover:bg-[#F3F4F6]"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content Area */}
        <div className="p-6 sm:p-10 min-h-112.5">
          {loadingData ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="animate-spin w-10 h-10 border-4 border-[#3B82F6] border-t-transparent rounded-full"></div>
              <p className="text-[#6B7280] font-medium animate-pulse">Fetching your data...</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {activeTab === "favorites" && (
                favourites.length === 0 ? <EmptyState icon={<FiPlusCircle />} msg="No favorites yet." /> :
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favourites.map((product) => <CategoryCard key={product.id} product={product} />)}
                </div>
              )}

              {activeTab === "comments" && (
                comments.length === 0 ? <EmptyState icon={<FiMessageSquare />} msg="No comments posted yet." /> :
                <div className="max-w-3xl mx-auto space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] hover:border-[#3B82F6]/50 hover:bg-white transition-all group shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 p-2.5 bg-white text-[#3B82F6] rounded-lg shadow-sm border border-[#E5E7EB] group-hover:bg-[#3B82F6] group-hover:text-white transition-all">
                          <FiMessageSquare size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[#0B1220] font-semibold leading-relaxed text-base">
                            {comment.comment || "Comment text missing"}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-[#6B7280] uppercase tracking-wider bg-white px-2 py-1 rounded-md border border-[#E5E7EB]">
                              <FiClock size={12} className="text-[#3B82F6]" /> 
                              {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString() : "Recent"}
                            </span>
                            {comment.toolId && (
                              <span className="text-[10px] font-black text-[#3B82F6] bg-[#3B82F6]/5 px-2 py-1 rounded-md uppercase tracking-tighter border border-[#3B82F6]/10">
                                Tool: {comment.toolId.replace(/-/g, ' ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "bugs" && (
                bugReports.length === 0 ? <EmptyState icon={<FiUser />} msg="No bug reports found." /> :
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {bugReports.map((report) => <BugReportCard key={report.id} report={report} />)}
                </div>
              )}

              {["requests", "products"].includes(activeTab) && (
                <EmptyState icon={<FiPlusCircle />} msg={`${activeTab.replace(/-/g, ' ')} section is coming soon!`} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const EmptyState = ({ icon, msg }) => (
  <div className="flex flex-col items-center justify-center py-20 text-[#6B7280]/30">
    <div className="text-6xl mb-4">{icon}</div>
    <p className="font-bold text-lg text-[#6B7280] opacity-100 uppercase tracking-widest">{msg}</p>
  </div>
);

export default Profile;