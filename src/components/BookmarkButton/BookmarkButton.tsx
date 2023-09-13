import React from 'react';

import {Star, StarFill} from '@gravity-ui/icons';
import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import './BookmarkButton.scss';

const b = block('dc-bookmark-button');

export interface BookmarkButtonProps {
    className?: string;
    isBookmarked: boolean;
    onBookmark: (value: boolean) => void;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({isBookmarked, onBookmark}) => {
    const Icon = isBookmarked ? StarFill : Star;

    return (
        <Button
            className={b({active: isBookmarked})}
            onClick={() => {
                onBookmark(!isBookmarked);
            }}
            view="flat-secondary"
        >
            <Button.Icon className={b('icon')}>
                <Icon width={24} height={24} />
            </Button.Icon>
        </Button>
    );
};
