import type {FC} from 'react';
import type {ImageProps} from '@gravity-ui/page-constructor';

import React, {useMemo} from 'react';
import {Image, block} from '@gravity-ui/page-constructor';

const b = block('content-wrapper');

export interface ContentWrapperProps {
    text: string;
    icon?: ImageProps;
    iconSize?: number;
}

export const ContentWrapper: FC<ContentWrapperProps> = (props) => {
    const {text, icon, iconSize} = props;

    const iconSizeStyle = useMemo(() => {
        return iconSize ? {height: `${iconSize}px`, width: `${iconSize}px`} : {};
    }, [iconSize]);

    return (
        <>
            {icon && typeof icon !== 'string' && (
                <Image className={b('icon')} {...icon} style={iconSizeStyle} />
            )}
            <span className={b('text')}>{text}</span>
        </>
    );
};
