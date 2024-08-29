import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    DragEndEvent,
} from '@dnd-kit/core';
import Draggable from "./Draggable.tsx";
import Droppable from "./Droppable.tsx";
import './plans.css'

type Obiekt = {
    id: string,
    name: string,
    x: number,
    y: number,
    isset: boolean
};

let data: Array<Obiekt> = [
    { id: 'Englisz', name: 'Englisz', x: 0, y: 5, isset: true },
    { id: 'Polish', name: 'Polish', x: 1, y: 1, isset: true },
    { id: 'Dżapanizz', name: 'Dżapanizz', x: -1, y: -1, isset: false }

];


const Plans: React.FC = () => {

    const [lessons, setLessons] = useState(data)

    // Function to check for an object with specific x and y coordinates
    const checkCoordinates = (x: number, y: number) => {
        const foundObject = lessons.find(item => item.x === x && item.y === y);

        if (foundObject) {
            // If an object is found, do something with it
            console.log(`Found object: ${foundObject.name} at coordinates (${x}, ${y})`);
            return true;

            // Example action: Update its `isset` property
        } else {
            console.log(`No object found at coordinates (${x}, ${y})`);
            return false;
        }
    };

    // Initialize a 7x7 grid with empty slots
    const initialGrid: Array<Array<Obiekt | null>> = Array(7)
        .fill(null)
        .map(() => Array(7).fill(null));
    data.forEach(item => {
        const { x, y } = item;

        // Check if x and y are within the bounds of the grid
        if (x >= 0 && x < 7 && y >= 0 && y < 7) {
            initialGrid[item.x][item.y] = item; // Place the item at the correct position
        }
    });


    const [grid, setGrid] = useState(initialGrid);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        console.log(active.data.current)
        if (!over) {
            return;
        }
        // Ensure IDs are strings and split correctly
        // const fromId = active.id as string;
        const toId = over.id as string;

        // @ts-ignore
        const fromRow = active.data.current.x;
        // @ts-ignore
        const fromCol = active.data.current.y;

        //Nie wiem czemu to tu tak działa, ale działa więc iks de
        let [toRow, toCol] = toId.split('_').map(Number);
        if(toId.includes('ugabuga')){
            toRow = -1;
            toCol = -1;
        }


        //sprawdzenie czy takie pola w ogóle są
        if (isNaN(fromRow) || isNaN(fromCol) || isNaN(toRow) || isNaN(toCol)) {
            console.log("AjDi not walid")

            return; // Exit if the IDs are not valid
        }
        console.log(fromRow)
        if (fromRow === toRow && fromCol === toCol) {
            //obsługa rzeczy spoza tabeli tutaj
            console.log("same place noobie")
            return; // Do nothing if the item is dropped in the same place
        }
        const newGrid: Array<Array<Obiekt | null>> = grid.map(row => [...row]);

        const draggedItem = lessons.find(item => item.id === active.id);

        if (!draggedItem) return; // Exit if no item is found

        if (draggedItem.isset === false || toId.includes('ugabuga')) {
            if (toId.includes('ugabuga')) {
                setLessons(prevLessons =>
                    prevLessons.map(item =>
                        item.id === draggedItem.id
                            ? { ...item, isset: false, x: -1, y: -1 }
                            : item
                    )
                );
                newGrid[draggedItem.x][draggedItem.y] = null;
            } else if (draggedItem.isset === false) {
                if (checkCoordinates(toRow, toCol)) return;

                const updatedItem = { ...draggedItem, isset: true, x: toRow, y: toCol };
                setLessons(prevLessons =>
                    prevLessons.map(item =>
                        item.id === draggedItem.id ? updatedItem : item
                    )
                );
                newGrid[toRow][toCol] = updatedItem;
            }
        } else {
            if (grid[toRow][toCol] === null) {
                const updatedItem = { ...draggedItem, x: toRow, y: toCol };
                setLessons(prevLessons =>
                    prevLessons.map(item =>
                        item.id === draggedItem.id ? updatedItem : item
                    )
                );
                newGrid[toRow][toCol] = updatedItem;
                newGrid[draggedItem.x][draggedItem.y] = null;
            }
        }

        setGrid(newGrid); // Update the grid state with the new grid
        console.log(grid)
    };

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <Droppable id='ugabuga'>
                {lessons.filter(item => !item.isset).map(item => (
                    <Draggable id={item.id} name={item.name} x={item.x} y={item.y} isset={item.isset} key={item.id}>
                        {item.name}
                    </Draggable>
                ))}
            </Droppable>
            <table>
                <tbody>
                {grid.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((item, colIndex) => (
                            <td key={colIndex}>
                                <Droppable id={`${rowIndex}_${colIndex}`}>
                                    {item && (
                                        <Draggable id={item.id} name={item.name} x={item.x} y={item.y} isset={true}>
                                            {item.name}
                                        </Draggable>
                                    )}
                                </Droppable>
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </DndContext>
    );
};


export default Plans;