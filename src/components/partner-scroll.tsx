'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const partners = [
    'a.webp',
    '1.webp',
    '2.webp',
    '3.webp',
    '4.webp',
    '5.webp',
    '6.webp',
    '7.webp',
    '8.webp',
    '9.webp',
    '10.webp',
    '11.webp',
    '12.webp',
    '13.webp',
    'as-group.webp',
    'balaji-gold.webp',
    'kiran-industries.webp',
    'mr-fit.webp',
    'renuka.webp',
    'stree-fashion.webp',
    'ugrp.png',
];

export function PartnerScroll() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });
    const [isPaused, setIsPaused] = useState(false);

    // Duplicate array twice for smooth infinite loop
    const duplicatedPartners = [...partners, ...partners];

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-full overflow-hidden py-16"
        >
            <style>{`
                @keyframes partnerMarquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-partner-marquee {
                    animation: partnerMarquee 50s linear infinite;
                }
            `}</style>

            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/aboutpage/bg-gradient.webp"
                    alt=""
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Top Border Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10 z-10" />

            {/* Section label */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-center text-xs md:text-sm font-bold uppercase tracking-[0.4em] pt-8 text-blue-400 mb-12 relative z-20"
            >
                Trusted by Forward-Thinking Brands
            </motion.p>

            <div className="relative z-10 py-4">
                {/* Single Scrolling Layer with in-place pause */}
                <div
                    className="animate-partner-marquee flex items-center gap-6 md:gap-10 w-max px-6"
                    style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {duplicatedPartners.map((partner, index) => {
                        const isEmerge = partner === '2.webp';

                        return (
                            <div
                                key={`${partner}-${index}`}
                                className="relative flex-shrink-0 group cursor-pointer"
                            >
                                <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center rounded-3xl bg-[#12131C]/90 border border-white/10 group-hover:border-blue-500/50 group-hover:bg-[#1A1C29] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300 p-6 overflow-hidden">
                                    {/* Hover glow highlight */}
                                    <div className="absolute inset-0 bg-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                    <img
                                        src={`/partners/${partner}`}
                                        alt={`Partner ${partner}`}
                                        className={`
                                            relative z-10 object-contain transition-all duration-300
                                            drop-shadow-[0_2px_10px_rgba(255,255,255,0.18)]
                                            group-hover:scale-110 group-hover:brightness-110
                                            ${isEmerge ? 'h-10 md:h-14 w-24 md:w-32' : 'max-h-24 md:max-h-28 max-w-[85%]'}
                                        `}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Border Line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10" />
        </motion.section>
    );
}
