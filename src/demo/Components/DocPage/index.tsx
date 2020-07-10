import React from 'react';
import {DocPage} from '../../../index';
import {getIsMobile} from '../../controls/settings';

import getPageInfo from './data';

const DocPageDemo = () => {
    const props = getPageInfo();
    const isMobile = getIsMobile();
    const tocTitleIcon = (
        <svg width="14" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* eslint-disable-next-line max-len */}
            <path d="M14 1.714C14 .771 13.213 0 12.25 0c-.962 0-1.75.771-1.75 1.714 0 .6.35 1.2.875 1.457v1.972h-3.5V3.17c.525-.342.875-.857.875-1.457C8.75.771 7.963 0 7 0c-.962 0-1.75.771-1.75 1.714 0 .6.35 1.2.875 1.457v1.972h-3.5V3.17c.525-.342.875-.857.875-1.457C3.5.771 2.713 0 1.75 0 .788 0 0 .771 0 1.714c0 .6.35 1.2.875 1.457v1.972c0 .943.788 1.714 1.75 1.714H3.5V8.83c-.525.342-.875.857-.875 1.457 0 .943.788 1.714 1.75 1.714.963 0 1.75-.771 1.75-1.714 0-.6-.35-1.2-.875-1.457V6.857h3.5V8.83c-.525.342-.875.857-.875 1.457 0 .943.788 1.714 1.75 1.714.963 0 1.75-.771 1.75-1.714 0-.6-.35-1.2-.875-1.457V6.857h.875c.963 0 1.75-.771 1.75-1.714V3.17c.525-.257.875-.857.875-1.457z" fill="#027BF3"/>
        </svg>
    );

    return (
        <div className={isMobile === 'true' ? 'mobile' : 'desktop'}>
            {props.fullScreen ? null :
                <div className="Layout__header">
                    <div className="Header"/>
                </div>
            }
            <div className="Layout__content">
                <DocPage {...props} tocTitleIcon={tocTitleIcon}/>
            </div>
        </div>
    );
};

export default DocPageDemo;
