export default function ScrollArrows({ show, scrollToSection }) {
  if (!show) return null;

  return (
    <div className="fixed right-4 bottom-16 flex flex-col gap-3 z-[9999]">
      <button
        onClick={() =>
          scrollToSection(
            Math.max(
              0,
              Math.round(
                Number(
                  getComputedStyle(document.documentElement).getPropertyValue("--scroll")
                ) - 1
              )
            )
          )
        }
        className="
          p-4 rounded-2xl bg-black/20 backdrop-blur-xl
          border border-white/20 shadow-[0_0_25px_rgba(0,0,0,0.25)]
          text-white text-xl hover:bg-white/20 hover:scale-110
          transition-all
        "
      >
        ↑
      </button>

      <button
        onClick={() =>
          scrollToSection(
            Math.round(
              Number(
                getComputedStyle(document.documentElement).getPropertyValue("--scroll")
              ) + 1
            )
          )
        }
        className="
          p-4 rounded-2xl bg-black/20 backdrop-blur-xl
          border border-white/20 shadow-[0_0_25px_rgba(0,0,0,0.25)]
          text-white text-xl hover:bg-white/20 hover:scale-110
          transition-all
        "
      >
        ↓
      </button>
    </div>
  );
}
