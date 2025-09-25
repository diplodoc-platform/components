import React from 'react';
import {ERROR_CODES, ErrorPage} from '@diplodoc/components';

type Args = {
    Title: string;
    Mobile: string;
    ErrorCode: string;
};

const ErrorPageDemo = (args: Args) => {
    const title = args['Title'];
    const isMobile = args['Mobile'];
    const errorCode = args['ErrorCode'];

    return (
        <div className={isMobile === 'true' ? 'mobile' : 'desktop'}>
            <ErrorPage
                code={Number(errorCode)}
                receiveAccessUrl={'Request access url'}
                errorTitle={title}
            />
        </div>
    );
};

export default {
    title: 'Pages/Error',
    component: ErrorPageDemo,
    argTypes: {
        Title: {
            control: 'text',
        },
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
        Title: '',
        Mobile: false,
        ErrorCode: ERROR_CODES,
    },
};
