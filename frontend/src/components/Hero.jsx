import React, { useEffect, useState } from 'react';

const sections = [
    { 
        title: "Welcome to Our Store", 
        subtitle: "Discover Amazing Products", 
        image: "url('https://i.pinimg.com/736x/bf/97/ab/bf97ab38490d4be1ef4cd42aee1aa986.jpg')"
    },
    { 
        title: "Exclusive Deals", 
        subtitle: "Shop Now and Save Big", 
        image: "url('https://i.pinimg.com/736x/de/7f/b2/de7fb2f12d2c2055f29835992c941cdb.jpg')"
    },
    { 
        title: "New Arrivals", 
        subtitle: "Explore Our Latest Collections", 
        image: "url('https://i.pinimg.com/736x/9b/48/d8/9b48d85737f78263df728ec7002eb110.jpg')"
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
        <div className="relative w-full h-[60vh] ">
            <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000" 
                style={{ backgroundImage: sections[currentIndex].image }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-gray-900/90">
                    <div className="container mx-auto px-4 h-full flex items-center">
                        <div className="max-w-2xl space-y-6">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-light transition-opacity duration-500 ease-in-out">
                                {sections[currentIndex].title}
                            </h1>
                            <h2 className="text-xl md:text-2xl lg:text-3xl text-gray-300 transition-opacity duration-500 ease-in-out">
                                {sections[currentIndex].subtitle}
                            </h2>
                            <button className="mt-8 px-8 py-4 bg-accent text-light hover:bg-gray-700 transition-colors duration-200 rounded-square text-lg font-semibold">
                                Shop Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
                {sections.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-square transition-colors duration-200 ${
                            currentIndex === index ? 'bg-light' : 'bg-gray-500'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Hero;
