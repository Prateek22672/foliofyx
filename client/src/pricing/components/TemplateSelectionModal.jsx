import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Layout, ArrowRight } from "lucide-react";
import { TEMPLATES_DATA } from "../constants";

const TemplateSelectionModal = ({ isOpen, onClose, onConfirm }) => {
    const [selected, setSelected] = useState([]);
    const toggleTemplate = (id) => {
        if (selected.includes(id)) setSelected(selected.filter(i => i !== id));
        else if (selected.length < 2) setSelected([...selected, id]);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full md:w-[800px] md:h-auto h-full bg-neutral-900 border border-white/10 md:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-neutral-900 flex justify-between items-center">
                            <div><h3 className="text-xl font-bold text-white flex items-center gap-2"><Layout size={20} className="text-white" /> Configure Your Plus Plan</h3><p className="text-neutral-400 text-xs mt-1">Select any 2 templates to unlock immediately.</p></div>
                            <div className="text-right"><span className={`text-sm font-bold ${selected.length === 2 ? "text-green-400" : "text-neutral-500"}`}>{selected.length}/2 Selected</span></div>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh] bg-black/20">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {TEMPLATES_DATA.map((t) => {
                                    const isSelected = selected.includes(t.id);
                                    const isDisabled = !isSelected && selected.length >= 2;
                                    return (
                                        <div key={t.id} onClick={() => !isDisabled && toggleTemplate(t.id)} className={`relative aspect-[4/5] rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden group ${isSelected ? "border-white bg-white/5" : "border-white/5 bg-neutral-950 hover:border-white/20"} ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}`}>
                                            <div className={`absolute top-0 left-0 w-full h-32 ${t.color} opacity-20`} />
                                            <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                                <div className="flex justify-between items-end">
                                                    <div><span className="text-[10px] font-mono text-neutral-400 uppercase">{t.tag}</span><p className="text-white font-bold">{t.name}</p></div>
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${isSelected ? "bg-white border-white text-black" : "border-white/30 text-transparent"}`}><Check size={14} strokeWidth={3} /></div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="p-6 border-t border-white/5 bg-neutral-900 flex justify-between items-center">
                            <button onClick={onClose} className="text-neutral-400 text-sm hover:text-white">Cancel</button>
                            <button disabled={selected.length !== 2} onClick={() => onConfirm(selected)} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${selected.length === 2 ? "bg-white text-black hover:bg-neutral-200" : "bg-neutral-800 text-neutral-500 cursor-not-allowed"}`}>Continue to Checkout <ArrowRight size={16} /></button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TemplateSelectionModal;