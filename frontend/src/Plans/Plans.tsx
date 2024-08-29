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
        //właściwa funckja podmiany pól etc.
        // @ts-ignore
        if(active.data.current.isset == false || toId.includes('ugabuga')){
            if( toId.includes('ugabuga')){
                setLessons(prevData =>
                    prevData.map(item =>
                        item.id === active.data.current.id
                            ? { ...item, isset: !item.isset, x: -1, y: -1} // Toggle the `isset` value
                            : item
                    )
                );
                newGrid[active.data.current.x][active.data.current.y] = null;
                setGrid(newGrid)
                console.log(active.data.current)
                // @ts-ignore
            }else if(active.data.current.isset == false){
                console.log("isset = false")
                if(checkCoordinates(toRow, toCol)){
                    return;
                }
                // @ts-ignore
                active.data.current.x = toRow;
                // @ts-ignore
                active.data.current.y = toCol;
                setLessons(prevData =>
                    prevData.map(item =>
                        item.id === active.data.current.id
                            ? { ...item, isset: !item.isset, x:toRow, y:toCol } // Toggle the `isset` value
                            : item
                    )
                );
                // @ts-ignore
                newGrid[toRow][toCol] = active.data.current;
                setGrid(newGrid);
            }
        }else{
            //tutaj obsługa dragów tlyko w obrębie tabeli

            // Prevent placing more than one item in a slot
            if (grid[toRow][toCol] === null) {
                console.log("Setuje")
                setLessons(prevData =>
                    prevData.map(item =>
                        item.id === active.data.current.id
                            ? { ...item, x:toRow, y:toCol }
                            : item
                    )
                );
                // Move the item to the new slot
                // @ts-ignore
                newGrid[toRow][toCol] = active.data.current;
                newGrid[fromRow][fromCol] = null;
                setGrid(newGrid);
                console.log(newGrid)
            }
        }
        console.log(active.data.current)
        console.log(document.getElementById("ugabuga"))
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