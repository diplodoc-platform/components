import React from 'react';
import block from 'bem-cn-lite';

import {StageLabel, StageType} from '../StageLabel';
import {BookmarkButton} from '../BookmarkButton';

import './DocPageTitle.scss';

const b = block('dc-doc-page-title');

export interface DocPageTitleProps {
    stage?: string;
    className?: string;
    bookmarkedPage?: boolean;
    onChangeBookmarkPage?: (value: boolean) => void;
}

export const DocPageTitle: React.FC<DocPageTitleProps> = ({
    children,
    stage,
    className,
    bookmarkedPage,
    onChangeBookmarkPage,
}) => {
    const visibleStage = stage === 'tech-preview' ? 'preview' : (stage as StageType | undefined);
    const label = <StageLabel stage={visibleStage} className={b('label')} />;

    return (
        <h1 className={b(null, className)}>
            {label}
            {children}
            {typeof bookmarkedPage !== 'undefined' &&
                typeof onChangeBookmarkPage !== 'undefined' && (
                    <BookmarkButton
                        bookmarkedPage={bookmarkedPage}
                        onChangeBookmarkPage={onChangeBookmarkPage}
                    />
                )}
        </h1>
    );
};
