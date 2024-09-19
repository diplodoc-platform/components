import type {KeyboardEvent} from 'react';
import type {ISearchProvider} from '../../models';
import type {SearchSuggestItem, SearchSuggestLinkableItem, SearchSuggestPageItem} from './types';

import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import {List, Popup} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import uniqueId from 'lodash/uniqueId';

import {useTranslation, useVirtualElementRef} from '../../hooks';

import {SearchInput} from './SearchInput';
import {Suggest} from './Suggest';
import {SuggestItem} from './SuggestItem';
import {useFocus} from './useFocus';
import './index.scss';

const b = block('dc-search-suggest');

export type {SearchSuggestItem, SearchSuggestLinkableItem, SearchSuggestPageItem};

export interface SearchSuggestProps {
    provider: ISearchProvider;
    placeholder?: string;
    classNameContainer?: string;
    className?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    endContent?: React.ReactNode;
}

export interface SearchSuggestApi {
    open(): void;

    close(): void;
}

export const SearchSuggest = forwardRef<SearchSuggestApi, SearchSuggestProps>((props, api) => {
    const {t} = useTranslation('search');

    const {
        provider,
        className,
        placeholder = t('search_placeholder'),
        endContent,
        classNameContainer,
    } = props;
    const href = useRef<HTMLAnchorElement>(null);
    const input = useRef<HTMLElement>(null);
    const suggest = useRef<List<SearchSuggestItem>>(null);
    const id = useMemo(uniqueId, []);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState<undefined | number>(undefined);
    const [focused, setFocused, handlers] = useFocus(props);
    const box = useVirtualElementRef(input.current);

    const submitItem = useCallback(
        (link: string) => {
            if (href.current) {
                href.current.href = link;
                href.current.click();
            }
        },
        [href],
    );

    const page = provider.link(query);
    const onKeyDown = useCallback(
        (event: KeyboardEvent<HTMLElement>) => {
            if (event.key === 'Enter' && active === undefined && page) {
                submitItem(page);
            } else if (suggest.current) {
                suggest.current.onKeyDown(event);
            }
        },
        [suggest, active, submitItem, page],
    );

    const open = useCallback(() => {
        setFocused(true);
    }, [setFocused]);

    const close = useCallback(() => {
        setFocused(false);
        setQuery('');
    }, [setFocused, setQuery]);

    const onSubmit = useCallback(
        (item: SearchSuggestItem, _index?: number, fromKeyboard?: boolean) => {
            if (!fromKeyboard) {
                return;
            }

            submitItem((item as SearchSuggestLinkableItem).link);
        },
        [submitItem],
    );

    useEffect(() => provider.init(), [provider]);

    useImperativeHandle(api, () => ({open, close}), [open, close]);

    return (
        <div className={b('wrapper', classNameContainer)} {...handlers}>
            <a ref={href} href="#" hidden aria-hidden />
            <SearchInput
                ref={input}
                id={`dc-${id}-input`}
                size="l"
                className={b(null, className)}
                text={query}
                onUpdate={setQuery}
                onKeyDown={onKeyDown}
                autoFocus={focused}
                placeholder={placeholder}
                endContent={endContent}
                controlProps={{
                    'aria-controls': `dc-popup-${id}`,
                    'aria-expanded': Boolean(input.current && focused),
                    'aria-activedescendant':
                        active === undefined ? undefined : `dc-${id}-list-item-${active}`,
                }}
            />
            {input.current && (
                <Popup
                    open={Boolean(query && focused)}
                    id={`dc-popup-${id}`}
                    contentClassName={b('popup')}
                    style={{width: box.width}}
                    anchorRef={box}
                >
                    <Suggest
                        ref={suggest}
                        id={`dc-${id}-list`}
                        query={query}
                        provider={provider}
                        renderItem={SuggestItem}
                        onItemClick={onSubmit}
                        onChangeActive={setActive}
                    />
                </Popup>
            )}
        </div>
    );
});

SearchSuggest.displayName = 'SearchSuggest';
