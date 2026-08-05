import type {TagsFilterProps} from '@diplodoc/components';

import {TagsFilter as Component} from '@diplodoc/components';
import {useState} from 'react';

const tags = [
    'Diplodoc',
    'IEC',
    'ISO',
    'ГОСТ',
    'О нас',
    'аудит',
    'безопасность',
    'документация',
    'защита данных',
    'инфа',
    'информационная безопасность',
    'качество',
    'контроль доступа',
    'политика безопасности',
    'процессы',
    'руководство',
    'сертификация',
    'соответствие требованиям',
    'стандарты',
    'управление рисками',
    '_internal',
];
const mobileTags = [
    'Diplodoc',
    'IEC',
    'ISO',
    'GOST',
    'About us',
    'Audit',
    'Security',
    'Documentation',
    'Data protection',
    'Information',
    'Information security',
    'Quality',
    'Access control',
    'Security policy',
    'Processes',
    'Guide',
    'Certification',
    'Compliance requirements',
    'Standards',
    'Risk management',
    '_internal',
];
const args = {
    tags,
    selectedTags: [],
};

type TagsFilterDemoProps = TagsFilterProps & {Mobile?: boolean};

const TagsFilterDemo = ({
    Mobile,
    selectedTags: initialSelectedTags,
    ...props
}: TagsFilterDemoProps) => {
    const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags);

    return (
        <div style={{boxSizing: 'border-box', width: Mobile ? '320px' : '640px', padding: '24px'}}>
            <Component {...props} selectedTags={selectedTags} onChange={setSelectedTags} />
        </div>
    );
};

export default {
    title: 'Components/TagsFilter',
    component: TagsFilterDemo,
};

export const TagsFilter = {
    args: {...args, Mobile: false},
};

export const Mobile = {
    args: {...args, tags: mobileTags, Mobile: true},
};
