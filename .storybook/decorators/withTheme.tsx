import type {Decorator} from '@storybook/react-vite';

import {Provider} from '@gravity-ui/uikit';

export const WithTheme: Decorator = (Story, context) => {
    return (
        <Provider theme={context.globals.theme || 'dark'} direction={context.globals.direction}>
            <Story />
        </Provider>
    );
};
