import type {ReactNode} from 'react';
import type {ISearchProvider} from '../../models';
import type {SearchSuggestActionItem, SearchSuggestItem} from './types';
import type {ListItemData} from '@gravity-ui/uikit';

import React, {forwardRef, memo, useEffect, useMemo} from 'react';
import {List, Loader, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import pick from 'lodash/pick';

import {useTranslation} from '../../hooks';

import {SuggestItemType} from './types';
import {AiIcon} from './AiIcon';
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

const ENTER_HINT = (
    <Text variant="body-short" color="secondary">
        ENTER
    </Text>
);

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
    emptyState?: ReactNode;
    onAiAction?: (query: string) => void;
} & Omit<SuggestListProps, 'items'>;

export const Suggest = memo(
    forwardRef<List<SearchSuggestItem>, SuggestProps>((props, ref) => {
        const {query, provider, withAllResults = true, emptyState, onAiAction} = props;
        const {t} = useTranslation('search-suggest');
        const [items, suggest] = useProvider(provider, {withAllResults});

        useEffect(() => suggest(query), [query, suggest]);

        const aiActionItem: SearchSuggestActionItem | null = useMemo(
            () =>
                onAiAction && query
                    ? {
                          type: SuggestItemType.Action,
                          title: t('search-suggest_ask-ai'),
                          icon: <AiIcon />,
                          hint: ENTER_HINT,
                          onClick: () => onAiAction(query),
                      }
                    : null,
            [onAiAction, query, t],
        );

        const emptyAction =
            Array.isArray(items) && !items.length
                ? (provider.onEmptyAction?.(query) ?? null)
                : null;

        if (!items) {
            return null;
        }

        if (items instanceof Promise) {
            return <SuggestLoader />;
        }

        const listProps = pick(props, [
            'id',
            'renderItem',
            'onItemClick',
            'onChangeActive',
            'activeItemIndex',
        ]);

        if (Array.isArray(items) && !items.length) {
            const emptyItems: SearchSuggestActionItem[] = [
                ...(aiActionItem ? [aiActionItem] : []),
                ...(emptyAction ? [emptyAction] : []),
            ];

            return (
                <>
                    {Boolean(emptyItems.length) && (
                        <SuggestList ref={ref} items={emptyItems} {...listProps} />
                    )}
                    <SuggestEmpty query={query} emptyState={emptyState} />
                </>
            );
        }

        const allItems = aiActionItem ? [aiActionItem, ...items] : items;

        return <SuggestList ref={ref} items={allItems} {...listProps} />;
    }),
);

Suggest.displayName = 'Suggest';
