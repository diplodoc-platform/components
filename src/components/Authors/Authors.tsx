import React from 'react';
import block from 'bem-cn-lite';
import {WithTranslation, withTranslation, WithTranslationProps} from 'react-i18next';

import {ContributorsProps} from '../../models';
import {ContributorAvatars} from '../ContributorAvatars';

import './Authors.scss';

const b = block('authors');

type AuthorsInnerProps =
    & ContributorsProps
    & WithTranslation
    & WithTranslationProps;

const Authors: React.FC<AuthorsInnerProps> = (props) => {
    const {users, lang, vcsType, i18n, t} = props;

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

export default withTranslation('authors')(Authors);
