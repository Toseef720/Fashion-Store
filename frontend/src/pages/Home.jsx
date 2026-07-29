import { useState } from "react";

import Banner from "../components/Banner";
import Categories from "../components/Categories";
import BestCollection from "../components/BestCollection";
import Footer from "../components/Footer";


export default function Home({ cart, setCart }) {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <>
      <Banner />
      <Categories />
      <BestCollection />
      <Footer />
    </>
  );
}
