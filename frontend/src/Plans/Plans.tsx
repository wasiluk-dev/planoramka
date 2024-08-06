import './plans.css'
import React, { useState } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import Droppable  from './Droppable.tsx';
import Draggable  from './Draggable.tsx';

const Plans: React.FC = () =>{
    const [parent, setParent] = useState<string | null>(null);
    const draggable = (
        <Draggable id="draggable">
            Go ahead, drag me.
        </Draggable>
    );

    return (
        <DndContext onDragEnd={handleDragEnd}>
            {!parent ? draggable : null}
            <Droppable id="droppable">
                {parent === "droppable" ? draggable : 'Drop here'}
            </Droppable>
        </DndContext>
    );

    function handleDragEnd(event: DragEndEvent) {
        const { over } = event;
        setParent(!over ? null : over.id);
    }
};

export default Plans;