import React from 'react';
import block from 'bem-cn-lite';
import {WithTranslation, withTranslation, WithTranslationProps} from 'react-i18next';

import {ContributorsProps} from '../../models';
import {ContributorAvatars} from '../ContributorAvatars';

import './Contributors.scss';

const b = block('contributors');

type ContributorsInnerProps =
    & ContributorsProps
    & WithTranslation
    & WithTranslationProps;

const Contributors: React.FC<ContributorsInnerProps> = (props) => {
    const {users, lang, vcsType, i18n, t} = props;

    if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
    }

    return (
        <div className={b()}>
            <div className={b('title')}>{t('title')}</div>
            <ContributorAvatars contributors={users} vcsType={vcsType}/>
        </div>
    );
};

export default withTranslation('contributors')(Contributors);
