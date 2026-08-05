import type {FC} from 'react';

import {useMemo, useState} from 'react';
import block from 'bem-cn-lite';

import {useTranslation} from '../../hooks';
import {ToggleArrow} from '../ToggleArrow';

import {getPublicTags} from './utils';
import './TagsFilter.scss';

const b = block('dc-tags-filter');

const COLLAPSED_TAGS_COUNT = 12;

export interface TagsFilterProps {
    tags: string[];
    selectedTags: string[];
    onChange: (tags: string[]) => void;
}

const TagsFilter: FC<TagsFilterProps> = ({tags, selectedTags, onChange}) => {
    const {t} = useTranslation('toc-nav-panel');
    const publicTags = useMemo(() => getPublicTags(tags, selectedTags), [tags, selectedTags]);
    const [expanded, setExpanded] = useState(false);

    if (!publicTags.length) {
        return null;
    }

    const collapsible = publicTags.length > COLLAPSED_TAGS_COUNT;
    const visibleTags =
        collapsible && !expanded ? publicTags.slice(0, COLLAPSED_TAGS_COUNT) : publicTags;

    const toggleTag = (tag: string) => {
        onChange(
            selectedTags.includes(tag)
                ? selectedTags.filter((value) => value !== tag)
                : [...selectedTags, tag],
        );
    };

    return (
        <div className={b()}>
            {visibleTags.map((tag) => {
                const selected = selectedTags.includes(tag);

                return (
                    <button
                        key={tag}
                        className={b('tag', {selected})}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleTag(tag)}
                    >
                        {tag}
                    </button>
                );
            })}
            {collapsible && (
                <button
                    className={b('toggle')}
                    type="button"
                    aria-expanded={expanded}
                    aria-label={t('drop-down-list')}
                    onClick={() => setExpanded((value) => !value)}
                >
                    <ToggleArrow type="vertical" open={expanded} />
                </button>
            )}
        </div>
    );
};

export default TagsFilter;
