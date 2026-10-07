import {resolve} from 'path';
import {defineConfig} from '@playwright/test';

export default defineConfig({
    testDir: resolve(__dirname, '../src'),
    testMatch: '**/hooks/__tests__/*.spec.ts',
    forbidOnly: true,
    retries: 0,
    workers: 1,
    reporter: 'list',
    outputDir: '../test-results/unit',
});
