import React, {Fragment} from 'react';
import block from 'bem-cn-lite';
import {Author} from '../../models';

import './Authors.scss';

const b = block('authors');

const MAX_NUMBER_DISPLAYED_AUTHORS = 3;

export interface AuthorsProps {
    title: string;
    usersMetadata: string;
}

export const Authors: React.FC<AuthorsProps> = (props) => {
    const {title, usersMetadata} = props;

    const users = JSON.parse(usersMetadata.replace(/'/g, '"'));

    if (!users || Object.keys(users).length === 0) {
        return null;
    }

    const avatars = getAvatars(users);

    return (
        <div className={b()}>
            <div className={b('title')}>{title}</div>
            <div className={b('avatars')}>{avatars}</div>
        </div>
    );
};

function getAvatars(authors: Author[]) {
    if (authors.length === 1) {
        return getOneAvatar(authors[0]);
    }

    const displayedAvatars: JSX.Element[] = [];

    authors.forEach((author: Author, id: number) => {
        if (id < MAX_NUMBER_DISPLAYED_AUTHORS) {
            displayedAvatars.push(getAvatar(author));
        }
    });

    const hiddenAvatars = getHiddenAvatars(authors.slice(MAX_NUMBER_DISPLAYED_AUTHORS));

    return (
        <Fragment>
            <div className={b('displayed_avatars')}>{displayedAvatars}</div>
            <div className={b('hidden_avatars')}>{hiddenAvatars}</div>
        </Fragment>
    );
}

function getOneAvatar(author: Author) {
    const fullUserName = author.name;

    const shortUserName = fullUserName
        .split(' ')
        .reduce((result, current, id) => {
            return id > 0 ? `${result} ${current.charAt(0)}.` : current;
        }, '');

    return (
        <div className={b('one_author')}>
            {getAvatar(author)}
            <div>{shortUserName}</div>
        </div>
    );
}

function getHiddenAvatars(authors: Author[]): JSX.Element | null {
    const authorCount = authors.length;

    if (authorCount === 0) {
        return null;
    }

    // TODO: add logic when tooltip will be implemented

    const hiddenAvatars = (
        <div className={b('small_avatar')}>
            {`+${authorCount}`}
        </div>
    );

    return hiddenAvatars;
}

function getAvatar(author: Author): JSX.Element {
    const avatar = <img key={author.login} className={b('small_avatar')} src={author.avatar}/>;
    // TODO: add logic when tooltip will be implemented

    return avatar;
}
