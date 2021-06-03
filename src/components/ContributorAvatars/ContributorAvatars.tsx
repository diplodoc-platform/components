import block from 'bem-cn-lite';
import React, {Fragment, ReactElement} from 'react';

import {Contributor} from '../../models';
import {getName} from './utils';
import {AvatarData, AvatarSizes} from './models';
import HiddenAvatars from './Avatars/HiddenAvatars';
import AvatarWithDescription from './Avatars/AvatarWithDescription';
import Link from '../Link';
import Avatar from './Avatars/Avatar';

import './ContributorAvatars.scss';

const b = block('contributor-avatars');

const MAX_DISPLAYED_CONTRIBUTORS = 3;

export interface ContributorAvatarsProps {
    contributors: Contributor[];
    isAuthor?: boolean;
    onlyAuthor?: boolean;
}

const ContributorAvatars: React.FC<ContributorAvatarsProps> = (props) => {
    const {contributors, isAuthor = false, onlyAuthor = false} = props;

    if (!contributors || contributors.length === 0) {
        return null;
    }

    if (contributors.length === 1) {
        const oneAvatar = getOneAvatar(contributors[0], isAuthor, onlyAuthor);
        return oneAvatar;
    }

    const displayedContributors = [...contributors];
    const hiddenContributors = displayedContributors.splice(MAX_DISPLAYED_CONTRIBUTORS);

    const displayedAvatars = displayedContributors.map((contributor: Contributor) => {
        const {url, login, email} = contributor;
        return (
            <Link key={`displayed-contributors-${login || email}`} url={url}>
                <AvatarWithDescription contributor={contributor} avatarSize={AvatarSizes.SMALL}/>
            </Link>
        );
    });

    const hiddenAvatars = <HiddenAvatars contributors={hiddenContributors} avatarsSize={AvatarSizes.SMALL}/>;

    const avatars = (
        <Fragment>
            <div className={b('displayed_avatars')}>{displayedAvatars}</div>
            <div className={b('hidden_avatars')}>{hiddenAvatars}</div>
        </Fragment>
    );

    return avatars;
};

function getOneAvatar(contributor: Contributor, isAuthor: boolean, onlyAuthor: boolean): ReactElement {
    const avatarData: AvatarData = {
        contributor,
        size: AvatarSizes.SMALL,
    };

    const wrapperModifiers = isAuthor ? {onlyAuthor} : {};

    return (
        <div className={b('one_contributor', wrapperModifiers)}>
            <div className={'desktop'}>{getRedirectingAvatar(avatarData, contributor.url)} </div>
            <div className={'mobile'}>
                {
                    isAuthor && onlyAuthor
                        ? getRedirectingAvatar(avatarData, contributor.url, true)
                        : <AvatarWithDescription contributor={contributor} avatarSize={AvatarSizes.SMALL}/>
                }
            </div>
            <div>{getName(contributor, isAuthor)}</div>
        </div>
    );
}

function getRedirectingAvatar(avatarData: AvatarData, url: string, isRedirect = false) {
    return (
        <Link url={url}>
            <Avatar avatarData={avatarData} isRedirect={isRedirect}/>
        </Link>
    );
}

export default ContributorAvatars;
