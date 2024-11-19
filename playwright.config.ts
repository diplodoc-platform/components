import {defineConfig, devices} from '@playwright/test';

import {BASE_URL} from './src/components/constants';

export default defineConfig({
    updateSnapshots: 'missing',
    snapshotPathTemplate: '{testFilePath}/../../__screenshots__/{arg}-{projectName}{ext}',
    fullyParallel: false,
    forbidOnly: true,
    retries: 2,
    workers: 1,
    reporter: 'html',
    webServer: {
        reuseExistingServer: true,
        command: 'npm run _storybook:watch',
        url: BASE_URL,
        timeout: 120 * 1000,
    },
    use: {
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome']},
        },

        {
            name: 'firefox',
            use: {...devices['Desktop Firefox']},
        },

        {
            name: 'webkit',
            use: {...devices['Desktop Safari']},
        },
    ],
});
