import {NavigationItemModel} from '@gravity-ui/page-constructor';

type CustomNavigationItemModel = NavigationItemModel & {type: string};

const useItemsWithCustomDropdowns = (
    leftItems: NavigationItemModel[],
    rightItems?: NavigationItemModel[],
) => {
    const leftItemsWithCustomDropdowns: CustomNavigationItemModel[] = [];
    const rightItemsWithCustomDropdowns: CustomNavigationItemModel[] = [];

    leftItems.forEach((item) => {
        leftItemsWithCustomDropdowns.push(item);

        if (item.type !== 'dropdown') {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newMobileItem: any = {};
        Object.assign(newMobileItem, item);
        newMobileItem.type = 'MobileDropdown';

        leftItemsWithCustomDropdowns.push(newMobileItem);
    });

    if (rightItems) {
        rightItems.forEach((item) => {
            rightItemsWithCustomDropdowns.push(item);

            if (item.type !== 'dropdown') {
                return;
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newMobileItem: any = {};
            Object.assign(newMobileItem, item);
            newMobileItem.type = 'MobileDropdown';

            rightItemsWithCustomDropdowns.push(newMobileItem);
        });
    }

    return [leftItemsWithCustomDropdowns, rightItemsWithCustomDropdowns];
};

export default useItemsWithCustomDropdowns;
