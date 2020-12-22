import {radios} from '@storybook/addon-knobs';
import {getThemeSelector} from '../decorators/withTheme';
import {TextSizes} from '../../models';

export default function getUserSettings() {
    return {
        fullScreen: getFullScreen(),
        wideFormat: getWideFormat(),
        showMiniToc: getShowMiniToc(),
        theme: getThemeSelector(),
        textSize: getTextSize(),
        singlePage: getSinglePage(),
    };
}

function getFullScreen() {
    const label = 'Full screen';
    const options = {
        enabled: 'true',
        disabled: 'false',
    };
    const defaultValue = 'false';

    return radios(label, options, defaultValue) === 'true';
}

function getSinglePage() {
    const label = 'Single page';
    const options = {
        enabled: 'true',
        disabled: 'false',
    };
    const defaultValue = 'false';

    return radios(label, options, defaultValue) === 'true';
}

function getWideFormat() {
    const label = 'Wide format';
    const options = {
        enabled: 'true',
        disabled: 'false',
    };
    const defaultValue = 'true';

    return radios(label, options, defaultValue) === 'true';
}

function getShowMiniToc() {
    const label = 'Show mini toc';
    const options = {
        enabled: 'true',
        disabled: 'false',
    };
    const defaultValue = 'true';

    return radios(label, options, defaultValue) === 'true';
}

function getTextSize() {
    const label = 'Text size';
    const options = {
        s: TextSizes.s,
        m: TextSizes.m,
        l: TextSizes.l,
    };
    const defaultValue = TextSizes.m;

    return radios(label, options, defaultValue);
}

export function getIsMobile() {
    const label = 'Mobile version';
    const options = {
        enabled: 'true',
        disabled: 'false',
    };
    const defaultValue = 'false';

    return radios(label, options, defaultValue);
}
