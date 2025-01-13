import React, { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
// import Plans from "./Plans.tsx";

interface DroppableProps {
    id: string;
    children: ReactNode;
}

export const Droppable: React.FC<DroppableProps> = (props) => {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
    });
    let style
    if(props.id == 'ugabuga'){
        style = {
            opacity: isOver ? 0.6 : 1,
            width: '100px',
            minHeight: '100px',
            display: 'inline',
            backgroundColor: 'transparent',
            }

    }else {
        style = {
            opacity: isOver ? 0.6 : 1,
        };

    }
    return (
        <div ref={setNodeRef} style={style} id={props.id}>
            {props.children}
        </div>
    );
}
export default  Droppable;