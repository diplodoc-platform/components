import React, {memo, useState} from 'react';

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

import './MobileDropdown.scss';

const b = block('dc-mobile-dropdown');

export interface MobileDropdownProps {
    item: NavigationDropdownItem;
}

const MobileDropdown: React.FC<MobileDropdownProps> = memo(({item}) => {
    const {
        // type,
        text,
        isActive,
        // isTopLevel,
        items,
    } = item;

    const [isOpened, setIsOpen] = useState(isActive);
    const {onActiveItemChange} = useActiveNavItem(20, items);

    return (
        <React.Fragment>
            <span
                // ? type={type}
                className={b()}
                onClick={(event) => {
                    event.stopPropagation();

                    setIsOpen(!isOpened);
                }}
            >
                <span className={'pc-content-wrapper__text'}>{text}</span>
                <ChevronDown className={b('icon', {up: isOpened})} width={20} height={20} />
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
        </React.Fragment>
    );
});

MobileDropdown.displayName = 'MobileDropdown';

export default MobileDropdown;
