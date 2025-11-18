import type {PropsWithChildren} from 'react';
import type {StageType} from '../StageLabel';

import React from 'react';
import block from 'bem-cn-lite';

import {StageLabel} from '../StageLabel';

import './DocPageTitle.scss';

const b = block('dc-doc-page-title');

export interface DocPageTitleProps {
    stage?: string;
    className?: string;
}

export const DocPageTitle: React.FC<PropsWithChildren<DocPageTitleProps>> = ({
    children,
    stage,
    className,
}) => {
    const visibleStage = stage === 'tech-preview' ? 'preview' : (stage as StageType | undefined);
    const label = <StageLabel stage={visibleStage} className={b('label')} />;

    return (
        <h1 className={b(null, className)}>
            {label}
            {children}
        </h1>
    );
};
