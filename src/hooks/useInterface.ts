import {useContext} from 'react';

import {InterfaceContext} from '../contexts/InterfaceContext';

export function useInterface(name: string): boolean {
    const {isHidden} = useContext(InterfaceContext);

    return isHidden(name);
}
