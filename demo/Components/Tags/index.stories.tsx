import type {TagsProps} from '@diplodoc/components';

import {Tags as Component} from '@diplodoc/components';

const tags = [
    'Diplodoc',
    'documentation',
    'search',
    'components',
    'accessibility',
    'Diplodoc',
    '_internal',
];
const args = {
    tags,
    getSearchLink: (_query: string, _page?: number, selectedTags?: string[]) =>
        `/_search/ru/?tags=${selectedTags?.join(',')}`,
};

type TagsDemoProps = TagsProps & {Mobile?: boolean};

const TagsDemo = ({Mobile, ...props}: TagsDemoProps) => (
    <div style={{boxSizing: 'border-box', width: Mobile ? '320px' : '640px', padding: '24px'}}>
        <Component {...props} />
    </div>
);

export default {
    title: 'Components/Tags',
    component: TagsDemo,
};

export const Tags = {
    args: {...args, Mobile: false},
};

export const Mobile = {
    args: {...args, Mobile: true},
};
