import type {MouseEvent} from 'react';
import type {NavigationComponentProps} from '@gravity-ui/page-constructor';
import type {MobileControlsProps} from '../../MobileControls/MobileControls';
import type {NavigationTocProps} from '../SidebarContent/SidebarContent';

import React, {memo, useCallback, useEffect} from 'react';
import {
    Col,
    DesktopNavigation,
    Grid,
    Row,
    useActiveNavItem,
    useShowBorder,
} from '@gravity-ui/page-constructor';
import block from 'bem-cn-lite';

import Sidebar from '../Sidebar/Sidebar';
import SidebarContent from '../SidebarContent/SidebarContent';
import {useItemsWithCustomDropdowns} from '../hooks';
import {CommonAnalyticsEvent, useAnalytics} from '../../../shared/libs/analytics';

import './CustomNavigation.scss';
import {useMainMenuOpenness, useSidebarOpenness} from './hooks';

const CLASS_NAME = 'pc-navigation';
const PC_PARANT_CLASS_NAME = 'pc-layout__navigation';

const b = block(CLASS_NAME);

export interface CustomNavigationProps extends NavigationComponentProps {
    mobileControlsData?: MobileControlsProps;
    navigationTocData: NavigationTocProps;
}

export const CustomNavigation: React.FC<CustomNavigationProps> = memo((props) => {
    const {logo, data, mobileControlsData, navigationTocData} = props;
    const {
        leftItems,
        rightItems,
        customMobileHeaderItems,
        iconSize = 20,
        withBorder = false,
        withBorderOnScroll = true,
    } = data;

    const analytics = useAnalytics();
    const [isMainMenuOpened, closeMainMenu, mainMenuOpenessData] = useMainMenuOpenness();
    const [isSidebarOpened, onSidebarOpenedChange] = useSidebarOpenness(
        isMainMenuOpened,
        closeMainMenu,
        navigationTocData,
    );

    const [showBorder] = useShowBorder(withBorder, withBorderOnScroll);

    const {activeItemId, leftItemsWithIconSize, rightItemsWithIconSize, onActiveItemChange} =
        useActiveNavItem(iconSize, leftItems, rightItems);
    const [leftItemsWithCustomDropdowns, rightItemsWithCustomDropdowns] =
        useItemsWithCustomDropdowns(leftItemsWithIconSize, rightItemsWithIconSize);

    const pcNavigationData = {
        leftItemsWithIconSize: leftItemsWithCustomDropdowns,
        rightItemsWithIconSize: rightItemsWithCustomDropdowns,
        onActiveItemChange,
    };

    const handleLogoClick = useCallback(
        (event: MouseEvent<HTMLElement>) => {
            if (!logo.url) {
                return;
            }

            const link = (event.target as HTMLElement).closest(
                `a[href='${logo.url}'][class~='pc-logo']`,
            );

            if (link) {
                analytics.track(CommonAnalyticsEvent.DOCS_HEADER_LOGO_CLICK);
            }
        },
        [analytics, logo.url],
    );

    useEffect(() => {
        if (isSidebarOpened) {
            analytics.track(CommonAnalyticsEvent.DOCS_HEADER_SANDWICH_MENU_CLICK);
        }
    }, [analytics, isSidebarOpened]);

    return (
        <Grid className={b({'with-border': showBorder}, PC_PARANT_CLASS_NAME)}>
            <Row>
                <Col>
                    <nav onClickCapture={handleLogoClick}>
                        <DesktopNavigation
                            logo={logo}
                            activeItemId={activeItemId}
                            onActiveItemChange={onActiveItemChange}
                            leftItemsWithIconSize={leftItemsWithCustomDropdowns}
                            rightItemsWithIconSize={rightItemsWithIconSize}
                            customMobileHeaderItems={customMobileHeaderItems}
                            isSidebarOpened={isSidebarOpened}
                            onSidebarOpenedChange={onSidebarOpenedChange}
                        />
                        <Sidebar isOpened={isSidebarOpened}>
                            <SidebarContent
                                mainMenuOpenessData={mainMenuOpenessData}
                                pcNavigationData={pcNavigationData}
                                navigationTocData={navigationTocData}
                                mobileControlsData={mobileControlsData}
                                className={b()}
                            />
                        </Sidebar>
                    </nav>
                </Col>
            </Row>
        </Grid>
    );
});

CustomNavigation.displayName = 'CustomNavigation';

export default CustomNavigation;
