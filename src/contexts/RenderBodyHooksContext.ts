import type {FC} from 'react';
import type {RenderBodyProps} from '../components/DocPage';

import namedContext from './_namedContext';

export type RenderBodyHook = (c: FC<RenderBodyProps>) => FC<RenderBodyProps>;

export type RenderBodyHooks = RenderBodyHook[];

export const RenderBodyHooksContext = namedContext<RenderBodyHooks>('RenderBodyHooks', []);
