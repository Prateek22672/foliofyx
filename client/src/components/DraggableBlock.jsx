import React, { useState } from "react";

export default function DraggableBlock({
  children,
  index,
  moveBlock,
  type = "section",       // NEW → section or element
  id,                     // ID for element dragging
  onElementDrop,          // callback for element drops
}) {
  const [isOver, setIsOver] = useState(false);

  const onDragStart = (e) => {
    if (type === "section") {
      e.dataTransfer.setData("drag-type", "section");
      e.dataTransfer.setData("fromIndex", index);
    } else {
      e.dataTransfer.setData("drag-type", "element");
      e.dataTransfer.setData("elementId", id);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const onDragLeave = () => setIsOver(false);

  const onDrop = (e) => {
    const dragType = e.dataTransfer.getData("drag-type");

    // 🔥 Dropping a SECTION
    if (dragType === "section") {
      const from = Number(e.dataTransfer.getData("fromIndex"));
      moveBlock(from, index);
    }

    // 🔥 Dropping an ELEMENT inside a section
    if (dragType === "element" && onElementDrop) {
      const elementId = e.dataTransfer.getData("elementId");
      onElementDrop(elementId, id);
    }

    setIsOver(false);
  };

  return (
    <div
      draggable={type === "section"}  // Elements are NOT sections
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`transition rounded-xl ${
        isOver ? "border-2 border-purple-500 bg-purple-100/20" : "border-2 border-transparent"
      }`}
    >
      {children}
    </div>
  );
}
