import {NavigationItemModel} from '@gravity-ui/page-constructor';

type CustomNavigationItemModel = NavigationItemModel & {type: string};

const useItemsWithCustomDropdowns = (
    leftItems: NavigationItemModel[],
    rightItems?: NavigationItemModel[],
) => {
    const leftItemsWithCustomDropdowns: CustomNavigationItemModel[] = [];
    const rightItemsWithCustomDropdowns: CustomNavigationItemModel[] = [];

    leftItems.forEach((item) => {
        // leftItemsWithCustomDropdowns.push(item);

        if (item.type !== 'dropdown') {
            leftItemsWithCustomDropdowns.push(item);
            return;
        }

        // const newDesktopItem = {type: ''};
        const newMobileItem: any = {};

        // Object.assign(newDesktopItem, item);
        Object.assign(newMobileItem, item);

        // newDesktopItem.type = 'DesktopDropdown';
        newMobileItem.type = 'MobileDropdown';

        // leftItemsWithCustomDropdowns.push(newDesktopItem);
        leftItemsWithCustomDropdowns.push(newMobileItem);
    });

    if (rightItems) {
        rightItems.forEach((item) => {
            // leftItemsWithCustomDropdowns.push(item);

            if (item.type !== 'dropdown') {
                leftItemsWithCustomDropdowns.push(item);

                return;
            }

            const newMobileItem: any = {};
            Object.assign(newMobileItem, item);
            newMobileItem.type = 'MobileDropdown';

            leftItemsWithCustomDropdowns.push(newMobileItem);
        });
    }

    return [leftItemsWithCustomDropdowns, rightItemsWithCustomDropdowns];
};

export default useItemsWithCustomDropdowns;
