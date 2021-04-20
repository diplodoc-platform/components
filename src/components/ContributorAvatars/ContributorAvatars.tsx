import React, {Fragment, ReactElement} from 'react';
import block from 'bem-cn-lite';

import {Contributor, Vcs} from '../../models';
import GithubIcon from '../../../assets/icons/github.svg';
import ArcanumIcon from '../../../assets/icons/arcanum.svg';

import './ContributorAvatars.scss';

const b = block('contributor-icons');

const MAX_DISPLAYED_AUTHORS = 3;
const LOWER_BOUND_MORE_AUTHORS = 10;

export interface ContributorAvatarsProps {
    contributors: Contributor[];
    vcsType?: Vcs;
    isAuthor?: boolean;
}

const ContributorAvatars: React.FC<ContributorAvatarsProps> = (props) => {
    const {contributors, vcsType, isAuthor} = props;

    if (!contributors || contributors.length === 0) {
        return null;
    }

    const avatars = getAvatars(contributors, isAuthor, vcsType);

    return (
        <div className={b('avatars-wrapper')}>{avatars}</div>
    );
};

function getAvatars(authors: Contributor[], isAuthor = false, vcsType?: Vcs): ReactElement {
    if (authors.length === 1) {
        return getOneAvatar(authors[0], isAuthor, vcsType);
    }

    const displayedAuthors = [...authors];
    const hiddenAuthors = displayedAuthors.splice(MAX_DISPLAYED_AUTHORS);

    const displayedAvatars = displayedAuthors.map((author: Contributor) => {
        return getAvatar(author, vcsType);
    });
    const hiddenAvatars = getHiddenAvatars(hiddenAuthors);

    return (
        <Fragment>
            <div className={b('displayed_avatars')}>{displayedAvatars}</div>
            <div className={b('hidden_avatars')}>{hiddenAvatars}</div>
        </Fragment>
    );
}

function getOneAvatar(author: Contributor, isAuthor: boolean, vcsType?: Vcs): ReactElement {
    const userName = isAuthor
        ? author.name
        : getShortUserName(author.name);

    return (
        <div className={b('one_author')}>
            {getAvatar(author, vcsType)}
            <div>{userName}</div>
        </div>
    );
}

function getShortUserName(fullUserName: string): string {
    return fullUserName
        .split(' ')
        .reduce((result, current, index) => {
            return index > 0 ? `${result} ${current.charAt(0)}.` : current;
        }, '');
}

function getHiddenAvatars(authors: Contributor[]): ReactElement | null {
    const authorCount = authors.length;

    if (authorCount === 0) {
        return null;
    }

    // TODO: add logic when tooltip will be implemented

    const authorsCountString = authorCount >= LOWER_BOUND_MORE_AUTHORS
        ? `${authorCount}+`
        : `+${authorCount}`;

    const hiddenAvatars = (
        <div className={b('avatar', {size: 'small'})}>
            {authorsCountString}
        </div>
    );

    return hiddenAvatars;
}

function getAvatar(author: Contributor, vcsType?: Vcs): ReactElement {
    if (!author.avatar) {
        return getDefaultIcon(author.login, vcsType);
    }

    const avatar = <img key={author.login} className={b('avatar', {size: 'small'})} src={author.avatar}/>;
    // TODO: add logic when tooltip will be implemented

    return avatar;
}

function getDefaultIcon(key: string, vcsType?: Vcs) {
    const className = b('avatar', {size: 'small', type: vcsType});

    const defaultIcon = vcsType === Vcs.Arcanum
        ? <ArcanumIcon/>
        : <GithubIcon/>;

    return (
        <div className={className} key={key}>{defaultIcon}</div>
    );
}

export default ContributorAvatars;
