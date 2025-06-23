import {FC} from 'react';

import {RenderBodyProps} from '../components/DocPage';

import namedContext from './_namedContext';

export type RenderBodyHook = (c: FC<RenderBodyProps>) => FC<RenderBodyProps>;

export type RenderBodyHooks = RenderBodyHook[];

export default namedContext<RenderBodyHooks>('RenderBodyHooks', []);
