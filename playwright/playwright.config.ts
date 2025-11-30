import {resolve} from 'path';
import {defineConfig, devices} from '@playwright/test';

import {BASE_URL} from '../src/components/constants';

function pathFromRoot(p: string) {
    return resolve(__dirname, '../', p).replace(/\\/g, '/');
}

export default defineConfig({
    testDir: pathFromRoot('src/components'),
    updateSnapshots: process.env.UPDATE_SNAPSHOTS ? 'all' : 'missing',
    snapshotPathTemplate:
        '{testDir}/{testFilePath}/../../__screenshots__/{arg}-{projectName}-{platform}{ext}',
    fullyParallel: false,
    forbidOnly: true,
    retries: 2,
    workers: 1,
    reporter: 'html',
    webServer: {
        reuseExistingServer: !process.env.IS_DOCKER,
        command: 'BROWSER=true npm run dev',
        url: BASE_URL,
        timeout: 300 * 1000,
    },
    use: {
        trace: 'on-first-retry',
        navigationTimeout: 60000,
    },
    timeout: 60000,

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                launchOptions: process.env.IS_DOCKER
                    ? {
                          args: ['--single-process'],
                      }
                    : undefined,
            },
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
