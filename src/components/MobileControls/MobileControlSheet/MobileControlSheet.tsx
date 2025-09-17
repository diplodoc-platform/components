import type {Lang, ListItem} from '../../../models';

import React, {memo, useCallback} from 'react';
import {List, Sheet} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import './MobileControlSheet.scss';

const LIST_ITEM_HEIGHT = 44;

const b = block('dc-mobile-control-sheet');

export interface MobileControlSheetProps {
    title: string;
    items: ListItem[];
    onItemClick: (value: string) => void;
    isVisible: boolean;
    onClose: () => void;
    selectedItemIndex: number;
    availableLangs?: (`${Lang}` | Lang)[];
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
                const isDisabled = availableLangs && !availableLangs.includes(item.value as Lang);

                return (
                    <button
                        className={b('list-item', {disabled: isDisabled})}
                        disabled={isDisabled}
                    >
                        {item.text}
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
                    onItemClick={(item: ListItem) => onItemClick(item.value)}
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
