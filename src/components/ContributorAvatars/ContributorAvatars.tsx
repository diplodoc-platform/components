import block from 'bem-cn-lite';
import React, {Fragment, ReactElement} from 'react';

import {Contributor} from '../../models';
import {getName} from './utils';

import './ContributorAvatars.scss';
import {AvatarSizes} from './models';
import HiddenAvatars from './Avatars/HiddenAvatars';
import AvatarWithDescription from './Avatars/AvatarWithDescription';

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
        return getAvatarsComponent(oneAvatar);
    }

    const displayedContributors = [...contributors];
    const hiddenContributors = displayedContributors.splice(MAX_DISPLAYED_CONTRIBUTORS);

    const displayedAvatars = displayedContributors.map((contributor: Contributor) => {
        return (
            <AvatarWithDescription
                key={contributor.login}
                contributor={contributor}
                avatarSize={AvatarSizes.SMALL}
            />
        );
    });

    const hiddenAvatars = <HiddenAvatars contributors={hiddenContributors} avatarsSize={AvatarSizes.SMALL}/>;

    const avatars = (
        <Fragment>
            <div className={b('displayed_avatars')}>{displayedAvatars}</div>
            <div className={b('hidden_avatars')}>{hiddenAvatars}</div>
        </Fragment>
    );

    return getAvatarsComponent(avatars);
};

function getOneAvatar(contributor: Contributor, isAuthor: boolean, onlyAuthor: boolean): ReactElement {
    return (
        <div className={b('one_contributor', {onlyAuthor})}>
            <AvatarWithDescription contributor={contributor} avatarSize={AvatarSizes.SMALL}/>
            <div>{getName(contributor, isAuthor)}</div>
        </div>
    );
}

function getAvatarsComponent(avatars: ReactElement) {
    return (<div className={b('avatars-wrapper')}>{avatars}</div>);
}

export default ContributorAvatars;
