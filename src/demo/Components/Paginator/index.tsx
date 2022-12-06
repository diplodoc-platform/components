import React, {useState} from 'react';

import {Paginator} from '../../../index';

const PaginatorDemo = () => {
    const [page, setPage] = useState(1);

    return (
        <Paginator
            totalItems={15}
            onPageChange={(newPage) => setPage(newPage)}
            className={''}
            isMobile={true}
            itemsPerPage={5}
            maxPages={3}
            page={page}
        />
    );
};

export default PaginatorDemo;
