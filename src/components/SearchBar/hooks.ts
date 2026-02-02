import type {SyntheticEvent} from 'react';

import {useCallback, useEffect, useRef, useState} from 'react';
import throttle from 'lodash/throttle';

import {CLASSNAME, CLASSNAME_SELECTED, HIGHLIGHT_OPTIONS} from './constants';
import {getHighlightedItemIndexInView, highlight, scrollToItem} from './utils';

type UseHighlightedSearchWords = {
    html: string;
    searchWords: string[];
    showSearchBar: boolean;
    onNotFoundWords?: () => void;
    onContentMutation?: () => void;
    onContentLoaded?: () => void;
};

export function useHighlightedSearchWords({
    html,
    searchWords,
    showSearchBar,
    onContentMutation: _onContentMutation,
    onContentLoaded: _onContentLoaded,
    onNotFoundWords,
}: UseHighlightedSearchWords) {
    const highlightedHtml = useHighlightedHTMLString(html, searchWords, showSearchBar);

    const {wasChangedDOM, onContentMutation, onContentLoaded} = useCallbackDOMChange({
        onContentMutation: _onContentMutation,
        onContentLoaded: _onContentLoaded,
    });

    const highlightedDOMElements = useHighlightedDOMElements(
        highlightedHtml,
        wasChangedDOM,
        showSearchBar,
    );

    const searchBarIsVisible = useSearchBarIsVisible({
        showSearchBar,
        searchWords,
        highlightedHtml,
        html,
    });

    useNoSearchWordsFoundEffect({highlightedDOMElements, showSearchBar, onNotFoundWords});

    return {
        highlightedHtml,
        highlightedDOMElements,
        searchBarIsVisible,
        wasChangedDOM,
        onContentMutation,
        onContentLoaded,
    };
}

function useHighlightedDOMElements(
    highlightedHtml: string,
    wasChangedDOM: boolean,
    showSearchBar: boolean,
) {
    const cachedHighlightedDOMElements = useRef<Element[]>([] as Element[]);

    useEffect(() => {
        cachedHighlightedDOMElements.current = [];
    }, [highlightedHtml]);

    useEffect(() => {
        if (wasChangedDOM) {
            cachedHighlightedDOMElements.current = [];
        }
    }, [wasChangedDOM]);

    if (cachedHighlightedDOMElements.current.length) {
        return cachedHighlightedDOMElements.current;
    }

    if (!showSearchBar || typeof document === 'undefined') {
        return [];
    }

    const elements = Array.from(document.querySelectorAll(`.${CLASSNAME}`));
    cachedHighlightedDOMElements.current = elements;

    return cachedHighlightedDOMElements.current;
}

/* Try wrapping the search words in an html string by span elements with a highlight class */
function useHighlightedHTMLString(html: string, searchWords: string[], showSearchBar: boolean) {
    const [highlightedHtml, setHighlightedHtml] = useState(html);

    useEffect(() => {
        if (!searchWords.length || !showSearchBar) {
            setHighlightedHtml(html);
            return;
        }

        const highlightedResult = highlight({
            html,
            keywords: searchWords,
            options: HIGHLIGHT_OPTIONS,
        });

        if (highlightedResult.includes(CLASSNAME)) {
            setHighlightedHtml(highlightedResult);
        } else {
            setHighlightedHtml(html);
        }
    }, [html, searchWords, showSearchBar]);

    return highlightedHtml;
}

type UseSearchBarIsVisible = {
    showSearchBar: boolean;
    searchWords: string[];
    html: string;
    highlightedHtml: string;
};

function useSearchBarIsVisible({
    showSearchBar,
    searchWords,
    highlightedHtml,
    html,
}: UseSearchBarIsVisible) {
    const [searchBarIsVisible, setSearchBarIsVisible] = useState(showSearchBar);

    useEffect(() => {
        setSearchBarIsVisible(
            showSearchBar && Boolean(searchWords && searchWords.length) && highlightedHtml !== html,
        );
    }, [showSearchBar, searchWords, highlightedHtml, html]);

    return searchBarIsVisible;
}

type UseCallbackDOMChange = {
    onContentMutation?: () => void;
    onContentLoaded?: () => void;
};

function useCallbackDOMChange({
    onContentMutation: _onContentMutation,
    onContentLoaded: _onContentLoaded,
}: UseCallbackDOMChange) {
    const [wasChangedDOM, setWasChangedDOM] = useState(false);

    useEffect(() => {
        if (wasChangedDOM) {
            setWasChangedDOM(false);
        }
    }, [wasChangedDOM]);

    /* Callback for dangerouslySetInnerHTML when inserting content */
    const onContentMutation = useCallback(() => {
        if (_onContentMutation) {
            _onContentMutation();
        }

        setWasChangedDOM(true);
    }, [_onContentMutation]);

    /* Callback for loading resources after inserting content */
    const onContentLoaded = useCallback(() => {
        if (_onContentLoaded) {
            _onContentLoaded();
        }

        setWasChangedDOM(true);
    }, [_onContentLoaded]);

    return {
        wasChangedDOM,
        onContentMutation,
        onContentLoaded,
    };
}

type UseNoSearchWordsFoundEffect = {
    showSearchBar: boolean;
    highlightedDOMElements: Element[];
    onNotFoundWords?: () => void;
};

