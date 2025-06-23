import namedContext from './_namedContext';

export type MdxArtifacts = Record<string, unknown>;

export const MdxArtifactsContext = namedContext<MdxArtifacts | undefined>(
    'MdxArtifacts',
    undefined,
);
