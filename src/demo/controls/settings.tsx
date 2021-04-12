import {radios} from '@storybook/addon-knobs';

export function getIsMobile() {
    const label = 'Mobile version';
    const options = {
        enabled: 'true',
        disabled: 'false',
    };
    const defaultValue = 'false';

    return radios(label, options, defaultValue);
}
