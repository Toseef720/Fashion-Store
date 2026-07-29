import { Link } from "react-router-dom";

export default function ProductCard({ item }) {
  return (
    <Link to={`/product/${item.id}`}>

      <div className="bg-white shadow-sm hover:shadow-lg transition p-4">

        {/* Image */}
        <div className="w-full aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">

          <img
            src={item.images?.[0]}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover hover:scale-110 transition duration-300 bg-gray-200"
          />

        </div>

        {/* Info */}
        <h4 className="font-medium text-xl mb-1">
          {item.name}
        </h4>

        {/* Price */}
        <div className="flex items-center gap-2 text-base">

          <span className="font-semibold text-dark">
            ₹{item.prices?.M}
          </span>

          <span className="text-gray-400 line-through text-base">
            ₹{item.prices?.M + 500}
          </span>

          <span className="text-green-600 text-base font-medium">
            35% off
          </span>

        </div>

      </div>

    </Link>

    
  );
}
