import { useState, useEffect } from "react";
import { Share2, Heart, Bug } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToFavourites, removeFromFavourites, setFavourites } from "../redux/slices/favouritesSlice";
import { openShareModal } from "../redux/slices/modalSlice"; 
import { db } from "../firebase"; 
import { doc, setDoc, getDoc } from "firebase/firestore";
import BugReportModal from "./BugReportModal";

const ToolsDetailPageHeader = ({ title, icon }) => {
  const [fullProduct, setFullProduct] = useState(null);
  const [showBugModal, setShowBugModal] = useState(false);
  
  const dispatch = useDispatch();
  
  // Redux states
  const { items } = useSelector((state) => state.favourites);
  const { user } = useSelector((state) => state.auth);

  // 1. Fetch tool details from data.json
  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find(
          (item) => item.title.toLowerCase() === title.toLowerCase()
        );
        setFullProduct(found);
      })
      .catch((err) => console.error("Error loading data.json:", err));
  }, [title]);

  // 2. Initial Fetch from Cloud (Only once on mount or when user logs in)
  useEffect(() => {
    const fetchCloudFavourites = async () => {
      if (user?.uid && items.length === 0) {
        try {
          const userFavRef = doc(db, "user_favourites", user.uid);
          const docSnap = await getDoc(userFavRef);
          if (docSnap.exists()) {
            const cloudItems = docSnap.data().items || [];
            if (cloudItems.length > 0) {
              dispatch(setFavourites(cloudItems));
            }
          }
        } catch (err) {
          console.error("Error fetching favourites from cloud:", err);
        }
      }
    };
    fetchCloudFavourites();
  }, [dispatch, items.length, user]); 

  // Check if current tool is in favourites
  const isFavorite = items.some((item) => 
    fullProduct ? item.id === fullProduct.id : item.title === title
  );

  // 3. Handle Toggle (Redux + Firestore Update)
  const handleFavoriteClick = async () => {
    if (!user) {
      alert("Please login to manage favourites.");
      return;
    }

    let updatedItems;
    
    if (isFavorite) {
      // Remove Logic
      const idToRemove = fullProduct ? fullProduct.id : items.find(i => i.title === title)?.id;
      updatedItems = items.filter(item => item.id !== idToRemove);
      dispatch(removeFromFavourites(idToRemove));
    } else {
      // Add Logic
      const newItem = fullProduct || { 
        id: Date.now(), 
        title, 
        image: icon.split('/').pop(),
        category: "tools"
      };
      updatedItems = [...items, newItem];
      dispatch(addToFavourites(newItem));
    }

    // Direct Background Sync with Firestore
    try {
      const userFavRef = doc(db, "user_favourites", user.uid);
      await setDoc(userFavRef, { 
        items: updatedItems, 
        lastUpdated: new Date().toISOString() 
      }, { merge: true });
    } catch (error) {
      console.error("Firebase sync error:", error);
    }
  };

  const handleShareClick = () => {
    if (fullProduct) {
      dispatch(openShareModal({
        title: fullProduct.title,
        category: fullProduct.category
      }));
    } else {
      dispatch(openShareModal({
        title: title,
        category: "tools" 
      }));
    }
  };

  const actions = [
    { 
      label: "Share", 
      icon: <Share2 size={16} />, 
      onClick: handleShareClick 
    },
    {
      label: isFavorite ? "Saved" : "Add to Favs",
      icon: <Heart size={16} className={isFavorite ? "fill-red-500 text-red-500" : "text-brand-muted"} />,
      onClick: handleFavoriteClick,
    },
    { 
      label: "Report Bug", 
      icon: <Bug size={16} />, 
      onClick: () => setShowBugModal(true) 
    },
  ];

  return (
    <>
      <div className="w-full bg-brand-bg pt-14 md:pt-22 pb-2">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <img src={icon} alt={title} className="w-8 h-8 object-contain" />
            <h1 className="text-xl sm:text-2xl font-bold text-brand-text font-space-grotesk">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`inline-flex items-center gap-1 sm:gap-2 border border-gray-200 rounded-full px-3 sm:px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer outline-none
                  ${isFavorite && action.label === "Saved" 
                    ? "bg-red-50 border-red-100 text-red-600 shadow-sm" 
                    : "border-brand-border bg-brand-surface text-brand-muted hover:bg-brand-bg hover:text-brand-text shadow-sm"
                  }`}
              >
                {action.icon}
                <span className="hidden sm:inline">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <BugReportModal isOpen={showBugModal} onClose={() => setShowBugModal(false)} toolName={title} />
    </>
  );
};

export default ToolsDetailPageHeader;