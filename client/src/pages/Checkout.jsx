import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Check, ShieldCheck, Loader2, ArrowLeft, Smartphone } from "lucide-react";

const Checkout = () => {
    const { user, refreshUser } = useAuth(); // ✅ Get refreshUser
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const planType = location.pathname.split("/").pop();
    const isStudent = queryParams.get("discount") === "student";

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const plans = {
        plus: { name: "Folio Plus", price: isStudent ? 29 : 99, duration: "3 Months", features: ["2 Premium Templates", "Remove Watermark", "Basic Customization"] },
        max: { name: "Folio Max", price: isStudent ? 59 : 159, duration: "6 Months", features: ["All Premium Templates", "Advanced Analytics", "Priority Support", "Ai Assistant"] },
        starter: { name: "Starter", price: 29, duration: "3 Months", features: [] }
    };

    const selectedPlan = plans[planType] || plans.plus;

    const handlePayment = async () => {
        setLoading(true);

        setTimeout(async () => {
            try {
                // 2. Call Backend Mock API
                // 🔴 WAS: const token = localStorage.getItem("token"); 
                // ✅ FIX: Use "accessToken" to match your Login/Signup logic
                const token = localStorage.getItem("accessToken");

                if (!token) {
                    alert("You are not logged in. Please login first.");
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:5000/api/payment/mock-success', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Now this will be a real token
                    }, body: JSON.stringify({
                        planType: planType,
                        paymentId: `UPI_${Date.now()}`
                    })
                });

                const data = await response.json();

                if (data.success) {
                    // ✅ CRITICAL FIX: Refresh Context immediately
                    await refreshUser();

                    setSuccess(true);

                    setTimeout(() => {
                        window.location.href = "/dashboard";
                    }, 2500);
                } else {
                    alert("Payment failed: " + data.msg);
                    setLoading(false);
                }

            } catch (err) {
                console.error("Payment Failed", err);
                alert("Payment failed. Please try again.");
                setLoading(false);
            }
        }, 3000);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.5)] animate-bounce">
                    <Check size={48} className="text-white" strokeWidth={4} />
                </div>
                <h1 className="text-4xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-neutral-400 mb-8">You are now a <span className="text-[#D4AF37] font-bold uppercase">{selectedPlan.name}</span> member.</p>
                <p className="text-sm text-neutral-600">Redirecting to dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4 md:p-8 font-['Wix_Madefor_Text']">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 relative">
                {/* Header */}
                <div className="bg-[#0a0a0a] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/20 blur-[60px] rounded-full pointer-events-none"></div>
                    <button onClick={() => navigate(-1)} className="absolute top-6 left-6 text-neutral-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="text-center mt-2">
                        <p className="text-neutral-400 text-xs font-bold tracking-widest uppercase mb-2">Confirm Subscription</p>
                        <h2 className="text-3xl font-bold mb-1">{selectedPlan.name}</h2>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-4xl font-bold text-[#D4AF37]">₹{selectedPlan.price}</span>
                            <span className="text-neutral-400 text-sm">/ {selectedPlan.duration}</span>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8">
                    <div className="bg-neutral-50 rounded-xl p-4 mb-6 border border-neutral-200">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Included Features</h3>
                        <ul className="space-y-2.5">
                            {selectedPlan.features.map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-neutral-700">
                                    <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                        <Check size={10} strokeWidth={3} />
                                    </div>
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Payment Button */}
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full py-4 rounded-xl bg-black text-white font-bold text-lg shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : `Pay ₹${selectedPlan.price}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;