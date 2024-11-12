import React, { ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableProps {
    id: string;
    children: ReactNode;
    name: string;
    x: number;
    y: number;
    isset: boolean;
    type: string,
    color: string,
    group?: number,
}

const Draggable: React.FC<DraggableProps> = (props) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.id,
        data: {
            id: props.id,
            name: props.name,
            element: props.children,
            x: props.x,
            y: props.y,
            isset: props.isset,
        }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        backgroundColor: props.color,
        border: "1px solid black"
    };

    return (
            <button className='btn btn-light fw-bold' ref={setNodeRef} style={style} {...listeners} {...attributes} id={props.id}>
                {props.children}
            </button>

    );
}

export default Draggable;
