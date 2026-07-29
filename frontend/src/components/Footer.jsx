import facebook from "../assets/icons/facebook.svg"
import instagram from "../assets/icons/instagram.svg"
import twitter from "../assets/icons/twitter.svg"

export default function Footer() {
  return (
    <footer className="w-full bg-light border-t border-gray-300 ">

      <div className="w-full px-8 md:px-20 py-12 grid grid-cols-2 md:grid-cols-5 gap-8 text-2xl text-gray-700">

        {/* Brand */}
        <div>
          <h3 className="font-semibold text-primary mb-3">
            MENDHAR EXCLUSIVES
          </h3>

          <p className="text-base leading-relaxed text-gray-600">
            Premium fashion store bringing you the latest trends with quality
            and comfort.
          </p>
        </div>

        {/* Need Help */}
        <div>
          <h4 className="font-semibold mb-3">NEED HELP</h4>

          <ul className="space-y-2 text-base">
            <li className="cursor-pointer hover:text-primary">
              Track Order
            </li>
            <li className="cursor-pointer hover:text-primary">
              Contact Us
            </li>
            <li className="cursor-pointer hover:text-primary">
              FAQ
            </li>
            <li className="cursor-pointer hover:text-primary">
              Return Policy
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold mb-3">COMPANY</h4>

          <ul className="space-y-2 text-base">
            <li className="cursor-pointer hover:text-primary">
              About Us
            </li>
            <li className="cursor-pointer hover:text-primary">
              Careers
            </li>
            <li className="cursor-pointer hover:text-primary">
              Press
            </li>
            <li className="cursor-pointer hover:text-primary">
              Blogs
            </li>
          </ul>
        </div>

        {/* More Info */}
        <div>
          <h4 className="font-semibold mb-3">MORE INFO</h4>

          <ul className="space-y-2 text-base">
            <li className="cursor-pointer hover:text-primary">
              Privacy Policy
            </li>
            <li className="cursor-pointer hover:text-primary">
              Terms & Conditions
            </li>
            <li className="cursor-pointer hover:text-primary">
              Shipping Policy
            </li>
            <li className="cursor-pointer hover:text-primary">
              Refund Policy
            </li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-semibold mb-3">FOLLOW US</h4>

          <div className="flex gap-4">

            {/* Replace with your SVGs */}
            <div className="w-8 h-8 md:w-12 flex items-center justify-center cursor-pointer hover:border-primary">
              <img src={facebook} alt="error" className="w-8 h-8"/>
            </div>

            <div className="w-8 h-8 md:w-12 flex items-center justify-center cursor-pointer hover:border-primary">
              <img src={instagram} alt="error" className="w-8 h-8"/>
            </div>

            <div className="w-8 h-8 md:w-12 flex items-center justify-center cursor-pointer hover:border-primary">
              <img src={twitter} alt="error" className="w-8 h-8"/>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 py-4 text-center text-base text-gray-600">

        © {new Date().getFullYear()} Mendhar Exclusives. All Rights Reserved.

      </div>

    </footer>
  );
}
