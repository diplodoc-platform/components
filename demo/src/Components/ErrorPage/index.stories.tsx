import React from 'react';
import {ERROR_CODES, ErrorPage} from '@diplodoc/components';

const ErrorPageDemo = (args) => {
    const isMobile = args['Mobile'];
    const errorCode = args['ErrorCode'];

    return (
        <div className={isMobile === 'true' ? 'mobile' : 'desktop'}>
            <ErrorPage code={Number(errorCode)} receiveAccessUrl={'Request access url'} />
        </div>
    );
};

export default {
    title: 'Pages/Error',
    component: ErrorPageDemo,
    argTypes: {
        Mobile: {
            control: 'boolean',
        },
        ErrorCode: {
            control: 'select',
            options: ERROR_CODES,
        },
    },
};

export const Error = {
    args: {
        Mobile: false,
        ErrorCode: ERROR_CODES,
    },
};
