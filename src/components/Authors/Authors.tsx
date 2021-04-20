import React from 'react';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';

import {ContributorsProps} from '../../models';
import {ContributorAvatars} from '../ContributorAvatars';

import './Authors.scss';

const b = block('authors');

const Authors: React.FC<ContributorsProps> = (props) => {
    const {users, lang, vcsType} = props;
    const {t, i18n} = useTranslation('authors');

    if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
    }

    return (
        <div className={b()}>
            <div className={b('title')}>{t('title')}</div>
            <ContributorAvatars contributors={users} vcsType={vcsType} isAuthor={true}/>
        </div>
    );
};

export default Authors;
