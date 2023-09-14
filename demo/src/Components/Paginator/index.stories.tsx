import React, {useState} from 'react';

import {Paginator as Component} from '@diplodoc/components';

const PaginatorDemo = () => {
    const [page, setPage] = useState(1);

    return (
        <Component
            totalItems={15}
            onPageChange={setPage}
            className={''}
            isMobile={true}
            itemsPerPage={5}
            maxPages={3}
            page={page}
        />
    );
};

export default {
    title: 'Components/Paginator',
    component: PaginatorDemo,
};

export const Paginator = {};
