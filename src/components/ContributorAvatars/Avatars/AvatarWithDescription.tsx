import React, {useRef, useState} from 'react';

import UrlWrapper from './UrlWrapper';
import Avatar from './Avatar';
import {AvatarData, AvatarSizes, PopupData} from '../models';
import {Contributor} from '../../../models';
import Details from './Details';

interface AvatarWithDescriptionProps {
    contributor: Contributor;
    avatarSize: AvatarSizes;
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

    const avatarImg = (<Avatar avatarData={avatarData} popupData={popupData}/>);

    return (
        <React.Fragment>
            <UrlWrapper avatar={avatarImg} url={contributor.url}/>
            <Details contributors={[contributor]} popupData={popupData}/>
        </React.Fragment>
    );
};

export default AvatarWithDescription;
