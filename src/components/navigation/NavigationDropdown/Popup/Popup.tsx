import type {FC, RefObject} from 'react';
import type {NavigationColumnItem, NavigationLinkItem, NavigationSectionItem} from '../../types';

import React, {useCallback} from 'react';
import {Popup} from '@gravity-ui/uikit';
import {block} from '@gravity-ui/page-constructor';

import {DropdownContent} from '../../DropdownContent';

const b = block('navigation-popup');
const OFFSET_RESET = {mainAxis: 0, crossAxis: 0};

export interface NavigationPopupProps {
    open: boolean;
    items: Array<NavigationLinkItem | NavigationSectionItem | NavigationColumnItem>;
    onClose: () => void;
    anchorRef: RefObject<Element | null>;
}

export const NavigationPopup: FC<NavigationPopupProps> = (props) => {
    const {items, anchorRef, onClose, open} = props;

    const onOpenChange = useCallback(
        (isOpen: boolean) => {
            if (!isOpen) {
                onClose();
            }
        },
        [onClose],
    );

    return (
        <Popup
            className={b()}
            anchorElement={anchorRef.current}
            open={open}
            onOpenChange={onOpenChange}
            keepMounted
            strategy="fixed"
            placement="bottom-start"
            offset={OFFSET_RESET}
        >
            <DropdownContent items={items} />
        </Popup>
    );
};
