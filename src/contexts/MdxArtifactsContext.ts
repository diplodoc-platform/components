import namedContext from './_namedContext';

export type MdxArtifacts = Record<string, unknown>;

export default namedContext<MdxArtifacts>('MdxArtifactsContext', {});
