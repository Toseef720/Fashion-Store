import summer from "../assets/catagory-images/summer.jpg";
import winter from "../assets/catagory-images/winter.jpg";
import top from "../assets/catagory-images/top.jpg";
import jeans from "../assets/catagory-images/jeans.jpg";
import formal from "../assets/catagory-images/formal.jpg";

export default function Categories() {
  const data = [
    { name: "SUMMER", img: summer },
    { name: "WINTER", img: winter },
    { name: "TOP", img: top },
    { name: "JEANS", img: jeans },
    { name: "FORMALS", img: formal },
  ];

  return (
    <section className="w-full bg-secondary py-4">

      <div className="max-w-7xl mx-auto flex items-center justify-around">

        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >

            {/* Circle Image */}
            <div className="w-14 h-14 
                            sm:w-16 sm:h-16 
                            md:w-20 md:h-20 
                            lg:w-24 lg:h-24
                            xl:w-28 xl:h-28
                            rounded-full overflow-hidden 
                            border-2 border-gray-300 
                            group-hover:border-primary transition">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />

            </div>

            {/* Text */}
            <p className="text-sm sm:text-base md:text-lg tracking-widest font-medium text-dark">
              {item.name}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}
