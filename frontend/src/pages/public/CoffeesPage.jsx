import { useState, useEffect } from "react";
import CoffeeCard from "../../components/common/CoffeeCard.component";
import Filters from "../../components/common/Filters.component";
import Footer from "../../components/layouts/Footer";
import PeachLayout from "../../components/layouts/PeachLayout";

export default function Coffeespage() {
  const [coffees, setCoffees] = useState([]);
  const [filteredCoffees, setFilteredCoffees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch coffees from backend
  useEffect(() => {
    const fetchCoffees = async () => {
      setLoading(true);
      try {
const res = await fetch(`${process.env.REACT_APP_API_URL}/Coffees`);
        const data = await res.json();
        setCoffees(data);
      } catch (error) {
        console.error("Error fetching coffees:", error);
      }
      setLoading(false);
    };

    fetchCoffees();
  }, []);

  // Handle applying filters
  const handleApplyFilters = (filters) => {
    const result = coffees.filter((coffee) => {
      // Roast Level
      if (filters.roastLevel?.length && !filters.roastLevel.includes(coffee.roastLevel)) return false;
      // Taste Profile
      if (filters.tasteProfile?.length && !filters.tasteProfile.some(t => coffee.tasteProfile.includes(t))) return false;
      // Intensity
      if (filters.intensity?.length && !filters.intensity.includes(String(coffee.intensity))) return false;
      // Origin
      if (filters.origin?.length && !filters.origin.includes(coffee.origin)) return false;
      // Price
      if (coffee.price < filters.price.$gte || coffee.price > filters.price.$lte) return false;

      return true;
    });

    setFilteredCoffees(result);
  };

  return (
    <>
      <PeachLayout>
        <div className="max-w-3xl mx-auto py-10 text-center">
          <h1 className="text-4xl text-brown font-instrument-serif mt-10">Our Coffees</h1>
          <p className="font-instrument-sans text-sm mt-4">
            Choose from a wide variety of coffee from the top roasters in the US.
            <br />
            All our specialty coffee is roasted to order and shipped fresh to your door.
          </p>
        </div>

        <div className="flex gap-10 px-10">
          {/* Filters */}
          <Filters onApply={handleApplyFilters} />

          {/* Coffee Cards */}
          <section className="grid grid-cols-2 md:grid-cols-3 gap-6 px-4 md:px-0">
            {loading ? (
              <p className="col-span-full text-center">Loading...</p>
            ) : (filteredCoffees.length > 0 ? filteredCoffees : coffees).length > 0 ? (
              (filteredCoffees.length > 0 ? filteredCoffees : coffees).map((coffee) => (
                <CoffeeCard key={coffee._id} coffee={coffee} />
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">No coffees found.</p>
            )}
          </section>
        </div>
      

      <Footer />
      </PeachLayout>
    </>
  );
}
