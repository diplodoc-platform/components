import '../src/demo/reset-storybook.scss';
import '../styles/default.scss';
import '../styles/typography.scss';
import '../styles/themes.scss';

import React from 'react';
import {configure, addDecorator, addParameters} from '@storybook/react';
import {withKnobs} from '@storybook/addon-knobs';
import {addReadme} from 'storybook-readme';

import withTheme from '../src/demo/decorators/withTheme';

addParameters({
    options: {
        panelPosition: 'right',
        theme: {
            brandTitle: 'Docs Components',
            brandUrl: 'https://github.yandex-team.ru/data-ui/docs-components',
        },
        showPanel: true,
    },
});
addDecorator(addReadme);
addDecorator(withKnobs);
addDecorator(withTheme);

addDecorator((Story, context) => (
    <main>
        <Story {...context} />
    </main>
));

function loadStories() {
    require('../src/stories/Components.stories');
}

configure(loadStories, module);
