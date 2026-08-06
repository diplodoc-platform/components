import type {FC} from 'react';

import block from 'bem-cn-lite';

const b = block('dc-tags');

export type GetSearchLink = (query: string, page?: number, tags?: string[]) => string | null;

export interface TagProps {
    tag: string;
    getSearchLink?: GetSearchLink;
}

const Tag: FC<TagProps> = ({tag, getSearchLink}) => {
    const href = getSearchLink?.('', 1, [tag]);

    if (!href) {
        return <span className={b('tag')}>{tag}</span>;
    }

    return (
        <a className={b('tag')} href={href}>
            {tag}
        </a>
    );
};

export default Tag;
