import React from 'react';
import {DocPage} from '../../../index';

import getPageInfo from './data';

const DocPageDemo = () => {
    const props = getPageInfo();

    return (
        <div className="Layout__content">
            <DocPage {...props}/>
        </div>
    );
};

export default DocPageDemo;
