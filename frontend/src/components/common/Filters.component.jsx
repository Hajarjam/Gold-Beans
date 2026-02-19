import { useState } from "react";

export default function Filters({ onApply }) {
  const [openFilter, setOpenFilter] = useState(null);

  // Selected values
  const [filters, setFilters] = useState({
    roastLevel: [],
    tasteProfile: [],
    intensity: [],
    origin: [],
    price: [0, 20], // [minPrice, maxPrice] in dollars
  });

  const toggleFilter = (name) => {
    setOpenFilter(openFilter === name ? null : name);
  };

  const toggleOption = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const applyFilters = () => {
    // Create a filter object for backend
    const adaptedFilters = {
      ...filters,
      intensity: filters.intensity.map(Number),
      price: { $gte: filters.price[0], $lte: filters.price[1] },
    };
    console.log("Applied filters:", adaptedFilters);
    onApply?.(adaptedFilters);
  };

  const clearFilters = () => {
    setFilters({
      roastLevel: [],
      tasteProfile: [],
      intensity: [],
      origin: [],
      price: [0, 20],
    });
    setOpenFilter(null);
  };

  return (
    <aside className="w-full lg:w-64 lg:shrink-0 bg-white rounded-xl shadow-sm p-5 self-start">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 items-center">
          <img src="/assets/filter.png" className="w-4 h-4" />
          <p className="font-semibold text-sm">Filters</p>
        </div>
        <button
          onClick={clearFilters}
          className="text-xs text-gray-400 hover:text-black transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {/* Roast Level */}
        <FilterSection
          title="Roast Level"
          isOpen={openFilter === "roastLevel"}
          onToggle={() => toggleFilter("roastLevel")}
          options={["Light", "Medium", "Dark"]}
          values={filters.roastLevel}
          onChange={(v) => toggleOption("roastLevel", v)}
        />

        {/* Taste Profile */}
        <FilterSection
          title="Taste Profile"
          isOpen={openFilter === "tasteProfile"}
          onToggle={() => toggleFilter("tasteProfile")}
          options={["Sweet", "Bitter", "Fruity", "Nutty", "Chocolate"]}
          values={filters.tasteProfile}
          onChange={(v) => toggleOption("tasteProfile", v)}
        />

        {/* Intensity */}
        <FilterSection
          title="Intensity"
          isOpen={openFilter === "intensity"}
          onToggle={() => toggleFilter("intensity")}
          options={["1", "2", "3", "4", "5"]}
          values={filters.intensity}
          onChange={(v) => toggleOption("intensity", v)}
        />

        {/* Price slider */}
        <div className="py-4">
          <button
            onClick={() => toggleFilter("price")}
            className="w-full flex items-center justify-between text-sm"
          >
            <p>Price</p>
            <img
              src="/assets/downarrow.png"
              className={`w-3 h-3 transition-transform duration-300 ${
                openFilter === "price" ? "rotate-180" : ""
              }`}
            />
          </button>

          {openFilter === "price" && (
            <div className="pt-3 text-xs text-gray-500">
              <div className="flex justify-between mb-2">
                <span>${filters.price[0]}</span>
                <span>${filters.price[1]}</span>
              </div>

              <div className="relative h-2 w-full bg-gray-300 rounded">
                <div
                  className="absolute h-2 bg-brown rounded"
                  style={{
                    left: `${(filters.price[0] / 100) * 100}%`,
                    width: `${((filters.price[1] - filters.price[0]) / 100) * 100}%`,
                  }}
                ></div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.price[1]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      price: [
                        prev.price[0],
                        Math.max(Number(e.target.value), prev.price[0]),
                      ],
                    }))
                  }
                  className="absolute w-full h-2 bg-transparent pointer-events-auto appearance-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Origin */}
        <FilterSection
          title="Origin"
          isOpen={openFilter === "origin"}
          onToggle={() => toggleFilter("origin")}
          options={["Brazil", "Ethiopia", "Colombia", "Kenya", "Guatemala"]}
          values={filters.origin}
          onChange={(v) => toggleOption("origin", v)}
        />
      </div>

      {/* Apply button */}
      <button
        onClick={applyFilters}
        className="mt-4 w-full inline-flex items-center justify-center bg-brown text-white text-sm py-2.5 rounded-md hover:bg-peach hover:text-black transition"
      >
        Apply filters
      </button>
    </aside>
  );
}

/* Reusable section */
function FilterSection({ title, isOpen, onToggle, options, values, onChange }) {
  return (
    <div className="py-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 text-sm"
      >
        <p>{title}</p>
        <img
          src="/assets/downarrow.png"
          className={`w-3 h-3 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && options?.length > 0 && (
        <div className="pl-1 pb-2 flex flex-col gap-2 text-xs text-gray-500">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={values.includes(opt)}
                onChange={() => onChange(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
