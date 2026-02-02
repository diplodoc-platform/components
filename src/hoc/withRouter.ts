import type {RouterData} from '../contexts/RouterContext';

import RouterContext from '../contexts/RouterContext';

import withPropContext from './_withContext';

export interface WithRouterProps {
    router: RouterData;
}

export default withPropContext<WithRouterProps>('router', RouterContext);
