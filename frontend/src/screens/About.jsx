import React from 'react';

const About = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Header Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold">About EcoMart</h1>
          <p className="mt-4 text-xl">
            Your Trusted Online Grocery Store
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-green-600">Our Mission</h2>
          <p className="text-lg leading-relaxed text-center">
            At EcoMart, our mission is simple: to make grocery shopping convenient, affordable, and sustainable.
            We believe that everyone deserves access to high-quality food and household products without sacrificing
            their time or budget. That’s why we provide a seamless online shopping experience with fast delivery, 
            ensuring that you get fresh produce, pantry essentials, and more delivered right to your doorstep.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-green-600 mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-700">Quality</h3>
              <p className="mt-4 text-gray-600">
                We partner with trusted suppliers to ensure that every product we offer meets the highest standards of quality.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-700">Convenience</h3>
              <p className="mt-4 text-gray-600">
                Shop from the comfort of your home and enjoy fast, hassle-free delivery to your door.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-700">Sustainability</h3>
              <p className="mt-4 text-gray-600">
                We’re committed to eco-friendly practices, using sustainable packaging and minimizing our carbon footprint.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-700">Affordability</h3>
              <p className="mt-4 text-gray-600">
                Competitive pricing ensures that you can stock up on essentials without stretching your budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Our Story</h2>
          <p className="text-lg leading-relaxed text-center text-gray-700">
            EcoMart was founded in 2024 with the vision of revolutionizing the grocery shopping experience. Our goal
            is to bring the widest selection of groceries and essentials to your fingertips, combining convenience,
            sustainability, and affordability. With a dedicated team and a user-friendly platform, EcoMart aims to make
            grocery shopping easier, faster, and more eco-conscious than ever before.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Meet the Team</h2>
          <p className="text-lg leading-relaxed text-center text-gray-700 mb-8">
            Behind EcoMart is a passionate team of professionals who are dedicated to ensuring your experience is top-notch. 
            From our technology experts who create a smooth shopping platform to our logistics team who ensure your groceries 
            arrive fresh and on time, every member of our team plays a vital role in making EcoMart your trusted online store.
          </p>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Join Us on Our Journey</h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            Whether you're a busy professional, a parent, or someone looking for a more sustainable way to shop, EcoMart
            is here to serve you. Discover the future of grocery shopping with us!
          </p>
          <a href="/" className="inline-block bg-green-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-green-500 transition duration-300">
            Start Shopping
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
