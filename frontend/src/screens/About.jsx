import React from 'react';
import '../assets/styles/About.css'; // Assuming you have a CSS file for styling

const About = () => {
    return (
        <div className="about-container">
            <section className="about-header">
                <h1>About Ecomart</h1>
                <p>Your Go-To Online Grocery Store</p>
            </section>

            <section className="about-mission">
                <h2>Our Mission</h2>
                <p>
                    At Ecomart, our mission is to make grocery shopping convenient, affordable, and sustainable. We
                    believe that everyone should have access to high-quality food and household products without
                    compromising on time or budget. We aim to provide a seamless shopping experience by delivering
                    fresh produce, pantry essentials, and more right to your doorstep.
                </p>
            </section>

            <section className="about-values">
                <h2>Our Values</h2>
                <ul>
                    <li><strong>Quality:</strong> We source only the best products from trusted suppliers.</li>
                    <li><strong>Convenience:</strong> Shop from the comfort of your home and get your groceries delivered fast.</li>
                    <li><strong>Sustainability:</strong> We are committed to eco-friendly practices, from packaging to delivery.</li>
                    <li><strong>Affordability:</strong> We offer competitive prices to make sure your essentials fit your budget.</li>
                </ul>
            </section>

            <section className="about-story">
                <h2>Our Story</h2>
                <p>
                    Ecomart was founded in 2024 with the vision of revolutionizing the grocery shopping experience. 
                    We saw a need for a reliable, user-friendly online platform where customers could find a wide range of 
                    products, from fresh fruits and vegetables to household essentials. Our dedicated team works tirelessly 
                    to ensure that each order is carefully packed and delivered with care. We are constantly innovating to 
                    bring you the best in online grocery shopping.
                </p>
            </section>

            <section className="about-team">
                <h2>Meet the Team</h2>
                <p>
                    Behind Ecomart is a passionate team of professionals with a shared commitment to customer satisfaction.
                    From our tech experts who create a smooth shopping experience to our logistics team who ensure timely
                    delivery, everyone plays a crucial role in making Ecomart the best online grocery store for you.
                </p>
            </section>

            <section className="about-cta">
                <h2>Join Us on Our Journey</h2>
                <p>
                    Whether you're a busy professional, a parent, or someone looking for a more sustainable way to shop, 
                    Ecomart is here to serve you. Experience the future of grocery shopping with us.
                </p>
                <a href="/" className="cta-button">Start Shopping</a>
            </section>
        </div>
    );
};

export default About;
