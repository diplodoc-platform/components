import React, {memo, useCallback, useRef, useState} from 'react';
import {ArrowShapeTurnUpRight, SquareListUl} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {DocHeadingItem, Router, TocData} from '../../models';
import {Toc} from '../Toc';
import {SidebarNavigation} from '../navigation';
import {MobileControlsProps} from '../MobileControls';
import {MiniToc} from '../MiniToc';
import {OutsideClick} from '../OutsideClick';

import {useMiniTocData, useShareHandler, useVisibility} from './hooks';
import './SubNavigation.scss';

const b = block('dc-subnavigation');

const ICON_SIZE = {
    width: 20,
    height: 20,
};

export interface SubNavigationProps {
    router: Router;
    toc: TocData;
    keyDOM: number;
    pageTitle: string | undefined;
    headings: DocHeadingItem[];
    headerHeight?: number;
    mobileControlsData: MobileControlsProps;
    hideMiniToc: boolean;
    hideBurger: boolean;
    hideTocHeader?: boolean;
    onMiniTocItemClick?: (event: MouseEvent) => void;
}

const SubNavigation = memo(
    ({
        pageTitle = '',
        router,
        toc,
        keyDOM,
        headings,
        mobileControlsData,
        headerHeight,
        hideMiniToc,
        hideBurger,
        hideTocHeader,
        onMiniTocItemClick,
    }: SubNavigationProps) => {
        const ref = useRef<HTMLDivElement>(null);

        const [menuOpen, setMenuOpen] = useState(false);
        const [visible, setVisibility] = useVisibility(menuOpen);
        const {
            miniTocOpen,
            activeMiniTocTitle,
            closeMiniToc,
            miniTocHandler,
            onItemClick,
            onActiveItemTitleChange,
        } = useMiniTocData(pageTitle, hideMiniToc, menuOpen, setVisibility, onMiniTocItemClick);
        const shareHandler = useShareHandler(pageTitle, router);

        const onSidebarOpenedChange = useCallback(() => {
            closeMiniToc();
            setMenuOpen(!menuOpen);
        }, [menuOpen, closeMiniToc]);

        const menuButton = !hideBurger && (
            <SidebarNavigation
                isSidebarOpened={menuOpen}
                onSidebarOpenedChange={onSidebarOpenedChange}
                mobileControlsData={mobileControlsData}
            >
                <div className={b('toc')}>
                    <Toc
                        {...toc}
                        router={router}
                        headerHeight={headerHeight}
                        hideTocHeader={hideTocHeader}
                    />
                </div>
            </SidebarNavigation>
        );

        const miniTocButton = (
            <button
                className={b('mini-toc-button', {
                    disabled: menuOpen || hideMiniToc,
                    center: hideMiniToc && hideBurger,
                    label: hideMiniToc,
                })}
                type={'button'}
                disabled={menuOpen || hideMiniToc}
                onClick={miniTocHandler}
            >
                {!hideMiniToc && (
                    <div className={b('icon')}>
                        <SquareListUl {...ICON_SIZE} />
                    </div>
                )}
                <span
                    className={b('title', {
                        label: hideMiniToc,
                    })}
                >
                    {activeMiniTocTitle}
                </span>
            </button>
        );

        const shareButton = (
            <Button
                className={b('share-button', {
                    invisible: menuOpen && hideBurger,
                    absolute: hideMiniToc && hideBurger,
                })}
                size={'xl'}
                view={'flat'}
                onClick={shareHandler}
            >
                <Button.Icon>
                    <ArrowShapeTurnUpRight {...ICON_SIZE} />
                </Button.Icon>
            </Button>
        );

        const miniToc = !hideMiniToc && (
            <div ref={ref} className={b('mini-toc', {open: miniTocOpen})}>
                <MiniToc
                    headings={headings}
                    router={router}
                    headerHeight={headerHeight}
                    key={keyDOM}
                    onItemClick={onItemClick}
                    onActiveItemTitleChange={onActiveItemTitleChange}
                />
            </div>
        );

        return (
            <OutsideClick className={b('wrapper')} anchor={ref} onOutsideClick={closeMiniToc}>
                <div
                    ref={ref}
                    className={b({
                        invisible: !visible,
                        visible: visible,
                    })}
                >
                    {menuButton}
                    {miniTocButton}
                    {shareButton}
                </div>
                {!hideMiniToc && miniToc}
            </OutsideClick>
        );
    },
);

SubNavigation.displayName = 'SubNavigation';

export default SubNavigation;
