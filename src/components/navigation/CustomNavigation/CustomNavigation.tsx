import React, {memo} from 'react';
import {
    Col,
    DesktopNavigation,
    Grid,
    NavigationComponentProps,
    Row,
    useActiveNavItem,
    useShowBorder,
} from '@gravity-ui/page-constructor';
import block from 'bem-cn-lite';

import {MobileControlsProps} from '../../MobileControls/MobileControls';
import Sidebar from '../Sidebar/Sidebar';
import SidebarContent, {NavigationTocProps} from '../SidebarContent/SidebarContent';
import {useItemsWithCustomDropdowns} from '../hooks';

import './CustomNavigation.scss';
import {useMainMenuOpenness, useSidebarOpenness} from './hooks';

const CLASS_NAME = 'pc-navigation';
const PC_PARANT_CLASS_NAME = 'pc-layout__navigation';

const b = block(CLASS_NAME);

export interface CustomNavigationProps extends NavigationComponentProps {
    mobileControlsData?: MobileControlsProps;
    navigationTocData: NavigationTocProps;
}

export const CustomNavigation: React.FC<CustomNavigationProps> = memo(
    ({logo, data, mobileControlsData, navigationTocData}) => {
        const {
            leftItems,
            rightItems,
            customMobileHeaderItems,
            iconSize = 20,
            withBorder = false,
            withBorderOnScroll = true,
        } = data;

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

        return (
            <Grid className={b({'with-border': showBorder}, PC_PARANT_CLASS_NAME)}>
                <Row>
                    <Col>
                        <nav>
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
    },
);

CustomNavigation.displayName = 'CustomNavigation';

export default CustomNavigation;
