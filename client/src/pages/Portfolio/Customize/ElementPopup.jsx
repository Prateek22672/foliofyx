import React from "react";
import { useElements } from "../../../context/ElementContext";

export default function ElementPopup({ onClose }) {
  const { addElement } = useElements();

  const items = [
    { type: "button", label: "Button" },
    { type: "text", label: "Text" },
    { type: "link", label: "Link" },
    { type: "divider", label: "Divider" },
  ];

  const handleAdd = (item) => {
    addElement({
      type: item.type,
      content:
        item.type === "button"
          ? "Click Me"
          : item.type === "text"
            ? "Sample Text"
            : item.type === "link"
              ? "https://example.com"
              : "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md text-black">
        <div className="flex justify-between items-center mb-4">
          <div className="flex ">
                      <h2 className="text-lg font-bold">Add Element</h2>
          <p className="bg-black text-white ml-2 px-3 p4-2 rounded-2xl">Beta</p>
          </div>

          <button className="text-xl" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <button
              key={item.type}
              className="p-4 bg-gray-100 hover:bg-gray-200 rounded-xl shadow text-center"
              onClick={() => handleAdd(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
