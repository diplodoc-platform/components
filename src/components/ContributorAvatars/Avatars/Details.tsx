import block from 'bem-cn-lite';
import React from 'react';

import Avatar from './Avatar';
import UrlWrapper from './UrlWrapper';
import {Popup} from '../../Popup';
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
};

function getContributorDetails(contributor: Contributor) {
    const {login, url} = contributor;

    const avatarData: AvatarData = {
        contributor,
        size: AvatarSizes.BIG,
        inDetails: true,
    };

    const avatarImg = (<Avatar avatarData={avatarData}/>);

    return (
        <div key={login} className={b('details')}>
            <UrlWrapper avatar={avatarImg} url={url}/>
            <div>
                <div className={b('details_name')}>{getName(contributor, true)}</div>
                <div className={b('details_login')}>{login}</div>
            </div>
        </div>
    );
}

export default Details;
