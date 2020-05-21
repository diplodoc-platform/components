import {radios} from '@storybook/addon-knobs';
import {Lang} from '../../index';

export default function getLangControl() {
    const label = 'Language';
    const options = {
        ru: Lang.Ru,
        en: Lang.En,
    };
    const defaultValue = Lang.Ru;

    return radios(label, options, defaultValue);
}
