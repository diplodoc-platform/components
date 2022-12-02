import React from 'react';

import {ErrorPage} from '../../../index';
import {getIsMobile} from '../../controls/settings';
import getLangControl from '../../controls/lang';
import {radios, text} from '@storybook/addon-knobs';

enum ErrorOptions {
    ACCESS_DENIED = '403',
    NOT_FOUND = '404',
    SERVER_ERROR = '500',
}

const ErrorPageDemo = () => {
    const langValue = getLangControl();
    const isMobile = getIsMobile();
    const errorCode = getErrorCode();

    return (
        <div className={isMobile === 'true' ? 'mobile' : 'desktop'}>
            <ErrorPage
                lang={langValue}
                code={Number(errorCode)}
                receiveAccessUrl={text('Request access url', '')}
            />
        </div>
    );
};

function getErrorCode() {
    return radios('Errors', ErrorOptions, ErrorOptions.SERVER_ERROR);
}

export default ErrorPageDemo;
