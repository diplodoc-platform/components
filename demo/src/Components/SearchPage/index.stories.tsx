/* eslint-disable no-console */

import React, {useState} from 'react';
import {ISearchItem, SearchPage} from '@diplodoc/components';

import mockData from './data';
import generativeSearchData from './searchData';

// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
const log = (...message: any[]) => console.log(...message);

type Args = {
    Mobile: string;
    GenerativeSearchLoading: boolean;
    GenerativeSearchError: boolean;
};

const SearchPageDemo = (args: Args) => {
    const isMobile = args['Mobile'];
    const generativeSearchLoading = args['GenerativeSearchLoading'];
    const generativeSearchError = args['GenerativeSearchError'];

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
                generativeSearchData={generativeSearchData}
                generativeSearchLoading={generativeSearchLoading}
                generativeSearchError={generativeSearchError}
                generativeExpandOnClick={(answer) =>
                    console.log('Click on generative answer expand', answer)
                }
                generativeSourceOnClick={(link) =>
                    console.log('Click on generative answer source', link)
                }
                generativeIrrelevantOnClick={(answer) =>
                    console.log('Click on generative answer dislike button', answer)
                }
                generativeRelevantOnClick={(answer) =>
                    console.log('Click on generative answer like button', answer)
                }
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
        GenerativeSearchLoading: {
            control: 'boolean',
        },
        GenerativeSearchError: {
            control: 'boolean',
        },
    },
};

export const Search = {
    args: {
        Mobile: false,
    },
};
