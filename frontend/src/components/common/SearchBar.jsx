import { Search } from "lucide-react";

export default function SearchBar({ placeholder = "Search...", value, onChange }) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "320px" }}>
      <Search
        style={{
          pointerEvents: "none",
          position: "absolute",
          left: "14px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#9D8E83",
          zIndex: 2,
        }}
        size={18}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value ?? ""}
        onChange={onChange}
        autoComplete="off"
        style={{ position: "relative", zIndex: 1 }}
        className="h-11 w-full rounded-full border border-[#E6DDD7] bg-white pl-11 pr-4 text-sm text-brown shadow-sm outline-none transition-shadow placeholder:text-[#A89B92] focus:border-[#D7C8BE] focus:shadow-[0_0_0_3px_rgba(59,23,13,0.08)]"
      />
    </div>
  );
}
