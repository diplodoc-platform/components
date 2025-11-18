import type {Contributor} from '../../../models';
import type {AvatarData, AvatarSizes, PopupData} from '../models';

import React, {Fragment, useRef, useState} from 'react';

import Avatar from './Avatar';
import Details from './Details';

interface AvatarWithDescriptionProps {
    contributor: Contributor;
    avatarSize: AvatarSizes;
}

const AvatarWithDescription: React.FC<AvatarWithDescriptionProps> = (props) => {
    const {contributor, avatarSize} = props;

    const controlRef = useRef<(HTMLButtonElement & HTMLImageElement) | null>(null);
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

    const avatarImg = <Avatar avatarData={avatarData} popupData={popupData} />;

    return (
        <Fragment>
            {avatarImg}
            <Details contributors={[contributor]} popupData={popupData} />
        </Fragment>
    );
};

export default AvatarWithDescription;
