import { useEffect, useState } from "react";

// Auto import all images from banner folder
const bannerModules = import.meta.glob(
  "../assets/banner/*.{jpg,jpeg,png,webp}",
  { eager: true }
);

const banners = Object.values(bannerModules).map(
  (module) => module.default
);

export default function Banner() {

  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">

      {/* Slider */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((img, index) => (
          <div key={index} className="min-w-full">

            <img
              src={img}
              alt={`banner-${index}`}
              className="w-full h-[300px] sm:h-[450px] md:h-[550px] object-cover"
              loading="lazy"
            />

          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">

        {banners.map((_, index) => (

          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 rounded-full
              ${current === index
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/50 hover:bg-white"
              }
            `}
          />

        ))}

      </div>

    </div>
  );
}
