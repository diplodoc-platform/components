import {radios} from '@storybook/addon-knobs';

export function getIsSubscribe() {
    const label = 'Subscribe button';
    const options = {
        enabled: 'true',
        disabled: 'false',
    };
    const defaultValue = 'false';

    return radios(label, options, defaultValue);
}
