import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { Loader2, Package, AlertCircle, ExternalLink, Calendar } from 'lucide-react';

export default function Orders() {
  const isLogged = useSelector((s) => s.auth.isLogged);
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLogged) {
      navigate("/signin");
      return;
    }

    // Don't proceed if no user
    if (!user?.uid) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError("User not authenticated properly");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create query with proper ordering
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map((d) => {
            const data = d.data();
            return { 
              id: d.id, 
              ...data,
              // Ensure we have a valid date for display
              displayDate: data.createdAt?.toDate ? 
                data.createdAt.toDate() : 
                data.requestedAt ? new Date(data.requestedAt) : null
            };
          });
          setOrders(items);
          setLoading(false);
        },
        (err) => {
          console.error("Firestore error:", err);
          
          // Handle specific Firestore errors
          if (err.code === 'failed-precondition') {
            setError("Index required. Please check Firebase console to create the required index.");
          } else if (err.code === 'permission-denied') {
            setError("You don't have permission to view these orders.");
          } else {
            setError("Failed to load orders. Please try again later.");
          }
          setLoading(false);
        }
      );

      return () => unsub();
    } catch (err) {
      console.error("Error setting up orders listener:", err);
      setError("Failed to initialize orders. Please refresh the page.");
      setLoading(false);
    }
  }, [isLogged, navigate, user]);

  // Format date helper
  const formatDate = (date) => {
    if (!date) return "Date not available";
    
    try {
      return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className=" px-4 sm:px-6 py-8 sm:py-12 pt-20 mt-10 bg-[#F9FAFB] min-h-screen">
      {/* Header */}
      <div className="mx-auto max-w-5xl flex items-center gap-3 mb-6 sm:mb-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F9FAFB] rounded-xl flex items-center justify-center border border-[#E5E7EB]">
          <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#3B82F6]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">Your Tool Requests</h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">Track all your submitted tool requests</p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="mx-auto max-w-5xl bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
        {/* Status Bar */}
        <div className="px-4 sm:px-6 py-3 bg-[#F9FAFB] border-b border-[#E5E7EB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium text-[#0B1220]">Total Requests:</span>
            <span className="text-xs sm:text-sm font-bold text-[#3B82F6]">{orders.length}</span>
          </div>
          {!loading && !error && orders.length > 0 && (
            <span className="text-[10px] sm:text-xs text-[#6B7280]">Last updated: Just now</span>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 min-h-75">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#3B82F6] animate-spin mb-3" />
              <p className="text-xs sm:text-sm text-[#6B7280] font-medium">Loading your requests...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-50 rounded-full flex items-center justify-center mb-3 border border-red-100">
                <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-[#3B82F6]" />
              </div>
              <p className="text-sm sm:text-base text-[#0B1220] font-bold mb-1">Oops! Something went wrong</p>
              <p className="text-xs sm:text-sm text-[#6B7280] max-w-md">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full text-xs sm:text-sm text-[#0B1220] hover:border-[#3B82F6] hover:text-[#3B82F6] transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F9FAFB] rounded-2xl flex items-center justify-center mb-4 border border-[#E5E7EB]">
                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-[#3B82F6]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#111827] mb-2">No requests yet</h3>
              <p className="text-xs sm:text-sm text-[#6B7280] max-w-sm mb-6">
                You haven't submitted any tool requests. Be the first to suggest a tool!
              </p>
              <button 
                onClick={() => navigate("/tool-request")}
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#3B82F6] text-[#FFFFFF] rounded-full text-xs sm:text-sm font-bold hover:bg-[#2776f5] transition-colors shadow-lg shadow-[#3B82F6]/20 active:scale-95"
              >
                Request a Tool
              </button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {orders.map((o, index) => (
                <div 
                  key={o.id} 
                  className="group p-4 sm:p-5 border border-[#E5E7EB] rounded-xl hover:border-[#3B82F6] hover:shadow-md transition-all bg-[#FFFFFF]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-[#6B7280] bg-[#F9FAFB] px-2 py-1 rounded-full">
                          #{index + 1}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-[#111827]">{o.name}</h3>
                      </div>
                      
                      <p className="text-sm sm:text-base text-[#0B1220] mb-3 leading-relaxed">
                        {o.description}
                      </p>
                      
                      {o.similar && (
                        <a 
                          href={o.similar} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#3B82F6] hover:text-[#2776f5] transition-colors group/link"
                        >
                          <span>View similar tool</span>
                          <ExternalLink size={14} className="group-hover/link:translate-x-0.5 transition-transform" />
                        </a>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-[#6B7280] bg-[#F9FAFB] px-3 py-2 rounded-lg sm:flex-col sm:items-end">
                      <Calendar size={14} className="sm:hidden" />
                      <time dateTime={o.displayDate?.toISOString()} className="whitespace-nowrap">
                        {formatDate(o.displayDate)}
                      </time>
                    </div>
                  </div>

                  {/* Status Badge (optional) */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-[#6B7280]">
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
                      Pending Review
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      {!error && orders.length > 0 && (
        <div className="mt-6 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-[#0B1220]">
            <span className="font-bold text-[#3B82F6]">Note:</span> Your requests are under review. 
            We'll notify you when they're being developed. Thank you for helping us improve!
          </p>
        </div>
      )}
    </div>
  );
}