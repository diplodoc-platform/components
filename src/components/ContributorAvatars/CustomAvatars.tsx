import block from 'bem-cn-lite';
import React, {BaseSyntheticEvent, ReactElement, useRef, useState} from 'react';

import {Contributor} from '../../models';
import {Popup} from '../Popup';
import {getName} from './utils';
import {PopperPosition} from '../../hooks';

import './ContributorAvatars.scss';

const b = block('contributor-avatars');

const LOWER_BOUND_MORE_CONTRIBUTORS = 9;

type AvatarData = {
    contributor: Contributor;
    size?: string;
    inDetails?: boolean;
};

type PopupData = {
    ref: React.MutableRefObject<HTMLImageElement | null>;
    isVisiblePopup: boolean;
    changeVisiblilityPopup: (visible?: boolean) => void;
};

export enum ContributorAvatarSizes {
    BIG = 'big',
    SMALL = 'small',
}

export interface AvatarWithDescriptionProps {
    contributor: Contributor;
    avatarSize: ContributorAvatarSizes;
}

export interface HiddenAvatarsProps {
    contributors: Contributor[];
    avatarsSize: ContributorAvatarSizes;
}

const AvatarWithDescription: React.FC<AvatarWithDescriptionProps> = (props) => {
    const {contributor, avatarSize} = props;

    const controlRef = useRef<HTMLImageElement | null>(null);
    const [isVisiblePopup, setIsVisiblePopup] = useState(false);

    const changeVisiblilityPopup = (visible?: boolean) => {
        if (visible !== undefined) {
            setIsVisiblePopup(visible);
            return;
        }

        setIsVisiblePopup(!isVisiblePopup);
    };

    const avatarData: AvatarData = {
        contributor,
        size: avatarSize,
    };

    const popupData: PopupData = {
        changeVisiblilityPopup,
        ref: controlRef,
        isVisiblePopup,
    };

    const avatarImg = getAvatar(avatarData, popupData);
    const details = getDetails([contributor], popupData);

    return (
        <React.Fragment>
            {getAvatarWithUrl(avatarImg, contributor.url)}
            {details}
        </React.Fragment>
    );
};

const HiddenAvatars: React.FC<HiddenAvatarsProps> = (props) => {
    const {contributors, avatarsSize} = props;
    const contributorsCount = contributors.length;

    const controlRef = useRef<HTMLImageElement | null>(null);
    const [isVisiblePopup, setIsVisiblePopup] = useState(false);

    if (contributorsCount === 0) {
        return null;
    }

    const popupData: PopupData = {
        ref: controlRef,
        isVisiblePopup,
        changeVisiblilityPopup: () => setIsVisiblePopup(false),
    };

    const details = getDetails(contributors, popupData);

    const contributorsCountString = contributorsCount > LOWER_BOUND_MORE_CONTRIBUTORS
        ? `${LOWER_BOUND_MORE_CONTRIBUTORS}+`
        : `+${contributorsCount}`;

    return (
        <React.Fragment>
            <div
                className={b('avatar', {size: avatarsSize})}
                ref={controlRef}
                onClick={(event: BaseSyntheticEvent) => {
                    setIsVisiblePopup(!isVisiblePopup);
                    event.preventDefault();
                }}
            >
                {contributorsCountString}
            </div>
            {details}
        </React.Fragment>
    );
};

function getDetails(contributors: Contributor[], popupData: PopupData): JSX.Element {
    const {ref, isVisiblePopup, changeVisiblilityPopup} = popupData;

    const contributorsDetails = contributors.map((author: Contributor) => {
        return getContributorDetails(author);
    });

    return (
        <Popup
            anchor={ref.current}
            visible={isVisiblePopup}
            onOutsideClick={() => changeVisiblilityPopup(false)}
            className={b('popup')}
            position={PopperPosition.BOTTOM}
            hasArrow={true}
        >
            {contributorsDetails}
        </Popup>
    );
}

function getContributorDetails(contributor: Contributor) {
    const {login, url} = contributor;

    const avatarData: AvatarData = {
        contributor,
        size: ContributorAvatarSizes.BIG,
        inDetails: true,
    };

    const avatarImg = getAvatar(avatarData);

    return (
        <div key={login} className={b('details')}>
            {getAvatarWithUrl(avatarImg, url)}
            <div>
                <div className={b('details_name')}>{getName(contributor, true)}</div>
                <div className={b('details_login')}>{login}</div>
            </div>
        </div>
    );
}

function getAvatar(avatarData: AvatarData, popupData?: PopupData): ReactElement {
    const {contributor, size = ContributorAvatarSizes.SMALL, inDetails = false} = avatarData;
    const {changeVisiblilityPopup = () => { }, ref} = popupData || {};
    const {avatar, name, login} = contributor;

    if (avatar) {
        return (
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
        );
    }

    const initials = getInitials(name || login);

    return (
        <div
            key={login}
            className={b('avatar', {size, default: true})}
            ref={ref}
            onMouseOver={() => changeVisiblilityPopup(true)}
            onMouseLeave={() => changeVisiblilityPopup(false)}
            onTouchStart={() => changeVisiblilityPopup()}
            onTouchEnd={(event: BaseSyntheticEvent) => preventDefaultByComponent(event, inDetails)}
        >
            {initials}
        </div>
    );
}

function getInitials(name: string) {
    return name.charAt(0).toUpperCase();
}

function getAvatarWithUrl(avatar: ReactElement, url?: string): ReactElement {
    return url
        ? <a href={url} target="_blank" rel="noopener noreferrer">{avatar}</a>
        : avatar;
}

function preventDefaultByComponent(event: BaseSyntheticEvent, inDetails: boolean): void {
    if (inDetails) {
        return;
    }

    event.preventDefault();
}

export {
    AvatarWithDescription,
    HiddenAvatars,
};
