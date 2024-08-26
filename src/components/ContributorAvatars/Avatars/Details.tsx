import React from 'react';
import {Link, Popup} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import {PopperPosition} from '../../../hooks';
import {Contributor} from '../../../models';
import {AvatarData, AvatarSizes, PopupData} from '../models';
import {getName} from '../utils';

import Avatar from './Avatar';

// eslint-disable-next-line import/order
import '../ContributorAvatars.scss';

const b = block('dc-contributor-avatars');

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
            contentClassName={b('popup_content')}
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
        <Link href={url} key={`details-${login || email}`}>
            <div className={b('details')}>
                {avatarImg}
                <div className={b('details_name')}>{getName(contributor, true)}</div>
            </div>
        </Link>
    );
}

export default Details;
