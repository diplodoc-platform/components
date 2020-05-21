import {radios} from '@storybook/addon-knobs';
import {Vcs} from '../../index';

export default function getVcsControl() {
    const label = 'VCS';
    const options = {
        github: Vcs.Github,
        arcanum: Vcs.Arcanum,
    };
    const defaultValue = Vcs.Github;

    return radios(label, options, defaultValue);
}
