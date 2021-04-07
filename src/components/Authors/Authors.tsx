import React, {Fragment, ReactElement} from 'react';
import block from 'bem-cn-lite';
import {Author, Lang} from '../../models';
import {WithTranslation, withTranslation, WithTranslationProps} from 'react-i18next';

import './Authors.scss';

const b = block('authors');

const MAX_DISPLAYED_AUTHORS = 3;

export interface AuthorsProps {
    lang: Lang;
    usersMetadata: string;
}

type AuthorsInnerProps =
    & AuthorsProps
    & WithTranslation
    & WithTranslationProps;

const Authors: React.FC<AuthorsInnerProps> = (props) => {
    const {usersMetadata, lang, i18n, t} = props;

    const users = JSON.parse(usersMetadata.replace(/'/g, '"'));

    if (!users || Object.keys(users).length === 0) {
        return null;
    }

    const avatars = getAvatars(users);

    if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
    }

    return (
        <div className={b()}>
            <div className={b('title')}>{t('title')}</div>
            <div className={b('avatars-wrapper')}>{avatars}</div>
        </div>
    );
};

function getAvatars(authors: Author[]): ReactElement {
    if (authors.length === 1) {
        return getOneAvatar(authors[0]);
    }

    const displayedAuthors = [...authors];
    const hiddenAuthors = displayedAuthors.splice(MAX_DISPLAYED_AUTHORS);

    const displayedAvatars = displayedAuthors.map((author: Author) => {
        return getAvatar(author);
    });
    const hiddenAvatars = getHiddenAvatars(hiddenAuthors);

    return (
        <Fragment>
            <div className={b('avatars', {displayed: true})}>{displayedAvatars}</div>
            <div className={b('avatars', {hidden: true})}>{hiddenAvatars}</div>
        </Fragment>
    );
}

function getOneAvatar(author: Author): ReactElement {
    const fullUserName = author.name;

    const shortUserName = fullUserName
        .split(' ')
        .reduce((result, current, index) => {
            return index > 0 ? `${result} ${current.charAt(0)}.` : current;
        }, '');

    return (
        <div className={b('one_author')}>
            {getAvatar(author)}
            <div>{shortUserName}</div>
        </div>
    );
}

function getHiddenAvatars(authors: Author[]): ReactElement | null {
    const authorCount = authors.length;

    if (authorCount === 0) {
        return null;
    }

    // TODO: add logic when tooltip will be implemented

    const authorsCountString = authorCount >= 10 ? `${authorCount}+` : `+${authorCount}`;

    const hiddenAvatars = (
        <div className={b('avatar', {small: true})}>
            {authorsCountString}
        </div>
    );

    return hiddenAvatars;
}

function getAvatar(author: Author): ReactElement {
    const avatar = <img key={author.login} className={b('avatar', {small: true})} src={author.avatar}/>;
    // TODO: add logic when tooltip will be implemented

    return avatar;
}

export default withTranslation('authors')(Authors);
