import type {Decorator} from '@storybook/react-vite';

import {ThemeProvider} from '@gravity-ui/uikit';

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
