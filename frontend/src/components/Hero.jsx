import React, { useEffect, useState } from 'react';

const sections = [
    { 
        title: "Welcome to Our Store", 
        subtitle: "Discover Amazing Products", 
        image: "url('https://i.pinimg.com/564x/73/21/49/732149ed462b9fa091e9bdcff7b53d83.jpg')"
    },
    { 
        title: "Exclusive Deals", 
        subtitle: "Shop Now and Save Big", 
        image: "url('https://i.pinimg.com/564x/d5/bc/76/d5bc76c659c1b8ba0ccd64523de9b274.jpg')"
    },
    { 
        title: "New Arrivals", 
        subtitle: "Explore Our Latest Collections", 
        image: "url('https://i.pinimg.com/564x/7f/67/a1/7f67a123ef0b1195d42b76b17af6b2ac.jpg')"
    },
];

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % sections.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-40 lg:h-96 sm:h-60 md:h-screen rounded-3xl overflow-hidden"> {/* Added rounded-lg and overflow-hidden here */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000" 
                style={{ backgroundImage: sections[currentIndex].image }}
            >
                <div className="bg-black bg-opacity-50 h-full w-full flex items-center justify-center">
                    <div className="text-center p-4">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white transition-opacity duration-500 ease-in-out">
                            {sections[currentIndex].title}
                        </h1>
                        <h2 className="mt-2 text-lg md:text-xl lg:text-2xl text-gray-300 transition-opacity duration-500 ease-in-out">
                            {sections[currentIndex].subtitle}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
