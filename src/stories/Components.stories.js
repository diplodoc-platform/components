import React from 'react';
import {storiesOf} from '@storybook/react';
import Components from '../demo/Components';

// eslint-disable-next-line no-undef
const stories = storiesOf('Components', module);

stories.add('DocPage', () => {
    return <Components.DocPage />;
});

stories.add('DocLeadingPage', () => {
    return <Components.DocLeadingPage />;
});

stories.add('ErrorPage', () => {
    return <Components.ErrorPage />;
});

stories.add('SearchPage', () => {
    return <Components.SearchPage />;
});

stories.add('Paginator', () => {
    return <Components.Paginator />;
});

stories.add('SearchItem', () => {
    return <Components.SearchItem />;
});

stories.add('Paginator', () => {
    return <Components.Paginator />;
});
