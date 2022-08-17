import React from 'react';
import block from 'bem-cn-lite';

import {Button, Icon as IconComponent} from '@yandex-cloud/uikit';

import StarActive from '../../../assets/icons/star-active.svg';
import StarInactive from '../../../assets/icons/star-inactive.svg';

import './BookmarkButton.scss';

const b = block('dc-bookmark-button');

export interface BookmarkButtonProps {
    className?: string;
    bookmarkedPage: boolean;
    onChangeBookmarkPage: (value: boolean) => void;
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
    bookmarkedPage,
    onChangeBookmarkPage,
}) => {
    return (
        <Button
            className={b({active: bookmarkedPage})}
            onClick={() => {
                onChangeBookmarkPage(!bookmarkedPage);
            }}
            view="flat-secondary"
        >
            <Button.Icon className={b('icon')}>
                <IconComponent data={bookmarkedPage ? StarActive : StarInactive} size={24} />
            </Button.Icon>
        </Button>
    );
};
