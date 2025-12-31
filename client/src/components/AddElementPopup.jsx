import React from "react";
import { ELEMENT_TYPES } from "../constants/ElementTypes";

export default function AddElementPopup({ onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md">
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Add Element</h3>
          <p className="bg-black text-white px-4 p4-2 rounded-2xl">Beta</p>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {ELEMENT_TYPES.map((item) => (
            <button
              key={item.type}
              onClick={() => {
                onSelect(item);
                onClose();
              }}
              className="p-3 bg-gray-100 hover:bg-gray-200 text-black rounded-xl border border-gray-300 text-sm font-medium"
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
