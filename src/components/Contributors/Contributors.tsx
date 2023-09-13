import React from 'react';

import block from 'bem-cn-lite';

import {useTranslation} from '../../hooks';
import {Contributor} from '../../models';
import {ContributorAvatars} from '../ContributorAvatars';

import './Contributors.scss';

const b = block('contributors');

export interface ContributorsProps {
    users: Contributor[];
    onlyAuthor?: boolean;
    isAuthor?: boolean;
    translationName?: string;
}

const Contributors: React.FC<ContributorsProps> = (props) => {
    const {users, onlyAuthor = false, isAuthor = false, translationName = 'contributors'} = props;
    const {t} = useTranslation(translationName);

    return (
        <div className={b()}>
            <div className={b('title')}>{t<string>('title')}</div>
            <ContributorAvatars contributors={users} isAuthor={isAuthor} onlyAuthor={onlyAuthor} />
        </div>
    );
};

export default Contributors;
