import React, { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Stack } from '@mui/material';

interface DroppableProps {
    id: string;
    children: ReactNode;
}

export const Droppable: React.FC<DroppableProps> = (props) => {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
    });

    let style;
    if (props.id === 'subjectsDroppable') {
        style = {
            opacity: isOver ? 0.6 : 1,
            display: 'flex',
            padding: '16px',
            backgroundColor: 'transparent',
        };
    } else {
        style = {
            opacity: isOver ? 0.6 : 1,
        };
    }

    return (
        <Stack
            spacing={ 2 }
            id={ props.id }
            style={ style }
            ref={ setNodeRef }
        >
            { props.children }
        </Stack>
    );
}

export default Droppable;
