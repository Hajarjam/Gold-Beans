import NavbarC from "./NavbarC";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom"; 
import productsData from "../../components/data/products.json";

export default function ClientLayout() {
    const bestSellers = productsData.products.filter(
        (product) => product.isBestSeller,
      );
      const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col">
            <NavbarC />



            <section className="relative h-screen">
        {/* Background image */}
        <img
          src="/assets/Rectangle83.png"
          alt="Coffee background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-4 sm:px-8 md:px-16 lg:px-24">
          <div className="text-white max-w-xl sm:max-w-2xl">
            <h1 className="text-4xl md:text-6xl lg:text-6xl font-instrument-serif mb-2 leading-tight">
              WHERE EVERY BEAN
            </h1>
            <h1 className="text-4xl md:text-6xl lg:text-6xl font-instrument-serif mb-6 leading-tight">
              TELLS A STORY
            </h1>
            <p className="text-[0.8rem] md:text-[1rem] mb-8 text-gray-200 font-instrument-sans">
              Thoughtfully sourced coffees, crafted to elevate everyday moments.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-peach-light text-black font-semibold font-instrument-sans rounded-lg hover:bg-peach transition">
                Subscribe
              </button>
              <button
                onClick={() => navigate("/coffees")}
                className="px-8 py-3 border-2 border-peach-light text-white font-semibold font-instrument-sans rounded-lg
             bg-peach/20 hover:bg-peach hover:text-black hover:border-peach transition"
              >
                Discover
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <div className="bg-charcoal py-20">
        <h2 className="text-center text-xl text-peach-light md:text-3xl tracking-widest mb-16">
          OUR BEST SELLERS
        </h2>

        <div
          className="
          mx-auto
          px-6
          grid gap-12
          grid-cols-1
          md:grid-cols-3
          max-w-4xl
          lg:max-w-6xl
          2xl:max-w-7xl
        "
        >
          {bestSellers.map((product) => (
            <div
              key={product.id}
              className="bg-dark-brown rounded-2xl pb-6 text-center shadow-lg"
            >
              <div className="overflow-hidden rounded-t-2xl mb-5">
                <img
                  src={product.image}
                  alt={product.title}
                  className="
                  w-full
                  h-64
                  lg:h-80
                  2xl:h-96
                  object-cover
                "
                />
              </div>

              <h3
                className="
              text-white 
              text-sm 
              lg:text-base
              uppercase 
              tracking-wide 
              mb-6 
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
              text-xs 
              lg:text-sm
              px-5 
              py-2.5
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

      <div className="bg-dark-brown pt-16 pb-[200px] mb-[-220px] relative clip-triangle">
        {/* Title */}
        <h2 className="text-center text-white text-xl md:text-3xl tracking-widest mb-16 mt-0">
          OUR PRODUCTS
        </h2>

        {/* Desktop Layout (unchanged) */}
        <div className="hidden md:grid max-w-4xl mx-auto grid-cols-3 grid-rows-2 gap-0 pt-6">
          {/* Image 1 */}
          <div className="aspect-square">
            <img
              src="/assets/coffee-beans.jpg"
              alt="Coffee Beans"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Coffee Machines */}
          <div className="aspect-square border-b-2 border-peach md:border-none bg-brown text-white flex flex-col justify-center items-center text-center px-6">
            <h3 className="text-4xl font-instrument-serif mb-1 font-medium">
              Coffee Machines
            </h3>
            <hr className="w-20 mb-6"></hr>
            <p className="text-sm font-instrument-sans opacity-80 mb-4">
              Highest Quality Offered
            </p>
            <button className="bg-white text-black px-4 py-2 text-xs rounded font-medium">
              SHOP NOW
            </button>
          </div>

          {/* Image 2 */}
          <div className="aspect-square">
            <img
              src="/assets/coffeepowder.jpg"
              alt="CoffeePowder"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Coffee Beans */}
          <div className="aspect-square border-2 border-x-0 border-t-0 border-peach md:border-none bg-brown text-white flex flex-col justify-center items-center text-center px-6">
            <h3 className="text-4xl font-instrument-serif mb-1">
              Coffee Beans
            </h3>
            <hr className="w-20 mb-6"></hr>
            <p className="text-sm font-instrument-sans opacity-80 mb-4">
              Highest Quality Offered
            </p>
            <button className="bg-white text-black px-4 py-2 text-xs rounded font-medium">
              SHOP NOW
            </button>
          </div>

          {/* Image 3 */}
          <div className="aspect-square">
            <img
              src="/assets/machine.jpg"
              alt="machine"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Coffee Powder */}
          <div className="aspect-square bg-brown text-white flex flex-col justify-center items-center text-center px-6">
            <h3 className="text-4xl font-instrument-serif mb-1">
              Coffee Powder
            </h3>
            <hr className="w-20 mb-6"></hr>
            <p className="text-sm font-instrument-sans opacity-80 mb-4">
              Aiming to serve a fresh quality Cup
            </p>
            <button className="bg-white text-black px-4 py-2 text-xs rounded font-medium">
              SHOP NOW
            </button>
          </div>
        </div>

        {/* Mobile Layout - glued squares, no gaps */}
        <div className="md:hidden mx-auto w-full max-w-[500px] gap-0">
          {/* Beans Row */}
          <div className="flex w-full gap-0">
            <div className="aspect-square w-1/2">
              <img
                 
              src="/assets/coffee-beans.jpg"
              alt="Coffee Beans"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square w-1/2 border-b-2 border-peach bg-brown text-white flex flex-col justify-center items-center text-center px-6">
              <h3 className="text-3xl md:text-4xl  font-instrument-serif mb-1">
                Coffee Beans
              </h3>
              <hr className="w-20 mb-6"></hr>
              <p className="text-sm font-instrument-sans opacity-80 mb-4">
                Highest Quality Offered
              </p>
              <button className="bg-white text-black px-4 py-2 text-xs rounded font-medium">
                SHOP NOW
              </button>
            </div>
          </div>

          {/* Machines Row */}
          <div className="flex w-full gap-0">
            <div className="aspect-square w-1/2">
              <img
                src="/assets/machine.jpg"
                alt="Coffee Machines"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square w-1/2 border-b-2 border-peach bg-brown text-white flex flex-col justify-center items-center text-center px-6">
              <h3 className="text-3xl md:text-4xl font-instrument-serif mb-1 font-medium">
                Coffee Machines
              </h3>
              <hr className="w-20 mb-6"></hr>
              <p className="text-sm font-instrument-sans opacity-80 mb-4 tracking-[0.9px]">
                Highest Quality Offered
              </p>
              <button className="bg-white text-black px-4 py-2 text-xs rounded font-medium">
                SHOP NOW
              </button>
            </div>
          </div>

          {/* Powder Row */}
          <div className="flex w-full gap-0">
            <div className="aspect-square w-1/2">
              <img
                src="/assets/coffeepowder.jpg"
                alt="Coffee Powder"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square w-1/2 border-b-2 border-peach bg-brown text-white flex flex-col justify-center items-center text-center px-6">
              <h3 className="text-3xl md:text-4xl  font-instrument-serif mb-1">
                Coffee Powder
              </h3>
              <hr className="w-20 mb-6"></hr>
              <p className="text-sm font-instrument-sans opacity-80 mb-4">
                Aiming to serve a fresh quality Cup
              </p>
              <button className="bg-white text-black px-4 py-2 text-xs rounded font-medium">
                SHOP NOW
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* HowItWorks */}

      <div className="bg-peach pt-[280px] pb-[100px]">
        <h2 className="text-center text-brown text-xl md:text-3xl tracking-widest mb-12 font-semibold">
          HOW IT WORKS ?
        </h2>

        <div className="flex justify-center px-6 sm:px-20">
          <div className="flex flex-col sm:flex-row gap-12 w-full max-w-7xl justify-between">
            {/* STEP 1 */}
            <div className="flex flex-col items-center flex-1">
              <div
                className="
  w-[200px] h-[200px] 
  sm:w-[300px] sm:h-[300px] 
  rounded-full 
  overflow-hidden 
  bg-brown
  shadow-[0_0_35px_8px_rgba(27,21,21,0.35)]
