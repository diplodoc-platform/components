import type {FC} from 'react';
import type {GetSearchLink} from './Tag';

import block from 'bem-cn-lite';

import Tag from './Tag';
import './Tags.scss';

const b = block('dc-tags');

export interface TagsProps {
    tags: string[];
    getSearchLink?: GetSearchLink;
}

const Tags: FC<TagsProps> = ({tags, getSearchLink}) => {
    const publicTags = [...new Set(tags.filter((tag) => !tag.startsWith('_')))];

    if (!publicTags.length) {
        return null;
    }

    return (
        <div className={b()}>
            {publicTags.map((tag) => (
                <Tag key={tag} tag={tag} getSearchLink={getSearchLink} />
            ))}
        </div>
    );
};

export default Tags;
