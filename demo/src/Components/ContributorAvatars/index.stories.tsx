import type {Contributor} from '@diplodoc/components';

import React from 'react';
import {ContributorAvatars as Component} from '@diplodoc/components';

const ContributorAvatarsDemo = (args: Record<string, any>) => {
    const currentEnable = args['EnableDataStaffLogin'];
    const showMultiple = args['ShowMultiple'];

    const mockUsers: Contributor[] = showMultiple
        ? [
              {
                  avatar: 'https://githubusercontent.com',
                  email: 'robot-dataui-vcs@yandex-team.ru',
                  login: 'robot-dataui-vcs-login',
                  name: 'DataUI VCS Robot',
                  url: 'http://yandex.ru',
                  enableDataStaffLogin: currentEnable,
              },
              {
                  avatar: 'https://githubusercontent.com',
                  email: 'skanunnikov@yandex-team.ru',
                  login: 'skanunnikov',
                  name: 'Sergey Kanunnikov',
                  url: '',
                  enableDataStaffLogin: currentEnable,
              },
          ]
        : [
              {
                  avatar: 'https://githubusercontent.com',
                  email: 'robot-dataui-vcs@yandex-team.ru',
                  login: 'robot-dataui-vcs-login',
                  name: 'DataUI VCS Robot',
                  url: 'http://yandex.ru',
                  enableDataStaffLogin: currentEnable,
              },
          ];

    return (
        <Component
            contributors={mockUsers}
            isAuthor={args['IsAuthor']}
            onlyAuthor={args['OnlyAuthor']}
        />
    );
};

export default {
    title: 'Components/ContributorAvatars',
    component: ContributorAvatarsDemo,
    argTypes: {
        EnableDataStaffLogin: {
            control: 'boolean',
        },
        ShowMultiple: {
            control: 'boolean',
        },
        IsAuthor: {
            control: 'boolean',
        },
        OnlyAuthor: {
            control: 'boolean',
        },
    },
};

export const ContributorAvatars = {
    args: {
        EnableDataStaffLogin: true,
        ShowMultiple: false,
        IsAuthor: true,
        OnlyAuthor: true,
    },
};
