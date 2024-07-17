import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {ArrowShapeTurnUpRight, SquareListUl, Bars} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import './SubNavigation.scss';

const b = block('dc-subnavigation');

export type ShareData = {
    title: string | undefined;
    url?: string;
};

const useVisibility = (miniTocOpened: boolean, closeMiniToc: () => void) => {
    const [visible, setVisibility] = useState(true);
    const [hiddingTimeout, setHiddingTimeout] = useState<number | undefined>(undefined);
    const [lastScrollY, setLastScrollY] = useState(window.screenY);

    const clickOutsideMiniToc = useCallback(
        (event: MouseEvent) => {
            /*
             * func "composedPath" returns an array in which the last two elements are "HTML" and "#document",
             * which do not have the classList property, so they are subtracted before checking by slice()
             */
            const isOutside = !event
                .composedPath()
                .slice(0, -2)
                .some((item) => {
                    const el = item as HTMLElement;
                    const classes = el.classList ?? [];

                    return classes?.contains('dc-doc-layout__right');
                });

            if (isOutside) {
                closeMiniToc();
            }
        },
        [closeMiniToc],
    );

    const controlVisibility = useCallback(() => {
        if (miniTocOpened) {
            setVisibility(true);
            return;
        }

        if (lastScrollY === 0) {
            setVisibility(true);
        }

        if (window.scrollY > lastScrollY) {
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
        } else if (window.scrollY < lastScrollY) {
            setVisibility(true);
        }

        setLastScrollY(window.scrollY);
    }, [
        miniTocOpened,
        lastScrollY,
        hiddingTimeout,
        setLastScrollY,
        setVisibility,
        setHiddingTimeout,
    ]);

    useEffect(() => {
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
        window.addEventListener('scroll', controlVisibility);

        return () => {
            window.removeEventListener('scroll', controlVisibility);
        };
    }, [controlVisibility]);

    useEffect(() => {
        document.addEventListener('click', clickOutsideMiniToc, true);

        return () => {
            document.removeEventListener('click', clickOutsideMiniToc, true);
        };
    }, [clickOutsideMiniToc]);

    return visible;
};

const useTitleView = (title: string | undefined, hideBurger: boolean) => {
    const [titleView, setTitleView] = useState<string | undefined>('');
    const [availableTitleLength, setAvailableTitleLength] = useState<number | null>(null);

    const updateAvailableLength = useCallback(() => {
        const screenWidth = window.innerWidth;

        const availableWidth = hideBurger ? screenWidth - 120 : screenWidth - 172;
        const avaiableLength = Math.floor(hideBurger ? availableWidth / 7 : availableWidth / 9) - 1;

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
                      .trimEnd()
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
            url: window.location.href,
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
    toggleMiniTocOpen: () => void;
    closeMiniToc: () => void;
}

export const SubNavigation = ({
    title,
    hideBurger,
    hideMiniToc,
    miniTocOpened,
    toggleMiniTocOpen,
    closeMiniToc,
}: SubNavigationProps) => {
    const visible = useVisibility(miniTocOpened, closeMiniToc);
    const titleView = useTitleView(
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus fuga ut ducimus unde, totam consectetur est doloribus magnam perspiciatis eum reiciendis, officia inventore nesciunt sequi? Dolores mollitia, officiis sit quam rerum obcaecati sequi veritatis esse eos sint pariatur illo dolore cupiditate architecto labore. Explicabo totam, dolorum officia soluta veritatis iusto perspiciatis at doloribus repellat labore atque assumenda aspernatur praesentium. Labore eos officia, aperiam commodi quod veritatis quam omnis perferendis deserunt beatae ut quas, tempore velit ad sit cum veniam rem minus id quia eum consequatur illum. Ipsum blanditiis hic maiores veritatis facere tenetur repudiandae quibusdam, voluptatum, inventore ducimus amet? Inventore.',
        hideBurger,
    );
    const shareHandler = useShareHandler(title);

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
                onClick={() => {}}
            >
                <Button.Icon>
                    <Bars width={20} height={20} />
                </Button.Icon>
            </Button>
            <button
                className={b('left', {hidden: hideMiniToc})}
                type="button"
                onClick={toggleMiniTocOpen}
            >
                <div className={b('icon')}>
                    <SquareListUl width={20} height={20} />
                </div>
                <span className={b('title')}>{titleView}</span>
            </button>
            <Button
                className={b('button')}
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
};

export default SubNavigation;
