import type {DocPageProps, DocSettings, Lang} from '@diplodoc/components';

export type PageProps = Omit<DocPageProps, keyof DocSettings> &
    Required<Pick<DocPageProps, keyof DocSettings>>;

export interface ContentBundle {
    en: unknown;
    ru: unknown;
    he?: unknown;
    singleEn: unknown;
    singleRu: unknown;
}

export function createGetContent(bundle: ContentBundle) {
    const _bundle = bundle as Record<keyof ContentBundle, PageProps>;

    return (lang: Lang, singlePage: boolean) => {
        if (singlePage) {
            if (lang === 'ru') {
                return _bundle.singleRu;
            }

            return _bundle.singleEn;
        }

        if (lang === 'ru') {
            return _bundle.ru;
        }

        if (lang === 'he' && bundle.he) {
            return _bundle.he;
        }

        return _bundle.en;
    };
}
