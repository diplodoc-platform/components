import React, {useState, useCallback, useEffect} from 'react';

import {DocPageData, Router} from '../../models';

import {
    useHighlightedSearchWords,
    useSearchBarNavigation,
    useCurrentWordSelectionEffect,
    useCurrentWordSelectionSyncScrollEffect,
} from './hooks';

export interface SearchWordsHighlighterProps extends DocPageData {
    useSearchBar?: boolean;
    searchWords?: string[];
    showSearchBar?: boolean;
    onCloseSearchBar?: () => void;
    onNotFoundWords?: () => void;
    searchQuery?: string;
    onContentMutation?: () => void;
    onContentLoaded?: () => void;
    headerHeight?: number;
    router: Router;
}

function withHighlightedSearchWords<T extends SearchWordsHighlighterProps>(
    Component: React.ComponentType<T>,
) {
    const SearchWordsHighlighter: React.FC<SearchWordsHighlighterProps & T> = (
        props,
    ): JSX.Element | null => {
        const {
            html,
            searchWords = [],
            showSearchBar = false,
            onCloseSearchBar,
            onNotFoundWords = () => {},
            onContentMutation: _onContentMutation,
            onContentLoaded: _onContentLoaded,
            headerHeight = 0,
            router: {hash},
        } = props;

        const [syncOnScroll, setSyncOnScroll] = useState<boolean>(true);
        const stopSyncOnScroll = useCallback(() => setSyncOnScroll(false), []);

        useEffect(() => {
            setSyncOnScroll(false);
        }, [html, searchWords]);

        const {
            highlightedHtml,
            highlightedDOMElements,
            searchBarIsVisible,
            wasChangedDOM,
            onContentMutation,
            onContentLoaded,
        } = useHighlightedSearchWords({
            html,
            searchWords,
            showSearchBar,
            onContentMutation: _onContentMutation,
            onContentLoaded: _onContentLoaded,
            onNotFoundWords,
        });

        const {
            searchCurrentIndex,
            setSearchCurrentIndex,
            searchCountResults,
            onClickPrevSearch,
            onClickNextSearch,
        } = useSearchBarNavigation({highlightedDOMElements, stopSyncOnScroll, headerHeight, hash});

        useCurrentWordSelectionEffect({
            searchCurrentIndex,
            highlightedDOMElements,
            wasChangedDOM,
            syncOnScroll,
            hash,
        });

        /* Sync scroll with a current item in viewport */
        useCurrentWordSelectionSyncScrollEffect({
            highlightedDOMElements,
            searchWords,
            syncOnScroll,
            searchBarIsVisible,
            setSearchCurrentIndex,
            headerHeight,
            setSyncOnScroll,
        });

        if (searchBarIsVisible) {
            return (
                <Component
                    {...props}
                    html={highlightedHtml}
                    onContentMutation={onContentMutation}
                    onContentLoaded={onContentLoaded}
                    searchCurrentIndex={searchCurrentIndex}
                    searchCountResults={searchCountResults}
                    onCloseSearchBar={onCloseSearchBar}
                    onClickPrevSearch={onClickPrevSearch}
                    onClickNextSearch={onClickNextSearch}
                />
            );
        }

        return <Component {...props} showSearchBar={false} />;
    };

    const SearchWordsHighlighterWrapper: React.FC<SearchWordsHighlighterProps & T> = (
        props,
    ): JSX.Element | null => {
        const {useSearchBar = false} = props;

        if (useSearchBar) {
            return <SearchWordsHighlighter {...props} />;
        }

        return <Component {...props} />;
    };

    return SearchWordsHighlighterWrapper;
}

export default withHighlightedSearchWords;
