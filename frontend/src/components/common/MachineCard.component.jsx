import { Link } from "react-router-dom";

export default function MachineCard({ machine }) {
  const imageUrl = machine.images?.[0] || "/assets/columbianbrewcoffee.jpg";
  
  return (
    <Link to={`/machine/${machine._id}`}>
      <div className="border w-fit bg-white rounded-lg flex flex-col gap-2 hover:shadow-lg transition">
        <img
          src={imageUrl}
          alt={machine.name}
          className="w-[200px] h-40 lg:h-[200px] lg:w-[600px] object-cover rounded-t-lg "
        />
        <div className="pt-4 pb-2 px-2">
          <div className="flex flex-col ">
            <h2 className="font-semibold text-lg text-brown">{machine.name}</h2>
            <p className="text-md font-semibold mt-1">${machine.price.toFixed(2)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">{machine.brand}</p>
            <p className="text-sm text-gray-500">
              {machine.type}
            </p>
            <p className="text-sm text-gray-500">Power: {machine.power}W</p>            
          </div>
        </div>
      </div>
    </Link>
  );
}
