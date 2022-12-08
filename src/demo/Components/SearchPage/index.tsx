import React, {useState} from 'react';

import {ISearchItem, SearchPage} from '../../../index';
import {getIsMobile} from '../../controls/settings';
import getLangControl from '../../controls/lang';
import mockData from './data';

const SearchPageDemo = () => {
    const langValue = getLangControl();
    const isMobile = getIsMobile();
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('test');
    const [items, setItems] = useState(getItems(page, mockData));

    function getItems(newPage: number, data: ISearchItem[]): ISearchItem[] {
        return newPage === 1 ? data.slice(0, 2) : data.slice(2);
    }

    return (
        <div className={isMobile === 'true' ? 'mobile' : 'desktop'}>
            <SearchPage
                query={query}
                items={items}
                page={page}
                onQueryUpdate={setQuery}
                onPageChange={(newPage) => {
                    setPage(newPage);
                    setItems(getItems(newPage, mockData));
                }}
                onSubmit={() => setItems(getItems(page, mockData))}
                onItemClick={(item) => console.log('Add click analytics.', item)}
                itemsPerPage={2}
                totalItems={mockData.length}
                lang={langValue}
            />
        </div>
    );
};

export default SearchPageDemo;
