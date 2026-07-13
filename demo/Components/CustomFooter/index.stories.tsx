import type {FooterMenuItemConfig} from '@diplodoc/components';

import {CustomFooter as Component} from '@diplodoc/components';

type CustomFooterDemoArgs = {
    WithDivider: boolean;
    MoreButtonTitle: string;
    Copyright: string;
    Logo: string;
    MenuItems: FooterMenuItemConfig[];
};

const DEFAULT_MENU_ITEMS: FooterMenuItemConfig[] = [
    {
        text: 'Telegram',
        url: 'https://t.me/diplodoc_ru',
    },
    {
        text: 'GitHub',
        url: 'https://github.com/diplodoc-platform',
        target: 'self',
    },
];

const CustomFooterDemo = (args: CustomFooterDemoArgs) => {
    return (
        <Component
            withDivider={args['WithDivider']}
            moreButtonTitle={args['MoreButtonTitle']}
            copyright={args['Copyright']}
            logo={args['Logo']}
            menuItems={args['MenuItems']}
        />
    );
};

export default {
    title: 'Components/CustomFooter',
    component: CustomFooterDemo,
    argTypes: {
        WithDivider: {
            control: 'boolean',
        },
        MoreButtonTitle: {
            control: 'text',
        },
        Copyright: {
            control: 'text',
        },
        Logo: {
            control: 'text',
        },
        MenuItems: {
            control: 'object',
        },
    },
};

export const CustomFooter = {
    args: {
        WithDivider: true,
        MoreButtonTitle: 'Show more',
        Copyright: 'Copyright',
        Logo: 'https://storage.yandexcloud.net/diplodoc-www-assets/navigation/diplodoc-logo.svg',
        MenuItems: DEFAULT_MENU_ITEMS,
    },
};
