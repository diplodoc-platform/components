import type {AvailableLangs, Lang, LangOptions, ListItem} from '../../../models';

import React, {memo, useCallback} from 'react';
import {List, Sheet} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import './MobileControlSheet.scss';

const LIST_ITEM_HEIGHT = 44;

const b = block('dc-mobile-control-sheet');

export interface MobileControlSheetProps {
    title: string;
    items: ListItem[];
    onItemClick: (value: string, options?: LangOptions) => void;
    isVisible: boolean;
    onClose: () => void;
    selectedItemIndex: number;
    availableLangs?: AvailableLangs;
}

const MobileControlSheet = memo(
    ({
        title,
        items,
        onItemClick,
        isVisible,
        onClose,
        selectedItemIndex,
        availableLangs,
    }: MobileControlSheetProps) => {
        const renderItem = useCallback(
            (item: ListItem) => {
                const {domain, href} = item.options || {};

                const disabled =
                    Boolean(
                        availableLangs?.length && !availableLangs.includes(item.value as Lang),
                    ) &&
                    !domain &&
                    !href;

                const country = item.country;

                return (
                    <button
                        className={b('list-item', {disabled, domain: Boolean(domain)})}
                        disabled={disabled}
                    >
                        {item.text}
                        {domain && country && <span>{country}</span>}
                    </button>
                );
            },
            [availableLangs],
        );

        return (
            <Sheet title={title} className={b()} visible={isVisible} onClose={onClose}>
                <List
                    role={'list'}
                    className={b('list')}
                    filterable={false}
                    items={items}
                    onItemClick={(item: ListItem) => onItemClick(item.value, item.options)}
                    itemHeight={LIST_ITEM_HEIGHT}
                    itemsHeight={LIST_ITEM_HEIGHT * items.length}
                    renderItem={renderItem}
                    selectedItemIndex={selectedItemIndex}
                />
            </Sheet>
        );
    },
);

MobileControlSheet.displayName = 'MobileControlSheet';

export default MobileControlSheet;
