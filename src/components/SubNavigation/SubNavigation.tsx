import React, {useCallback, useEffect, useMemo, useState} from 'react';

import {ArrowShapeTurnUpRight, SquareListUl} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import './SubNavigation.scss';

const b = block('dc-subnavigation');

export type ShareData = {
    title: string | undefined;
    url?: string;
};

const useVisibility = (miniTocOpened: boolean, closeMiniToc: () => void) => {
    const [visibility, setVisibility] = useState(true);
    const [hiddingTimeout, setHiddingTimeout] = useState<number | undefined>(undefined);
    const [lastScrollY, setLastScrollY] = useState(window.screenY);

    const clickOutsideMiniToc = useCallback(
        (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();

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

    return visibility;
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
    hideMiniToc: boolean;
    miniTocOpened: boolean;
    toggleMiniTocOpen: () => void;
    closeMiniToc: () => void;
}

export const SubNavigation = ({
    title,
    hideMiniToc,
    miniTocOpened,
    toggleMiniTocOpen,
    closeMiniToc,
}: SubNavigationProps) => {
    const visibility = useVisibility(miniTocOpened, closeMiniToc);
    const shareHandler = useShareHandler(title);

    return (
        <div
            className={b({
                hidden: !visibility,
                visible: visibility,
                invisible: hideMiniToc,
            })}
        >
            <button
                className={b('left', {hidden: hideMiniToc})}
                type="button"
                onClick={toggleMiniTocOpen}
            >
                <div className={b('icon')}>
                    <SquareListUl width={20} height={20} />
                </div>
                <span className={b('title')}>
                    {title && title.length > 30
                        ? title.substring(0, 30).trimEnd().concat('...')
                        : title ?? ''}
                </span>
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
