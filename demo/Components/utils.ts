import type {Theme} from '@diplodoc/components';

export function updateBodyClassName(theme: Theme) {
    const bodyEl = document.body;

    if (!bodyEl.classList.contains('g-root')) {
        bodyEl.classList.add('g-root');
    }

    bodyEl.classList.toggle('g-root_theme_light', theme === 'light');
    bodyEl.classList.toggle('g-root_theme_dark', theme === 'dark');
}
