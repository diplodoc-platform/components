import {NavigationItemModel} from '@gravity-ui/page-constructor';

type CustomNavigationItemModel = NavigationItemModel & {type: string};

const useItemsWithCustomDropdowns = (
    leftItems: NavigationItemModel[],
    rightItems?: NavigationItemModel[],
) => {
    return [addMobileDropdownsTo(leftItems), rightItems ? addMobileDropdownsTo(rightItems) : []];
};

function addMobileDropdownsTo(items: CustomNavigationItemModel[]) {
    const itemsWithCustomDropdowns: CustomNavigationItemModel[] = [];

    items.forEach((item) => {
        itemsWithCustomDropdowns.push(item);

        if (item.type !== 'dropdown') {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newMobileItem: any = {};
        Object.assign(newMobileItem, item);
        newMobileItem.type = 'MobileDropdown';

        itemsWithCustomDropdowns.push(newMobileItem);
    });

    return itemsWithCustomDropdowns;
}

export default useItemsWithCustomDropdowns;
