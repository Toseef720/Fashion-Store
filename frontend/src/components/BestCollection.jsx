import { useState } from "react";

import products from "../data/products";
import ProductCard from "./ProductCard";

export default function BestCollection() {

  const ITEMS_PER_PAGE = 8;

  const [currentPage, setCurrentPage] = useState(1);

  // Total pages
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  // Get current page products
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <section className="w-full py-14 bg-light">

      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-lg md:text-3xl font-bold text-dark tracking-wide">
          <span className="text-red-600">BEST </span>
          FROM OUR COLLECTION
        </h2>
      </div>

      {/* Products Grid */}
      <div className="max-w-screen mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6">

        {currentProducts.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}

      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-2">

        {/* Prev */}
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          className={`px-3 py-1 border rounded
            ${currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "hover:bg-black hover:text-white"
            }`}
        >
          Prev
        </button>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, i) => {

          const page = i + 1;

          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded
                ${currentPage === page
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
                }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
          className={`px-3 py-1 border rounded
            ${currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "hover:bg-black hover:text-white"
            }`}
        >
          Next
        </button>

      </div>

    </section>
  );
}
