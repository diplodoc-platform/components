import React from 'react';
import {ArrowShapeTurnUpRight} from '@gravity-ui/icons';
import {Button, ButtonSize, ButtonView} from '@gravity-ui/uikit';

import {useShareHandler} from '../../hooks';
import {ClassNameProps} from '../../models';

const ICON_SIZE = {
    width: 24,
    height: 24,
};

type IconSize = {
    width: number;
    height: number;
};

export interface ShareButtonProps extends ClassNameProps {
    title: string;
    iconSize?: IconSize;
    size?: ButtonSize;
    view?: ButtonView;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
    title,
    iconSize = ICON_SIZE,
    size = 'm',
    view = 'flat-secondary',
    className,
}) => {
    const shareHandler = useShareHandler(title);

    return (
        <Button className={className} size={size} view={view} onClick={shareHandler}>
            <Button.Icon>
                <ArrowShapeTurnUpRight {...iconSize} />
            </Button.Icon>
        </Button>
    );
};
