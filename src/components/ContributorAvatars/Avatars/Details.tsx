import block from 'bem-cn-lite';
import React from 'react';
import {Popup} from '@yandex-cloud/uikit';

import Avatar from './Avatar';
import Link from '../../Link';
import {AvatarData, AvatarSizes, PopupData} from '../models';
import {getName} from '../utils';
import {Contributor} from '../../../models';
import {PopperPosition} from '../../../hooks';

import '../ContributorAvatars.scss';

const b = block('contributor-avatars');

interface DetailsProps {
    contributors: Contributor[];
    popupData: PopupData;
}

const Details: React.FC<DetailsProps> = (props) => {
    const {contributors, popupData} = props;
    const {ref, isVisiblePopup, changeVisiblilityPopup} = popupData || {};

    const contributorsDetails = contributors.map((author: Contributor) => {
        return getContributorDetails(author);
    });

    return (
        <Popup
            anchorRef={ref}
            open={isVisiblePopup}
            onOutsideClick={() => changeVisiblilityPopup(false)}
            className={b('popup')}
            placement={PopperPosition.BOTTOM}
            hasArrow={true}
        >
            {contributorsDetails}
        </Popup>
    );
};

function getContributorDetails(contributor: Contributor) {
    const {login, email, url} = contributor;

    const avatarData: AvatarData = {
        contributor,
        size: AvatarSizes.BIG,
        inDetails: true,
    };

    const avatarImg = <Avatar avatarData={avatarData} />;

    return (
        <Link url={url} key={`details-${login || email}`}>
            <div className={b('details')}>
                {avatarImg}
                <div className={b('details_name')}>{getName(contributor, true)}</div>
            </div>
        </Link>
    );
}

export default Details;
