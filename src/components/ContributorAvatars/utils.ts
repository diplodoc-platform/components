import {Contributor} from '../../models';

export function getName(contributor: Contributor, useFullName = false): string {
    return useFullName
        ? getUserIdentificator(contributor)
        : getShortContributorName(getUserIdentificator(contributor));
}

export function getUserIdentificator(contributor: Contributor): string {
    const {name, email, login} = contributor;

    return name || login || email;
}

function getShortContributorName(fullContributorName: string): string {
    return fullContributorName.split(' ').reduce((result, current, index) => {
        return index > 0 ? `${result} ${current.charAt(0)}.` : current;
    }, '');
}
