import React, {Fragment, ReactElement} from 'react';
import block from 'bem-cn-lite';

import {Contributor, Vcs} from '../../models';
import GithubIcon from '../../../assets/icons/github.svg';
import ArcanumIcon from '../../../assets/icons/arcanum.svg';

import './ContributorAvatars.scss';

const b = block('contributor-icons');

const MAX_DISPLAYED_CONTRIBUTORS = 3;
const LOWER_BOUND_MORE_CONTRIBUTORS = 9;

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

function getAvatars(contributors: Contributor[], isAuthor = false, vcsType?: Vcs): ReactElement {
    if (contributors.length === 1) {
        return getOneAvatar(contributors[0], isAuthor, vcsType);
    }

    const displayedContributors = [...contributors];
    const hiddenContributors = displayedContributors.splice(MAX_DISPLAYED_CONTRIBUTORS);

    const displayedAvatars = displayedContributors.map((contributor: Contributor) => {
        return getAvatar(contributor, vcsType);
    });
    const hiddenAvatars = getHiddenAvatars(hiddenContributors);

    return (
        <Fragment>
            <div className={b('displayed_avatars')}>{displayedAvatars}</div>
            <div className={b('hidden_avatars')}>{hiddenAvatars}</div>
        </Fragment>
    );
}

function getOneAvatar(contributor: Contributor, isAuthor: boolean, vcsType?: Vcs): ReactElement {
    const contributorName = isAuthor
        ? contributor.name
        : getShortContributorName(contributor.name);

    return (
        <div className={b('one_contributor')}>
            {getAvatar(contributor, vcsType)}
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

function getAvatar(contributor: Contributor, vcsType?: Vcs): ReactElement {
    if (!contributor.avatar) {
        return getDefaultIcon(contributor.login, vcsType);
    }

    const avatar = <img key={contributor.login} className={b('avatar', {size: 'small'})} src={contributor.avatar}/>;
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
