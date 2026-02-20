import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_MAX_PRICE = 100;

const isDefinedValue = (value) =>
  value !== undefined && value !== null && String(value).trim() !== "";

const uniqueValues = (values) =>
  Array.from(new Set(values.filter(isDefinedValue)));

const getInitialFilters = (maxPrice) => ({
  type: [],
  brand: [],
  category: [],
  coffeeTypeSupported: [],
  power: [],
  maxPrice,
});

const isDefaultFilters = (filters, maxPrice) =>
  filters.type.length === 0 &&
  filters.brand.length === 0 &&
  filters.category.length === 0 &&
  filters.coffeeTypeSupported.length === 0 &&
  filters.power.length === 0 &&
  filters.maxPrice === maxPrice;

export default function MachineFilters({ machines = [], onApply }) {
  const [openFilter, setOpenFilter] = useState(null);

  const options = useMemo(() => {
    const type = uniqueValues(machines.map((machine) => machine.type));
    const brand = uniqueValues(machines.map((machine) => machine.brand));
    const category = uniqueValues(machines.map((machine) => machine.category));
    const coffeeTypeSupported = uniqueValues(
      machines.flatMap((machine) =>
        Array.isArray(machine.coffeeTypeSupported)
          ? machine.coffeeTypeSupported
          : []
      )
    );
    const power = uniqueValues(machines.map((machine) => machine.power))
      .map(String)
      .sort((a, b) => Number(a) - Number(b));

    const prices = machines
      .map((machine) => Number(machine.price))
      .filter((price) => Number.isFinite(price));
    const maxPrice = prices.length
      ? Math.ceil(Math.max(...prices))
      : DEFAULT_MAX_PRICE;

    return {
      type,
      brand,
      category,
      coffeeTypeSupported,
      power,
      maxPrice,
    };
  }, [machines]);

  const [filters, setFilters] = useState(() => getInitialFilters(options.maxPrice));
  const previousMaxPriceRef = useRef(options.maxPrice);

  useEffect(() => {
    setFilters((prev) => {
      const previousMaxPrice = previousMaxPriceRef.current;
      const shouldTrackMaxPrice = prev.maxPrice === previousMaxPrice;

      const nextFilters = {
        type: prev.type.filter((value) => options.type.includes(value)),
        brand: prev.brand.filter((value) => options.brand.includes(value)),
        category: prev.category.filter((value) => options.category.includes(value)),
        coffeeTypeSupported: prev.coffeeTypeSupported.filter((value) =>
          options.coffeeTypeSupported.includes(value)
        ),
        power: prev.power.filter((value) => options.power.includes(value)),
        maxPrice: shouldTrackMaxPrice
          ? options.maxPrice
          : Math.min(prev.maxPrice, options.maxPrice),
      };

      return nextFilters;
    });

    previousMaxPriceRef.current = options.maxPrice;
  }, [options]);

  const toggleFilter = (name) =>
    setOpenFilter(openFilter === name ? null : name);

  const toggleOption = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((selected) => selected !== value)
        : [...prev[category], value],
    }));
  };

  const applyFilters = () => {
    onApply?.(isDefaultFilters(filters, options.maxPrice) ? null : filters);
  };

  const clearFilters = () => {
    setFilters(getInitialFilters(options.maxPrice));
    setOpenFilter(null);
  };

  useEffect(() => {
    onApply?.(isDefaultFilters(filters, options.maxPrice) ? null : filters);
  }, [filters, onApply, options.maxPrice]);

  const filterSections = [
    { key: "type", title: "Type", values: filters.type, options: options.type },
    {
      key: "brand",
      title: "Brand",
      values: filters.brand,
      options: options.brand,
    },
    {
      key: "category",
      title: "Category",
      values: filters.category,
      options: options.category,
    },
    {
      key: "coffeeTypeSupported",
      title: "Coffee Type",
      values: filters.coffeeTypeSupported,
      options: options.coffeeTypeSupported,
    },
    {
      key: "power",
      title: "Power",
      values: filters.power,
      options: options.power,
      formatOption: (value) => `${value}W`,
    },
  ].filter((section) => section.options.length > 0);

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
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <img src="/assets/filter.png" className="w-5 h-5" alt="Filter icon" />
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

      {filterSections.length > 0 ? (
        filterSections.map((section, index) => (
          <div key={section.key}>
            <FilterSection
              title={section.title}
              isOpen={openFilter === section.key}
              onToggle={() => toggleFilter(section.key)}
              options={section.options}
              values={section.values}
              onChange={(value) => toggleOption(section.key, value)}
              formatOption={section.formatOption}
            />
            {index < filterSections.length - 1 && <hr className="mt-4" />}
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 px-2">
          No dynamic machine filter values available yet.
        </p>
      )}

      <hr />

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
            alt="Toggle price filter"
          />
        </button>

        {openFilter === "price" && (
          <div className="mt-2 flex flex-col gap-1">
            <div className="text-right text-sm text-gray-600">
              ${filters.maxPrice}
            </div>
            <input
              type="range"
              min="0"
              max={options.maxPrice}
              value={filters.maxPrice}
              onChange={(event) =>
                setFilters((prev) => ({
                  ...prev,
                  maxPrice: Number(event.target.value),
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
  formatOption,
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
          alt={`Toggle ${title}`}
        />
      </button>

      {isOpen && options?.length > 0 && (
        <div className="pl-4 py-2 flex flex-col gap-2 text-sm text-gray-600">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 py-1 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={values.includes(option)}
                onChange={() => onChange(option)}
              />
              {formatOption ? formatOption(option) : option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
