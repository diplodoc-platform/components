import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';

import {ArrowShapeTurnUpRight, Bars, SquareListUl, Xmark} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

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

        const scrollY = window.scrollY;

        if (lastScrollY === null) {
            setLastScrollY(scrollY);
            return;
        }

        if (miniTocOpened || menuOpened) {
            setVisibility(true);
            return;
        }

        if (scrollY - lastScrollY > -25 && scrollY - lastScrollY < 25) {
            return;
        }

        if (lastScrollY === 0) {
            setVisibility(true);
        }

        console.log('block start');
        console.log('scrollY', scrollY);
        console.log('lastScrollY', lastScrollY);
        console.log('hiddingTimeout', hiddingTimeout);

        if (scrollY > lastScrollY) {
            if (hiddingTimeout) {
                console.log('return');

                return;
            }

            setVisibility(false);

            setHiddingTimeout(
                window.setTimeout(() => {
                    window.clearTimeout(hiddingTimeout);
                    setHiddingTimeout(undefined);
                }, 300),
            );
        } else if (scrollY < lastScrollY) {
            setVisibility(true);
        }

        setLastScrollY(scrollY);
    }, [miniTocOpened, menuOpened, lastScrollY, hiddingTimeout]);

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

const useOpenMiniTocHandler = (
    menuOpened: boolean,
    hideBurger: boolean,
    toggleMenuOpen: () => void,
    toggleMiniTocOpen: () => void,
) => {
    const handle = useCallback(
        (event: React.MouseEvent) => {
            event.stopPropagation();

            if (!menuOpened) {
                return toggleMiniTocOpen();
            }

            return hideBurger
                ? () => {
                      console.log('back to main menu');
                      toggleMenuOpen();
                  }
                : () => {
                      toggleMiniTocOpen();
                      toggleMenuOpen();
                  };
        },
        [menuOpened, hideBurger, toggleMenuOpen, toggleMiniTocOpen],
    );

    return handle;
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
    const openMiniTocHandler = useOpenMiniTocHandler(
        menuOpened,
        hideBurger,
        toggleMenuOpen,
        toggleMiniTocOpen,
    );

    const menuButton = (
        <Button
            className={b('menu-button', {invisible: hideBurger})}
            size="xl"
            view={'flat'}
            onClick={() => {
                closeMiniToc();
                toggleMenuOpen();
            }}
        >
            <Button.Icon>
                {menuOpened ? <Xmark width={20} height={20} /> : <Bars width={20} height={20} />}
            </Button.Icon>
        </Button>
    );

    const miniTocButton = (
        <button
            className={b('mini-toc-button', {
                hidden: hideMiniToc && hideBurger,
                disabled: menuOpened || hideMiniToc,
                label: hideMiniToc,
            })}
            type="button"
            disabled={menuOpened || hideMiniToc}
            onClick={hideMiniToc ? () => {} : openMiniTocHandler}
        >
            {!hideMiniToc && (
                <div className={b('icon')}>
                    <SquareListUl width={20} height={20} />
                </div>
            )}
            <span className={b('title')}>{titleView}</span>
        </button>
    );

    const shareButton = (
        <Button
            className={b('share-button', {invisible: menuOpened && hideBurger})}
            size="xl"
            view={hideMiniToc && hideBurger ? 'raised' : 'flat'}
            onClick={shareHandler}
        >
            <Button.Icon>
                <ArrowShapeTurnUpRight width={20} height={20} />
            </Button.Icon>
        </Button>
    );

    return (
        <div
            className={b({
                invisible: !visible && (!hideMiniToc || !hideBurger),
                visible: visible,
                hidden: hideMiniToc && hideBurger,
            })}
        >
            {menuButton}
            {miniTocButton}
            {shareButton}
        </div>
    );
});

export default SubNavigation;
