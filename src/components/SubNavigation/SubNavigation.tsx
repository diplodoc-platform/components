import React, { useCallback, useMemo } from 'react';

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
        <div className={b()}>
            {/* <div className={b('left')}> */}
                <button onClick={openMiniTocHandler} type='button' className={b('left')}>
                    <div className={b('icon')}>
                        <SquareListUl width={20} height={20} />
                    </div>
                    <span className={b('title')}>{title ? title : ""}</span>
                </button>
            {/* </div> */}
            {/* <div className={b('right')}> */}
                <Button onClick={shareHandler} size="xs" view='flat' className={b('button')}>
                    <Button.Icon>
                        <ArrowShapeTurnUpRight width={20} height={20} />
                    </Button.Icon>
                </Button>
            {/* </div> */}
        </div>
    );
};

export default SubNavigation;
