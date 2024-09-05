import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    DragEndEvent,
} from '@dnd-kit/core';
import Draggable from "./Draggable.tsx";
import Droppable from "./Droppable.tsx";
import './plans.css';

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

let data2: Array<Obiekt> = [
    { id: 'Englisz', name: 'Englisz', x: 0, y: 5, isset: true },
    { id: 'Polish', name: 'Polish', x: 1, y: 1, isset: true },
    { id: 'Dżapanizz', name: 'Dżapanizz', x: -1, y: -1, isset: false }
];

let data3: Array<Obiekt> = [
    { id: 'Englisz', name: 'Englisz', x: 0, y: 0, isset: true },
    { id: 'Polish', name: 'Polish', x: 1, y: 5, isset: true },
    { id: 'Dżapanizz', name: 'Dżapanizz', x: -1, y: -1, isset: false },
    { id: 'Rusrus', name: 'Rusrus', x: -1, y: -1, isset: false }
];

const kierunki: { [key: number]: { [key: number]: string } } = {
    1: {
        1: 'K1_1',
        2: 'K1_2',
        3: 'K1_3'
    },
    2: {
        1: 'K2_1',
        2: 'K2_2',
        3: 'K2_3'
    },
    3: {
        1: 'K3_1',
        2: 'K3_2',
        3: 'K3_3'
    }
};

const Plans: React.FC = () => {
    const [selectedWydzial, setSelectedWydzial] = useState<string>("");
    const [selectedKierunek, setSelectedKierunek] = useState<string>("");

    const handleWydzialChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWydzial(event.target.value);
        setSelectedKierunek("");
    };

    const handleKierunekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedKierunek(selectedValue);

        if (selectedValue === '3') {  // Assuming '3' is the key for 'K3_3'
            setLessons(data3);
        }
    };

    const kierunkiOptions = selectedWydzial ? Object.entries(kierunki[parseInt(selectedWydzial)]) : [];

    const [lessons, setLessons] = useState(data);
    const [grid, setGrid] = useState<Array<Array<Obiekt | null>>>([]);

    useEffect(() => {
        const updatedGrid: Array<Array<Obiekt | null>> = Array(7)
            .fill(null)
            .map(() => Array(7).fill(null));

        lessons.forEach(item => {
            const { x, y } = item;
            if (x >= 0 && x < 7 && y >= 0 && y < 7) {
                updatedGrid[x][y] = item;
            }
        });

        setGrid(updatedGrid);
    }, [lessons]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        console.log(active.data.current);
        if (!over) {
            return;
        }

        const toId = over.id as string;
        const fromRow = active.data.current.x;
        const fromCol = active.data.current.y;

        let [toRow, toCol] = toId.split('_').map(Number);
        if (toId.includes('ugabuga')) {
            toRow = -1;
            toCol = -1;
        }

        if (isNaN(fromRow) || isNaN(fromCol) || isNaN(toRow) || isNaN(toCol)) {
            console.log("AjDi not walid");
            return;
        }

        if (fromRow === toRow && fromCol === toCol) {
            console.log("same place noobie");
            return;
        }

        const newGrid: Array<Array<Obiekt | null>> = grid.map(row => [...row]);
        const draggedItem = lessons.find(item => item.id === active.id);

        if (!draggedItem) return;

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
                if (grid[toRow][toCol]) return;

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
                newGrid[draggedItem.x][draggedItem.y] = null;
            }
        }

        setGrid(newGrid);
    };

    return (
        <div className="p-3 mb-2 bg-secondary">
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
            <div className="bg-secondary col-2">
                <select
                    className="form-select"
                    aria-label="Default select example"
                    value={selectedWydzial}
                    onChange={handleWydzialChange}
                >
                    <option value="" disabled hidden>Wybierz wydział</option>
                    <option value="1">Wydział 1</option>
                    <option value="2">Wydział 2</option>
                    <option value="3">Wydział 3</option>
                </select>

                {selectedWydzial && (
                    <div className="mt-2">
                        <select
                            className="form-select"
                            aria-label="Default select example"
                            value={selectedKierunek}
                            onChange={handleKierunekChange}
                        >
                            <option value="" disabled hidden>Wybierz kierunek</option>
                            {kierunkiOptions.map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedKierunek && (
                    <div className="mt-2">
                        <p>Wybrano: Wydział {selectedWydzial}, Kierunek {kierunki[selectedWydzial][selectedKierunek]}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Plans;
