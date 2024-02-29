/** @type { import('@storybook/react').Preview } */
import type {Preview} from '@storybook/react';

import {WithTheme} from './decorators/withTheme';

import './global.css';

const preview: Preview = {
    decorators: [WithTheme],
    parameters: {
        actions: {argTypesRegex: '^on[A-Z].*'},
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
};

export default preview;
