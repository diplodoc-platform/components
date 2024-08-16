import React from 'react';
import {ConsentPopup as Component} from '@diplodoc/components';
import {Button, TextInput} from '@gravity-ui/uikit';

import './index.scss';

const ConsentPopupDemo = () => {
    const router = {pathname: '/docs/overview/concepts/quotas-limits'};

    const [rerender, setRerender] = React.useState(1);
    const [gtmId, setGtmId] = React.useState('');

    const onResetButtonClick = () => {
        document.cookie = 'analyticsConsents=; Max-Age=0';
        setRerender(rerender + 1);
    };

    return (
        <React.Fragment>
            <TextInput value={gtmId} onUpdate={setGtmId} placeholder="GTM ID"></TextInput>
            <Button size="s" onClick={onResetButtonClick}>
                Reset consent
            </Button>
            <Component gtmId={gtmId} router={router} key={rerender} />
        </React.Fragment>
    );
};

export default {
    title: 'Components/ConsentPopup',
    component: ConsentPopupDemo,
};

export const ConsentPopup = {};
