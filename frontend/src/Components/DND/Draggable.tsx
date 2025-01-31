import React, { ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Stack, Tooltip, Typography } from '@mui/material';

type DraggableProps = {
    id: string;
    name: string;
    type: string;
    color: string;
    children: ReactNode;
    x: number;
    y: number;
    isset: boolean;
    group?: number;
    setday?: number;
    teacher?: string;
    room?: string;
}

const Draggable: React.FC<DraggableProps> = ({ id, children, name, x, y, isset, color, setday, teacher, room }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
        data: {
            id: id,
            name: name,
            element: children,
            x: x,
            y: y,
            isset: isset,
            setday: setday,
        },
    });

    const style = {
        border: '1px solid black',
        backgroundColor: color,
        transform: CSS.Translate.toString(transform),
    };

    return (
        <Tooltip title={ (teacher || room) ? <Stack sx={{ alignItems: 'center' }}>
            { teacher && (
                <Typography variant="caption">{ 'Prowadzący: ' + teacher }</Typography>
            ) }
            { room && (
                <Typography variant="caption">{ 'Sala: ' + room }</Typography>
            ) }
        </Stack> : false }>
            <button
                className="btn btn-light fw-bold"
                id={ id }
                ref={ setNodeRef }
                style={ style }
                { ...attributes }
                { ...listeners }
            >
                { children }
            </button>
        </Tooltip>
    );
}

export default Draggable;
