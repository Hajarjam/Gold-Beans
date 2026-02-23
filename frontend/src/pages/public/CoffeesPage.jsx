import { useState, useEffect } from "react";
import CoffeeCard from "../../components/common/CoffeeCard.component";
import Filters from "../../components/common/Filters.component";
import Pagination from "../../components/common/Pagination";
import PeachLayout from "../../components/layouts/PeachLayout";
import Breadcrumb from "../../components/common/Breadcrumb";

import publicApi from "../../api/publicApi";

const ITEMS_PER_PAGE = 9;

export default function CoffeesPage() {
  const [coffees, setCoffees] = useState([]);
  const [filteredCoffees, setFilteredCoffees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchCoffees = async () => {
      setLoading(true);
      try {
        const data = await publicApi.getCoffees();
        setCoffees(data);
        setFilteredCoffees(data);
      } catch (err) {
        console.error("Error fetching coffees:", err);
      }
      setLoading(false);
    };

    fetchCoffees();
  }, []);

  const sortCoffees = (list, option) => {
    const sorted = [...list];
    switch (option) {
      case "price-low-high":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high-low":
        return sorted.sort((a, b) => b.price - a.price);
      case "intensity-low-high":
        return sorted.sort((a, b) => a.intensity - b.intensity);
      case "intensity-high-low":
        return sorted.sort((a, b) => b.intensity - a.intensity);
      case "name-a-z":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-z-a":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return list;
    }
  };

  const handleApplyFilters = (filters) => {
    if (!filters) {
      const resetList = sortCoffees(coffees, sortOption);
      setFilteredCoffees(resetList);
      setCurrentPage(1);
      return;
    }

    const result = coffees.filter((coffee) => {
      if (filters.roastLevel?.length && !filters.roastLevel.includes(coffee.roastLevel)) {
        return false;
      }

      if (
        filters.tasteProfile?.length &&
        !coffee.tasteProfile?.some((t) => filters.tasteProfile.includes(t))
      ) {
        return false;
      }

      if (filters.intensity?.length && !filters.intensity.includes(coffee.intensity)) {
        return false;
      }

      if (filters.origin?.length && !filters.origin.includes(coffee.origin)) {
        return false;
      }

      if (filters.price !== undefined && coffee.price > filters.price) {
        return false;
      }

      return true;
    });

    const sortedResult = sortCoffees(result, sortOption);
    setFilteredCoffees(sortedResult);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    setFilteredCoffees((prev) => {
      const source = prev.length ? prev : coffees;
      return sortCoffees(source, option);
    });

    setCurrentPage(1);
  };

  const list = filteredCoffees;
  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE) || 1;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCoffees = list.slice(start, start + ITEMS_PER_PAGE);

  return (
    <>
      <PeachLayout>
        <div className="max-w-7xl mx-auto px-4 md:px-10 pt-2 md:pt-3">
          <Breadcrumb compact />
        </div>

        <div className="text-center pt-8 md:pt-10 pb-8 px-4">
          <h1 className="font-instrument-serif text-brown text-5xl mb-4">
            Our Coffees
          </h1>
          <p className="font-instrument-sans text-charcoal text-base leading-relaxed">
            Choose from a wide variety of coffee from the top roasters in the US.
            <br />
            All our specialty coffee is roasted to order and shipped fresh to your door.
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
            <option value="intensity-low-high">Intensity: Low to High</option>
            <option value="intensity-high-low">Intensity: High to Low</option>
            <option value="name-a-z">Name: A to Z</option>
            <option value="name-z-a">Name: Z to A</option>
          </select>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-10 pb-16 flex flex-col lg:flex-row gap-8 items-start">
          <Filters coffees={coffees} onApply={handleApplyFilters} />

          <section className="flex flex-col flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <p className="col-span-full text-center">Loading...</p>
              ) : list.length > 0 ? (
                paginatedCoffees.map((coffee) => (
                  <CoffeeCard key={coffee._id} coffee={coffee} />
                ))
              ) : (
                <p className="text-gray-500 col-span-full text-center">No coffees found.</p>
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
