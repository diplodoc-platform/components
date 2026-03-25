import type {
    SearchSuggestAiHintItem,
    SearchSuggestHintMap,
    SearchSuggestIconMap,
    SearchSuggestItem,
} from './types';
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
    icon?: React.ReactNode;
    hint?: React.ReactNode;
}>;

const SuggestItemContentWrapper: FC<SuggestItemContentWrapperProps> = ({
    item,
    icon,
    hint,
    children,
}) => {
    return (
        <div className={b('item-content')}>
            {icon}
            <div className={b('item-main')}>{children}</div>
            {!item.disabled && hint}
        </div>
    );
};

type AiHintProps = {
    item: SearchSuggestAiHintItem;
    icon?: React.ReactNode;
    hint?: React.ReactNode;
};

export const AiHint: React.FC<AiHintProps> = ({item, icon, hint}) => {
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
            <SuggestItemContentWrapper item={item} icon={icon} hint={hint}>
                <span className={b('item-title')}>{item.title}</span>
                <span className={b('item-description')}>{item.description}</span>
            </SuggestItemContentWrapper>
        </Link>
    );
};

type SuggestItemProps = {
    item: SearchSuggestItem;
    iconMap?: SearchSuggestIconMap;
    hintMap?: SearchSuggestHintMap;
};

export const SuggestItem: React.FC<SuggestItemProps> = ({item, iconMap, hintMap}) => {
    const icon = iconMap?.[item.type];
    const hintNode = hintMap?.[item.type];
    const hint = hintNode ? <span className={b('item-hint')}>{hintNode}</span> : undefined;

    switch (item.type) {
        case SuggestItemType.Delimiter:
            return <BasicSuggestItem item={item}>{null}</BasicSuggestItem>;
        case SuggestItemType.AiHint:
            return <AiHint item={item} icon={icon} hint={hint} />;
        case SuggestItemType.Link:
            return (
                <Link className={b('item', {type: item.type})} view={'primary'} href={item.link}>
                    <SuggestItemContentWrapper item={item} icon={icon} hint={hint}>
                        <span>{item.title}</span>
                        <ChevronRight width={13} height={13} viewBox={'0 0 13 13'} />
                    </SuggestItemContentWrapper>
                </Link>
            );
        case SuggestItemType.Page:
            return (
                <Link className={b('item', {type: item.type})} view={'primary'} href={item.link}>
                    <SuggestItemContentWrapper item={item} icon={icon} hint={hint}>
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
