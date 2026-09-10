import type {FC} from 'react';

import {useMemo, useState} from 'react';
import block from 'bem-cn-lite';

import {useTranslation} from '../../hooks';
import {ToggleArrow} from '../ToggleArrow';

import {getPublicTags} from './utils';
import './TagsFilter.scss';

const b = block('dc-tags-filter');

const DEFAULT_COLLAPSED_COUNT = 12;

export interface TagsFilterProps {
    tags: string[];
    selectedTags: string[];
    tagCounts?: Record<string, number>;
    onChange: (tags: string[]) => void;
    collapsedCount?: number;
}

const TagsFilter: FC<TagsFilterProps> = ({
    tags,
    selectedTags,
    tagCounts,
    onChange,
    collapsedCount = DEFAULT_COLLAPSED_COUNT,
}) => {
    const {t} = useTranslation('toc-nav-panel');
    const {t: tagsTranslation} = useTranslation('tags');
    const publicTags = useMemo(() => {
        const result = getPublicTags([...tags, ...selectedTags], selectedTags);

        if (!tagCounts) {
            return result;
        }

        const isDisabled = (tag: string) =>
            !selectedTags.includes(tag) &&
            (!Object.prototype.hasOwnProperty.call(tagCounts, tag) || tagCounts[tag] === 0);

        return result.sort((left, right) => Number(isDisabled(left)) - Number(isDisabled(right)));
    }, [tags, selectedTags, tagCounts]);
    const [expanded, setExpanded] = useState(false);

    if (!publicTags.length) {
        return null;
    }

    const collapsible = publicTags.length > collapsedCount;
    const visibleTags = collapsible && !expanded ? publicTags.slice(0, collapsedCount) : publicTags;

    const toggleTag = (tag: string) => {
        onChange(
            selectedTags.includes(tag)
                ? selectedTags.filter((value) => value !== tag)
                : [...selectedTags, tag],
        );
    };

    return (
        <div className={b()} role="group" aria-label={tagsTranslation('title')}>
            <h3 className={b('title')}>{tagsTranslation('title')}</h3>
            {visibleTags.map((tag) => {
                const selected = selectedTags.includes(tag);
                const count =
                    tagCounts &&
                    (Object.prototype.hasOwnProperty.call(tagCounts, tag) ? tagCounts[tag] : 0);
                const disabled = count === 0 && !selected;

                return (
                    <button
                        key={tag}
                        className={b('tag', {selected})}
                        type="button"
                        aria-pressed={selected}
                        disabled={disabled}
                        onClick={() => toggleTag(tag)}
                    >
                        {tag}
                        {count !== undefined && (
                            <span className={b('count')} title={String(count)}>
                                {count > 99 ? '99+' : count}
                            </span>
                        )}
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
