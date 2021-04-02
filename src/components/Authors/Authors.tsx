import React, {Fragment} from 'react';
import block from 'bem-cn-lite';
import {Author, AuthorItems} from '../../models';

import './Authors.scss';
// import Tooltip from '../Tooltip/Tooltip';

const b = block('authors');

const MAX_NUMBER_DISPLAYED_AUTHORS = 3;

export interface AuthorsProps {
    title: string;
    usersMetadata: string;
}

export const Authors: React.FC<AuthorsProps> = (props) => {
    const {title, usersMetadata} = props;

    const users = JSON.parse(usersMetadata.replace(/'/g, '"'));

    if (!users || Object.keys(users).length === 0) {
        return null;
    }

    const avatars = getAvatars(users);

    return (
        <div className={b()}>
            <div className={b('title')}>{title}</div>
            <div className={b('avatars')}>{avatars}</div>
        </div>
    );
};

function getAvatars(users: AuthorItems) {
    const logins = Object.keys(users);

    if (logins.length === 1) {
        const login = logins[0];
        return getOneAvatar(login, users);
    }

    const displayedAvatars: JSX.Element[] = [];

    logins.forEach((login: string, id: number) => {
        if (id < MAX_NUMBER_DISPLAYED_AUTHORS) {
            displayedAvatars.push(getAvatar(login, users));
        }
    });

    const hiddenAvatars = getHiddenAvatars(logins.slice(MAX_NUMBER_DISPLAYED_AUTHORS), users);

    return (
        <Fragment>
            <div className={b('displayed_avatars')}>{displayedAvatars}</div>
            <div className={b('hidden_avatars')}>{hiddenAvatars}</div>
        </Fragment>
    );
}

function getOneAvatar(login: string, users: AuthorItems) {
    const fullUserName = users[login].name;

    const shortUserName = fullUserName
        .split(' ')
        .reduce((result, current, id) => {
            return id > 0 ? `${result} ${current.charAt(0)}.` : current;
        }, '');

    return (
        <div className={b('one_author')}>
            {getAvatar(login, users)}
            <div>{shortUserName}</div>
        </div>
    );
}

function getHiddenAvatars(logins: string[], users: AuthorItems) {
    if (logins.length === 0) {
        return null;
    }

    const details = getDetails(logins, users);
    const hiddenAvatars = (
        <div className={b('small_avatar')}>
            {`+${logins.length + details.length}`}
        </div>
    );

    return (
        // <Tooltip
        //     content={details}
        //     hasTail={false}
        //     to={'bottom-left'}
        //     tooltipClass={b()}
        //     tooltipOffset={0}
        // >
        {hiddenAvatars}
        // </Tooltip>
    );
}

function getAvatar(login: string, users: AuthorItems) {
    const avatar = <img className={b('small_avatar')} src={users[login].avatar}/>;
    //const details = getDetails([login], users);

    return (
        // <Tooltip
        //     content={details}
        //     hasTail={false}
        //     to={'bottom-left'}
        //     tooltipClass={b()}
        //     tooltipOffset={0}
        // >
        {avatar}
        // </Tooltip>
    );
}

function getDetails(logins: string[], users: AuthorItems): JSX.Element[] {
    return logins.map((login: string) => {
        return getUserDetails(users[login]);
    });
}

function getUserDetails(user: Author) {
    return (
        <div>
            <img src={user.avatar}/>
            <div>{user.name}</div>
            <div>{user.login}</div>
        </div>
    );
}
