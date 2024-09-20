import React, {MouseEvent, memo, useCallback, useState} from 'react';
import {ChevronDown} from '@gravity-ui/icons';
import {
    Foldable,
    ItemColumnName,
    NavigationDropdownItem,
    NavigationLayout,
    NavigationList,
    useActiveNavItem,
} from '@gravity-ui/page-constructor';
import block from 'bem-cn-lite';

import {OutsideClick} from '../../OutsideClick';

import './MobileDropdown.scss';

const ICON_SIZE = 20;

const b = block('dc-mobile-dropdown');

export interface MobileDropdownProps {
    item: NavigationDropdownItem;
}

const MobileDropdown: React.FC<MobileDropdownProps> = memo(({item}) => {
    const {text, isActive, items} = item;

    const [isOpened, setIsOpen] = useState(isActive);
    const {onActiveItemChange} = useActiveNavItem(ICON_SIZE, items);

    const toggleOpennes = useCallback(
        (event: MouseEvent) => {
            event.stopPropagation();

            setIsOpen(!isOpened);
        },
        [isOpened],
    );

    return (
        <OutsideClick onOutsideClick={() => setIsOpen(false)}>
            <span className={b()} onClick={toggleOpennes}>
                <span className={'pc-content-wrapper__text'}>{text}</span>
                <ChevronDown
                    className={b('icon', {up: isOpened})}
                    width={ICON_SIZE}
                    height={ICON_SIZE}
                />
            </span>
            <Foldable className={b('foldable')} isOpened={isOpened}>
                <NavigationList
                    items={items}
                    className={b('list')}
                    itemClassName={b('list-item')}
                    column={ItemColumnName.Top}
                    menuLayout={NavigationLayout.Mobile}
                    onActiveItemChange={onActiveItemChange}
                />
            </Foldable>
        </OutsideClick>
    );
});

MobileDropdown.displayName = 'MobileDropdown';

export default MobileDropdown;
