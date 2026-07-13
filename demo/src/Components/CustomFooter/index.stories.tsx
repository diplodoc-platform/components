import React from 'react';
import {CustomFooter as Component} from '@diplodoc/components';

const CustomFooterDemo = (args: Record<string, string | boolean>) => {
    return (
        <Component
            withDivider={args['WithDivider'] as boolean}
            moreButtonTitle={args['MoreButtonTitle'] as string}
            copyright={args['Copyright'] as string}
            logo={args['Logo'] as string}
            menuItems={[
                {
                    text: 'Telegram',
                    url: 'https://t.me/diplodoc_ru',
                },
                {
                    text: 'GitHub',
                    url: 'https://github.com/diplodoc-platform',
                    target: 'self',
                },
            ]}
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
    },
};

export const CustomFooter = {
    args: {
        WithDivider: true,
        MoreButtonTitle: 'Show more',
        Copyright: 'Copyright',
        Logo: 'https://storage.yandexcloud.net/diplodoc-www-assets/navigation/diplodoc-logo.svg',
    },
};
