// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-orange-500 text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-3">SBO-EXPRESS-SHOP</h2>
          <p className="text-sm leading-6">
            Your trusted e-commerce store for quality products at the best prices.
            We deliver Around Matsapha with secure payment options.
          </p>
        </div>

        {/* Quick Links */}
 

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="#" >Contact Us:76784037/79767227</Link>
            </li>
            <li>
              <Link to="#" >Payment: Are made through mobile money</Link>
            </li>
          
            <li>
              <Link to="#" >Privacy:Your Information is safe and secure with us</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-orange-400 mt-6">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} SBO-EXPRESS-SHOP. All rights reserved.</p>
         
        </div>
      </div>
    </footer>
  );
}
