//import ProductCard from "../../components/common/ProductCard";
//import SearchBar from "../../components/ui/SearchBar";
import MainLayout from "../../components/layouts/MainLayout";
//import useHomeService from "../../hooks/useHomeService";

import productsData from "../../components/data/products.json";
import { useNavigate } from "react-router-dom";


export default function HomePage() {
  const bestSellers = productsData.products.filter(
    (product) => product.isBestSeller,
  );
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* Section Hero */}
      <section className="relative h-screen min-h-[500px]">
        {/* Background image */}
        <img
          src="/assets/Rectangle83.png"
          alt="Coffee background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <div className="text-white max-w-full sm:max-w-xl md:max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-instrument-serif mb-1 sm:mb-2 leading-tight">
              WHERE EVERY BEAN
            </h1>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-instrument-serif mb-4 sm:mb-6 leading-tight">
              TELLS A STORY
            </h1>
            <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-gray-200 font-instrument-sans max-w-lg">
              Thoughtfully sourced coffees, crafted to elevate everyday moments.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-peach-light text-black font-semibold font-instrument-sans rounded-lg hover:bg-peach transition text-sm sm:text-base">
                Subscribe
              </button>
              <button
                onClick={() => navigate("/coffees")}
                className="px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-peach-light text-white font-semibold font-instrument-sans rounded-lg
             bg-peach/20 hover:bg-peach hover:text-black hover:border-peach transition text-sm sm:text-base"
              >
                Discover
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <div className="bg-charcoal py-12 sm:py-16 md:py-20">
        <h2 className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl text-peach-light tracking-widest mb-8 sm:mb-12 md:mb-16 px-4">
          OUR BEST SELLERS
        </h2>

        <div
          className="
          mx-auto
          px-4 sm:px-6 md:px-8
          grid gap-6 sm:gap-8 md:gap-10 lg:gap-12
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          max-w-4xl
          lg:max-w-6xl
          2xl:max-w-7xl
        "
        >
          {bestSellers.map((product) => (
            <div
              key={product.id}
              className="bg-dark-brown rounded-2xl pb-6 text-center shadow-lg hover:shadow-2xl transition-shadow"
            >
              <div className="overflow-hidden rounded-t-2xl mb-4 sm:mb-5">
                <img
                  src={product.image}
                  alt={product.title}
                  className="
                  w-full
                  h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80
                  object-cover
                  hover:scale-105 transition-transform duration-300
                "
                />
              </div>

              <h3
                className="
              text-white 
              text-xs sm:text-sm lg:text-base
              uppercase 
              tracking-wide 
              mb-4 sm:mb-5 md:mb-6
              font-semibold
              px-4
            "
              >
                {product.title}
              </h3>

              <button
                className="
              bg-white 
              font-semibold 
              text-black 
              text-xs lg:text-sm
              px-4 sm:px-5
              py-2 sm:py-2.5
              rounded-md 
              hover:bg-gray-200 
              transition
            "
              >
                SHOP NOW
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Product Section */}
      <section className="bg-dark-brown 
            pt-12 sm:pt-16 md:pt-20 lg:pt-24 
            pb-32 sm:pb-24 md:pb-32 lg:pb-40 
            mb-[-125px] sm:mb-[-130px] md:mb-[-145px] lg:mb-[-180px] 
            relative clip-triangle">

    
      {/* Title */}
      <h2 className="text-center text-white text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-widest mb-10 sm:mb-12 md:mb-16 mt-0 px-4">
        OUR PRODUCTS
      </h2>

      {/* Desktop Layout (3x2 grid) */}
      <div className="hidden md:grid max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto grid-cols-3 grid-rows-2 gap-0 pt-6">
        {/* Image 1 */}
        <div className="aspect-square">
          <img src="/assets/coffee-beans.jpg" alt="Coffee Beans" className="w-full h-full object-cover" />
        </div>

        {/* Coffee Machines */}
        <div className="aspect-square bg-brown text-white flex flex-col justify-center items-center text-center px-4 lg:px-6">
          <h3 className="text-2xl lg:text-3xl xl:text-4xl font-instrument-serif mb-1 font-medium">Coffee Machines</h3>
          <hr className="w-16 lg:w-20 mb-4 lg:mb-6"></hr>
          <p className="text-xs lg:text-sm font-instrument-sans opacity-80 mb-3 lg:mb-4">Highest Quality Offered</p>
          <button onClick={() => navigate("/machines")} className="bg-white text-black px-3 lg:px-4 py-1.5 lg:py-2 text-xs rounded font-medium hover:bg-gray-200 transition">
            SHOP NOW
          </button>
        </div>

        {/* Image 2 */}
        <div className="aspect-square">
          <img src="/assets/coffeepowder.jpg" alt="CoffeePowder" className="w-full h-full object-cover" />
        </div>

        {/* Coffee Beans */}
        <div className="aspect-square bg-brown text-white flex flex-col justify-center items-center text-center px-4 lg:px-6">
          <h3 className="text-2xl lg:text-3xl xl:text-4xl font-instrument-serif mb-1">Coffee Beans</h3>
          <hr className="w-16 lg:w-20 mb-4 lg:mb-6"></hr>
          <p className="text-xs lg:text-sm font-instrument-sans opacity-80 mb-3 lg:mb-4">Highest Quality Offered</p>
          <button onClick={() => navigate("/coffees")} className="bg-white text-black px-3 lg:px-4 py-1.5 lg:py-2 text-xs rounded font-medium hover:bg-gray-200 transition">
            SHOP NOW
          </button>
        </div>

        {/* Image 3 */}
        <div className="aspect-square">
          <img src="/assets/machine.jpg" alt="machine" className="w-full h-full object-cover" />
        </div>

        {/* Coffee Powder */}
        <div className="aspect-square bg-brown text-white flex flex-col justify-center items-center text-center px-4 lg:px-6">
          <h3 className="text-2xl lg:text-3xl xl:text-4xl font-instrument-serif mb-1">Coffee Powder</h3>
          <hr className="w-16 lg:w-20 mb-4 lg:mb-6"></hr>
          <p className="text-xs lg:text-sm font-instrument-sans opacity-80 mb-3 lg:mb-4">
            Aiming to serve a fresh quality Cup
          </p>
          <button onClick={() => navigate("/coffees")} className="bg-white text-black px-3 lg:px-4 py-1.5 lg:py-2 text-xs rounded font-medium hover:bg-gray-200 transition">
            SHOP NOW
          </button>
        </div>
      </div>


      {/* Mobile & Tablet Layout - stacked squares */}
      <div className="md:hidden mx-auto w-full max-w-[600px] gap-0 px-8">
        {/* Beans Row */}
        <div className="flex w-full gap-0 mb-0">
          <div className="aspect-square w-1/2">
            <img src="/assets/coffee-beans.jpg" alt="Coffee Beans" className="w-full h-full object-cover" />
          </div>
          <div className="aspect-square w-1/2 border-b-2 border-peach bg-brown text-white flex flex-col justify-center items-center text-center px-3 sm:px-6">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-instrument-serif mb-1">Coffee Beans</h3>
            <hr className="w-12 sm:w-16 md:w-20 mb-3 sm:mb-4 md:mb-6"></hr>
            <p className="text-xs sm:text-sm font-instrument-sans opacity-80 mb-3 sm:mb-4">Highest Quality Offered</p>
            <button onClick={() => navigate("/coffees")} className="bg-white text-black px-3 sm:px-4 py-1.5 sm:py-2 text-xs rounded font-medium hover:bg-gray-200 transition">
              SHOP NOW
            </button>
          </div>
        </div>

        {/* Machines Row */}
        <div className="flex w-full gap-0 mb-0">
          <div className="aspect-square w-1/2">
            <img src="/assets/machine.jpg" alt="Coffee Machines" className="w-full h-full object-cover" />
          </div>
          <div className="aspect-square w-1/2 border-b-2 border-peach bg-brown text-white flex flex-col justify-center items-center text-center px-3 sm:px-6">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-instrument-serif mb-1 font-medium">Coffee Machines</h3>
            <hr className="w-12 sm:w-16 md:w-20 mb-3 sm:mb-4 md:mb-6"></hr>
            <p className="text-xs sm:text-sm font-instrument-sans opacity-80 mb-3 sm:mb-4 tracking-[0.5px] sm:tracking-[0.9px]">Highest Quality Offered</p>
            <button className="bg-white text-black px-3 sm:px-4 py-1.5 sm:py-2 text-xs rounded font-medium hover:bg-gray-200 transition">
              SHOP NOW
            </button>
          </div>
        </div>

        {/* Powder Row */}
        <div className="flex w-full gap-0">
          <div className="aspect-square w-1/2">
            <img src="/assets/coffeepowder.jpg" alt="Coffee Powder" className="w-full h-full object-cover" />
          </div>
          <div className="aspect-square w-1/2 border-b-2 border-peach bg-brown text-white flex flex-col justify-center items-center text-center px-3 sm:px-6">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-instrument-serif mb-1">Coffee Powder</h3>
            <hr className="w-12 sm:w-16 md:w-20 mb-3 sm:mb-4 md:mb-6"></hr>
            <p className="text-xs sm:text-sm font-instrument-sans opacity-80 mb-3 sm:mb-4">
              Aiming to serve a fresh quality Cup
            </p>
            <button onClick={() => navigate("/coffees")} className="bg-white text-black px-3 sm:px-4 py-1.5 sm:py-2 text-xs rounded font-medium hover:bg-gray-200 transition">
              SHOP NOW
            </button>
          </div>
        </div>
      </div>

    </section>

      {/* HowItWorks */}
<div className="bg-peach pt-20 sm:pt-28 md:pt-40 lg:pt-56 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
  
  {/* Title */}
  <h2 className="text-center text-brown text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-widest mb-8 sm:mb-10 md:mb-14 font-semibold px-4">
    HOW IT WORKS ?
  </h2>

  {/* Container */}
  <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
    
    {/* Steps wrapper */}
    <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 max-w-7xl mx-auto">

      {/* STEP 1 */}
      <div className="flex flex-col items-center text-center w-full max-w-xs">

        <div
          className="
          w-[140px] h-[140px]
          xs:w-[160px] xs:h-[160px]
          sm:w-[180px] sm:h-[180px]
          md:w-[200px] md:h-[200px]
          lg:w-[240px] lg:h-[240px]
          xl:w-[280px] xl:h-[280px]
          rounded-full
          overflow-hidden
          bg-brown
          shadow-[0_0_20px_5px_rgba(27,21,21,0.25)]
          sm:shadow-[0_0_30px_7px_rgba(27,21,21,0.3)]
          lg:shadow-[0_0_35px_8px_rgba(27,21,21,0.35)]
          transition-shadow hover:shadow-[0_0_40px_10px_rgba(27,21,21,0.4)]
          "
        >
          <img
            src="/assets/step1.jpg"
            alt="step1"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-4 sm:mt-5">
          <h4 className="font-robotoSerif font-bold text-sm sm:text-base md:text-lg lg:text-xl">
            STEP 1 — We source rare beans
          </h4>

          <p className="font-instrument-sans italic text-xs sm:text-sm md:text-base mt-2 text-gray-700 px-2">
            Single-origin coffee from limited harvests
          </p>
        </div>

      </div>


      {/* STEP 2 */}
      <div className="flex flex-col items-center text-center w-full max-w-xs">

        <div
          className="
          w-[140px] h-[140px]
          xs:w-[160px] xs:h-[160px]
          sm:w-[180px] sm:h-[180px]
          md:w-[200px] md:h-[200px]
          lg:w-[240px] lg:h-[240px]
          xl:w-[280px] xl:h-[280px]
          rounded-full
          overflow-hidden
          bg-brown
          shadow-[0_0_20px_5px_rgba(27,21,21,0.25)]
          sm:shadow-[0_0_30px_7px_rgba(27,21,21,0.3)]
          lg:shadow-[0_0_35px_8px_rgba(27,21,21,0.35)]
          transition-shadow hover:shadow-[0_0_40px_10px_rgba(27,21,21,0.4)]
          "
        >
          <img
            src="/assets/step2.jpg"
            alt="step2"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-4 sm:mt-5">
          <h4 className="font-robotoSerif font-bold text-sm sm:text-base md:text-lg lg:text-xl">
            STEP 2 — Roasted in batches
          </h4>

          <p className="font-instrument-sans italic text-xs sm:text-sm md:text-base mt-2 text-gray-700 px-2">
            Freshly roasted for peak flavor
          </p>
        </div>

      </div>


      {/* STEP 3 */}
      <div className="flex flex-col items-center text-center w-full max-w-xs">

        <div
          className="
          w-[140px] h-[140px]
          xs:w-[160px] xs:h-[160px]
          sm:w-[180px] sm:h-[180px]
          md:w-[200px] md:h-[200px]
          lg:w-[240px] lg:h-[240px]
          xl:w-[280px] xl:h-[280px]
          rounded-full
          overflow-hidden
          bg-brown
          shadow-[0_0_20px_5px_rgba(27,21,21,0.25)]
          sm:shadow-[0_0_30px_7px_rgba(27,21,21,0.3)]
          lg:shadow-[0_0_35px_8px_rgba(27,21,21,0.35)]
          transition-shadow hover:shadow-[0_0_40px_10px_rgba(27,21,21,0.4)]
          "
        >
          <img
            src="/assets/step3.jpg"
            alt="step3"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-4 sm:mt-5">
          <h4 className="font-robotoSerif font-bold text-sm sm:text-base md:text-lg lg:text-xl">
            STEP 3 — Monthly Delivery
          </h4>

          <p className="font-instrument-sans italic text-xs sm:text-sm md:text-base mt-2 text-gray-700 px-2">
            Whole bean or ground, tailored to you
          </p>
        </div>

      </div>

    </div>
  </div>
</div>

      {/* WhyUs */}
      <div className="bg-white py-12 sm:py-16 md:py-20 px-4">
        <h2 className="text-center text-brown text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-widest mb-10 sm:mb-12 md:mb-16 font-semibold">
          WHY US ?
        </h2>

        {/* Cards */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-6 md:gap-8 lg:gap-12 max-w-3xl md:max-w-5xl lg:max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center w-full max-w-xs sm:max-w-none">
            <img
              src="/assets/original.png"
              alt="Original"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40"
            />
            <p className="font-instrument-sans text-xs sm:text-sm md:text-base font-thin max-w-xs mt-4 sm:mt-5 px-2">
              Carefully sourced beans from the world's finest coffee-growing
              regions, chosen for their unique flavor and character.
            </p>
          </div>

          <div className="flex flex-col items-center text-center w-full max-w-xs sm:max-w-none">
            <img
              src="/assets/quality.png"
              alt="Quality"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40"
            />
            <p className="font-instrument-sans text-xs sm:text-sm md:text-base font-thin max-w-xs mt-4 sm:mt-5 px-2">
              Roasted in small batches to preserve aroma, freshness, and balance
              in every cup.
            </p>
          </div>

          <div className="flex flex-col items-center text-center w-full max-w-xs sm:max-w-none">
            <img
              src="/assets/handshake.png"
              alt="Trust"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40"
            />
            <p className="font-instrument-sans text-xs sm:text-sm md:text-base font-thin max-w-xs mt-4 sm:mt-5 px-2">
              Committed to transparency, consistency, and lasting relationships
              with growers and customers alike.
            </p>
          </div>
        </div>

        {/* Divider + CTA */}
        <div className="mt-12 sm:mt-16 md:mt-20 flex flex-col items-center max-w-3xl mx-auto px-4">
          <hr className="w-full border-t border-brown mb-6 sm:mb-8 md:mb-10" />

          <p className="text-xl sm:text-2xl md:text-3xl text-center font-instrument-sans italic mb-6 sm:mb-8">
            Elevate your coffee experience.
          </p>

          <button className="bg-brown text-white rounded-lg px-5 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-instrument-sans font-semibold hover:bg-peach hover:text-brown transition">
            Subscribe
          </button>
        </div>
      </div>
    </MainLayout>
  );
}