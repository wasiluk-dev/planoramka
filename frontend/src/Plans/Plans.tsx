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
        1: 'LAB',
        2: 'PS',
        3: 'W'
    },
    2: {
        1: 'LAB',
        2: 'PS',
        3: 'W'
    },
    3: {
        1: 'LAB',
        2: 'PS',
        3: 'W'
    }
};

const day ={
    0: "Niedziela",
    1: "Poniedziałek",
    2: "Wtorek",
    3: "Środa",
    4: "Czwartek",
    5: "Piątek",
    6: "Sobota",
}


type GroupInfo = {
    classType: {
        acronym: string;
        _id: string;
        }
    groupCount: number;
}


const Plans: React.FC = () => {

    const [groupTypes, setGroupTypes] = useState<Array<GroupInfo> | null>([])
    const [showCurrentDay, setShowCurrentDay] = useState<number>(6);
    const [fixedRows, setFixedRows]= useState<number>(14)
    const [timeTables, setTimeTables] = useState<dataType.Classdata | null>(null);// Fetch data from API when component mounts
    const [periods, setPeriods] = useState<Array<dataType.Periods> | null>(null)
    const [selectedGroupTypeCount, setSelectedGroupTypeCount] = useState<number>(1)
    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getTimeTables();
            setTimeTables(data); // Store fetched time tables in state
            setGroupTypes(data[0]?.groups)
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


    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getTimeTables();
            setTimeTables(data); // Store fetched time tables in state
            for (let i:number = 0; i < 7; i++){
                if(data[0]?.schedules[i].weekdays.includes(showCurrentDay)){
                    setFixedRows(data[0]?.schedules[i].periods.length);
                    break;
                }
            }
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

        if (selectedValue === '3') {  // W
            for (let i = 0; i < groupTypes.length; i++) {
                if (groupTypes[i].classType.acronym == 'W'){
                    setSelectedGroupTypeCount(groupTypes[i].groupCount);
                    console.log(selectedGroupTypeCount+ " W")
                }
            }
        }

        if (selectedValue === '2') {  // PS
            for (let i = 0; i < groupTypes.length; i++) {
                if (groupTypes[i].classType.acronym == 'PS'){
                    setSelectedGroupTypeCount(groupTypes[i].groupCount);
                    console.log(selectedGroupTypeCount+ " PS")
                }
            }
        }

        if (selectedValue === '1') {  // La
            for (let i = 0; i < groupTypes.length; i++) {
                if (groupTypes[i].classType.acronym == 'L'){
                    setSelectedGroupTypeCount(groupTypes[i].groupCount);
                    console.log(selectedGroupTypeCount + " L")
                }
            }
            // setLessons(data3);
        }
    };

    const kierunkiOptions = selectedWydzial ? Object.entries(kierunki[parseInt(selectedWydzial)]) : [];

    const [lessons, setLessons] = useState(data);
    const [grid, setGrid] = useState<Array<Array<Obiekt | null>>>([]);

    useEffect(() => {
        const updatedGrid: Array<Array<Obiekt | null>> = Array(fixedRows)
            .fill(null)
            .map(() => Array(selectedGroupTypeCount).fill(null));

        lessons.forEach(item => {
            const { x, y } = item;
            if (x >= 0 && x < fixedRows && y >= 0 && y < selectedGroupTypeCount) {
                updatedGrid[x][y] = item;
            }
        });

        setGrid(updatedGrid);
    }, [lessons,  selectedGroupTypeCount]);

    const changeDay = (newDay: number) => {
        setShowCurrentDay(newDay); // Set the new current day
        const schedule = timeTables[0]?.schedules.find(schedule => schedule.weekdays.includes(newDay));
        if (schedule) {
            setFixedRows(schedule.periods.length);
        }
        // updateTableData(); // Update table data whenever the day changes
    };

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

    console.log(groupTypes)

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
                    <table className="table table-striped table-hover table-bordered border-primary table-fixed-height w-100">
                        <tbody style={{height: '100%'}}>
                        <tr className="table-dark text-center">
                            <td className="table-dark text-center fw-bolder fs-5" colSpan={selectedGroupTypeCount + 1}>
                                <div className="d-flex justify-content-center"> {/* Flexbox container */}
                                    {Object.entries(day)
                                        .filter(([key]) => key !== '0') // Filter out the entry with key '0'
                                        .map(([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex-fill text-center me-2" // Flex item
                                            >
                                                {key === showCurrentDay.toString() ? (
                                                    <div className="fw-bold" role="button">{value}</div>
                                                ) : (
                                                    <div className="fw-light" role="button"
                                                         onClick={() => changeDay(parseInt(key))}>{value}</div>
                                                )}

                                            </div>
                                        ))
                                    }

                                    {/* Now display the entry with key '0' at the end */}
                                    {day['0'] && (
                                        <div
                                            key="0"
                                            className="flex-fill text-center me-2" // Flex item
                                        >
                                            {showCurrentDay.toString() === '0' ? (
                                                <div className="fw-bold" role="button">{day['0']}</div>
                                            ) : (
                                                <div className="fw-light" role="button"
                                                     onClick={() => changeDay(0)}>{day['0']}</div>
                                            )}
                                        </div>
                                    )}

                                </div>
                            </td>
                        </tr>
                        {grid.map((row, rowIndex) => (
                            <tr key={rowIndex} className="table-dark w-100">
                                <th scope="col" className="col-1 text-nowrap">
                                    {timeTables ? (
                                        (showCurrentDay == 0 || showCurrentDay == 6) && timeTables[0]?.schedules[1]?.periods[rowIndex] ? (
                                            timeTables[0].schedules[1].periods[rowIndex].startTime + ' - ' + timeTables[0].schedules[1].periods[rowIndex].endTime
                                        ) : (showCurrentDay > 0 && showCurrentDay < 6 && timeTables[0]?.schedules[0]?.periods[rowIndex] ? (
                                            timeTables[0].schedules[0].periods[rowIndex].startTime + ' - ' + timeTables[0].schedules[0].periods[rowIndex].endTime
                                        ) : ("Error in showing period per day!"))
                                    ) : (
                                        <p>Loading...</p>
                                    )}
                                </th>
                                {row.map((item, colIndex) => (
                                    <td key={colIndex} className="col-3 text-center" scope="col">
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
                    <div className='flex-sm-grow-1 ms-5 w-15 border border-black'>
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
        </>
    );
};

export default Plans;
