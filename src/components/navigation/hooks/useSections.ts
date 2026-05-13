import type {NavigationLinkItem, NavigationSectionItem} from '../types';

import {useMemo} from 'react';

export interface UseSectionsProps {
    items: Array<NavigationSectionItem | NavigationLinkItem>;
}

export function useSections(props: UseSectionsProps) {
    const {items} = props;

    const sections = useMemo(() => {
        return getSections(items);
    }, [items]);

    return {
        items: sections,
    };
}

function getSections(items: Array<NavigationSectionItem | NavigationLinkItem>) {
    let index = 0;
    const sections: NavigationSectionItem[] = [];

    for (const item of items) {
        if (item.type === 'section') {
            const section: NavigationSectionItem = {
                ...item,
                items: item.items.map((item) => getItemWithIconSize(item)),
            };

            sections.push(section);

            index = sections.length;
        } else {
            sections[index] ??= {type: 'section', items: []};
            sections[index].items.push(getItemWithIconSize(item));
        }
    }

    return sections;
}

function getItemWithIconSize(item: NavigationLinkItem, iconSize = 20) {
    if ('iconSize' in item) {
        return item;
    }

    return {...item, iconSize};
}
