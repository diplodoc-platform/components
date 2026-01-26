import type {SearchSuggestItem} from './types';
import type {FC, PropsWithChildren} from 'react';

import React from 'react';
import {ChevronRight} from '@gravity-ui/icons';
import {Link} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {HTML} from '../HTML';

import {SuggestItemType} from './types';

const b = block('dc-search-suggest');

const BasicSuggestItem: FC<PropsWithChildren<{item: SearchSuggestItem}>> = ({item, children}) => {
    return <div className={b('item', {type: item.type})}>{children}</div>;
};

export const SuggestItem: React.FC<SearchSuggestItem> = (item) => {
    switch (item.type) {
        case SuggestItemType.Delimiter:
            return <BasicSuggestItem item={item}>{null}</BasicSuggestItem>;
        case SuggestItemType.Link:
            return (
                <Link className={b('item', {type: item.type})} view={'primary'} href={item.link}>
                    <span>{item.title}</span>
                    <ChevronRight width={13} height={13} viewBox={'0 0 13 13'} />
                </Link>
            );
        case SuggestItemType.Page:
            return (
                <Link className={b('item', {type: item.type})} view={'primary'} href={item.link}>
                    <HTML className={b('item-title')}>{item.title}</HTML>
                    <HTML className={b('item-description')}>{item.description}</HTML>
                </Link>
            );
        case SuggestItemType.Group:
            return (
                <BasicSuggestItem item={item}>
                    <h5>
                        <HTML>{item.title}</HTML>
                    </h5>
                </BasicSuggestItem>
            );
        default:
            return (
                <BasicSuggestItem item={item}>
                    <HTML>{item.title}</HTML>
                </BasicSuggestItem>
            );
    }
};
