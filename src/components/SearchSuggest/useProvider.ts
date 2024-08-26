import type {TFunction} from 'react-i18next';
import type {SearchGroup, SearchProvider, SearchResult, SearchSuggestItem} from './types';

import {useCallback, useMemo, useRef, useState} from 'react';
import debounce from 'lodash/debounce';

import {useTranslation} from '../../hooks';

import {SuggestItemType} from './types';

type Link = (query: string) => string;
type Zalgo<T> = Promise<T> | T;
type Items = Zalgo<SearchSuggestItem[] | null>;
type Request = (query: string) => () => void;

const cache = new Map<string, SearchSuggestItem[]>();

export function useProvider(provider: SearchProvider): [Items, Request] {
    const wait = useRef<Zalgo<SearchSuggestItem[] | null>>(null);
    const [items, setItems] = useState<Zalgo<SearchSuggestItem[] | null>>(null);
    const {t} = useTranslation('search-suggest');

    const suggest = useMemo(
        () =>
            debounce((query: string) => {
                const promise = (wait.current = (async () => {
                    try {
                        const data = await provider.suggest(query);
                        const items = format(query, data, provider.link, t);

                        cache.set(query, items);
                        setTimeout(() => cache.delete(query), 30000);

                        return items;
                    } catch (error) {
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
        [t, provider, wait, setItems],
    );

    const request = useCallback(
        (query: string) => {
            if (!query) {
                wait.current = null;
                setItems(null);
            } else if (cache.has(query)) {
                wait.current = null;
                setItems(cache.get(query) as SearchSuggestItem[]);
            } else {
                suggest(query);
            }

            return suggest.cancel;
        },
        [suggest, setItems],
    );

    return [items, request];
}

function format(query: string, items: SearchResult[], link: Link, t: TFunction) {
    const groups = Object.values(
        items.reduce(
            (result, item) => {
                result[item.type] = result[item.type] || {type: item.type, items: []};
                result[item.type].items.push({
                    type: SuggestItemType.Page,
                    title: item.title,
                    link: link(item.link),
                    description: item.description,
                    breadcrumbs: item.breadcrumbs,
                });
                return result;
            },
            {} as Record<string, SearchGroup>,
        ),
    );

    const result =
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
                      title: t<string>(
                          `search-item_type-${group.type}`,
                          t<string>('search-item_type-main'),
                      ),
                      disabled: true,
                  });

                  return result.concat(group.items as SearchSuggestItem[]);
              }, [] as SearchSuggestItem[]);

    if (result.length > 0) {
        result.push({
            type: SuggestItemType.Link,
            title: t('search-suggest_all-results'),
            link: link(`/search?query=${query}`),
        });
    }

    return result;
}
