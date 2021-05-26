import block from 'bem-cn-lite';
import React, { BaseSyntheticEvent, ReactElement, useCallback, useRef, useState } from 'react';

import {Contributor} from '../../models';
import { Popup } from '../Popup';
import {getName} from './utils';
import { PopperPosition } from '../../hooks';

import './ContributorAvatars.scss';

const b = block('contributor-avatars');

const LOWER_BOUND_MORE_CONTRIBUTORS = 9;

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

    const setRef = useCallback((ref: HTMLImageElement) => {
        controlRef.current = ref;
    }, []);

    const avatarImg = getAvatar(contributor, avatarSize, changeVisiblilityPopup, setRef);
    const details = getDetails([contributor], controlRef, isVisiblePopup, changeVisiblilityPopup);

    return (
        <React.Fragment>
            {avatarImg}
            {details}
        </React.Fragment>
    );
};

const HiddenAvatars: React.FC<HiddenAvatarsProps> = (props) => {
    const {contributors, avatarsSize} = props;
    const contributorsCount = contributors.length;

    const controlRef = useRef<HTMLImageElement | null>(null);
    const [isVisiblePopup, setIsVisiblePopup] = useState(false);
    const setRef = useCallback((ref: HTMLImageElement) => {
        controlRef.current = ref;
    }, []);

    if (contributorsCount === 0) {
        return null;
    }

    const details = getDetails(contributors, controlRef, isVisiblePopup, () => setIsVisiblePopup(false));

    const contributorsCountString = contributorsCount > LOWER_BOUND_MORE_CONTRIBUTORS
        ? `${LOWER_BOUND_MORE_CONTRIBUTORS}+`
        : `+${contributorsCount}`;

    return (
        <React.Fragment>
            <div
                className={b('avatar', {size: avatarsSize})}
                ref={setRef}
                onClick={() => setIsVisiblePopup(!isVisiblePopup)}
            >
                {contributorsCountString}
            </div>
            {details}
        </React.Fragment>
    );
};

function getDetails(
    contributors: Contributor[],
    controlRef: React.MutableRefObject<HTMLImageElement | null>,
    isVisiblePopup: boolean,
    changeVisiblilityPopup: (visible?: boolean) => void,
): JSX.Element {
    const contributorsDetails = contributors.map((author: Contributor) => {
        return getContributorDetails(author);
    });

    return (
        <Popup
            anchorRef={controlRef.current}
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
    const {login} = contributor;

    const avatarImg = getAvatar(contributor, ContributorAvatarSizes.BIG, () => { });

    return (
        <div key={login} className={b('details')}>
            {avatarImg}
            <div>
                <div className={b('details_name')}>{getName(contributor)}</div>
                <div className={b('details_login')}>{login}</div>
            </div>
        </div>
    );
}

function getAvatar(
    contributor: Contributor,
    size: string = ContributorAvatarSizes.SMALL,
    changeVisiblilityPopup: (visible?: boolean) => void,
    setRef?: (ref: HTMLImageElement) => void,
): ReactElement {
    const {avatar, name, login} = contributor;

    const preventDefaultChanges = (event: BaseSyntheticEvent) => event.preventDefault();

    if (avatar) {
        return (
            <img
                key={login}
                className={b('avatar', {size})}
                src={avatar}
                ref={setRef}
                onMouseOver={() => changeVisiblilityPopup(true)}
                onMouseLeave={() => changeVisiblilityPopup(false)}
                onTouchStart={() => changeVisiblilityPopup()}
                onTouchMove={preventDefaultChanges}
                onTouchEnd={preventDefaultChanges}
            />
        );
    }

    const initials = getInitials(name || login);

    return (
        <div
            key={login}
            className={b('avatar', {size, default: true})}
            ref={setRef}
            onMouseOver={() => changeVisiblilityPopup(true)}
            onMouseLeave={() => changeVisiblilityPopup(false)}
            onTouchStart={() => changeVisiblilityPopup()}
            onTouchMove={preventDefaultChanges}
            onTouchEnd={preventDefaultChanges}
        >
            {initials}
        </div>
    );
}

function getInitials(name: string) {
    return name.charAt(0).toUpperCase();
}

export {
    AvatarWithDescription,
    HiddenAvatars,
};
