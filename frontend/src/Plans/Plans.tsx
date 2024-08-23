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
    isset?: boolean
};

const Plans: React.FC = () => {
    // Initialize a 7x7 grid with empty slots
    const initialGrid: Array<Array<Obiekt | null>> = Array(7)
        .fill(null)
        .map(() => Array(7).fill(null));
    initialGrid[0][0] = { id: 'Englisz', name: 'Englisz', x: 0, y: 0 };
    initialGrid[1][1] = { id: 'Polish', name: 'Polish', x: 1, y: 1 };

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
        console.log(toId);
        if(toId.includes('ugabuga')){
            console.log("Zawiera uga")
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
            console.log("TAAAAAAK");
            console.log(active)
            if( toId.includes('ugabuga')){
                let essa = document.getElementById("ugabuga");
                let essa_dwa = document.getElementById(active.data.current.id as string);
                essa.appendChild(essa_dwa)
                console.log(active.data.current.x)
                grid[active.data.current.x][active.data.current.y] = null;
                // setGrid(newGrid)
                active.data.current.isset = false;
                active.data.current.x = -1;
                active.data.current.y = -1;
                console.log(active.data.current)
                // @ts-ignore
            }else if(active.data.current.isset == false){
                // @ts-ignore
                active.data.current.x = toRow;
                // @ts-ignore
                active.data.current.y = toCol;
                // @ts-ignore
                document.getElementById(active.data.current.id).remove()
                // @ts-ignore
                newGrid[toRow][toCol] = active.data.current;
                setGrid(newGrid);
            }
        }else{
            //tutaj obsługa dragów tlyko w obrębie tabeli

            // Prevent placing more than one item in a slot
            if (grid[toRow][toCol] === null) {
                console.log("Setuje")
                // Move the item to the new slot
                // @ts-ignore
                active.data.current.x = toRow;
                // @ts-ignore
                active.data.current.y = toCol;
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
                <Draggable id={'jp'} name={'Dżapanizz'} x={-1} y={-1} isset={false}>
                    Dżapanizz
                </Draggable>
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