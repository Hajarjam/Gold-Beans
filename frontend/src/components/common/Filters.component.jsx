import { useState, useEffect } from "react";

export default function Filters({ coffees = [], onApply }) {
  const [openFilter, setOpenFilter] = useState(null);

  // Get max price dynamically from coffees
  const maxPrice = coffees.length
    ? Math.max(...coffees.map((c) => c.price))
    : 100;

  // Selected filters
  const [filters, setFilters] = useState({
    roastLevel: [],
    tasteProfile: [],
    intensity: [],
    origin: [],
    price: maxPrice,
  });

  // Update price if coffees change
  useEffect(() => {
    setFilters((prev) => ({ ...prev, price: maxPrice }));
  }, [maxPrice]);

  const toggleFilter = (name) =>
    setOpenFilter(openFilter === name ? null : name);

  const toggleOption = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const applyFilters = () => {
    const adaptedFilters = {
      ...filters,
      intensity: filters.intensity.map(Number),
    };
    onApply?.(adaptedFilters);
  };

  const clearFilters = () => {
    setFilters({
      roastLevel: [],
      tasteProfile: [],
      intensity: [],
      origin: [],
      price: maxPrice,
    });
    setOpenFilter(null);
    onApply?.(null);
  };

  const originOptions = Array.from(
    new Set(coffees.map((c) => c.origin))
  );

  const tasteProfileOptions = Array.from(
    new Set(coffees.flatMap((c) => c.tasteProfile))
  );

  return (
    <div
      className="
        shadow-md
        w-full
        sm:w-[85%]
        md:w-[300px]
        lg:w-[320px]
        h-fit
        p-3 sm:p-4
        bg-white
        mx-auto
        rounded-md
        flex
        flex-col
        gap-4
        lg:sticky lg:top-24
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <img src="/assets/filter.png" className="w-5 h-5" />
          <p className="font-semibold text-sm">Filters</p>
        </div>
        <button
          onClick={clearFilters}
          className="text-gray-500 text-sm font-semibold hover:text-black"
        >
          Clear All
        </button>
      </div>

      <hr />

      <FilterSection
        title="Roast Level"
        isOpen={openFilter === "roastLevel"}
        onToggle={() => toggleFilter("roastLevel")}
        options={["Light", "Medium", "Dark"]}
        values={filters.roastLevel}
        onChange={(v) => toggleOption("roastLevel", v)}
      />

      <hr />

      <FilterSection
        title="Taste Profile"
        isOpen={openFilter === "tasteProfile"}
        onToggle={() => toggleFilter("tasteProfile")}
        options={tasteProfileOptions}
        values={filters.tasteProfile}
        onChange={(v) => toggleOption("tasteProfile", v)}
      />

      <hr />

      <FilterSection
        title="Intensity"
        isOpen={openFilter === "intensity"}
        onToggle={() => toggleFilter("intensity")}
        options={["1", "2", "3", "4", "5"]}
        values={filters.intensity}
        onChange={(v) => toggleOption("intensity", v)}
      />

      <hr />

      <FilterSection
        title="Origin"
        isOpen={openFilter === "origin"}
        onToggle={() => toggleFilter("origin")}
        options={originOptions}
        values={filters.origin}
        onChange={(v) => toggleOption("origin", v)}
      />

      <hr />

      {/* Price */}
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
          <div className="mt-2 flex flex-col gap-1">
            <div className="text-right text-sm text-gray-600">
              ${filters.price}
            </div>
            <input
              type="range"
              min="0"
              max={maxPrice}
              value={filters.price}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  price: Number(e.target.value),
                }))
              }
              className="w-full h-2 rounded-lg cursor-pointer"
            />
          </div>
        )}
      </div>

      <button
        onClick={applyFilters}
        className="mt-4 bg-brown text-white text-sm py-2 rounded-md hover:bg-peach hover:text-black transition"
      >
        Apply Filters
      </button>
    </div>
  );
}

function FilterSection({
  title,
  isOpen,
  onToggle,
  options,
  values,
  onChange,
}) {
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
        <div className="pl-4 py-2 flex flex-col gap-2 text-sm text-gray-600">
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-3 py-1 cursor-pointer"
            >
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