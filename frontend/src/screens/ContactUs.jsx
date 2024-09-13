import React from 'react';
import { FaEnvelope, FaPhone} from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-6 md:p-12">
      <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-700">We'd love to hear from you! Reach out using the contact details provided below or fill out the form.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get In Touch</h2>
          <div className="flex items-start space-x-4 mb-4">
            <FaEnvelope className="text-2xl text-gray-600" />
            <div>
              <p className="text-gray-700"><strong>Email:</strong> support@ecomart.com</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 mb-4">
            <FaPhone className="text-2xl text-gray-600" />
            <div>
              <p className="text-gray-700"><strong>Phone:</strong> +123 456 7890</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <IoLocationOutline className="text-2xl text-gray-600" />
            <div>
              <p className="text-gray-700"><strong>Address:</strong> 123 Ecomart Street, City, Country</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <iframe
            src="https://www.google.com/maps/embed?pb=..."
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ecomart Location"
            className="w-full h-60 rounded-lg shadow-md"
          ></iframe>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">EcoMart Shops in Your Area</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>EcoMart Connaught Place:</strong> 22 Connaught Place, New Delhi, Delhi</li>
          <li><strong>EcoMart Saket:</strong> 34 Saket District Centre, New Delhi, Delhi</li>
          <li><strong>EcoMart Karol Bagh:</strong> 56 Ajmal Khan Road, Karol Bagh, New Delhi, Delhi</li>
          <li><strong>EcoMart Vasant Kunj:</strong> 78 Vasant Kunj, New Delhi, Delhi</li>
          <li><strong>EcoMart Lajpat Nagar:</strong> 90 Lajpat Nagar, New Delhi, Delhi</li>
        </ul>
      </section>

      <section className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send Us a Message</h2>
        <form
          className="space-y-4"
          method="post"
          action="#"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                placeholder="Your Email"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-700">Message</label>
            <textarea
              id="message"
              name="message"
              required
              rows="4"
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              placeholder="Your Message"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
};

export default ContactUs;
