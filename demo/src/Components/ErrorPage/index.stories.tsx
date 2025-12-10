import React from 'react';
import {ERROR_CODES, ErrorPage} from '@diplodoc/components';

import './index.scss';

type Args = {
    Title: string;
    Mobile: string;
    ErrorCode: string;
    ReceiveAccessText?: string;
    ReceiveAccessUrl?: string;
};

const ErrorPageDemo = (args: Args) => {
    const title = args['Title'];
    const isMobile = args['Mobile'];
    const errorCode = args['ErrorCode'];
    const receiveAccessText = args['ReceiveAccessText'] || '';
    const receiveAccessUrl = args['ReceiveAccessUrl'];

    const processedUrl = receiveAccessUrl?.trim();
    const renderMultiline = (text: string) => text.replace(/\r\n/g, '\n').replace(/\\n/g, '\n');

    return (
        <div className={isMobile === 'true' ? 'mobile' : 'desktop'}>
            <ErrorPage
                code={Number(errorCode)}
                receiveAccessText={renderMultiline(receiveAccessText)}
                receiveAccessUrl={processedUrl}
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
        ReceiveAccessText: {
            control: 'text',
        },
        ReceiveAccessUrl: {
            control: 'text',
        },
    },
};

export const Error = {
    args: {
        Title: '',
        Mobile: false,
        ErrorCode: ERROR_CODES,
        ReceiveAccessText: 'Request access',
    },
};
