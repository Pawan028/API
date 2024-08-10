import React from 'react';
import '../assets/styles/ContactUs.css';

const ContactUs = () => {
  return (
    <div className="contact-container">
      <section className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Reach out using the contact details provided below.</p>
      </section>

      <section className="contact-details">
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p><strong>Email:</strong> support@ecomart.com</p>
          <p><strong>Phone:</strong> +123 456 7890</p>
          <p><strong>Address:</strong> 123 Ecomart Street, City, Country</p>
        </div>
        <div className="contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=..."
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ecomart Location"
          ></iframe>
        </div>
      </section>

      <section className="contact-shops">
        <h2>EcoMart Shops in Your Area</h2>
        <ul className="shops-list">
          <li><strong>EcoMart Connaught Place:</strong> 22 Connaught Place, New Delhi, Delhi</li>
          <li><strong>EcoMart Saket:</strong> 34 Saket District Centre, New Delhi, Delhi</li>
          <li><strong>EcoMart Karol Bagh:</strong> 56 Ajmal Khan Road, Karol Bagh, New Delhi, Delhi</li>
          <li><strong>EcoMart Vasant Kunj:</strong> 78 Vasant Kunj, New Delhi, Delhi</li>
          <li><strong>EcoMart Lajpat Nagar:</strong> 90 Lajpat Nagar, New Delhi, Delhi</li>
        </ul>
      </section>
    </div>
  );
};

export default ContactUs;
