import {resolve} from 'path';
import {defineConfig, devices} from '@playwright/test';

import {BASE_URL} from '../src/components/constants';

function pathFromRoot(p: string) {
    // replace for Windows users
    return resolve(__dirname, '../', p).replace(/\\/g, '/');
}

export default defineConfig({
    testDir: pathFromRoot('src/components'),
    // updateSnapshots can be controlled via -u flag: npm run playwright -- -u
    // Keeping UPDATE_SNAPSHOTS env var for backward compatibility
    updateSnapshots: process.env.UPDATE_SNAPSHOTS ? 'all' : 'missing',
    snapshotPathTemplate:
        '{testDir}/{testFilePath}/../../__screenshots__/{arg}-{projectName}-{platform}{ext}',
    fullyParallel: false,
    forbidOnly: true,
    retries: 2,
    workers: 1,
    reporter: 'html',
    webServer: {
        reuseExistingServer: !process.env.IS_DOCKER, // Don't reuse in Docker to avoid conflicts
        command: process.env.IS_DOCKER 
            ? 'echo "[WEBSERVER] Starting storybook..." && BROWSER=true npm run dev 2>&1'
            : 'BROWSER=true npm run dev',
        url: BASE_URL,
        timeout: 300 * 1000, // Increased timeout for Docker/container environments (5 minutes)
        // In Docker, show stdout/stderr to debug webServer startup issues
        // This will show all storybook logs in real-time
        stdout: process.env.IS_DOCKER ? 'inherit' : 'pipe',
        stderr: process.env.IS_DOCKER ? 'inherit' : 'pipe',
    },
    use: {
        trace: 'on-first-retry',
        navigationTimeout: 60000, // 60 seconds for navigation in container environments
    },
    timeout: 60000, // Increase test timeout to 60 seconds

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // Use single process mode in Docker to avoid crashes on macOS
                launchOptions: process.env.IS_DOCKER ? {
                    args: ['--single-process'],
                } : undefined,
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
