import type {BaseSyntheticEvent} from 'react';
import type {Contributor} from '../../../models';
import type {AvatarSizes, PopupData} from '../models';

import React, {Fragment, useRef, useState} from 'react';
import block from 'bem-cn-lite';

import Details from './Details';

// eslint-disable-next-line import/order
import '../ContributorAvatars.scss';

const b = block('dc-contributor-avatars');

const LOWER_BOUND_MORE_CONTRIBUTORS = 9;

export interface HiddenAvatarsProps {
    contributors: Contributor[];
    avatarsSize: AvatarSizes;
}

const HiddenAvatars: React.FC<HiddenAvatarsProps> = (props) => {
    const {contributors, avatarsSize} = props;
    const contributorsCount = contributors.length;

    const controlRef = useRef<(HTMLButtonElement & HTMLImageElement) | null>(null);
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
            <button
                className={b('avatar', {size: avatarsSize})}
                ref={controlRef}
                onClick={(event: BaseSyntheticEvent) => {
                    setIsVisiblePopup(!isVisiblePopup);
                    event.preventDefault();
                }}
                aria-expanded={isVisiblePopup}
            >
                {contributorsCountString}
            </button>
            <Details contributors={contributors} popupData={popupData} />
        </Fragment>
    );
};

export default HiddenAvatars;
