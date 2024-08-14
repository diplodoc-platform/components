import type {ReactNode} from 'react';
import React, {forwardRef, memo, useEffect} from 'react';

import {List, ListItemData, Loader} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import pick from 'lodash/pick';

import {useTranslation} from '../../hooks';
import {YandexGPTLogo} from '../GenerativeSearchAnswer/YandexGPTLogo';

import type {SearchProvider, SearchSuggestItem} from './types';
import {useProvider} from './useProvider';

import './index.scss';

const b = block('dc-search-suggest');

const SuggestGenerative = () => {
    const {t} = useTranslation('search-suggest');

    return (
        <div className={b('generative-search')}>
            <YandexGPTLogo />
            <div className={b('generative-search-text')}>
                <h1>{t<string>('search-suggest-generative_title')}</h1>
                <p>{t<string>('search-suggest-generative_subtitle')}</p>
            </div>
        </div>
    );
};

const SuggestLoader = memo(() => {
    return (
        <div className={b('loader')}>
            <Loader />
        </div>
    );
});

SuggestLoader.displayName = 'SuggestLoader';

const SuggestEmpty = memo<{query: string}>(({query}) => {
    const {t} = useTranslation('search-suggest');

    return (
        <div className={b('list', {empty: true})}>
            {t<string>('search-suggest_not-found', {query})}
        </div>
    );
});

SuggestEmpty.displayName = 'SuggestEmpty';

type SuggestListProps = {
    id: string;
    items: SearchSuggestItem[];
    renderItem: (item: SearchSuggestItem) => ReactNode;
    onItemClick: (
        item: ListItemData<SearchSuggestItem>,
        index?: number,
        fromKeyboard?: boolean,
    ) => boolean | void;
    onChangeActive: (index?: number) => void;
};

const SuggestList = memo(
    forwardRef<List<SearchSuggestItem>, SuggestListProps>((props, ref) => {
        const {id, items, renderItem, onItemClick, onChangeActive} = props;

        return (
            <>
                <SuggestGenerative />
                <List
                    ref={ref}
                    id={id}
                    className={b('list')}
                    role={'listbox'}
                    filterable={false}
                    virtualized={false}
                    items={items}
                    renderItem={renderItem}
                    onItemClick={onItemClick}
                    onChangeActive={onChangeActive}
                />
            </>
        );
    }),
);

SuggestList.displayName = 'SuggestList';

type SuggestProps = {
    id: string;
    query: string;
    provider: SearchProvider;
} & Omit<SuggestListProps, 'items'>;

export const Suggest = memo(
    forwardRef<List<SearchSuggestItem>, SuggestProps>((props, ref) => {
        const {query, provider} = props;
        const [items, suggest] = useProvider(provider);

        useEffect(() => suggest(query), [query, suggest]);

        if (!items) {
            return null;
        }

        if (items instanceof Promise) {
            return <SuggestLoader />;
        }

        if (Array.isArray(items) && !items.length) {
            // <><SuggestGenerative /><SuggestEmpty query={query} /></>
            return (
                <>
                    <SuggestGenerative />
                    <SuggestEmpty query={query} />
                </>
            );
        }

        return (
            <SuggestList
                ref={ref}
                items={items}
                {...pick(props, ['id', 'renderItem', 'onItemClick', 'onChangeActive'])}
            />
        );
    }),
);

Suggest.displayName = 'Suggest';
