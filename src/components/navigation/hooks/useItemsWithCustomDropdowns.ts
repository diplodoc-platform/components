import type {NavigationDropdownItem, NavigationItemModel} from '@gravity-ui/page-constructor';

const useItemsWithCustomDropdowns = (
    leftItems: NavigationItemModel[],
    rightItems?: NavigationItemModel[],
) => {
    return [addMobileDropdownsTo(leftItems), rightItems ? addMobileDropdownsTo(rightItems) : []];
};

function addMobileDropdownsTo(items: NavigationItemModel[]) {
    const itemsWithCustomDropdowns: NavigationItemModel[] = [];

    items.forEach((item) => {
        itemsWithCustomDropdowns.push(item);

        if (item.type !== 'dropdown') {
            return;
        }

        itemsWithCustomDropdowns.push({
            ...item,
            type: 'MobileDropdown',
        } as unknown as NavigationDropdownItem);
    });

    return itemsWithCustomDropdowns;
}

export default useItemsWithCustomDropdowns;
