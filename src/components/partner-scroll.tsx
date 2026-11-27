'use client';

import {
    animate,
    type AnimationPlaybackControls,
    motion,
    useAnimationFrame,
    useInView,
    useMotionValue,
} from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
    const ref = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const nudgeAnimRef = useRef<AnimationPlaybackControls | null>(null);
    const isInView = useInView(ref, { once: true, amount: 0.1 });

    const [isPaused, setIsPaused] = useState(false);
    const [isNudging, setIsNudging] = useState(false);
    const [singleSetWidth, setSingleSetWidth] = useState(0);
    const [itemStep, setItemStep] = useState(0);

    const x = useMotionValue(0);

    // Duplicate the list 3 times for seamless infinite wrapping
    const repeatedPartners = [0, 1, 2].flatMap((copy) =>
        partners.map((partner) => ({ partner, key: `${copy}-${partner}` })),
    );

    useEffect(() => {
        const updateMeasurements = () => {
            const track = trackRef.current;
            if (!track) return;

            const first = track.children[0] as HTMLElement | undefined;
            const second = track.children[1] as HTMLElement | undefined;
            const firstOfSecondSet = track.children[partners.length] as HTMLElement | undefined;

            if (first && second) {
                setItemStep(second.offsetLeft - first.offsetLeft);
            }
            if (first && firstOfSecondSet) {
                const setWidth = firstOfSecondSet.offsetLeft - first.offsetLeft;
                setSingleSetWidth(setWidth);
                x.set(-setWidth);
            }
        };

        updateMeasurements();
        window.addEventListener('resize', updateMeasurements);
        return () => window.removeEventListener('resize', updateMeasurements);
    }, [x]);

    // Wraps x seamlessly within [-2 * singleSetWidth, -singleSetWidth]
    const wrapPosition = (value: number) => {
        if (singleSetWidth === 0) return value;
        let next = value;
        while (next <= -singleSetWidth * 2) {
            next += singleSetWidth;
        }
        while (next > -singleSetWidth) {
            next -= singleSetWidth;
        }
        return next;
    };

    // Continuous 60fps horizontal auto-scroll
    useAnimationFrame((_, delta) => {
        if (isPaused || isNudging || singleSetWidth === 0) return;

        const speed = 50; // pixels per second
        const moveBy = (speed * delta) / 1000;
        x.set(wrapPosition(x.get() - moveBy));
    });

    // Smoothly glide forward or backward by 2 cards on button click
    const handleSlide = (direction: 'prev' | 'next') => {
        if (itemStep === 0 || singleSetWidth === 0) return;

        nudgeAnimRef.current?.stop();
        setIsNudging(true);

        const currentWrapped = wrapPosition(x.get());
        x.set(currentWrapped);

        const cardsToMove = 1;
        const offset = direction === 'next' ? -itemStep * cardsToMove : itemStep * cardsToMove;
        const target = currentWrapped + offset;

        nudgeAnimRef.current = animate(x, target, {
            duration: 0.45,
            ease: 'easeOut',
            onComplete: () => {
                x.set(wrapPosition(x.get()));
                setIsNudging(false);
            },
        });
    };

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative w-full overflow-hidden py-16"
        >
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

            <section
                aria-label="Partner carousel"
                className="relative z-10 py-4"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Left Carousel Button */}
                <button
                    type="button"
                    aria-label="Show previous partners"
                    onClick={() => handleSlide('prev')}
                    className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 rounded-full border border-white/20 bg-black/60 backdrop-blur-md p-3 text-white shadow-lg transition-all hover:scale-105 hover:border-blue-400/60 hover:bg-blue-500/20 active:scale-95"
                >
                    <ChevronLeft aria-hidden="true" size={22} />
                </button>

                {/* Right Carousel Button */}
                <button
                    type="button"
                    aria-label="Show next partners"
                    onClick={() => handleSlide('next')}
                    className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 rounded-full border border-white/20 bg-black/60 backdrop-blur-md p-3 text-white shadow-lg transition-all hover:scale-105 hover:border-blue-400/60 hover:bg-blue-500/20 active:scale-95"
                >
                    <ChevronRight aria-hidden="true" size={22} />
                </button>

                {/* Infinite Scrolling Track */}
                <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                    <motion.div
                        ref={trackRef}
                        style={{ x }}
                        className="flex w-max items-center gap-6 md:gap-10 will-change-transform"
                    >
                        {repeatedPartners.map(({ partner, key }) => {
                            const isEmerge = partner === '2.webp';

                            return (
                                <div
                                    key={key}
                                    className="group relative flex-shrink-0 cursor-pointer"
                                >
                                    <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center rounded-3xl bg-[#12131C]/90 border border-white/10 group-hover:border-blue-500/50 group-hover:bg-[#1A1C29] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300 p-6 overflow-hidden">
                                        {/* Hover glow highlight */}
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

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
                    </motion.div>
                </div>
            </section>

            {/* Bottom Border Line */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10" />
        </motion.section>
    );
}