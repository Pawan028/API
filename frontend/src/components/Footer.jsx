const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">EcoMart</h3>
            <p className="text-gray-400">
              EcoMart is your one-stop shop for fresh groceries, organic products, and daily essentials delivered right to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="/" className="text-gray-400 hover:text-white">Shop</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white">FAQs</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-white text-lg font-bold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="text-gray-400">Email: support@ecomart.com</li>
              <li className="text-gray-400">Phone: +123 456 7890</li>
              <li className="text-gray-400">Address: 123 Grocery Lane, Fresh City, CA</li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h4 className="text-white text-lg font-bold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Stay updated with the latest deals and products. Subscribe to our newsletter.
            </p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Social Media Links & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6">
            <a href="https://facebook.com" className="text-gray-400 hover:text-white">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://instagram.com" className="text-gray-400 hover:text-white">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://twitter.com" className="text-gray-400 hover:text-white">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://linkedin.com" className="text-gray-400 hover:text-white">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>

          <p className="text-gray-400 mt-4 md:mt-0">
            &copy; {currentYear} EcoMart. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