"
              >
                <img
                  src="/assets/step1.jpg"
                  alt="step1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 text-center max-w-xs">
                <h4 className="font-robotoSerif font-bold text-lg">
                  STEP 1 — We source rare beans
                </h4>
                <p className="font-instrument-sans italic text-sm mt-2">
                  Single-origin coffee from limited harvests
                </p>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="flex flex-col items-center flex-1">
              <div
                className="
  w-[200px] h-[200px] 
  sm:w-[300px] sm:h-[300px] 
  rounded-full 
  overflow-hidden 
  bg-brown
  shadow-[0_0_35px_8px_rgba(27,21,21,0.35)]
"
              >
                <img
                  src="/assets/step2.jpg"
                  alt="step2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 text-center max-w-xs">
                <h4 className="font-robotoSerif font-bold text-lg">
                  STEP 2 — Roasted in batches
                </h4>
                <p className="font-instrument-sans italic text-sm mt-2">
                  Freshly roasted for peak flavor
                </p>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="flex flex-col items-center flex-1">
              <div
                className="
  w-[200px] h-[200px] 
  sm:w-[300px] sm:h-[300px] 
  rounded-full 
  overflow-hidden 
  bg-brown
  shadow-[0_0_35px_8px_rgba(27,21,21,0.35)]
