import React from 'react';
import {Mark, MarkColor} from '../Mark';

export type StageType = 'preview' | 'new';

export interface StageLabelProps {
    stage?: StageType;
    size?: 's' | 'm';
    className?: string;
}

const colorByStage: Record<StageType, MarkColor> = {
    preview: 'blue',
    new: 'green',
};
const possibleStages = Object.keys(colorByStage);

export const StageLabel: React.FC<StageLabelProps> = ({stage, size = 's', className}) => {
    if (!(stage && possibleStages.includes(stage))) {
        return null;
    }

    const color = colorByStage[stage];

    return <Mark className={className} text={stage} color={color} size={size} />;
};
