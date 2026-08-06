import type {FC} from 'react';
import type {GetSearchLink} from './Tag';

import block from 'bem-cn-lite';

import {getPublicTags} from '../TagsFilter/utils';

import Tag from './Tag';
import './Tags.scss';

const b = block('dc-tags');

export interface TagsProps {
    tags: string[];
    getSearchLink?: GetSearchLink;
}

const Tags: FC<TagsProps> = ({tags, getSearchLink}) => {
    const publicTags = getPublicTags(tags);

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
