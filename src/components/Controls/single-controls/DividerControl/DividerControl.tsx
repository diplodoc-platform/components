import React, {useContext} from 'react';
import cn from 'bem-cn-lite';

import {ControlsLayoutContext} from '../../ControlsLayout';

import './DividerControl.scss';

const b = cn('dc-divider-control');

interface DividerControlProps {
    className?: string;
}

const DividerControl: React.FC<DividerControlProps> = ({className}) => {
    const {isVerticalView, controlSize} = useContext(ControlsLayoutContext);

    return <div className={b({size: controlSize, vertical: !isVerticalView}, className)} />;
};

export default DividerControl;
