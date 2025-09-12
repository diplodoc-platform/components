import type {KeyboardEvent, MouseEventHandler, SyntheticEvent} from 'react';
import type {ISearchProvider} from '../../models';
import type {SearchSuggestItem, SearchSuggestLinkableItem, SearchSuggestPageItem} from './types';
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
    classNameClose?: string;
    className?: string;
    onFocus?: (event: SyntheticEvent) => void;
    onBlur?: (event: SyntheticEvent) => void;
    endContent?: React.ReactNode;
    closeButton?: boolean;
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
        endContent,
        closeButton,
        onBlur,
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
    }, [setFocused]);

    const clearQuery = useCallback(() => {
        setQuery('');
    }, [setQuery]);

    const onSubmit = useCallback(
        (item: SearchSuggestItem, _index?: number, fromKeyboard?: boolean) => {
            if (!fromKeyboard) {
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

    useEffect(() => provider.init(), [provider]);
    useEffect(() => {
        if (focused) {
            return watch();
        }

        return () => {};
    }, [focused, watch]);

    useImperativeHandle(api, () => ({open, close}), [open, close]);

    return (
        <div className={b('wrapper', classNameContainer)}>
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
                endContent={!focused && endContent}
                controlProps={{
                    'aria-controls': `dc-popup-${id}`,
                    'aria-expanded': Boolean(input.current && focused),
                    'aria-activedescendant':
                        active === undefined ? undefined : `dc-${id}-list-item-${active}`,
                }}
            />
            {closeButton && focused && <CloseButton onClick={onClose} className={classNameClose} />}
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
