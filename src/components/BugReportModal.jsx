import { SendHorizontal, X, Bug } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { db, auth } from '../firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

const BugReportModal = ({ isOpen, onClose, toolName }) => {
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("Please enter a description.", {
        duration: 3000,
        position: 'top-right',
        icon: '📝',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
      return;
    }

    setIsSubmitting(true);

    const loadingToast = toast.loading("Submitting report...", {
      position: 'top-right',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });

    try {
      await addDoc(collection(db, "bug_reports"), {
        toolName: toolName,
        description: description,
        userId: auth.currentUser ? auth.currentUser.uid : "Guest",
        userEmail: auth.currentUser ? auth.currentUser.email : "Anonymous",
        createdAt: serverTimestamp(),
        status: "pending"
      });

      
      toast.success("Bug reported successfully!", { 
        id: loadingToast,
        icon: '🐛',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
      setDescription(""); 
      onClose(); 
    } catch (error) {
      console.error("Error submitting bug report:", error);
      
      toast.error("Something went wrong. Please try again.", { 
        id: loadingToast,
        icon: '❌',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#FFFFFF] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-[#E5E7EB]">
        
        <div className="p-8 pb-0">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl text-[#3B82F6]"><Bug size={24} strokeWidth={2.5}/></span>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Bug Report</h2>
          </div>

          <div className="mb-6">
            <p className="text-lg font-semibold text-[#0B1220]">
              Tool: <span className="font-normal text-[#6B7280]">{toolName}</span>
            </p>
            <p className="text-sm text-[#6B7280] mt-2">Please describe the issue you encountered.</p>
          </div>

          <div className="relative">
            <textarea
              autoFocus
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description*"
              disabled={isSubmitting}
              className="w-full h-40 p-4 border border-[#E5E7EB] rounded-xl focus:ring-4 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] outline-none transition-all resize-none placeholder:text-[#6B7280] disabled:bg-[#F9FAFB] text-[#0B1220]"
            />
          </div>
        </div>

        <div className="p-8 pt-6 flex justify-end">
          <button 
            className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2776f5] text-[#FFFFFF] px-8 py-3 rounded-full font-semibold transition-all shadow-lg shadow-[#3B82F6]/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <span>
              {isSubmitting ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <SendHorizontal className='h-4 w-4'/>
              )}
            </span> 
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-[#6B7280] hover:text-[#3B82F6] transition-colors p-1"
        >
          <X className="h-6 w-6 stroke-[2.5px]" />
        </button>
      </div>
    </div>,
    document.body
  );
};

export default BugReportModal;