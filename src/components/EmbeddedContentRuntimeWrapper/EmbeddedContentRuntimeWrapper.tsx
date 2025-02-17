import {EmbeddedContentRuntime} from '@diplodoc/html-extension/react';
import RuntimeIFrameURI from '@diplodoc/html-extension/iframe';
import React, {FC} from 'react';

export const EmbeddedContentRuntimeWrapper: FC = () => (
    <EmbeddedContentRuntime isolatedSandboxHostURIOverride={RuntimeIFrameURI as string} />
);
