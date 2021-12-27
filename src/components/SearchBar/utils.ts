import Mark from 'mark.ts';

export interface HighlightOptions {
    html: string;
    keywords: string[];
    options: {
        className: string;
        element: string;
        exclude: string[];
    };
}

export function highlight({html, keywords, options}: HighlightOptions) {
    const tmpDiv = document.createElement('div');
    tmpDiv.innerHTML = html;

    const markInstance = new Mark(tmpDiv);
    markInstance.mark(keywords, options);

    return tmpDiv.innerHTML;
}

export function scrollToItem(item: Element) {
    if (!item) {
        return;
    }

    item.scrollIntoView({
        block: 'center',
        inline: 'center',
    });
}

type GetItemIndexInView = {
    elements: Element[];
    offset?: number;
    top?: number;
    bottom?: number;
    reverse?: boolean;
};

function getElementOffset(item: HTMLElement, offset = 0) {
    return Math.floor(Number((item as HTMLElement).getBoundingClientRect().top)) - offset;
}

export function getItemIndexInView({
    elements,
    offset = 0,
    top = 0,
    bottom = Infinity,
    reverse = false,
}: GetItemIndexInView) {
    let itemIndex;
    for (let index = 0; index < elements.length; index++) {
        const item = elements[index];
        const itemOffset = getElementOffset(item as HTMLElement, offset);

        if (itemOffset >= top && itemOffset <= bottom) {
            itemIndex = index + 1;

            if (!reverse) {
                break;
            }
        }
    }

    return itemIndex;
}

type UseHighlightedItemInView = {
    highlightedDOMElements: Element[];
    headerHeight: number;
    hash?: string;
};

export function getHighlightedItemIndexInView({
    highlightedDOMElements,
    headerHeight,
    hash,
}: UseHighlightedItemInView) {
    const elements = highlightedDOMElements;
    const offset = headerHeight;
    let top = 0;

    if (hash && typeof document !== 'undefined') {
        const anchorEl = document.getElementById(hash) as HTMLElement;
        if (anchorEl) {
            top = getElementOffset(anchorEl, offset);
        }
    }

    const firstIndexInView = getItemIndexInView({top, elements, offset});
    const firstIndexOutViewBottom = getItemIndexInView({
        top: top + window.innerHeight,
        elements,
        offset,
    });
    const lastIndexOutViewTop = getItemIndexInView({
        top: -Infinity,
        bottom: top,
        reverse: true,
        elements,
        offset,
    });

    return firstIndexInView || firstIndexOutViewBottom || lastIndexOutViewTop;
}
