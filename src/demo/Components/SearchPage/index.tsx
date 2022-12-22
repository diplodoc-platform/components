import React, {useState} from 'react';

import {ISearchItem, SearchPage} from '../../../index';
import {getIsMobile} from '../../controls/settings';
import getLangControl from '../../controls/lang';
import mockData from './data';

const SearchPageDemo = () => {
    const langValue = getLangControl();
    const isMobile = getIsMobile();
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
                itemOnClick={(item) => console.log('Click on search result', item)}
                irrelevantOnClick={(item) => console.log('Click on dislike button', item)}
                relevantOnClick={(item) => console.log('Click on like  button', item)}
                itemsPerPage={2}
                totalItems={mockData.length}
                lang={langValue}
            />
        </div>
    );
};

export default SearchPageDemo;