"
              >
                <img
                  src="/assets/step3.jpg"
                  alt="step3"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 text-center max-w-xs">
                <h4 className="font-robotoSerif font-bold text-lg">
                  STEP 3 — Monthly Delivery
                </h4>
                <p className="font-instrument-sans italic text-sm mt-2">
                  Whole bean or ground, tailored to you
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhyUs */}

      <div className="bg-white py-20 px-4">
        <h2 className="text-center text-brown text-xl tracking-widest mb-16 font-semibold">
          WHY US ?
        </h2>

        {/* Cards */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 max-w-3xl md:max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center w-full">
            <img
              src="/assets/original.png"
              alt="Original"
              className="w-32 h-32 md:w-40 md:h-40"
            />
            <p className="font-instrument-sans text-sm font-thin max-w-xs mt-5">
              Carefully sourced beans from the world’s finest coffee-growing
              regions, chosen for their unique flavor and character.
            </p>
          </div>

          <div className="flex flex-col items-center text-center w-full">
            <img
              src="/assets/quality.png"
              alt="Quality"
              className="w-32 h-32 md:w-40 md:h-40"
            />
            <p className="font-instrument-sans text-sm font-thin max-w-xs mt-5">
              Roasted in small batches to preserve aroma, freshness, and balance
              in every cup.
            </p>
          </div>

          <div className="flex flex-col items-center text-center w-full">
            <img
              src="/assets/handshake.png"
              alt="Trust"
              className="w-32 h-32 md:w-40 md:h-40"
            />
            <p className="font-instrument-sans text-sm font-thin max-w-xs mt-5">
              Committed to transparency, consistency, and lasting relationships
              with growers and customers alike.
            </p>
          </div>
        </div>

        {/* Divider + CTA */}
        <div className="mt-20 flex flex-col items-center max-w-3xl mx-auto">
          <hr className="w-full border-t border-brown mb-10" />

          <p className="text-2xl md:text-3xl text-center font-instrument-sans italic mb-8">
            Elevate your coffee experience.
          </p>

          <button className="bg-brown text-white rounded-lg px-6 py-2 font-instrument-sans font-semibold hover:bg-peach hover:text-brown transition">
            Subscribe
          </button>
        </div>
      </div>


           


            <Footer />
        </div>
    );
}
