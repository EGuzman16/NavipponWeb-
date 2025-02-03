import React from 'react';

const Hero = ({ imageUrl, imageAlt }) => {
    return (
        <div className="relative" style={{height:"60vh"}}>
            <img 
                src={imageUrl} 
                alt={imageAlt} 
                className="object-cover w-full h-full"
            />
        </div>
    );
}

export default Hero;