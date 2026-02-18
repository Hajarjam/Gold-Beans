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

  const handlePriceChange = (index, value) => {
    setFilters((prev) => {
      const newPrice = [...prev.price];
      newPrice[index] = Number(value);
      return { ...prev, price: newPrice };
    });
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
<div className="shadow-md w-[50%] max-w-[700px] h-fit p-4 bg-white ml-10 rounded-md flex flex-col gap-2">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <img src="/assets/filter.png" className="w-5 h-5" />
          <p className="font-semibold text-sm">Filter</p>
        </div>
        <button
          onClick={clearFilters}
          className="text-gray-500 text-sm font-semibold hover:text-black"
        >
          Clear
        </button>
      </div>

      <hr />

      {/* Roast Level */}
      <FilterSection
        title="Roast Level"
        isOpen={openFilter === "roastLevel"}
        onToggle={() => toggleFilter("roastLevel")}
        options={["Light", "Medium", "Dark"]}
        values={filters.roastLevel}
        onChange={(v) => toggleOption("roastLevel", v)}
      />

      <hr />

      {/* Taste Profile */}
      <FilterSection
        title="Taste Profile"
        isOpen={openFilter === "tasteProfile"}
        onToggle={() => toggleFilter("tasteProfile")}
        options={["Sweet", "Bitter", "Fruity", "Nutty", "Chocolate"]}
        values={filters.tasteProfile}
        onChange={(v) => toggleOption("tasteProfile", v)}
      />

      <hr />

      {/* Intensity */}
      <FilterSection
        title="Intensity"
        isOpen={openFilter === "intensity"}
        onToggle={() => toggleFilter("intensity")}
        options={["1", "2", "3", "4", "5"]}
        values={filters.intensity}
        onChange={(v) => toggleOption("intensity", v)}
      />

      <hr />

      {/* Price slider */}
      <div>
        <button
          onClick={() => toggleFilter("price")}
          className="w-full flex items-center justify-between px-2 py-1 text-sm"
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
  <div className="px-2 py-2 flex flex-col gap-2">
    {/* Display current min and max */}
    <div className="flex justify-between text-sm mb-2">
      <span>${filters.price[0]}</span>
      <span>${filters.price[1]}</span>
    </div>

    {/* Slider track */}
    <div className="relative h-2 w-full bg-gray-300 rounded">
      {/* Selected range highlight */}
      <div
        className="absolute h-2 bg-brown rounded"
        style={{
          left: `${(filters.price[0] / 100) * 100}%`,
          width: `${((filters.price[1] - filters.price[0]) / 100) * 100}%`,
        }}
      ></div>

     
      {/* Max thumb */}
      <input
        type="range"
        min="0"
        max="100"
        value={filters.price[1]}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            price: [prev.price[0], Math.max(Number(e.target.value), prev.price[0])],
          }))
        }
        className="absolute w-full h-2 bg-transparent pointer-events-auto appearance-none"
      />
    </div>
  </div>
)}



      </div>

      <hr />

      {/* Origin */}
      <FilterSection
        title="Origin"
        isOpen={openFilter === "origin"}
        onToggle={() => toggleFilter("origin")}
        options={["Brazil", "Ethiopia", "Colombia", "Kenya", "Guatemala"]}
        values={filters.origin}
        onChange={(v) => toggleOption("origin", v)}
      />

      {/* Apply button */}
      <button
        onClick={applyFilters}
        className="mt-4 bg-brown text-white text-sm py-2 rounded-md hover:bg-peach hover:text-black hover: transition"
      >
        Apply filters
      </button>
    </div>
  );
}

/* Reusable section */
function FilterSection({ title, isOpen, onToggle, options, values, onChange }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-2 py-1 text-sm"
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
        <div className="pl-4 py-2 flex flex-col gap-1 text-sm text-gray-600">
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
