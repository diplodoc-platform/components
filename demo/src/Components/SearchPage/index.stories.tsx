import React, {useState} from 'react';
import {ISearchItem, SearchPage} from '@diplodoc/components';

import mockData from './data';

// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
const log = (...message: any[]) => console.log(...message);

const SearchPageDemo = (args) => {
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
