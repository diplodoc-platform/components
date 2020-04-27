import React from 'react';
import {configure, addDecorator, addParameters} from '@storybook/react';
import {withKnobs} from '@storybook/addon-knobs';
import {addReadme} from 'storybook-readme';

addParameters({
    options: {
        panelPosition: 'right',
        theme: {
            brandTitle: 'Docs Components',
            brandUrl: 'https://github.yandex-team.ru/data-ui/docs-components',
        },
    }
});
addDecorator(addReadme);
addDecorator(withKnobs);

addDecorator((Story, context) => (
    <main>
        <Pointerfocus/>
            <Story {...context}/>
    </main>
));

configure(require.context('../src/stories', true, /\.stories.tsx?$/), module);
