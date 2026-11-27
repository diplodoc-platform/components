import {useState} from 'react';

import {NeuroExpertModal as Modal} from '@diplodoc/components';

const NeuroExpertModalDemo = ({projectId = 'example'}: {projectId?: string}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [alternateProject, setAlternateProject] = useState(false);

    const openChat = (question: string) => {
        setQuery(question);
        setOpen(true);
    };

    return (
        <>
            <button onClick={() => openChat('')}>Open empty chat</button>
            <button onClick={() => openChat('First question')}>Open with a question</button>
            <button onClick={() => setAlternateProject((current) => !current)}>
                Switch project
            </button>
            <Modal
                open={open}
                query={query}
                createChatOnInit={!query}
                projectId={alternateProject ? `${projectId}-other` : projectId}
                onClose={() => setOpen(false)}
            />
        </>
    );
};

export default {
    title: 'Components/NeuroExpertModal',
    component: NeuroExpertModalDemo,
};

export const NeuroExpertModal = {};
