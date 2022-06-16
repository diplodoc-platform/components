import {radios} from '@storybook/addon-knobs';

export function getIsBookmarked() {
    const label = 'Bookmark page';
    const options = {
        enabled: 'true',
        disabled: 'false',
    };
    const defaultValue = 'false';

    return radios(label, options, defaultValue);
}
