import React, {Fragment, ReactElement} from 'react';
import block from 'bem-cn-lite';

import { Contributor } from '../../models';

import './ContributorAvatars.scss';

const b = block('contributor-icons');

const MAX_DISPLAYED_CONTRIBUTORS = 3;
const LOWER_BOUND_MORE_CONTRIBUTORS = 9;

export interface ContributorAvatarsProps {
    contributors: Contributor[];
    isAuthor?: boolean;
}

const ContributorAvatars: React.FC<ContributorAvatarsProps> = (props) => {
    const { contributors, isAuthor } = props;

    if (!contributors || contributors.length === 0) {
        return null;
    }

    const avatars = getAvatars(contributors, isAuthor);

    return (
        <div className={b('avatars-wrapper')}>{avatars}</div>
    );
};

function getAvatars(contributors: Contributor[], isAuthor = false): ReactElement {
    if (contributors.length === 1) {
        return getOneAvatar(contributors[0], isAuthor);
    }

    const displayedContributors = [...contributors];
    const hiddenContributors = displayedContributors.splice(MAX_DISPLAYED_CONTRIBUTORS);

    const displayedAvatars = displayedContributors.map((contributor: Contributor) => {
        return getAvatar(contributor);
    });
    const hiddenAvatars = getHiddenAvatars(hiddenContributors);

    return (
        <Fragment>
            <div className={b('displayed_avatars')}>{displayedAvatars}</div>
            <div className={b('hidden_avatars')}>{hiddenAvatars}</div>
        </Fragment>
    );
}

function getOneAvatar(contributor: Contributor, isAuthor: boolean): ReactElement {
    const contributorName = isAuthor
        ? contributor.name
        : getShortContributorName(contributor.name);

    return (
        <div className={b('one_contributor')}>
            {getAvatar(contributor)}
            <div>{contributorName}</div>
        </div>
    );
}

function getShortContributorName(fullContributorName: string): string {
    return fullContributorName
        .split(' ')
        .reduce((result, current, index) => {
            return index > 0 ? `${result} ${current.charAt(0)}.` : current;
        }, '');
}

function getHiddenAvatars(contributors: Contributor[]): ReactElement | null {
    const contributorsCount = contributors.length;

    if (contributorsCount === 0) {
        return null;
    }

    // TODO: add logic when tooltip will be implemented

    const contributorsCountString = contributorsCount > LOWER_BOUND_MORE_CONTRIBUTORS
        ? `${LOWER_BOUND_MORE_CONTRIBUTORS}+`
        : `+${contributorsCount}`;

    const hiddenAvatars = (
        <div className={b('avatar', {size: 'small'})}>
            {contributorsCountString}
        </div>
    );

    return hiddenAvatars;
}

function getAvatar(contributor: Contributor): ReactElement {
    const { avatar, name, login } = contributor;

    let avatarImg = avatar
        ? <img key={login} className={b('avatar', { size: 'small' })} src={avatar} />
        : <div key={login} className={b('avatar', { size: 'small', default: true })}>{getInitials(name || login)}</div>;

    // TODO: add logic when tooltip will be implemented

    return avatarImg;
}

function getInitials(name: string) {
    return name.charAt(0).toUpperCase();
}

export default ContributorAvatars;
