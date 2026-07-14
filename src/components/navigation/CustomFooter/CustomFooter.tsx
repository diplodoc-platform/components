import type {FooterLogoConfig, FooterMenuItemConfig} from './types';
import type {FooterProps} from '@gravity-ui/navigation';

import React, {memo, useMemo} from 'react';
import {Footer, MobileFooter} from '@gravity-ui/navigation';
import block from 'bem-cn-lite';

import {mapLogo, mapMenuItems} from './utils';
import './CustomFooter.scss';

const b = block('dc-footer');

export interface CustomFooterProps extends Omit<FooterProps, 'logo' | 'menuItems' | 'copyright'> {
    copyright?: string;
    logo?: string | FooterLogoConfig;
    menuItems?: FooterMenuItemConfig[];
}

export const CustomFooter: React.FC<CustomFooterProps> = memo((props) => {
    const {copyright = '', logo: logoProp, menuItems: menuItemsProp, ...otherProps} = props;

    const logo = useMemo(() => mapLogo(logoProp), [logoProp]);
    const menuItems = useMemo(() => mapMenuItems(menuItemsProp), [menuItemsProp]);

    const footerProps: FooterProps = {
        ...otherProps,
        copyright,
        logo,
        menuItems,
    };

    return (
        <div className={b()}>
            <div className={b('desktop')}>
                <Footer {...footerProps} />
            </div>
            <div className={b('mobile')}>
                <MobileFooter {...footerProps} />
            </div>
        </div>
    );
});

CustomFooter.displayName = 'CustomFooter';
