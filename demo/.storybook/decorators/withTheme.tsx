import type {Decorator} from '@storybook/react';

import {ThemeProvider} from '@gravity-ui/uikit';
import React from 'react';

export const WithTheme: Decorator = (Story, context) => {
    return (
        <ThemeProvider
            theme={context.globals.theme || 'dark'}
            direction={context.globals.direction}
        >
            <Story />
        </ThemeProvider>
    );
};
