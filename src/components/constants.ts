export const ROOT_ELEMENT_SELECTOR = '#storybook-root';
export const BASE_URL = process.env.BASE_URL ?? 'http://localhost:6006';
export const DOC_PAGE_URL =
    BASE_URL + '/iframe.html?args=&id=pages-document--document&viewMode=story';
export const DOC_PAGE_HIDDEN_URL =
    BASE_URL + '/iframe.html?args=&id=pages-docpagehidden--doc-page-hidden&viewMode=story';
export const DOC_LEADING_PAGE_HIDDEN_URL =
    BASE_URL + '/iframe.html?args=&id=pages-leadinghidden--leading-hidden&viewMode=story';
export const DOC_PAGE_HEADER_HIDDEN_URL =
    BASE_URL + '/iframe.html?args=HideTocHeader:true&id=pages-document--document&viewMode=story';
export const DOC_PAGE_HEADER_SHOWN_URL =
    BASE_URL + '/iframe.html?args=HideTocHeader:false&id=pages-document--document&viewMode=story';
export const DOC_PAGE_FEEDBACK_HIDDEN_URL =
    BASE_URL + '/iframe.html?args=HideFeedback:true&id=pages-document--document&viewMode=story';
export const DOC_PAGE_FEEDBACK_SHOWN_URL =
    BASE_URL + '/iframe.html?args=HideFeedback:false&id=pages-document--document&viewMode=story';
