import {useEffect, useRef, useState} from 'react';

export const useCarousel = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showPrevButton, setShowPrevButton] = useState<boolean>(false);
    const [showNextButton, setShowNextButton] = useState<boolean>(true);

    const updateButtonsVisibility = () => {
        if (containerRef.current) {
            const {scrollLeft, scrollWidth, clientWidth} = containerRef.current;
            setShowPrevButton(scrollLeft > 0);
            setShowNextButton(scrollLeft < scrollWidth - clientWidth);
        }
    };

    const nextSlide = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: containerRef.current.clientWidth / 3,
                behavior: 'smooth',
            });
            setTimeout(updateButtonsVisibility, 300);
        }
    };

    const prevSlide = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: -containerRef.current.clientWidth / 3,
                behavior: 'smooth',
            });
            setTimeout(updateButtonsVisibility, 300);
        }
    };

    useEffect(() => {
        updateButtonsVisibility();
        const handleResize = () => {
            updateButtonsVisibility();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        containerRef,
        showPrevButton,
        showNextButton,
        nextSlide,
        prevSlide,
        updateButtonsVisibility,
    };
};
