import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';

import {ArrowLeft, ArrowShapeTurnUpRight, Bars, SquareListUl, Xmark} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {useTranslation} from '../../hooks';

import './SubNavigation.scss';

const b = block('dc-subnavigation');

export type ShareData = {
    title: string | undefined;
    url?: string;
};

const useVisibility = (miniTocOpened: boolean, menuOpened: boolean) => {
    const [visible, setVisibility] = useState(true);
    const [hiddingTimeout, setHiddingTimeout] = useState<number | undefined>(undefined);
    const [lastScrollY, setLastScrollY] = useState(
        typeof window === 'undefined' ? null : window.screenY,
    );

    const controlVisibility = useCallback(() => {
        if (typeof window === 'undefined') {
            return;
        }

        if (miniTocOpened || menuOpened) {
            setVisibility(true);
            return;
        }

        if (lastScrollY && lastScrollY === 0) {
            setVisibility(true);
        }

        if (lastScrollY && window.scrollY > lastScrollY) {
            if (hiddingTimeout) {
                return;
            }

            setVisibility(false);

            setHiddingTimeout(
                window.setTimeout(() => {
                    window.clearTimeout(hiddingTimeout);
                    setHiddingTimeout(undefined);
                }, 300),
            );
        } else if (lastScrollY && window.scrollY < lastScrollY) {
            setVisibility(true);
        }

        setLastScrollY(window.scrollY);
    }, [
        miniTocOpened,
        menuOpened,
        lastScrollY,
        hiddingTimeout,
        setLastScrollY,
        setVisibility,
        setHiddingTimeout,
    ]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        if (window.scrollY === 0) {
            return;
        }

        setHiddingTimeout(
            window.setTimeout(() => {
                setLastScrollY(window.scrollY);
                setHiddingTimeout(undefined);
            }, 100),
        );
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return () => {};
        }

        window.addEventListener('scroll', controlVisibility);

        return () => {
            window.removeEventListener('scroll', controlVisibility);
        };
    }, [controlVisibility]);

    return visible;
};

const useTitleView = (title: string | undefined, hideBurger: boolean) => {
    const [titleView, setTitleView] = useState<string | undefined>('');
    const [availableTitleLength, setAvailableTitleLength] = useState<number | null>(null);

    const updateAvailableLength = useCallback(() => {
        const ANOTHER_CONTENT_WIDTH = hideBurger ? 120 : 172;
        const SYMBOL_SIZE_QUOTIENT = hideBurger ? 1 / 8.5 : 1 / 7.5;

        const screenWidth = window.innerWidth;
        const avaiableWidth = screenWidth - ANOTHER_CONTENT_WIDTH;
        const avaiableLength = Math.floor(SYMBOL_SIZE_QUOTIENT * avaiableWidth) - 1;

        setAvailableTitleLength(avaiableLength);
    }, [hideBurger]);

    useEffect(() => {
        if (!title || !availableTitleLength) {
            return;
        }

        const newTitle =
            title.length > availableTitleLength
                ? title
                      .substring(0, availableTitleLength - 1)
                      .trim()
                      .concat('...')
                : title;

        setTitleView(newTitle);
    }, [title, availableTitleLength]);

    useEffect(() => {
        updateAvailableLength();

        window.addEventListener('resize', updateAvailableLength);

        return () => {
            window.removeEventListener('resize', updateAvailableLength);
        };
    }, [updateAvailableLength]);

    return titleView;
};

const useShareHandler = (title: string | undefined) => {
    const shareData = useMemo(() => {
        return {
            title,
            url: typeof window === 'undefined' ? undefined : window.location.href,
        };
    }, [title]);

    const shareHandler = useCallback(() => {
        if (navigator && navigator.share) {
            navigator
                .share(shareData)
                .then(() => {})
                .catch((error) => console.error('Error sharing', error));
        } else {
            console.log('Share not supported', shareData);
        }
    }, [shareData]);

    return shareHandler;
};

export interface SubNavigationProps {
    title: string | undefined;
    hideBurger: boolean;
    hideMiniToc: boolean;
    miniTocOpened: boolean;
    menuOpened: boolean;
    toggleMiniTocOpen: () => void;
    closeMiniToc: () => void;
    toggleMenuOpen: () => void;
    closeMenu: () => void;
}

const SubNavigation = memo(function SubNavigation({
    title,
    hideBurger,
    hideMiniToc,
    miniTocOpened,
    menuOpened,
    toggleMiniTocOpen,
    closeMiniToc,
    toggleMenuOpen,
}: SubNavigationProps) {
    const visible = useVisibility(miniTocOpened, menuOpened);
    const titleView = useTitleView(title, hideBurger);
    const shareHandler = useShareHandler(title);

    const {t} = useTranslation('subnavigation');

    return (
        <div
            className={b({
                hidden: !visible,
                visible: visible,
                invisible: hideMiniToc,
            })}
        >
            <Button
                className={b('menu-button', {invisible: hideBurger, hidden: hideMiniToc})}
                size="xl"
                view={'flat'}
                onClick={() => {
                    closeMiniToc();
                    toggleMenuOpen();
                }}
            >
                <Button.Icon>
                    {menuOpened ? (
                        <Xmark width={20} height={20} />
                    ) : (
                        <Bars width={20} height={20} />
                    )}
                </Button.Icon>
            </Button>
            <button
                className={b('left', {hidden: hideMiniToc})}
                type="button"
                onClick={
                    menuOpened
                        ? () => {
                              toggleMiniTocOpen();
                              toggleMenuOpen();
                          }
                        : toggleMiniTocOpen
                }
            >
                <div className={b('icon')}>
                    {menuOpened && hideBurger ? (
                        <ArrowLeft width={20} height={20} />
                    ) : (
                        <SquareListUl width={20} height={20} />
                    )}
                </div>
                <span className={b('title')}>
                    {menuOpened && hideBurger ? t<string>('back_title') : titleView}
                </span>
            </button>
            <Button
                className={b('button', {invisible: menuOpened && hideBurger})}
                size="xl"
                view={hideMiniToc ? 'raised' : 'flat'}
                onClick={shareHandler}
            >
                <Button.Icon>
                    <ArrowShapeTurnUpRight width={20} height={20} />
                </Button.Icon>
            </Button>
        </div>
    );
});

export default SubNavigation;
