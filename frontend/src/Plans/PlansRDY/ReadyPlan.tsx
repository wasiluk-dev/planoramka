import React, {useState, useEffect, useMemo} from 'react';
import {
    DndContext,
    closestCenter,
    DragEndEvent,
} from '@dnd-kit/core';
import Draggable from "./../Draggable.tsx";
import Droppable from "./../Droppable.tsx";
import './../plans.css';
import apiService from "../../../services/apiService.tsx";
import * as dataType from "../../../services/databaseTypes.tsx";



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

const  ReadyPlan: React.FC = () => {

    const [timeTables, setTimeTables] = useState<dataType.Classdata | null>(null);// Fetch data from API when component mounts
    const [periods, setPeriods] = useState<Array<dataType.Periods> | null>(null)
    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getTimeTables();
            setTimeTables(data); // Store fetched time tables in state
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getPeriods();
            setPeriods(data); // Store fetched time tables in state
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

    const normal = useMemo(() => {
        return periods?.filter((item) =>
            item.weekdays.includes(1)
        ).sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
    }, [periods]);


    const innormal = periods?.filter((item) =>
        item.weekdays.length != 5
    )

    // console.log(normal)
    // console.log(innormal)

    useEffect(() => {
        // Check if `normal` is defined and has a valid length
        if (!normal || normal.length === 0) return;

        const updatedGrid: Array<Array<Obiekt | null>> = Array(normal.length)
            .fill(null)
            .map(() => Array(7).fill(null));

        lessons.forEach(item => {
            const { x, y } = item;
            if (x >= 0 && x < 7 && y >= 0 && y < 7) {
                updatedGrid[x][y] = item;
            }
        });

        setGrid(updatedGrid);
    }, [normal, lessons]);

    console.log(timeTables)

    // @ts-ignore
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
                        </div>
                    )}
                </div>
                <div className="mb-1 bg-secondary ms-5 d-flex flex-row w-100">
                        <table className="table table-striped table-hover table-bordered border-primary">
                            <tbody>
                            {grid.map((row, rowIndex) => (
                                <tr key={rowIndex} className="table-dark">
                                    <th scope="col" className='col-1'>
                                        {normal? (normal[rowIndex].startTime +" - " + normal[rowIndex].endTime) : (<p>Loading...</p>)}
                                    </th>
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
                        <div className='flex-sm-grow-1 ms-5 w-15 bg-success'>
                        </div>
                </div>
            </div>
            {timeTables ? timeTables.map((timeTable) => (
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
            )) : <h1>Loading...</h1>}
        </>
    );
};

export default ReadyPlan;
