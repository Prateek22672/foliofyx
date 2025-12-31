// src/components/ScrollTextEffect.jsx
import React from 'react';

const ScrollTextEffect = () => {
    // Defines the text layers with offsets and styles to mimic the overlapping effect.
    const textLayers = [
        { text: 'CREATE WE', color: 'text-pink-200', size: 'text-[120px] md:text-[200px] xl:text-[280px]', rotation: 'rotate-[-6deg]', offset: 'top-[-5vh] left-[-5vw] opacity-90', speed: 40 },
        { text: 'CREATE WE', color: 'text-stone-600', size: 'text-[120px] md:text-[200px] xl:text-[280px]', rotation: 'rotate-[-3deg]', offset: 'top-[10vh] left-[10vw] opacity-80', speed: 20 },
        { text: 'CREATE WE', color: 'text-pink-200', size: 'text-[120px] md:text-[200px] xl:text-[280px]', rotation: 'rotate-[-1deg]', offset: 'top-[25vh] left-[-2vw] opacity-90', speed: 0 },
        { text: 'CREATE WE', color: 'text-stone-600', size: 'text-[120px] md:text-[200px] xl:text-[280px]', rotation: 'rotate-[1deg]', offset: 'top-[40vh] left-[15vw] opacity-80', speed: -20 },
        { text: 'CREATE WE', color: 'text-pink-200', size: 'text-[120px] md:text-[200px] xl:text-[280px]', rotation: 'rotate-[-4deg]', offset: 'top-[55vh] left-[-10vw] opacity-90', speed: -40 },
    ];

    // Style function using the --scroll CSS variable for movement
    const textStyle = (speed) => ({
        transform: `translate3d(0, calc(var(--scroll, 0) * ${speed}px), 0)`,
        transition: 'transform 0s linear', // Essential for smooth scroll linkage
        lineHeight: '1.0',
    });

    return (
        <div className="absolute inset-0 bg-black overflow-hidden pointer-events-none">
            {textLayers.map((layer, index) => (
                <div 
                    key={index} 
                    className={`absolute font-extrabold whitespace-nowrap ${layer.color} ${layer.size} ${layer.rotation}`}
                    style={{ 
                        ...textStyle(layer.speed), 
                        top: layer.offset.match(/top-\[(\S+)\]/)[1],
                        left: layer.offset.match(/left-\[(\S+)\]/)[1],
                        opacity: layer.opacity.match(/opacity-(\d+)/)[1] / 100,
                    }}
                >
                    <span className={layer.offset.split(' ').slice(2).join(' ')}>
                       {layer.text}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default ScrollTextEffect;