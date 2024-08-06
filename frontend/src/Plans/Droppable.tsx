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
    const style = {
        opacity: isOver ? 1 : 0.5,
    };

    return (
        <div ref={setNodeRef} style={style}>
            {props.children}
        </div>
    );
}
export default  Droppable;