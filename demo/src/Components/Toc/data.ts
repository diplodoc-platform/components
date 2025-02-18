import singlePageSettings from './single-page-toc-items.json';
import pageSettings from './page-toc-items.json';

export const getTocItems = (singlePage = false) => {
    return singlePage ? singlePageSettings : pageSettings;
};
