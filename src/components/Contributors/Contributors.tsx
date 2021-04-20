import React from 'react';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';

import {ContributorsProps} from '../../models';
import {ContributorAvatars} from '../ContributorAvatars';

import './Contributors.scss';

const b = block('contributors');

const Contributors: React.FC<ContributorsProps> = (props) => {
    const {users, lang, vcsType} = props;
    const {t, i18n} = useTranslation('contributors');

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

export default Contributors;
