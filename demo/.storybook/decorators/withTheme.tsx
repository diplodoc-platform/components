import type {Decorator} from '@storybook/react';

// eslint-disable-next-line import/no-extraneous-dependencies
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
