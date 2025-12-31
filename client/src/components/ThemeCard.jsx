import React from "react";

const ThemeCard = ({ theme, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(theme.name)}
      className="cursor-pointer border rounded-lg shadow hover:shadow-lg transition-all p-4 text-center bg-white"
    >
      <img
        src={theme.image}
        alt={theme.name}
        className="w-full h-48 object-cover rounded-md"
      />
      <h3 className="mt-3 text-lg font-semibold">{theme.name}</h3>
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Select
      </button>
    </div>
  );
};

export default ThemeCard;
