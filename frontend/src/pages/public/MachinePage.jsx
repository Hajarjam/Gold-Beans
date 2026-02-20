import { useCallback, useEffect, useMemo, useState } from "react";
import MachineCard from "../../components/common/MachineCard.component";
import MachineFilters from "../../components/common/MachineFilters.component";
import Pagination from "../../components/common/Pagination";
import PeachLayout from "../../components/layouts/PeachLayout";
import publicApi from "../../api/publicApi";
import Breadcrumb from "../../components/common/Breadcrumb";

const ITEMS_PER_PAGE = 9;

export default function MachinePage() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");
  const [activeFilters, setActiveFilters] = useState(null);

  useEffect(() => {
    const fetchMachines = async () => {
      setLoading(true);
      try {
        const data = await publicApi.getMachines();
        setMachines(data);
      } catch (error) {
        console.error("Error fetching machines:", error);
      }
      setLoading(false);
    };

    fetchMachines();
  }, []);
  const sortMachines = (list, option) => {
    const sorted = [...list];
    switch (option) {
      case "price-low-high":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high-low":
        return sorted.sort((a, b) => b.price - a.price);
      case "name-a-z":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-z-a":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return list;
    }
  };
  const handleApplyFilters = useCallback((filters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  }, []);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setCurrentPage(1);
  };

  const list = useMemo(() => {
    const filtered = machines.filter((machine) => {
      if (!activeFilters) return true;

      if (activeFilters.type?.length && !activeFilters.type.includes(machine.type)) {
        return false;
      }

      if (activeFilters.brand?.length && !activeFilters.brand.includes(machine.brand)) {
        return false;
      }

      if (
        activeFilters.category?.length &&
        !activeFilters.category.includes(machine.category)
      ) {
        return false;
      }

      if (activeFilters.power?.length) {
        const machinePower = String(machine.power ?? "");
        if (!activeFilters.power.includes(machinePower)) return false;
      }

      if (activeFilters.coffeeTypeSupported?.length) {
        const supportedTypes = Array.isArray(machine.coffeeTypeSupported)
          ? machine.coffeeTypeSupported
          : [];
        const hasMatchingCoffeeType = supportedTypes.some((type) =>
          activeFilters.coffeeTypeSupported.includes(type)
        );
        if (!hasMatchingCoffeeType) return false;
      }

      const machinePrice = Number(machine.price);
      if (
        Number.isFinite(activeFilters.maxPrice) &&
        Number.isFinite(machinePrice) &&
        machinePrice > activeFilters.maxPrice
      ) {
        return false;
      }

      return true;
    });

    return sortMachines(filtered, sortOption);
  }, [machines, activeFilters, sortOption]);

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE) || 1;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMachines = list.slice(start, start + ITEMS_PER_PAGE);

  return (
    <>
      <PeachLayout>
        <div className="max-w-7xl mx-auto px-4 md:px-10 pt-2 md:pt-3">
          <Breadcrumb compact />
        </div>

        <div className="text-center pt-10 md:pt-12 pb-8 px-4">
          <h1 className="font-instrument-serif text-brown text-5xl mb-4">
            Our Machines
          </h1>
          <p className="font-instrument-sans text-charcoal text-base leading-relaxed">
            Choose from a wide variety of Machines from the leaders in the
            market.
            <br />
            All our machines are top quality to insure the best experience and
            delivered to your door.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-10 flex justify-end items-center gap-3 mb-3">
          <select
            value={sortOption}
            onChange={handleSortChange}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white"
          >
            <option value="">Sort by</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="name-a-z">Name: A to Z</option>
            <option value="name-z-a">Name: Z to A</option>
          </select>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-10 pb-16 flex flex-col lg:flex-row gap-8 items-start">
          {/* Filters */}
          <MachineFilters machines={machines} onApply={handleApplyFilters} />

          {/* Machine Cards */}
          <section className="flex flex-col flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <p className="col-span-full text-center">Loading...</p>
              ) : list.length > 0 ? (
                paginatedMachines.map((machine) => (
                  <MachineCard key={machine._id} machine={machine} />
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center">
                  No machines found.
                </p>
              )}
            </div>
            {!loading && list.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </section>
        </div>
      </PeachLayout>
    </>
  );
}
