import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from 'react-hot-toast';

export default function ToolRequest() {
  const user = useSelector((s) => s.auth.user);
  const isLogged = useSelector((s) => s.auth.isLogged);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [similar, setSimilar] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isLogged) {
      navigate("/signin");
    }
  }, [isLogged, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // client-side validation
    const newErrors = {};
    if (!name || name.trim().length === 0) newErrors.name = "Please enter a tool name.";
    if (!description || description.trim().length === 0) newErrors.description = "Please enter a description.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields", {
        duration: 3000,
        position: 'top-right',
        icon: '⚠️',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
      return;
    }

    if (!isLogged) {
      // extra guard — redirect to signin
      navigate("/signin");
      return;
    }

    setSubmitting(true);
    const loadingToast = toast.loading("Submitting your request...", {
      position: 'top-right',
      style: {
        background: '#F9FAFB',
        color: '#0B1220',
        border: '1px solid #E5E7EB',
      },
    });

    try {
      const payload = {
        name,
        description,
        similar,
        requestedBy: user?.email || null,
        requestedAt: new Date().toISOString(),
      };
      
      await addDoc(collection(db, "orders"), {
        ...payload,
        userId: user?.uid || null,
        createdAt: serverTimestamp(),
      });
      
      console.log("Tool request submitted and saved:", payload);
      setName("");
      setDescription("");
      setSimilar("");
      
      toast.success("Request submitted successfully! Thank you for your suggestion.", {
        id: loadingToast,
        duration: 4000,
        icon: '🎉',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request. Please try again.", {
        id: loadingToast,
        icon: '❌',
        style: {
          background: '#F9FAFB',
          color: '#0B1220',
          border: '1px solid #E5E7EB',
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pt-20">
      <h1 className="text-2xl font-bold text-[#111827] flex items-center gap-2 mb-6">
        <span className="text-2xl">💡</span> Request a Tool
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#FFFFFF] p-6 rounded-lg shadow-sm border border-[#E5E7EB]">
        <div>
          <label className="block text-sm font-medium text-[#0B1220] mb-2">
            1. Enter the name of the tool <span className="text-[#3B82F6]">*</span>
            <span className="text-[#6B7280] text-xs ml-2 font-normal">(e.g. CSS Clip Path Generator)</span>
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter tool name..."
            aria-invalid={errors.name ? "true" : "false"}
            className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-[#6B7280] text-[#0B1220] ${
              errors.name 
                ? 'border-[#3B82F6] ring-4 ring-[#3B82F6]/10' 
                : 'border-[#E5E7EB] focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10'
            }`}
          />
          {errors.name && <p className="text-sm text-[#3B82F6] mt-2 flex items-center gap-1">⚠️ {errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0B1220] mb-2">
            2. Describe the tool you want <span className="text-[#3B82F6]">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the tool functionality, features you'd like to see..."
            rows={7}
            aria-invalid={errors.description ? "true" : "false"}
            className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none placeholder:text-[#6B7280] text-[#0B1220] ${
              errors.description 
                ? 'border-[#3B82F6] ring-4 ring-[#3B82F6]/10' 
                : 'border-[#E5E7EB] focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10'
            }`}
          />
          {errors.description && <p className="text-sm text-[#3B82F6] mt-2 flex items-center gap-1">⚠️ {errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0B1220] mb-2">
            3. Enter the URL of a similar tool <span className="text-[#6B7280] text-xs font-normal">(optional)</span>
          </label>
          <input
            value={similar}
            onChange={(e) => setSimilar(e.target.value)}
            placeholder="https://example.com/similar-tool"
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:text-[#6B7280] text-[#0B1220] focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10"
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-[#6B7280]">
            <span className="text-[#3B82F6]">*</span> Required fields
          </p>
          <button
            type="submit"
            disabled={submitting || !name.trim() || !description.trim() || !isLogged}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-[#FFFFFF] transition-all active:scale-95 ${
              (submitting || !name.trim() || !description.trim() || !isLogged) 
                ? 'bg-[#6B7280] cursor-not-allowed opacity-50' 
                : 'bg-[#3B82F6] hover:bg-[#2776f5] shadow-lg shadow-[#3B82F6]/20'
            }`}
          >
            {submitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                ➤ Submit Request
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info Card */}
      <div className="mt-8 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-6">
        <h3 className="text-sm font-bold text-[#111827] mb-3">💡 Why request a tool?</h3>
        <p className="text-sm text-[#0B1220] leading-relaxed">
          Your suggestions help us build better tools for everyone. We review all requests and prioritize 
          development based on community interest. You'll be notified when your requested tool is available!
        </p>
        <div className="mt-4 flex gap-4 text-xs text-[#6B7280]">
          <span>✓ Free tools only</span>
          <span>✓ No spam</span>
          <span>✓ Community driven</span>
        </div>
      </div>
    </div>
  );
}