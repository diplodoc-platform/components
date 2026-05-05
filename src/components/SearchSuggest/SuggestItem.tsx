import type {SearchSuggestActionItem, SearchSuggestItem} from './types';
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

type SuggestItemContentWrapperProps = PropsWithChildren<{
    item: SearchSuggestItem;
}>;

const SuggestItemContentWrapper: FC<SuggestItemContentWrapperProps> = ({item, children}) => {
    return (
        <div className={b('item-content')}>
            {item.icon}
            <div className={b('item-main')}>{children}</div>
            {!item.disabled && item.hint ? (
                <span className={b('item-hint')}>{item.hint}</span>
            ) : undefined}
        </div>
    );
};

type ActionProps = {
    item: SearchSuggestActionItem;
};

export const Action: React.FC<ActionProps> = ({item}) => {
    return (
        <Link
            className={b('item', {type: item.type})}
            view={'primary'}
            href="#"
            onClick={(event) => {
                event.preventDefault();
                item.onClick();
            }}
        >
            <SuggestItemContentWrapper item={item}>
                <span className={b('item-title')}>{item.title}</span>
                <span className={b('item-description')}>{item.description}</span>
            </SuggestItemContentWrapper>
        </Link>
    );
};

export const SuggestItem = (item: SearchSuggestItem) => {
    switch (item.type) {
        case SuggestItemType.Delimiter:
            return <BasicSuggestItem item={item}>{null}</BasicSuggestItem>;
        case SuggestItemType.Action:
            return <Action item={item} />;
        case SuggestItemType.Link:
            return (
                <Link className={b('item', {type: item.type})} view={'primary'} href={item.link}>
                    <SuggestItemContentWrapper item={item}>
                        <span>{item.title}</span>
                        <ChevronRight width={13} height={13} viewBox={'0 0 13 13'} />
                    </SuggestItemContentWrapper>
                </Link>
            );
        case SuggestItemType.Page:
            return (
                <Link className={b('item', {type: item.type})} view={'primary'} href={item.link}>
                    <SuggestItemContentWrapper item={item}>
                        <HTML className={b('item-title')}>{item.title}</HTML>
                        <HTML className={b('item-description')}>{item.description}</HTML>
                    </SuggestItemContentWrapper>
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
