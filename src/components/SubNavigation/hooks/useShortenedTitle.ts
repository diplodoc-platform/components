import {useCallback, useEffect, useState} from 'react';

const iconWidth = 44; //px

const widthConfig = {
    // in px
    burgerButton: iconWidth,
    shareButton: iconWidth,
    miniTocIcon: iconWidth,
    maxPadding: 12,
    gap: 4,
};

const widthWithBurger =
    widthConfig.burgerButton +
    widthConfig.shareButton +
    widthConfig.miniTocIcon +
    2 * widthConfig.maxPadding +
    3 * widthConfig.gap;

const widthWithoutBurger =
    widthConfig.shareButton +
    widthConfig.miniTocIcon +
    2 * widthConfig.maxPadding +
    2 * widthConfig.gap;

const speacialChars = new Set([',', '.', '?', '!', '-', '_', ':', ';', '(', '[', '{']);

const getAnotherContentWidth = (hideBurger: boolean) =>
    hideBurger ? widthWithoutBurger : widthWithBurger;
// the values are calculated empirically
const getSymbolSizeQuotient = (hideBurger: boolean) => (hideBurger ? 1 / 7.0 : 1 / 6.5);

// ",...", "?...", "!...", "-...", "_...", "(...", ":..." - looks bad
const deleteSpecialCharsFromTitleEnd = (title: string): string => {
    const lastCharIndex = title.length - 1;
    const lastChar = title.charAt(lastCharIndex);

    const isSpecialChar = speacialChars.has(lastChar);

    if (!isSpecialChar) return title;

    const titleWithoutLastChar = title.slice(0, lastCharIndex);

    return deleteSpecialCharsFromTitleEnd(titleWithoutLastChar);
};

const useShortenedTitle = (title: string, hideBurger: boolean) => {
    const [displayedTitle, setDisplayedTitle] = useState<string>(title);
    const [availableTitleLength, setAvailableTitleLength] = useState<number>(Infinity);

    const updateAvailableLength = useCallback(() => {
        const ANOTHER_CONTENT_WIDTH = getAnotherContentWidth(hideBurger);
        const SYMBOL_SIZE_QUOTIENT = getSymbolSizeQuotient(hideBurger);

        const screenWidth = window.innerWidth;
        const avaiableWidth = screenWidth - ANOTHER_CONTENT_WIDTH;
        const avaiableLength = Math.floor(SYMBOL_SIZE_QUOTIENT * avaiableWidth) - 1;

        setAvailableTitleLength(avaiableLength);
    }, [hideBurger]);

    useEffect(() => {
        if (title.length <= availableTitleLength) {
            return setDisplayedTitle(title);
        }

        // delete unnecessary characters from title
        let shortenedTtitle = title.substring(0, availableTitleLength - 1).trim();
        shortenedTtitle = deleteSpecialCharsFromTitleEnd(shortenedTtitle);
        shortenedTtitle = shortenedTtitle.trim().concat('...');

        setDisplayedTitle(shortenedTtitle);
    }, [title, availableTitleLength]);

    useEffect(() => {
        updateAvailableLength();

        window.addEventListener('resize', updateAvailableLength);

        return () => {
            window.removeEventListener('resize', updateAvailableLength);
        };
    }, [updateAvailableLength]);

    return displayedTitle;
};

export default useShortenedTitle;
