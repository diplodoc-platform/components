import type {ISearchProvider, ISearchResult, TFunction} from '../../models';
import type {SearchGroup, SearchSuggestItem} from './types';

import {useCallback, useMemo, useRef, useState} from 'react';
import debounce from 'lodash/debounce';

import {useTranslation} from '../../hooks';

import {SuggestItemType} from './types';

type Link = (query: string) => string | null;
type Zalgo<T> = Promise<T> | T;
type Items = Zalgo<SearchSuggestItem[] | null>;
type Request = (query: string) => () => void;
type UseProviderOptions = {
    withAllResults?: boolean;
};

const cache = new Map<string, SearchSuggestItem[]>();

export function useProvider(
    provider: ISearchProvider,
    options: UseProviderOptions = {},
): [Items, Request] {
    const {withAllResults = true} = options;
    const wait = useRef<Zalgo<SearchSuggestItem[] | null>>(null);
    const [items, setItems] = useState<Zalgo<SearchSuggestItem[] | null>>(null);
    const {t} = useTranslation('search-suggest');

    const suggest = useMemo(
        () =>
            debounce((query: string) => {
                const cacheKey = `${withAllResults ? 'all' : 'items'}:${query}`;
                const promise = (wait.current = (async () => {
                    try {
                        const data = await provider.suggest(query);
                        const items = format(
                            query,
                            data,
                            (args) => provider.link(args),
                            t,
                            withAllResults,
                        );

                        cache.set(cacheKey, items);
                        setTimeout(() => cache.delete(cacheKey), 30000);

                        return items;
                    } catch {
                        return [
                            {
                                type: SuggestItemType.Text,
                                title: t('search-suggest_error-text'),
                                disabled: true,
                            },
                        ] as SearchSuggestItem[];
                    }
                })());

                setItems(promise);

                promise.then((items) => {
                    if (wait.current === promise) {
                        setItems(items);
                    }
                });
            }, 300),
        [t, provider, wait, setItems, withAllResults],
    );

    const request = useCallback(
        (query: string) => {
            const cacheKey = `${withAllResults ? 'all' : 'items'}:${query}`;

            if (!query) {
                wait.current = null;
                setItems(null);
            } else if (cache.has(cacheKey)) {
                wait.current = null;
                setItems(cache.get(cacheKey) as SearchSuggestItem[]);
            } else {
                suggest(query);
            }

            return suggest.cancel;
        },
        [suggest, setItems, withAllResults],
    );

    return [items, request];
}

function format(
    query: string,
    items: ISearchResult[],
    link: Link,
    t: TFunction,
    withAllResults: boolean,
) {
    const page = link(query);
    const preparedItems: SearchSuggestItem[] = [];
    const groupedItemsMap = {} as Record<string, SearchGroup>;

    items.forEach((item) => {
        if (item.type === SuggestItemType.Action) {
            preparedItems.push({
                type: SuggestItemType.Action,
                title: item.title,
                description: item.description || '',
                onClick: item.onClick,
                icon: item.icon,
                hint: item.hint,
            });
            return;
        }

        if (item.type === SuggestItemType.Page) {
            preparedItems.push({
                type: SuggestItemType.Page,
                title: item.title,
                link: item.link,
                description: item.description,
                breadcrumbs: item.breadcrumbs,
                icon: item.icon,
                hint: item.hint,
            });
            return;
        }

        if (item.type === SuggestItemType.Link) {
            preparedItems.push({
                type: SuggestItemType.Link,
                title: item.title,
                link: item.link,
                icon: item.icon,
                hint: item.hint,
            });
            return;
        }

        groupedItemsMap[item.type] = groupedItemsMap[item.type] || {type: item.type, items: []};
        groupedItemsMap[item.type].items.push({
            type: SuggestItemType.Page,
            title: item.title,
            link: item.link,
            description: item.description,
            breadcrumbs: item.breadcrumbs,
            icon: item.icon,
            hint: item.hint,
        });
    });

    const groups = Object.values(groupedItemsMap);

    const groupedItems =
        groups.length === 1
            ? groups[0].items
            : groups.reduce((result, group) => {
                  if (result.length) {
                      result.push({
                          type: SuggestItemType.Delimiter,
                          disabled: true,
                      });
                  }

                  result.push({
                      type: SuggestItemType.Group,
                      title: t(`search-item_type-${group.type}`, t('search-item_type-main')),
                      disabled: true,
                  });

                  return result.concat(group.items as SearchSuggestItem[]);
              }, [] as SearchSuggestItem[]);

    const result = preparedItems.concat(groupedItems);

    if (withAllResults && result.length > 0 && page) {
        result.push({
            type: SuggestItemType.Link,
            title: t('search-suggest_all-results'),
            link: page,
        });
    }

    return result;
}
