import React, {MouseEvent, memo, useCallback, useRef, useState} from 'react';
import {SquareListUl} from '@gravity-ui/icons';
import block from 'bem-cn-lite';

import {useInterface} from '../../hooks/useInterface';
import {DocHeadingItem, Router, TocData} from '../../models';
import {Toc} from '../Toc';
import {SidebarNavigation} from '../navigation';
import {MobileControlsProps} from '../MobileControls';
import {MiniToc} from '../MiniToc';
import {OutsideClick} from '../OutsideClick';
import {ShareButton} from '../ShareButton';

import {useMiniTocData, useVisibility} from './hooks';
import './SubNavigation.scss';
import {useHeadingIntersectionObserver} from './hooks/useHeadingIntersectionObserver';

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
        const isTocHidden = useInterface('toc');

        const [menuOpen, setMenuOpen] = useState(false);
        const {miniTocOpen, closeMiniToc, miniTocHandler} = useMiniTocData(hideMiniToc, menuOpen);
        const [visible, setVisibility] = useVisibility(menuOpen, miniTocOpen);

        const {flatHeadings, activeHeading} = useHeadingIntersectionObserver({
            headings,
        });

        const onItemClick = useCallback(
            (event: MouseEvent) => {
                if (onMiniTocItemClick) {
                    onMiniTocItemClick(event);
                }

                setTimeout(() => {
                    setVisibility(false);
                    closeMiniToc();
                }, 0);
            },
            [setVisibility, closeMiniToc, onMiniTocItemClick],
        );

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
                {!isTocHidden && (
                    <div className={b('toc')}>
                        <Toc
                            {...toc}
                            router={router}
                            headerHeight={headerHeight}
                            hideTocHeader={hideTocHeader}
                        />
                    </div>
                )}
            </SidebarNavigation>
        );

        const shareButton = (
            <ShareButton
                size={'xl'}
                view={'flat'}
                iconSize={ICON_SIZE}
                className={b('share-button', {
                    invisible: menuOpen && hideBurger,
                })}
                title={pageTitle}
            />
        );

        const navContent = (
            <button
                className={b('mini-toc-button', {
                    disabled: menuOpen || hideMiniToc,
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
                <span className={b('title', {single: true})}>
                    {activeHeading?.title ?? pageTitle}
                </span>
            </button>
        );

        const miniToc = !hideMiniToc && (
            <div ref={ref} className={b('mini-toc', {open: miniTocOpen})}>
                <MiniToc
                    key={keyDOM}
                    headings={flatHeadings}
                    activeHeading={activeHeading}
                    onItemClick={onItemClick}
                />
            </div>
        );

        return (
            <OutsideClick className={b('wrapper')} anchor={ref} onOutsideClick={closeMiniToc}>
                <div
                    ref={ref}
                    className={b({
                        invisible: !visible,
                        visible: !hideMiniToc && visible,
                        hidden: hideMiniToc && hideBurger,
                    })}
                >
                    {menuButton}
                    {navContent}
                    {shareButton}
                </div>
                {!hideMiniToc && miniToc}
            </OutsideClick>
        );
    },
);

SubNavigation.displayName = 'SubNavigation';

export default SubNavigation;
