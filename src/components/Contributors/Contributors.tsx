import type {Contributor} from '../../models';

import React from 'react';
import block from 'bem-cn-lite';

import {useTranslation} from '../../hooks';
import {ContributorAvatars} from '../ContributorAvatars';

import './Contributors.scss';

const b = block('dc-contributors');

export interface ContributorsProps {
    users: Contributor[];
    onlyAuthor?: boolean;
    isAuthor?: boolean;
    hasAuthor?: boolean;
    translationName?: string;
}

const Contributors: React.FC<ContributorsProps> = (props) => {
    const {
        users,
        onlyAuthor = false,
        isAuthor = false,
        hasAuthor = true,
        translationName = 'contributors',
    } = props;
    const {t} = useTranslation(translationName);

    const titleKey = !isAuthor && !hasAuthor ? 'no-author-title' : 'title';

    return (
        <div className={b()}>
            <div className={b('title')}>{t(titleKey)}</div>
            <ContributorAvatars contributors={users} isAuthor={isAuthor} onlyAuthor={onlyAuthor} />
        </div>
    );
};

export default Contributors;
