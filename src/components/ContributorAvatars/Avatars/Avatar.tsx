import block from 'bem-cn-lite';
import React, {BaseSyntheticEvent} from 'react';

import {AvatarData, AvatarSizes, PopupData} from '../models';

import '../ContributorAvatars.scss';

const b = block('contributor-avatars');

interface AvatarProps {
    avatarData: AvatarData;
    popupData?: PopupData;
}

const Avatar: React.FC<AvatarProps> = (props) => {
    const {avatarData, popupData} = props;
    const {contributor, size = AvatarSizes.SMALL, inDetails = false} = avatarData;
    const {changeVisiblilityPopup = () => { }, ref} = popupData || {};
    const {avatar, name, login} = contributor;

    if (avatar) {
        return (
            <div className={b('avatar-wrapper', {size})}>
                <img
                    key={login}
                    className={b('avatar', {size})}
                    src={avatar}
                    ref={ref}
                    onMouseOver={() => changeVisiblilityPopup(true)}
                    onMouseLeave={() => changeVisiblilityPopup(false)}
                    onTouchStart={() => changeVisiblilityPopup()}
                    onTouchEnd={(event: BaseSyntheticEvent) => preventDefaultByComponent(event, inDetails)}
                />
            </div>
        );
    }

    const initials = getInitials(name || login);

    return (
        <div
            key={login}
            className={b('avatar', {default: true}, size)}
            ref={ref}
            onMouseOver={() => changeVisiblilityPopup(true)}
            onMouseLeave={() => changeVisiblilityPopup(false)}
            onTouchStart={() => changeVisiblilityPopup()}
            onTouchEnd={(event: BaseSyntheticEvent) => preventDefaultByComponent(event, inDetails)}
        >
            {initials}
        </div>
    );
};

function preventDefaultByComponent(event: BaseSyntheticEvent, inDetails: boolean): void {
    if (inDetails) {
        return;
    }

    event.preventDefault();
}

function getInitials(name: string) {
    return name.charAt(0).toUpperCase();
}

export default Avatar;
