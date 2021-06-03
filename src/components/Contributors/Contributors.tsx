import React, {useEffect} from 'react';
import block from 'bem-cn-lite';
import {useTranslation} from 'react-i18next';

import {ContributorAvatars} from '../ContributorAvatars';
import {Lang, Contributor} from '../../models';

import './Contributors.scss';

const b = block('contributors');

export interface ContributorsProps {
    lang: Lang;
    users: Contributor[];
    onlyAuthor?: boolean;
    isAuthor?: boolean;
    translationName?: string;
}

const Contributors: React.FC<ContributorsProps> = (props) => {
    const {users, lang, onlyAuthor = false, isAuthor = false, translationName = 'contributors'} = props;
    const {t, i18n} = useTranslation(translationName);

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [i18n, lang]);

    return (
        <div className={b()}>
            <div className={b('title')}>{t('title')}</div>
            <ContributorAvatars contributors={users} isAuthor={isAuthor} onlyAuthor={onlyAuthor}/>
        </div>
    );
};

export default Contributors;
