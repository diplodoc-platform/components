import React from 'react';
import {SparklesFill} from '@gravity-ui/icons';
import {Icon} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

const b = block('dc-search-suggest');

export const AiIcon = () => {
    return (
        <span className={b('ai-icon')}>
            <Icon data={SparklesFill} size={16} />
        </span>
    );
};
