export const CLASSNAME = 'dc-search-highlighted';

export const CLASSNAME_SELECTED = 'dc-search-highlighted_selected';

export const HIGHLIGHT_OPTIONS = {
    element: 'span',
    className: CLASSNAME,
    exclude: [
        `.${CLASSNAME}`, // Exclude the elements to highlight to avoid duplicating the highlight
        'svg *'
    ],
};
