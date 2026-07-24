import type {AvailableLangs} from '@diplodoc/components';

import {Button, spacing} from '@gravity-ui/uikit';
import {VcsType} from '@diplodoc/components';

export const commonArgTypes = {
    Mobile: {
        control: 'boolean',
    },
    Settings: {
        control: 'boolean',
    },
    Langs: {
        control: 'boolean',
    },
    Fullscreen: {
        control: 'boolean',
    },
    Singlepage: {
        control: 'boolean',
    },
    Feedback: {
        control: 'boolean',
    },
    Subscribe: {
        control: 'boolean',
    },
    Bookmarks: {
        control: 'boolean',
    },
    Notification: {
        control: 'boolean',
    },
    VCS: {
        control: 'select',
        options: {
            none: null,
            github: VcsType.Github,
            arcanum: VcsType.Arcanum,
        },
    },
    Search: {
        control: 'text',
    },
    Pdf: {
        control: 'text',
    },
} as const;

export const commonArgs = {
    Settings: true,
    Langs: true,
    Fullscreen: true,
    Singlepage: true,
    Feedback: true,
    Subscribe: true,
    Bookmarks: true,
    Notification: true,
    VCS: null,
    Search: '',
    Pdf: 'https://doc.yandex-team.ru/help/diy/diy-guide.pdf',
} as const;

export const extendedLangs = [
    'ru',
    'en',
    'cs',
    'he',
    {lang: 'de', tld: 'de'},
    {lang: 'tr', href: 'https://example.com'},
];

export const beforeSubNavigationContent = (
    <Button view="action" className={spacing({mb: 4})}>
        Action button
    </Button>
);

export const availableLangsArgType = {
    control: {type: 'check'},
    options: ['ru', 'en', 'cs', 'he'],
} as const;

export function resolveAvailableLangs(value: unknown): AvailableLangs {
    return Array.isArray(value) ? (value as AvailableLangs) : ['ru'];
}
