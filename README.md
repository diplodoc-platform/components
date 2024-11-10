[![NPM version](https://img.shields.io/npm/v/@diplodoc/components.svg?style=flat)](https://www.npmjs.org/package/@diplodoc/components)

# YFM Docs Components

Компоненты для Yandex Flavored Markdown Documentation.

## Installation

`npm i @diplodoc/components`

## Usage

Append js

```js
// In most cases append transform runtime
import "@doc-tools/transform/dist/js/yfm.js";

import {createRoot} from 'react-dom/client';
import {ThemeProvider} from '@gravity-ui/uikit';

// configure components
import {configure as configureUikit} from '@gravity-ui/uikit';
import {configure as configureDocs} from '@diplodoc/components';

configureUikit({lang: 'ru'});

// can be reconfigured in any moment
configureDocs({
    lang: 'ru',
    // optionally configure allowed translations
    loc: {ru, en, tr, ...}
})

// The theme must be applied. To do that wrap your app in ThemeProvider
const root = createRoot(document.getElementById('root'));
root.render(
    <ThemeProvider theme="light">
        <App />
    </ThemeProvider>,
);
```

Append css

```css
/*project.css*/

/*Append components styles*/
@import '@diplodoc/components';

/*Append components theme*/
@import '@diplodoc/components/themes/common';

/*In most cases append transform styles*/
@import '@doc-tools/transform/dist/css/yfm.css';
```

## Development

To build the project correctly you need to install `python@2`.
Visit [python.org/downloads](https://www.python.org/downloads/release/python-2718/) to get the latest version.

Install Dependencies

```shell
npm ci
cd demo && npm ci
```

To start the development server with storybook run the following:

```shell
npm run dev
```

## Testing

We use [Playwright](https://playwright.dev/docs/intro) for testing.

### Preparation

You need to add `.env` file in repository's root directory with the data below:

```bash
# The URL where Storybook is running
BASE_URL= # for example:'http://localhost:6006'
```

### Running tests

All tests:

```bash
# run storybook (if it is not running) and run tests
npm run test
```

Single test:

```bash
# run storybook (if it is not running) and run test
npm run test test_name.spec.ts
```

### Test reports

```bash
npx playwright show-report
```

### Updating tests

`**.spec.ts` files contain test code.

`**.spec.ts-snapshots` folders contain screenshots which are used for comparison with test screenshots. If screenshot is incorrect you can delete it and after the tests playwright will replace it with test screenshot.

## License

MIT
