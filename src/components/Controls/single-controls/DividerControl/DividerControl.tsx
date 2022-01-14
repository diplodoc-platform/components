import React from 'react';
import cn from 'bem-cn-lite';

import {ControlSizes} from '../../../../models';

import './DividerControl.scss';

const b = cn('dc-divider-control');

interface DividerControlProps {
    size?: ControlSizes;
    className?: string;
    isVerticalView?: boolean;
}

const DividerControl = ({
    size = ControlSizes.S,
    className,
    isVerticalView = true,
}: DividerControlProps) => {
    return <div className={b({size, vertical: isVerticalView}, className)} />;
};

export default DividerControl;