export function useNoSearchWordsFoundEffect({
    showSearchBar,
    highlightedDOMElements,
    onNotFoundWords,
}: UseNoSearchWordsFoundEffect) {
    useEffect(() => {
        if (!onNotFoundWords) {
            return;
        }

        if (showSearchBar && !highlightedDOMElements.length) {
            onNotFoundWords();
        }
    }, [highlightedDOMElements, showSearchBar, onNotFoundWords]);
}

type UseSearchBarNavigation = {
    highlightedDOMElements: Element[];
    stopSyncOnScroll: () => void;
    headerHeight: number;
    hash?: string;
};

export function useSearchBarNavigation({
    highlightedDOMElements,
    stopSyncOnScroll,
    headerHeight,
    hash,
}: UseSearchBarNavigation) {
    const [searchCurrentIndex, setSearchCurrentIndex] = useState(1);
    const [searchCountResults, setSearchCountResults] = useState(1);

    useEffect(() => {
        const startIndex =
            getHighlightedItemIndexInView({highlightedDOMElements, headerHeight, hash}) || 1;

        setSearchCurrentIndex(startIndex);
        setSearchCountResults(highlightedDOMElements.length || 1);
    }, [highlightedDOMElements, headerHeight, hash]);

    const onClickNextSearch = useCallback(
        (e: SyntheticEvent) => {
            e.stopPropagation();
            e.preventDefault();

            stopSyncOnScroll();

            if (!highlightedDOMElements.length) {
                return;
            }

            let newIndex = searchCurrentIndex + 1;
            if (newIndex > highlightedDOMElements.length) {
                newIndex = 1;
            }

            setSearchCurrentIndex(newIndex);
        },
        [highlightedDOMElements, searchCurrentIndex, setSearchCurrentIndex, stopSyncOnScroll],
    );

    const onClickPrevSearch = useCallback(
        (e: SyntheticEvent) => {
            e.stopPropagation();
            e.preventDefault();

            stopSyncOnScroll();

            if (!highlightedDOMElements.length) {
                return;
            }

            let newIndex = searchCurrentIndex - 1;
            if (newIndex < 1) {
                newIndex = highlightedDOMElements.length;
            }

            setSearchCurrentIndex(newIndex);
        },
        [highlightedDOMElements, searchCurrentIndex, setSearchCurrentIndex, stopSyncOnScroll],
    );

    return {
        searchCurrentIndex,
        setSearchCurrentIndex,
        searchCountResults,
        onClickPrevSearch,
        onClickNextSearch,
    };
}

type UseHighlightCurrentWordEffect = {
    highlightedDOMElements: Element[];
    searchCurrentIndex: number;
    wasChangedDOM: boolean;
    syncOnScroll: boolean;
    hash?: string;
};

export function useCurrentWordSelectionEffect({
    searchCurrentIndex,
    highlightedDOMElements,
    wasChangedDOM,
    syncOnScroll,
    hash,
}: UseHighlightCurrentWordEffect) {
    useEffect(() => {
        try {
            if (!highlightedDOMElements || !highlightedDOMElements.length) {
                return;
            }

            for (let index = 0; index < highlightedDOMElements.length; index++) {
                const item = highlightedDOMElements[index];

                item.classList.remove(CLASSNAME_SELECTED);
            }

            const item = highlightedDOMElements[searchCurrentIndex - 1];
            item.classList.add(CLASSNAME_SELECTED);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
        }
    }, [highlightedDOMElements, searchCurrentIndex, wasChangedDOM]);

    useEffect(() => {
        if (syncOnScroll) {
            return;
        }

        scrollToItem(highlightedDOMElements[searchCurrentIndex - 1]);
    }, [wasChangedDOM, searchCurrentIndex, highlightedDOMElements, syncOnScroll, hash]);
}

type UseCurrentWordSelectionSyncScrollEffect = {
    highlightedDOMElements: Element[];
    searchWords: string[];
    syncOnScroll: boolean;
    searchBarIsVisible: boolean;
    setSearchCurrentIndex: (index: number) => void;
    headerHeight: number;
    setSyncOnScroll: (flag: boolean) => void;
};

export function useCurrentWordSelectionSyncScrollEffect({
    highlightedDOMElements,
    searchWords,
    syncOnScroll,
    searchBarIsVisible,
    setSearchCurrentIndex,
    headerHeight,
    setSyncOnScroll,
}: UseCurrentWordSelectionSyncScrollEffect) {
    const scrollEndTimer = useRef<ReturnType<typeof setTimeout>>();

    const handleScroll = useCallback(() => {
        if (scrollEndTimer.current) {
            clearTimeout(scrollEndTimer.current);
        }

        scrollEndTimer.current = setTimeout(() => {
            setSyncOnScroll(true);
        }, 50);

        if (!syncOnScroll || !searchBarIsVisible) {
            return;
        }

        const highlightedItemIndexInView = getHighlightedItemIndexInView({
            highlightedDOMElements,
            headerHeight,
        });

        if (isNaN(highlightedItemIndexInView as number)) {
            return;
        }

        setSearchCurrentIndex(highlightedItemIndexInView as number);
    }, [
        setSyncOnScroll,
        searchBarIsVisible,
        syncOnScroll,
        setSearchCurrentIndex,
        highlightedDOMElements,
        headerHeight,
    ]);

    const handleScrollThrottled = throttle(handleScroll, 50);

    useEffect(() => {
        if (searchBarIsVisible) {
            window.addEventListener('scroll', handleScrollThrottled);
        }
        return () => {
            window.removeEventListener('scroll', handleScrollThrottled);
        };
    }, [searchBarIsVisible, searchWords, handleScrollThrottled]);
}
