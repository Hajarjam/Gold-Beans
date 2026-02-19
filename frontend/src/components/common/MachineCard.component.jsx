import { Link } from "react-router-dom";

export default function MachineCard({ machine }) {
  const imageUrl = machine.images?.[0] || "/assets/columbianbrewcoffee.jpg";
  
  return (
    <Link to={`/machine/${machine._id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="h-52 w-full overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={machine.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex flex-col ">
            <h2 className="font-instrument-sans font-bold text-base text-brown mb-1">
              {machine.name}
            </h2>
            <p className="font-instrument-sans font-semibold text-sm text-charcoal mb-1">
              ${machine.price.toFixed(2)}
            </p>
          </div>

          <div className="font-instrument-sans text-xs text-gray-500">
            <p>{machine.brand}</p>
            <p>
              {machine.type}
            </p>
            <p>Power: {machine.power}W</p>            
          </div>
        </div>
      </div>
    </Link>
  );
}
