import {Lang} from 'src/models';

import namedContext from './_namedContext';

export default namedContext<Lang>('Lang', (process.env.DEFAULT_LANG as Lang) || Lang.En);
