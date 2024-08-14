import React, {memo, useCallback} from 'react';

import {List, Sheet} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {ListItem} from '../../../models';

import './MobileControlSheet.scss';

const b = block('dc-mobile-control-sheet');

export interface MobileControlSheetProps {
    title: string;
    items: ListItem[];
    onItemClick: (value: string) => void;
    isVisible: boolean;
    onClose: () => void;
}

const LIST_ITEM_HEIGHT = 44;

const MobileControlSheet = memo(
    ({title, items, onItemClick, isVisible, onClose}: MobileControlSheetProps) => {
        const itemsHeight = LIST_ITEM_HEIGHT * items.length;

        const renderItem = useCallback(
            (item: ListItem) => <button className={b('list-item')}>{item.text}</button>,
            [],
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
                    itemsHeight={itemsHeight}
                    renderItem={renderItem}
                />
            </Sheet>
        );
    },
);

MobileControlSheet.displayName = 'MobileControlSheet';

export default MobileControlSheet;
