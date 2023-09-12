import React, {BaseSyntheticEvent} from 'react';

import block from 'bem-cn-lite';

import {Contributor} from '../../../models';
import {AvatarData, AvatarSizes, PopupData} from '../models';
import {getUserIdentificator} from '../utils';

import '../ContributorAvatars.scss';

const b = block('contributor-avatars');

interface AvatarProps {
    avatarData: AvatarData;
    popupData?: PopupData;
    isRedirect?: boolean;
}

const Avatar: React.FC<AvatarProps> = (props) => {
    const {avatarData, popupData, isRedirect = false} = props;
    const {contributor, size = AvatarSizes.SMALL, inDetails = false} = avatarData;
    const {changeVisiblilityPopup = () => {}, ref} = popupData || {};
    const {avatar, email, login} = contributor;

    const key = `avatar-${login || email}`;

    if (avatar) {
        return (
            <img
                key={key}
                className={b('avatar', {size})}
                src={avatar}
                ref={ref}
                onMouseOver={() => changeVisiblilityPopup(true)}
                onMouseLeave={() => changeVisiblilityPopup(false)}
                onTouchStart={() => changeVisiblilityPopup()}
                onTouchEnd={(event: BaseSyntheticEvent) =>
                    preventDefaultByComponent(event, inDetails, isRedirect)
                }
            />
        );
    }

    const initials = getInitials(contributor);

    return (
        <button
            key={key}
            className={b('avatar', {size, default: true})}
            ref={ref}
            onMouseOver={() => changeVisiblilityPopup(true)}
            onMouseLeave={() => changeVisiblilityPopup(false)}
            onTouchStart={() => changeVisiblilityPopup()}
            onTouchEnd={(event: BaseSyntheticEvent) =>
                preventDefaultByComponent(event, inDetails, isRedirect)
            }
        >
            {initials}
        </button>
    );
};

function preventDefaultByComponent(
    event: BaseSyntheticEvent,
    inDetails: boolean,
    isRedirect: boolean,
): void {
    if (inDetails || isRedirect) {
        return;
    }

    event.preventDefault();
}

function getInitials(contributor: Contributor) {
    return getUserIdentificator(contributor).charAt(0).toUpperCase();
}

export default Avatar;
