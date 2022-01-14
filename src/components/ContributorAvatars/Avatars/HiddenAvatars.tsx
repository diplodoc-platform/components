import block from 'bem-cn-lite';
import React, {BaseSyntheticEvent, Fragment, useRef, useState} from 'react';

import {AvatarSizes, PopupData} from '../models';
import {Contributor} from '../../../models';
import Details from './Details';

import '../ContributorAvatars.scss';

const b = block('contributor-avatars');

const LOWER_BOUND_MORE_CONTRIBUTORS = 9;

export interface HiddenAvatarsProps {
    contributors: Contributor[];
    avatarsSize: AvatarSizes;
}

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

    const contributorsCountString =
        contributorsCount > LOWER_BOUND_MORE_CONTRIBUTORS
            ? `${LOWER_BOUND_MORE_CONTRIBUTORS}+`
            : `+${contributorsCount}`;

    return (
        <Fragment>
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
            <Details contributors={contributors} popupData={popupData} />
        </Fragment>
    );
};

export default HiddenAvatars;
