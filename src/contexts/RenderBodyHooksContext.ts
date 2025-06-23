import {FC} from 'react';

import {RenderBodyProps} from '../components/DocPage';

import namedContext from './_namedContext';

export type RenderBodyWithHook = (c: FC<RenderBodyProps>) => FC<RenderBodyProps>;

export type RenderBodyHooks = RenderBodyWithHook[];

export default namedContext<RenderBodyHooks>('RenderBodyHooks', []);
