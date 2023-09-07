import {Config, Lang} from '../models';

import {configureI18N} from './i18n';

type Subscriber = (config: Config) => void;

const subs: Set<Subscriber> = new Set();

let config: Config = {
    lang: Lang.En,
};

export const configure = (newConfig: Partial<Config> = {}) => {
    config = Object.assign({}, config, newConfig);

    configureI18N({
        lang: config.lang,
        loc: config.loc,
    });

    subs.forEach((sub) => {
        sub(config);
    });
};

export const subscribeConfigure = (sub: Subscriber) => {
    subs.add(sub);

    return () => {
        subs.delete(sub);
    };
};

export const getConfig = () => config;
