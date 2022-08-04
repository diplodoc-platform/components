import {radios} from '@storybook/addon-knobs';

export function getHasSubscribe() {
    const label = 'Subscribe button';
    const options = {
        enabled: 'true',
        disabled: 'false',
    };
    const defaultValue = 'true';

    return radios(label, options, defaultValue);
}
