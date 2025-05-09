import React from 'react';
import {MiniToc as Component} from '@diplodoc/components';

type FlatHeadingItem = {
    title: string;
    href: string;
    isChild: boolean;
};

type Args = {
    headings: FlatHeadingItem[];
    activeHeading: FlatHeadingItem | null;
};

const MiniTocDemo = (args: Args) => {
    return <Component headings={args.headings} activeHeading={args.activeHeading} />;
};

export default {
    title: 'Components/MiniToc',
    component: MiniTocDemo,
    argTypes: {
        headings: {
            control: 'object',
            description: 'Array of headings to display in the table of contents',
        },
        activeHeading: {
            control: 'object',
            description: 'Currently active heading',
        },
    },
};

export const MiniToc = {
    args: {
        headings: [
            {
                title: 'Heading 1',
                href: '#heading-1',
                isChild: false,
            },
            {
                title: 'Heading 1.1',
                href: '#heading-1-1',
                isChild: true,
            },
            {
                title: 'Heading 2',
                href: '#heading-2',
                isChild: false,
            },
            {
                title: 'Heading 3',
                href: '#heading-3',
                isChild: false,
            },
            {
                title: 'Heading 3.1',
                href: '#heading-3-1',
                isChild: true,
            },
            {
                title: 'Heading 3.2',
                href: '#heading-3-2',
                isChild: true,
            },
        ],
        activeHeading: {
            title: 'Heading 3.1',
            href: '#heading-3-1',
            isChild: true,
        },
    },
};
