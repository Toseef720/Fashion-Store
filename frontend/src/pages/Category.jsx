import { useParams } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Category() {
  const { type } = useParams();

  const filteredProducts = products.filter(
    (product) => product.category === type
  );

  return (
    <div className="max-w-8xl mx-auto px-4 py-10 bg-secondary">

      <h2 className="text-2xl font-semibold mb-8 capitalize">
        {type} Collection
      </h2>

      {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredProducts.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}

    </div>
  );
}