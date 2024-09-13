import React, { useState } from 'react';

const FAQ = () => {
  const [open, setOpen] = useState(null);

  const toggleFAQ = (index) => {
    setOpen(open === index ? null : index);
  };

  const faqList = [
    {
      question: "What is EcoMart?",
      answer: "EcoMart is an online grocery store that delivers fresh groceries, organic products, and household essentials straight to your door."
    },
    {
      question: "How does delivery work?",
      answer: "We offer fast and reliable delivery services. During checkout, you can select your preferred delivery time slot, and we'll ensure your groceries are delivered within that time."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept a variety of payment methods including credit cards, debit cards, PayPal, and other online payment services."
    },
    {
      question: "Do you offer discounts or promotions?",
      answer: "Yes, we frequently offer discounts and promotions! You can subscribe to our newsletter or follow us on social media to stay updated on the latest deals."
    },
    {
      question: "Can I return items?",
      answer: "Yes, if you are unsatisfied with any item, you can return it within 7 days of delivery. Simply contact our customer support team to process the return."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-12">
          Frequently Asked Questions
        </h1>

        <div className="space-y-8">
          {faqList.map((faq, index) => (
            <div
              key={index}
              className={`border-b border-gray-200 pb-4 transition-all duration-300 ${
                open === index ? "bg-gray-100 rounded-lg shadow-md p-6" : "pb-4"
              }`}
            >
              <h2
                className="text-xl font-semibold text-gray-800 cursor-pointer flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span
                  className={`transition-transform transform ${
                    open === index ? "rotate-180" : "rotate-0"
                  }`}
                >
                  &#9660;
                </span>
              </h2>
              {open === index && (
                <p className="mt-4 text-gray-600">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
