import React, {useState} from 'react';
import cn from 'bem-cn-lite';
import {
    DocLeadingPage,
} from '../../../index';
import Header from '../Header/Header';
import {DEFAULT_SETTINGS} from '../../../constants';
import {getIsMobile} from '../../controls/settings';
import getLangControl from '../../controls/lang';
import pageContent from './page.json';
import {DocLeadingPageData} from '../../../models';

const layoutBlock = cn('Layout');

const DocLeadingPageDemo = () => {
    const langValue = getLangControl();
    const isMobile = getIsMobile();
    const router = {pathname: '/docs/compute'};

    const [fullScreen, onChangeFullScreen] = useState(DEFAULT_SETTINGS.fullScreen);
    const [lang, onChangeLang] = useState(langValue);

    return (
        <div className={isMobile === 'true' ? 'mobile' : 'desktop'}>
            <Header
                lang={lang}
                fullScreen={fullScreen}
                onChangeFullScreen={onChangeFullScreen}
                onChangeLang={onChangeLang}
            />
            <div className={layoutBlock('content')}>
                <DocLeadingPage
                    {...(pageContent as DocLeadingPageData)}
                    lang={lang}
                    router={router}
                />
            </div>
        </div>
    );
};

export default DocLeadingPageDemo;
