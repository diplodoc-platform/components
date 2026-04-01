import type {KeyboardEvent, MouseEventHandler, SyntheticEvent} from 'react';
import type {ISearchProvider} from '../../models';
import type {SearchSuggestActionItem, SearchSuggestItem, SearchSuggestLinkableItem} from './types';
import type {List} from '@gravity-ui/uikit';

import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import {Icon, Popup} from '@gravity-ui/uikit';
import {Xmark} from '@gravity-ui/icons';
import block from 'bem-cn-lite';
import uniqueId from 'lodash/uniqueId';

import {useTranslation, useVirtualElementRef} from '../../hooks';

import {SuggestItemType} from './types';
import {SearchInput} from './SearchInput';
import {Suggest} from './Suggest';
import {SuggestItem} from './SuggestItem';
import {useFocus} from './useFocus';
import './index.scss';

const b = block('dc-search-suggest');

export type {
    SearchSuggestActionItem,
    SearchSuggestItem,
    SearchSuggestLinkableItem,
    SearchSuggestPageItem,
} from './types';
export {SuggestItemType} from './types';

export interface SearchSuggestProps {
    provider: ISearchProvider;
    placeholder?: string;
    classNameContainer?: string;
    classNameClose?: string;
    className?: string;
    onFocus?: (event: SyntheticEvent) => void;
    onBlur?: (event: SyntheticEvent) => void;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    closeButton?: boolean;
    withAllResults?: boolean;
    focusFirstSearchResult?: boolean;
    hasClear?: boolean;
    withFocusOverlay?: boolean;
    emptyState?: React.ReactNode;
    actionOnEmpty?: (query: string) => SearchSuggestActionItem;
}

export interface SearchSuggestApi {
    open(): void;

    close(): void;
}

const MIMIC_PC_CONTROL = 'pc-control pc-control_size_l pc-control_theme_primary';

function CloseButton({onClick, className}: {onClick: MouseEventHandler; className?: string}) {
    const {t} = useTranslation('search');

    return (
        <button
            type="button"
            aria-label={t('search_close')}
            className={b('close', [MIMIC_PC_CONTROL, className].join(' '))}
            onClick={onClick}
        >
            <Icon data={Xmark} size={24} />
        </button>
    );
}

export const SearchSuggest = forwardRef<SearchSuggestApi, SearchSuggestProps>((props, api) => {
    const {t} = useTranslation('search');

    const {
        provider,
        className,
        classNameContainer,
        classNameClose,
        placeholder = t('search_placeholder'),
        startContent,
        endContent,
        closeButton,
        onBlur,
        withAllResults = true,
        focusFirstSearchResult = false,
        hasClear = false,
        withFocusOverlay = false,
        emptyState,
        actionOnEmpty,
    } = props;
    const href = useRef<HTMLAnchorElement>(null);
    const input = useRef<HTMLElement>(null);
    const suggest = useRef<List<SearchSuggestItem>>(null);
    const id = useMemo(uniqueId, []);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState<undefined | number>(undefined);
    const [focused, setFocused, handlers] = useFocus(props);
    const [box, watch] = useVirtualElementRef(input.current);

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
            if (
                event.key === 'Enter' &&
                withAllResults &&
                !focusFirstSearchResult &&
                active === undefined &&
                page
            ) {
                submitItem(page);
            } else if (suggest.current) {
                suggest.current.onKeyDown(event);
            }
        },
        [suggest, active, submitItem, page, withAllResults, focusFirstSearchResult],
    );

    const open = useCallback(() => {
        setFocused(true);
    }, [setFocused]);

    const close = useCallback(() => {
        setFocused(false);
    }, [setFocused]);

    const clearQuery = useCallback(() => {
        setQuery('');
    }, [setQuery]);

    const onSubmit = useCallback(
        (item: SearchSuggestItem, _index?: number, fromKeyboard?: boolean) => {
            if (!fromKeyboard) {
                return;
            }

            if (item.type === SuggestItemType.Action) {
                item.onClick();
                return;
            }

            submitItem((item as SearchSuggestLinkableItem).link);
        },
        [submitItem],
    );

    const onClose = useCallback(
        (event: SyntheticEvent) => {
            close();
            clearQuery();
            onBlur?.(event);
        },
        [close, clearQuery, onBlur],
    );

    const onOutsideClick = useCallback(() => {
        if (focused) {
            close();
        }
    }, [focused, close]);

    useEffect(() => provider.init(), [provider]);
    useEffect(() => {
        if (focused) {
            return watch();
        }

        return () => {};
    }, [focused, watch]);
    useImperativeHandle(api, () => ({open, close}), [open, close]);

    const wrapperClassName = [b('wrapper', {focused}), classNameContainer]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={wrapperClassName}>
            {withFocusOverlay && focused && (
                <div className={b('overlay')} onClick={onOutsideClick} />
            )}
            <a ref={href} href="#" hidden aria-hidden />
            <SearchInput
                {...handlers}
                ref={input}
                id={`dc-${id}-input`}
                size="l"
                className={b(null, className)}
                text={query}
                onUpdate={setQuery}
                onKeyDown={onKeyDown}
                autoFocus={focused}
                placeholder={placeholder}
                startContent={startContent}
                endContent={!focused && endContent}
                controlProps={{
                    'aria-controls': `dc-popup-${id}`,
                    'aria-expanded': Boolean(input.current && focused),
                    'aria-activedescendant':
                        active === undefined ? undefined : `dc-${id}-list-item-${active}`,
                }}
                hasClear={hasClear}
            />
            {closeButton && focused && <CloseButton onClick={onClose} className={classNameClose} />}
            {input.current && (
                <Popup
                    open={Boolean(query && focused)}
                    onOutsideClick={onOutsideClick}
                    id={`dc-popup-${id}`}
                    className={b('popup')}
                    style={{width: box.width, zIndex: 1002}}
                    anchorRef={box}
                    strategy="fixed"
                >
                    <Suggest
                        ref={suggest}
                        id={`dc-${id}-list`}
                        query={query}
                        provider={provider}
                        withAllResults={withAllResults}
                        focusFirstSearchResult={focusFirstSearchResult}
                        activeItemIndex={focusFirstSearchResult ? (active ?? 0) : active}
                        renderItem={SuggestItem}
                        onItemClick={onSubmit}
                        onChangeActive={setActive}
                        emptyState={emptyState}
                        actionOnEmpty={actionOnEmpty}
                    />
                </Popup>
            )}
        </div>
    );
});

SearchSuggest.displayName = 'SearchSuggest';
