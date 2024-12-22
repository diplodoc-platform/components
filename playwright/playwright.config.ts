import {resolve} from 'path';
import {defineConfig, devices} from '@playwright/test';

import {BASE_URL} from '../src/components/constants';

function pathFromRoot(p: string) {
    // replace for Windows users
    return resolve(__dirname, '../', p).replace(/\\/g, '/');
}

export default defineConfig({
    testDir: pathFromRoot('src/components'),
    updateSnapshots: 'missing',
    snapshotPathTemplate:
        '{testDir}/{testFilePath}/../../__screenshots__/{arg}-{projectName}-{platform}{ext}',
    fullyParallel: false,
    forbidOnly: true,
    retries: 2,
    workers: 1,
    reporter: 'html',
    webServer: {
        reuseExistingServer: true,
        command: 'BROWSER=true npm run dev',
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
