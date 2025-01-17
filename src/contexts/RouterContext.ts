import type {Query} from '../models';

export interface RouterData {
    page: string;
    pathname: string;
    query: Query;
    hash?: string;
    as: string;
    hostname: string;
    serverRouter?: RouterData;
}

import namedContext from './_namedContext';

export default namedContext<RouterData>('Request', {} as RouterData);
