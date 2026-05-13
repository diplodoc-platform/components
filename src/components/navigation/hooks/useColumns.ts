import type {NavigationColumnItem, NavigationLinkItem, NavigationSectionItem} from '../types';

import {useMemo} from 'react';

export interface UseColumnsProps {
    items: Array<NavigationSectionItem | NavigationLinkItem | NavigationColumnItem>;
}

export function useColumns(props: UseColumnsProps) {
    const {items} = props;

    const columns = useMemo(() => {
        return getColumns(items);
    }, [items]);

    return {
        items: columns,
    };
}

function getColumns(
    items: Array<NavigationSectionItem | NavigationLinkItem | NavigationColumnItem>,
) {
    let index = 0;
    const columns: NavigationColumnItem[] = [];

    for (const item of items) {
        if (item.type === 'column') {
            columns.push(item);

            index = columns.length;
        } else {
            columns[index] ??= {type: 'column', items: []};
            columns[index].items.push(item);
        }
    }

    return columns;
}
