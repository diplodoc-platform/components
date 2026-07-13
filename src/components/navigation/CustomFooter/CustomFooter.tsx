import type {CustomFooterProps} from './types';

import React, {memo, useMemo} from 'react';
import {Footer, MobileFooter} from '@gravity-ui/navigation';

import {buildFooterProps} from './utils';
import './CustomFooter.scss';

export const CustomFooter: React.FC<CustomFooterProps> = memo((props) => {
    const footerProps = useMemo(() => buildFooterProps(props), [props]);

    return (
        <div className="dc-footer">
            <div className="dc-footer__desktop">
                <Footer {...footerProps} />
            </div>
            <div className="dc-footer__mobile">
                <MobileFooter {...footerProps} />
            </div>
        </div>
    );
});

CustomFooter.displayName = 'CustomFooter';

export default CustomFooter;
