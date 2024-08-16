import type {ReactNode} from 'react';
import type {SearchProvider, SearchSuggestItem} from './types';

import React, {forwardRef, memo, useEffect} from 'react';

import {Link, List, ListItemData, Loader} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import pick from 'lodash/pick';

import {useTranslation} from '../../hooks';
import {YandexGPTLogo} from '../GenerativeSearchAnswer/YandexGPTLogo';

import {useProvider} from './useProvider';
import './index.scss';

const b = block('dc-search-suggest');

interface SuggestGenerativeProps {
    link: string;
    generativeSuggestOnClick?: (link: string) => void;
}

const SuggestGenerative: React.FC<SuggestGenerativeProps> = ({link, generativeSuggestOnClick}) => {
    const {t} = useTranslation('search-suggest');

    return (
        <Link
            href={link}
            onClick={() => (generativeSuggestOnClick ? generativeSuggestOnClick(link) : undefined)}
        >
            <div className={b('generative-search')}>
                <YandexGPTLogo width={16} height={16} fill={'var(--g-color-text-secondary)'} />
                <div className={b('generative-search-text')}>
                    <h1>{t<string>('search-suggest-generative_title')}</h1>
                    <p>{t<string>('search-suggest-generative_subtitle')}</p>
                </div>
            </div>
        </Link>
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
    queryLink: string;
    generativeSuggestOnClick?: (link: string) => void;
};

const SuggestList = memo(
    forwardRef<List<SearchSuggestItem>, SuggestListProps>((props, ref) => {
        const {
            id,
            items,
            renderItem,
            onItemClick,
            onChangeActive,
            queryLink,
            generativeSuggestOnClick,
        } = props;

        return (
            <>
                <SuggestGenerative link={queryLink} {...generativeSuggestOnClick} />
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
} & Omit<SuggestListProps, 'items' | 'queryLink'>;

export const Suggest = memo(
    forwardRef<List<SearchSuggestItem>, SuggestProps>((props, ref) => {
        const {query, provider, generativeSuggestOnClick} = props;
        const [items, suggest] = useProvider(provider);

        useEffect(() => suggest(query), [query, suggest]);

        if (!items) {
            return null;
        }

        if (items instanceof Promise) {
            return <SuggestLoader />;
        }

        const queryLink = provider.link(`/search?query=${query}`);

        if (Array.isArray(items) && !items.length) {
            return (
                <>
                    <SuggestGenerative link={queryLink} {...generativeSuggestOnClick} />
                    <SuggestEmpty query={query} />
                </>
            );
        }

        return (
            <SuggestList
                ref={ref}
                items={items}
                queryLink={queryLink}
                {...pick(props, ['id', 'renderItem', 'onItemClick', 'onChangeActive'])}
                {...generativeSuggestOnClick}
            />
        );
    }),
);

Suggest.displayName = 'Suggest';
