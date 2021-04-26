import React, {useEffect} from 'react';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';

import {ContributorsProps} from '../../models';
import {ContributorAvatars} from '../ContributorAvatars';

import './Authors.scss';

const b = block('authors');

const Authors: React.FC<ContributorsProps> = (props) => {
    const {users, lang} = props;
    const {t, i18n} = useTranslation('authors');

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [i18n, lang]);

    return (
        <div className={b()}>
            <div className={b('title')}>{t('title')}</div>
            <ContributorAvatars contributors={users} isAuthor={true}/>
        </div>
    );
};

export default Authors;
