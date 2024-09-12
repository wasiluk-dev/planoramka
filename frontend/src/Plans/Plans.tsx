import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    DragEndEvent,
} from '@dnd-kit/core';
import Draggable from "./Draggable.tsx";
import Droppable from "./Droppable.tsx";
import './plans.css';
import apiService from "../../services/apiService.tsx";
import * as dataType from "../../services/databaseTypes.tsx";



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

    const [timeTables, setTimeTables] = useState<dataType.Classdata | null>(null);
    // Fetch data from API when component mounts
    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getTimeTables();
            setTimeTables(data); // Store fetched time tables in state
        };

        fetchData();
    }, []);

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
        // @ts-ignore
        const fromRow = active.data.current.x;
        // @ts-ignore
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

    console.log(timeTables)

    return (
        <>
            <h1 className='text-center'> PLAN ZAJĘĆ</h1>
        <div className='d-flex flex-row p-3 mx-3'>
            <div className="bg-secondary text-center w-15">
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
                    <div className="">
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
                        {/*<p>Wybrano: Wydział {selectedWydzial},*/}
                        {/*    Kierunek {kierunki[selectedWydzial][selectedKierunek]}</p>*/}
                    </div>
                )}
            </div>
            <div className="mb-1 bg-secondary ms-5 d-flex flex-row w-100">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <table className="table table-striped table-hover table-bordered border-primary">
                        {/*<thead>*/}
                        {/*<tr  className="table-dark">*/}
                        {/*    <th scope="col">Pon</th>*/}
                        {/*    <th scope="col">Wt</th>*/}
                        {/*    <th scope="col">Śr</th>*/}
                        {/*    <th scope="col">i tak dalej :v</th>*/}
                        {/*</tr>*/}
                        {/*</thead>*/}
                        <tbody>
                        {grid.map((row, rowIndex) => (
                            <tr key={rowIndex} className="table-dark">
                                <th scope="col" className='col-1'>{rowIndex + 1}</th>
                                {row.map((item, colIndex) => (
                                    <td key={colIndex} className="table-dark col-1 text-center" scope="col">
                                        <Droppable id={`${rowIndex}_${colIndex}`}>
                                            {item && (
                                                <Draggable id={item.id} name={item.name} x={item.x} y={item.y}
                                                           isset={true}>
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
                    <div className='flex-sm-grow-1 ms-5 w-15'>
                        <Droppable id='ugabuga'>
                            {lessons.filter(item => !item.isset).map(item => (
                                <Draggable id={item.id} name={item.name} x={item.x} y={item.y} isset={item.isset}
                                           key={item.id}>
                                    {item.name}
                                </Draggable>
                            ))}
                        </Droppable>
                    </div>
                </DndContext>
            </div>
        </div>
            {timeTables.map((timeTable) => (
                <div key={timeTable._id}>
                    <h2>Semester {timeTable.targetedSemester}</h2>
                    {timeTable.classes.map((cls) => (
                        <div key={cls._id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
                            <h3>
                                {cls.subject.name} ({cls.subject.shortName}) - {cls.classType.name} ({cls.classType.acronym})
                            </h3>
                            <p>Organizer: {cls.organizer.fullName}</p>
                            <p>Room: {cls.room.roomNumber}</p>
                            <h4>Periods:</h4>
                            <ul>
                                {cls.periods.map((period) => (
                                    <li key={period._id}>
                                        Days: {period.weekdays.join(', ')} | Start: {period.startTime} | End: {period.endTime}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ))}
        </>
    );
};

export default Plans;
