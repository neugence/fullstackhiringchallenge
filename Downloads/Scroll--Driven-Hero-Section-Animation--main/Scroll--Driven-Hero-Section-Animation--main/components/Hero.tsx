'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const matchMedia = gsap.matchMedia();

    matchMedia.add("(min-width: 1px)", () => {
      if (!containerRef.current || !trackRef.current || !carRef.current || !trailRef.current) return;

      const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];

      // Calculate max travel distance for the car
      const roadWidth = trackRef.current.offsetWidth;
      const carWidth = carRef.current.offsetWidth;
      // We want the car to stop exactly at the right edge
      const endX = roadWidth - carWidth;

      // Define the main animation for the car and trail
      gsap.to(carRef.current, {
        scrollTrigger: {
          trigger: containerRef.current, // The 200vh container
          start: "top top", // Start when 200vh section hits top of viewport
          end: "bottom bottom", // End when 200vh section ends
          scrub: 1, // Smoothly link to scrollbar
        },
        x: endX, // Move car to the right
        ease: "none",
        onUpdate: function () {
          // Get the car's current x position strictly from GSAP
          const carX = gsap.getProperty(carRef.current, "x") as number;

          // The visual 'center/front' of the car deciding when to reveal text
          // Using carX + carWidth/1.5 gives a nice reveal point just behind the nose
          const revealPointX = carX + (carWidth / 1.5);

          // Update Trail Width
          // We set width to carX + offset so it looks attached to the back of the car
          gsap.set(trailRef.current, { width: carX + 20 });

          // Check text reveal logic
          letters.forEach((letter) => {
            // Get letter's absolute X position relative to the track/viewport
            // letter.offsetLeft also works well since they are positioned relatively in the flex container
            const letterLeft = letter.offsetLeft;

            if (revealPointX >= letterLeft) {
              // Fade in
              if (letter.style.opacity !== "1") {
                gsap.to(letter, { opacity: 1, duration: 0.2, overwrite: "auto" });
                // Also add a little jump to the letter as it reveals
                gsap.fromTo(letter,
                  { y: 10, scale: 0.9 },
                  { y: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)", overwrite: "auto" }
                );
              }
            } else {
              // Fade out
              if (letter.style.opacity !== "0.2") { // Keep it slightly visible as a background pattern
                gsap.to(letter, { opacity: 0.2, duration: 0.2, overwrite: "auto" });
                gsap.to(letter, { y: 0, scale: 1, duration: 0.2, overwrite: "auto" });
              }
            }
          });
        },
      });

      // Stats boxes scroll triggers
      const statBoxes = gsap.utils.toArray('.stat-box') as HTMLDivElement[];

      // Reveal each stat box progressively based on scrolling depth
      statBoxes.forEach((box, i) => {
        gsap.fromTo(box,
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            scrollTrigger: {
              trigger: containerRef.current,
              // Stagger the start times based on index (i)
              // This maps the reveal over the 200vh scroll space
              start: `top+=${400 + (i * 300)} top`,
              end: `top+=${600 + (i * 300)} top`,
              scrub: 1,
            }
          }
        );
      });

    });

    return () => matchMedia.revert();
  }, []);

  const headline = "W E L C O M E   I T Z F I Z Z".split("");

  return (
    // Make section 300vh to give plenty of scroll distance
    <section ref={containerRef} className="relative w-full h-[300vh] bg-zinc-950 font-sans text-white">

      {/* The Track / Pinned Container */}
      <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden bg-zinc-900 shadow-inner">

        {/* The Road Element */}
        <div ref={trackRef} className="relative w-full h-[250px] md:h-[350px] bg-zinc-950 flex items-center border-y border-zinc-800/50 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">

          {/* Background Grid for Sense of Speed/Scale */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

          {/* Background Text (Reveals as car passes) */}
          <div className="absolute inset-0 z-0 flex items-center justify-center w-full px-10 md:px-20">
            <h1 className="flex justify-between w-full text-5xl md:text-7xl lg:text-[7rem] font-heading font-black tracking-widest text-zinc-100 uppercase pointer-events-none">
              {headline.map((char, index) => (
                <span
                  key={index}
                  ref={el => { lettersRef.current[index] = el; }}
                  className="font-bold inline-block"
                  style={{ opacity: 0.2 }} // Initial state
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h1>
          </div>

          {/* The Trail */}
          <div
            ref={trailRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[4px] md:h-[6px] bg-cyan-400 shadow-[0_0_15px_#22d3ee] z-10 w-0"
          // The width will be controlled by GSAP
          ></div>

          {/* The Car (Top-down SVG) */}
          <div
            ref={carRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 will-change-transform w-32 md:w-56"
          >
            {/* Embedded high-quality SVG Sports Car Top View */}
            <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl">
              {/* Shadow */}
              <ellipse cx="200" cy="100" rx="190" ry="70" fill="black" fillOpacity="0.5" filter="blur(8px)" />
              {/* Tires */}
              <rect x="320" y="25" width="50" height="25" rx="8" fill="#111" />
              <rect x="320" y="150" width="50" height="25" rx="8" fill="#111" />
              <rect x="50" y="20" width="60" height="30" rx="8" fill="#111" />
              <rect x="50" y="150" width="60" height="30" rx="8" fill="#111" />

              {/* Suspension lines (Front) */}
              <path d="M 270 90 L 345 37" stroke="#333" strokeWidth="4" />
              <path d="M 270 110 L 345 162" stroke="#333" strokeWidth="4" />
              {/* Suspension lines (Rear) */}
              <path d="M 100 90 L 80 35" stroke="#333" strokeWidth="4" />
              <path d="M 100 110 L 80 165" stroke="#333" strokeWidth="4" />

              {/* Rear Wing */}
              <path d="M 20 50 L 50 50 L 50 150 L 20 150 Z" fill="url(#car-gradient)" />
              <path d="M 40 60 L 60 60 L 60 140 L 40 140 Z" fill="#111827" />

              {/* Main Body / Floor */}
              <path d="M 90 60 C 150 50, 200 65, 270 70 C 290 70, 360 45, 380 45 L 390 55 C 385 65, 370 70, 370 85 L 370 115 C 370 130, 385 135, 390 145 L 380 155 C 360 155, 290 130, 270 130 C 200 135, 150 150, 90 140 Z" fill="url(#car-gradient)" />

              {/* Front Wing details */}
              <path d="M 370 45 L 385 45 L 385 155 L 370 155 Z" fill="#111827" fillOpacity="0.7" />

              {/* Nose detail */}
              <path d="M 250 85 L 380 90 L 380 110 L 250 115 Z" fill="url(#car-gradient)" filter="brightness(1.2)" />

              {/* Sidepods */}
              <path d="M 120 55 C 150 55, 180 60, 240 70 L 240 130 C 180 140, 150 145, 120 145 Z" fill="url(#car-gradient)" filter="brightness(0.9)" />
              <path d="M 230 70 L 240 70 L 240 130 L 230 130 Z" fill="#111" /> {/* Sidepod intakes */}

              {/* Engine Cover & driver area */}
              <path d="M 60 80 L 160 80 L 180 85 L 180 115 L 160 120 L 60 120 Z" fill="url(#car-gradient)" filter="brightness(1.1)" />

              {/* Cockpit / Driver */}
              <circle cx="180" cy="100" r="12" fill="#e2e8f0" /> {/* Driver helmet */}
              <path d="M 195 85 C 220 85, 220 115, 195 115 Z" fill="#111" /> {/* Wind deflector */}
              <defs>
                <linearGradient id="car-gradient" x1="20" y1="100" x2="390" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#d946ef" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>

        </div>

        {/* Floating Stat Boxes */}
        {/* Positioned similarly to the reference, revealing at different scroll offsets */}
        <div className="absolute inset-0 pointer-events-none max-w-7xl mx-auto w-full h-full">

          <div className="stat-box absolute top-[15%] right-[20%] md:right-[30%] bg-[#ec4899] text-white p-6 rounded-xl shadow-[0_0_30px_#ec4899] backdrop-blur-md z-30">
            <div className="text-4xl md:text-5xl font-bold font-heading mb-1">58%</div>
            <div className="text-sm font-medium tracking-wide">Increase in User Interaction</div>
          </div>

          <div className="stat-box absolute bottom-[20%] right-[35%] md:right-[40%] bg-[#8b5cf6] text-white p-6 rounded-xl shadow-[0_0_30px_#8b5cf6] backdrop-blur-md z-30">
            <div className="text-4xl md:text-5xl font-bold font-heading mb-1">23%</div>
            <div className="text-sm font-medium tracking-wide">Decrease in Bounce Rate</div>
          </div>

          <div className="stat-box absolute top-[25%] right-[5%] md:right-[10%] bg-zinc-900 shadow-[0_0_20px_#06b6d4] text-white p-6 rounded-xl border border-cyan-500/30 backdrop-blur-md z-30">
            <div className="text-4xl md:text-5xl font-bold font-heading mb-1 text-cyan-400">120K</div>
            <div className="text-sm font-medium tracking-wide text-zinc-300">New Active Accounts</div>
          </div>

          <div className="stat-box absolute bottom-[15%] right-[10%] md:right-[15%] bg-[#0ea5e9] text-white p-6 rounded-xl shadow-[0_0_30px_#0ea5e9] backdrop-blur-md z-30">
            <div className="text-4xl md:text-5xl font-bold font-heading mb-1">40%</div>
            <div className="text-sm font-medium tracking-wide">Boost in Revenue</div>
          </div>

        </div>

      </div>
    </section>
  );
}
