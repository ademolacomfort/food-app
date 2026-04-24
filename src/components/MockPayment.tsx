import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CreditCard, CheckCircle, ShieldCheck, X } from "lucide-react";
import { auth, db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

interface MockPaymentProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function MockPayment({ onSuccess, onClose }: MockPaymentProps) {
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [method, setMethod] = useState<"card" | "paystack">("card");

  const handlePay = async () => {
    setStatus("processing");
    
    // Simulate API call to the server
    try {
      const response = await fetch("/api/payments/mock-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 5000,
          currency: "NGN",
          email: auth.currentUser?.email
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update user status in Firebase
        if (auth.currentUser) {
          const userRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userRef, { isPremium: true });
        }
        
        setTimeout(() => {
          setStatus("success");
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }, 1500);
      }
    } catch (error) {
      console.error("Payment failed", error);
      setStatus("idle");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2">
          <X size={20} />
        </button>

        <div className="bg-deepgreen p-8 text-white text-center">
          <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center text-deepgreen mx-auto mb-4 rotate-6">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold">Premium Access</h2>
          <p className="text-white/60 text-sm mt-1">Unlock all authentic African recipes forever</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex gap-4">
            <button
              onClick={() => setMethod("card")}
              className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                method === "card" ? "border-terracotta bg-terracotta/5" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <CreditCard className={method === "card" ? "text-terracotta" : "text-gray-400"} />
              <span className={`text-xs font-bold ${method === "card" ? "text-terracotta" : "text-gray-500"}`}>Card</span>
            </button>
            <button
              onClick={() => setMethod("paystack")}
              className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                method === "paystack" ? "border-[#09a5db] bg-[#09a5db]/5" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <img src="https://paystack.com/favicon.ico" alt="Paystack" className="w-5 h-5 rounded" />
              </div>
              <span className={`text-xs font-bold ${method === "paystack" ? "text-[#09a5db]" : "text-gray-500"}`}>Paystack</span>
            </button>
          </div>

          <div className="bg-[#fcfcf0] p-4 rounded-2xl border border-gold/20 flex items-center justify-between">
            <span className="font-bold text-earth">Premium Lifetime Plan</span>
            <span className="text-xl font-black text-deepgreen">₦5,000</span>
          </div>

          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.button
                key="pay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handlePay}
                className="w-full bg-terracotta text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-terracotta/20 transition-all flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Pay Now
              </motion.button>
            )}

            {status === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-3"
              >
                <div className="w-5 h-5 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
                Processing Securely...
              </motion.div>
            )}

            {status === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3"
              >
                <CheckCircle size={20} />
                Payment Successful!
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-[10px] text-center text-gray-400 px-8 leading-relaxed">
            Your payment is secure. We use industry-standard encryption to protect your data. 
            This is a mock transaction for demonstration purposes.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
