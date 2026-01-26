import type {MouseEvent, PropsWithChildren} from 'react';
import type {ClassNameProps} from '../../../models/index';
import type {MobileControlsProps} from '../../MobileControls/MobileControls';

import React, {useCallback} from 'react';
import {Bars, Xmark} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import Sidebar from '../Sidebar/Sidebar';
import SidebarContent from '../SidebarContent/SidebarContent';

import './SidebarNavigation.scss';

const b = block('dc-sidebar-navigation');

export interface SidebarNavigationProps extends ClassNameProps {
    isSidebarOpened: boolean;
    onSidebarOpenedChange: (isOpened: boolean) => void;
    mobileControlsData?: MobileControlsProps;
}

const SidebarNavigation: React.FC<SidebarNavigationProps & PropsWithChildren> = ({
    isSidebarOpened,
    onSidebarOpenedChange,
    mobileControlsData,
    children,
    className,
}) => {
    const toggle = useCallback(
        (e: MouseEvent) => {
            e.nativeEvent.stopImmediatePropagation();
            onSidebarOpenedChange(!isSidebarOpened);
        },
        [isSidebarOpened, onSidebarOpenedChange],
    );

    return (
        <div className={b()}>
            <Button className={b('button', className)} onClick={toggle} view={'flat'} size="xl">
                <Button.Icon>
                    {isSidebarOpened ? (
                        <Xmark width={20} height={20} />
                    ) : (
                        <Bars width={20} height={20} />
                    )}
                </Button.Icon>
            </Button>
            <Sidebar isOpened={isSidebarOpened}>
                <SidebarContent mobileControlsData={mobileControlsData}>
                    <nav className={b('navigation')}>{children}</nav>
                </SidebarContent>
            </Sidebar>
        </div>
    );
};

export default SidebarNavigation;
