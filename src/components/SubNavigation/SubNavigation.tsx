import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {ArrowShapeTurnUpRight, SquareListUl} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import './SubNavigation.scss';

const b = block('dc-subnavigation');

export type ShareData = {
    title: string | undefined;
    url?: string;
}
export interface SubNavigationProps {
    title: string | undefined;
    // shareData: ShareData;
}

export const SubNavigation = ({
    title,
    // shareData
}: SubNavigationProps) => {
    const [visibility, setVisibility] = useState(true);
    const [hiddingInterval, setHiddingInterval] = useState<NodeJS.Timeout | undefined>(undefined);
    const [lastScrollY, setLastScrollY] = useState(window.screenY);

    const controlVisibility = useCallback(() => {
        if (lastScrollY === 0) {
            setLastScrollY(window.scrollY);
            setVisibility(true);
            return;
        }

        if (window.scrollY > lastScrollY) {
            if (hiddingInterval) {
                return;
            }

            setVisibility(false);

            setHiddingInterval(setTimeout(() => {
                clearTimeout(hiddingInterval);
                setHiddingInterval(undefined);
            }, 1000))
        } else if (window.scrollY < lastScrollY) {
            setVisibility(true);
        } else {
            return;
        }

        setLastScrollY(window.scrollY);
    }, [lastScrollY, hiddingInterval, setLastScrollY, setVisibility, setHiddingInterval]);


    useEffect(() => {
        window.addEventListener('scroll', controlVisibility);

        return () => {
            window.removeEventListener('scroll', controlVisibility);
        };
    }, [controlVisibility]);


    const shareData = useMemo(() => {
        return {
            title,
            // url: window.location.href // ?
        };
    }, [title]);

    const shareHandler = useCallback(() => {
        if (navigator && navigator.share) {
            navigator.share(shareData)
                     .then(() => {})
                     .catch((error) => console.error("Error sharing", error));
        } else {
            console.log("Share not supported", shareData); // ?
        }
    }, [shareData]);

    const openMiniTocHandler = useCallback(() => {

    }, [])

    return (
        <div className={b({ "hidden": !visibility, "visible": visibility })} >
            <button onClick={openMiniTocHandler} type='button' className={b('left')}>
                <div className={b('icon')}>
                    <SquareListUl width={20} height={20} />
                </div>
                <span className={b('title')}>{title ? title : ""}</span>
            </button>
            <Button onClick={shareHandler} size="xs" view='flat' className={b('button')}>
                <Button.Icon>
                    <ArrowShapeTurnUpRight width={20} height={20} />
                </Button.Icon>
            </Button>
        </div>
    );
};

export default SubNavigation;
