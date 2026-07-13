import type {FC} from 'react';
import type {NavigationDropdownItem, NavigationItemProps} from '@gravity-ui/page-constructor';

import {useRef} from 'react';
import {ToggleArrow, block} from '@gravity-ui/page-constructor';

import {NavigationPopup} from './Popup';
import {ContentWrapper} from './ContentWrapper';
import './NavigationDropdown.scss';

const b = block('navigation-dropdown');

const TOGGLE_ARROW_SIZE = 12;

export type NavigationDropdownProps = NavigationItemProps & NavigationDropdownItem;

export const NavigationDropdown: FC<NavigationDropdownProps> = (props) => {
    const {text, icon, className, iconSize, hidePopup, items, isActive, ...otherProps} = props;
    const iconData = typeof icon === 'string' ? {src: icon} : icon;

    const anchorRef = useRef<HTMLButtonElement>(null);

    return (
        <>
            <button
                ref={anchorRef}
                {...otherProps}
                type="button"
                className={b(null, className)}
                aria-expanded={isActive}
            >
                <ContentWrapper
                    text={text}
                    icon={iconData}
                    iconSize={iconSize}
                    aria-expanded={isActive}
                />
                <ToggleArrow
                    className={b('arrow')}
                    size={TOGGLE_ARROW_SIZE}
                    type={'vertical'}
                    iconType="navigation"
                    open={isActive}
                />
            </button>

            <NavigationPopup
                open={isActive}
                onClose={hidePopup}
                items={items}
                anchorRef={anchorRef}
            />
        </>
    );
};
