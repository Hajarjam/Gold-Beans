import { useState, useEffect } from "react";
import MachineCard from "../../components/common/MachineCard.component";
import Filters from "../../components/common/Filters.component";
import Pagination from "../../components/common/Pagination";
import PeachLayout from "../../components/layouts/PeachLayout";
import publicApi from "../../api/publicApi";
import Breadcrumb from "../../components/common/Breadcrumb";

const ITEMS_PER_PAGE = 9;

export default function MachinePage() {
  const [machines, setMachines] = useState([]);
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");
  // Fetch machines from backend
  useEffect(() => {
    const fetchMachines = async () => {
      setLoading(true);
      try {
        const data = await publicApi.getMachines();
        setMachines(data);
        setFilteredMachines(data);
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
  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    setFilteredMachines((prev) => {
      const source = prev.length ? prev : machines;
      return sortMachines(source, option);
    });

    setCurrentPage(1);
  };

  // Handle applying filters
  const handleApplyFilters = (filters) => {
    const result = machines.filter((machine) => {
      // Type filter
      if (filters.type?.length && !filters.type.includes(machine.type))
        return false;
      // Brand filter
      if (filters.brand?.length && !filters.brand.includes(machine.brand))
        return false;
      // Power filter
      if (
        filters.power?.length &&
        !filters.power.includes(String(machine.power))
      )
        return false;
      // Price filter
      if (
        machine.price < filters.price?.$gte ||
        machine.price > filters.price?.$lte
      )
        return false;

      return true;
    });

    setFilteredMachines(result);
    setCurrentPage(1);
    setCurrentPage(1);
  };

  const list = filteredMachines.length > 0 ? filteredMachines : machines;
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE) || 1;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMachines = list.slice(start, start + ITEMS_PER_PAGE);

  return (
    <>
      <PeachLayout>
        <div className="py-2 px-16 flex flex-row">
          {" "}
          <Breadcrumb />
          <div className="max-w-3xl mx-auto py-10 text-center">
            <h1 className="text-4xl text-brown font-instrument-serif mt-10">
              Our Machines
            </h1>
            <p className="font-instrument-sans text-sm mt-4">
              Choose from a wide variety of Machines from the leaders in the
              Market.
              <br />
              All our machines are top quality to insure the best experience and
              delivered to your door.
            </p>
          </div>
        </div>
        <div className="flex gap-10 px-10">
          {/* Filters */}
          <Filters onApply={handleApplyFilters} />

          {/* Machine Cards */}
          <section className="flex flex-col">
            <div className="flex items-center justify-between mb-4 px-4 md:px-0">
              <p className="text-sm text-gray-600">
                {loading ? "Loading Machines..." : `${list.length} Machines`}
              </p>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="">Sort by</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 px-4 md:px-0">
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
