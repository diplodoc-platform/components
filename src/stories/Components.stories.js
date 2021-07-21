import React from 'react';
import {storiesOf} from '@storybook/react';
import Components from '../demo/Components';

// eslint-disable-next-line no-undef
const stories = storiesOf('Components', module);

stories.add('DocPage', () => {
    return (
        <Components.DocPage/>
    );
});

stories.add('DocLeadingPage', () => {
    return (
        <Components.DocLeadingPage/>
    );
});
