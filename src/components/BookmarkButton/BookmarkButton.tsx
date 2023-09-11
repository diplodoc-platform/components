import StarActive from '@gravity-ui/icons/svgs/star-fill.svg';
import StarInactive from '@gravity-ui/icons/svgs/star.svg';
import {Button, Icon} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React from 'react';

import './BookmarkButton.scss';

const b = block('dc-bookmark-button');

export interface BookmarkButtonProps {
    className?: string;
    isBookmarked: boolean;
    onBookmark: (value: boolean) => void;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({isBookmarked, onBookmark}) => {
    return (
        <Button
            className={b({active: isBookmarked})}
            onClick={() => {
                onBookmark(!isBookmarked);
            }}
            view="flat-secondary"
        >
            <Button.Icon className={b('icon')}>
                <Icon data={isBookmarked ? StarActive : StarInactive} size={24} />
            </Button.Icon>
        </Button>
    );
};
