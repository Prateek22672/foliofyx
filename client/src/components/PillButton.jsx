export default function PillButton({ label, onClick, variant = "black" }) {
  const baseStyles = `
    px-7 py-2 
    rounded-full 
    text-sm font-medium
    transition-all duration-300
    cursor-pointer select-none
  `;

  const variants = {
    black: "bg-black text-white hover:bg-neutral-900",
    white: "bg-white text-black border border-black hover:bg-black hover:text-white"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]}`}
    >
      {label}
    </button>
  );
}
