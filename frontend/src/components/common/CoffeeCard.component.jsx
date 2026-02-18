export default function CoffeeCard({ coffee }) {
  const imageUrl = coffee.images?.[0] || "/assets/coffee-beans.jpg";

  return (
    <div className="border w-fit bg-white rounded-lg flex flex-col gap-2 hover:shadow-lg transition">
      <img
  src={imageUrl}
  alt={coffee.name}
  className="w-[200px] h-40 lg:h-[200px] lg:w-[600px] object-cover rounded-t-lg "
/>
<div className="pt-4 pb-2 px-2">
<div className="flex flex-col ">
      <h2 className="font-semibold text-lg text-brown">{coffee.name}</h2>
      <p className="text-md font-semibold mt-1">${coffee.price.toFixed(2)}</p>
      </div>

<div>
      <p className="text-sm text-gray-500">{coffee.roastLevel}</p>
      <p className="text-sm text-gray-500">
      {coffee.tasteProfile?.join(", ")}
      </p>
       <p className="text-sm text-gray-500">Intensity: {coffee.intensity}</p>            
    </div>
    </div>
    </div>
  );
}
