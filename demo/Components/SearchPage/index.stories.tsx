import type {ISearchItem} from '@diplodoc/components';

import {useState} from 'react';

import {SearchPage, TagsFilter} from '@diplodoc/components';

import mockData from './data';

// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
const log = (...message: any[]) => console.log(...message);

type Args = {
    Mobile: string;
};

const SearchPageDemo = (args: Args) => {
    const isMobile = args['Mobile'];
    const [page, setPage] = useState(1);
    const [items, setItems] = useState(getItems(page, mockData));

    function getItems(newPage: number, data: ISearchItem[]): ISearchItem[] {
        return newPage === 1 ? data.slice(0, 2) : data.slice(2);
    }

    return (
        <div className={isMobile === 'true' ? 'mobile' : 'desktop'}>
            <SearchPage
                query={'test'}
                items={items}
                page={page}
                onPageChange={(newPage) => {
                    setPage(newPage);
                    setItems(getItems(newPage, mockData));
                }}
                onSubmit={() => setItems(getItems(page, mockData))}
                itemOnClick={(item) => log('Click on search result', item)}
                irrelevantOnClick={(item) => log('Click on dislike button', item)}
                relevantOnClick={(item) => log('Click on like  button', item)}
                itemsPerPage={2}
                totalItems={mockData.length}
            />
        </div>
    );
};

export default {
    title: 'Pages/Search',
    component: SearchPageDemo,
    argTypes: {
        Mobile: {
            control: 'boolean',
        },
    },
};

export const Search = {
    args: {
        Mobile: false,
    },
};

const tagItems = [
    {
        title: 'Метаданные документа',
        url: '/meta',
        description: 'Метаинформация о странице',
        tags: ['информация', 'мета'],
    },
    {
        title: 'Инструкция по установке',
        url: '/install',
        description: 'Установка Diplodoc',
        tags: ['инструкция'],
    },
];

const TagSearchDemo = ({selectedTags: initialTags = []}: {selectedTags?: string[]}) => {
    const [query, setQuery] = useState('мета');
    const [selectedTags, setSelectedTags] = useState(initialTags);
    const matches = tagItems.filter((item) =>
        `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase()),
    );
    const tags = ['информация', 'мета', 'инструкция'];
    const tagCounts = Object.fromEntries(
        tags.map((tag) => [tag, matches.filter((item) => item.tags.includes(tag)).length]),
    );
    const items = matches.filter(
        (item) => !selectedTags.length || item.tags.some((tag) => selectedTags.includes(tag)),
    );

    return (
        <SearchPage
            query={query}
            onSubmit={setQuery}
            items={items}
            page={1}
            totalItems={items.length}
            onPageChange={() => {}}
            hasRequest={true}
            selectedTags={selectedTags}
            onResetFilters={() => setSelectedTags([])}
            filters={
                <TagsFilter
                    tags={tags}
                    selectedTags={selectedTags}
                    tagCounts={tagCounts}
                    onChange={setSelectedTags}
                />
            }
        />
    );
};

export const TagFilters = {
    render: () => <TagSearchDemo />,
};

export const EmptyTagIntersection = {
    render: () => <TagSearchDemo selectedTags={['инструкция']} />,
};
