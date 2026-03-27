import type {ReactNode} from 'react';
import type {ISearchProvider} from '../../models';
import type {SearchSuggestAiHintItem, SearchSuggestItem} from './types';
import type {ListItemData} from '@gravity-ui/uikit';

import React, {forwardRef, memo, useEffect} from 'react';
import {List, Loader} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import pick from 'lodash/pick';

import {useTranslation} from '../../hooks';

import {useProvider} from './useProvider';
import './index.scss';

const b = block('dc-search-suggest');

const SuggestLoader = memo(() => {
    return (
        <div className={b('loader')}>
            <Loader />
        </div>
    );
});

SuggestLoader.displayName = 'SuggestLoader';

const SuggestEmpty = memo<{query: string; emptyState?: ReactNode}>(({query, emptyState}) => {
    const {t} = useTranslation('search-suggest');

    return (
        <div className={b('list', {empty: true})}>
            {emptyState === undefined ? t('search-suggest_not-found', {query}) : emptyState}
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
    activeItemIndex?: number;
};

const SuggestList = memo(
    forwardRef<List<SearchSuggestItem>, SuggestListProps>((props, ref) => {
        const {id, items, renderItem, onItemClick, onChangeActive, activeItemIndex} = props;

        return (
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
                activeItemIndex={activeItemIndex}
            />
        );
    }),
);

SuggestList.displayName = 'SuggestList';

type SuggestProps = {
    id: string;
    query: string;
    provider: ISearchProvider;
    withAllResults?: boolean;
    focusFirstSearchResult?: boolean;
    emptyState?: ReactNode;
    aiHintOnEmpty?: (query: string) => SearchSuggestAiHintItem;
} & Omit<SuggestListProps, 'items'>;

export const Suggest = memo(
    forwardRef<List<SearchSuggestItem>, SuggestProps>((props, ref) => {
        const {
            query,
            provider,
            withAllResults = true,
            focusFirstSearchResult = false,
            emptyState,
            aiHintOnEmpty,
            onChangeActive,
        } = props;
        const [items, suggest] = useProvider(provider, {withAllResults});

        useEffect(() => suggest(query), [query, suggest]);

        const isEmptyWithHint = Array.isArray(items) && !items.length && Boolean(aiHintOnEmpty);
        useEffect(() => {
            if (focusFirstSearchResult && isEmptyWithHint) {
                onChangeActive(0);
            }
        }, [focusFirstSearchResult, isEmptyWithHint, onChangeActive]);

        if (!items) {
            return null;
        }

        if (items instanceof Promise) {
            return <SuggestLoader />;
        }

        if (Array.isArray(items) && !items.length) {
            const emptyItems = aiHintOnEmpty ? [aiHintOnEmpty(query)] : [];

            return (
                <>
                    {Boolean(emptyItems.length) && (
                        <SuggestList
                            ref={ref}
                            items={emptyItems}
                            {...pick(props, [
                                'id',
                                'renderItem',
                                'onItemClick',
                                'onChangeActive',
                                'activeItemIndex',
                            ])}
                        />
                    )}
                    <SuggestEmpty query={query} emptyState={emptyState} />
                </>
            );
        }

        return (
            <SuggestList
                ref={ref}
                items={items}
                {...pick(props, [
                    'id',
                    'renderItem',
                    'onItemClick',
                    'onChangeActive',
                    'activeItemIndex',
                ])}
            />
        );
    }),
);

Suggest.displayName = 'Suggest';
