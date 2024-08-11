import React from 'react';
import {SearchItem as Component} from '@diplodoc/components';

import data from './page.json';

const SearchItemDemo = () => {
    return <Component item={data} />;
};

export default {
    title: 'Components/SearchItem',
    component: SearchItemDemo,
};

export const SearchItem = {};
