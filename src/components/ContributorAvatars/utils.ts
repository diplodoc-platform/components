import {Contributor} from '../../models';

export function getName(contributor: Contributor, useFullName = false): string {
    const {name, email, login} = contributor;

    const contributorName = useFullName
        ? name
        : getShortContributorName(name);

    return contributorName || email || login;
}

function getShortContributorName(fullContributorName: string): string {
    return fullContributorName
        .split(' ')
        .reduce((result, current, index) => {
            return index > 0 ? `${result} ${current.charAt(0)}.` : current;
        }, '');
}
