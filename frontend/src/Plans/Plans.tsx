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
import APIUtils from "../utils/APIUtils.ts";
import {Room, SubjectDetails, Courses} from "../../services/databaseTypes.tsx";
import RoomPopup from "../Components/Popups/RoomPopup.tsx";


type ObiektNew = {
    id: string,
    name: string,
    type: string,
    color: string,
    isweekly: boolean,
    x: number,
    y: number,
    isset: boolean
    group?: number
};

type Buildings = {
    id: string,
    acronym: string,
    name: string,
    address: string;
    rooms: Array<Room>;
}

type Faculties = {
    _id: string;
    acronym: string;
    name: string;
    buildings: Array<Buildings>;
    courses: Array<Courses>;
}

const kierunki: { [key: number]: string } = {
    1: "Informatyka",
    2: "Informatyka i Ekonometria",
    3: "Informatyka",
};

const grupy: { [key: number]: string } = {
    1: 'PS',
    2: 'W',
    3: 'LAB',
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


    const [acronym, setAcronym]  = useState<string>("");
    const [subjects, setSubjects] = useState<Array>([]);
    const [subjectsOnBoard, setSubjectsOnBoard] = useState<Array<ObiektNew>>([]);
    const [test, setTest] = useState<Array<SubjectDetails>>([]);
    const [groupTypes, setGroupTypes] = useState<Array<GroupInfo> | null>([])
    const [showCurrentDay, setShowCurrentDay] = useState<number>(6);
    const [fixedRows, setFixedRows]= useState<number>(14)
    const [timeTables, setTimeTables] = useState<dataType.Classdata | null>(null);// Fetch data from API when component mounts
    const [periods, setPeriods] = useState<Array<dataType.Periods> | null>(null)
    const [selectedGroupTypeCount, setSelectedGroupTypeCount] = useState<number>(1)
    const [popup, setPopup] = useState<boolean>(false)
    const [faculties, setFaculties] = useState<Array<Faculties>>([])
    const [courses, setCourses] = useState<Array<Courses>>([])

    const [selectedGroupType, setSelectedGroupType] = useState<string>("");
    const [selectedFacultyId, setSelectedFacultyId] = useState<string>("");
    const [selectedFaculty, setSelectedFaculty] = useState<Faculties>();
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [selectedCourse, setSelectedCourse] = useState();
    const [selectedSemester, setSelectedSemester] = useState<string>("");

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
            const data = await apiService.getFaculties();
            setFaculties(data);
        };

        fetchData();
    }, []);

    useEffect(() => {

    }, [selectedFacultyId]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getSubjectDetails();
            setTest(data)
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = APIUtils.getSubjectDetailsForSpecificSemesters(test, [Number(selectedSemester)]);
            setSubjects(data)
        };

        fetchData();
    }, [selectedSemester]);

    useEffect(() => {
        if (acronym) {
            function getObiektyByAcronym(subjects: any[], acronym: string, groupNumber: number): ObiektNew[] {
                return subjects.flatMap((item) =>
                    item.details
                        .filter((detail) => detail.classType.acronym === acronym)
                        .map((detail) => ({
                            id: `${item._id} ${groupNumber}`,
                            name: `${item.subject.name} ${groupNumber}`, // Append groupNumber to name
                            type: detail.classType.name,
                            color: detail.classType.color,
                            isweekly: detail.weeklyBlockCount > 0,
                            x: -1,
                            y: -1,
                            isset: false,
                            groups: groupNumber // Set groups to current groupNumber
                        }))
                );
            }

            // Accumulate results across multiple runs
            let allResults: ObiektNew[] = [];
            for (let i = 1; i <= selectedGroupTypeCount; i++) {
                const result = getObiektyByAcronym(subjects, acronym, i);
                allResults = [...allResults, ...result];
            }
            setSubjectsOnBoard(allResults)
            setLessons(allResults);
        }

    }, [acronym]);


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

    const handleFacultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFacultyId(event.target.value);
        setSelectedCourseId("");
        const faculty = faculties.find((faculty) => faculty._id === event.target.value);
        setSelectedFaculty(faculty);
    };

    const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSemester(event.target.value);
    };

    const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedGroupType(event.target.value);
        if (selectedValue === '2') {  // W
            for (let i = 0; i < groupTypes.length; i++) {
                if (groupTypes[i].classType.acronym == 'W'){
                    setSelectedGroupTypeCount(groupTypes[i].groupCount);
                    setAcronym("W")
                }
            }
        }

        if (selectedValue === '1') {  // PS
            for (let i = 0; i < groupTypes.length; i++) {
                if (groupTypes[i].classType.acronym == 'PS'){
                    setSelectedGroupTypeCount(groupTypes[i].groupCount);
                    setAcronym("PS")
                }
            }
        }

        if (selectedValue === '3') {  // La
            for (let i = 0; i < groupTypes.length; i++) {
                if (groupTypes[i].classType.acronym == 'L'){
                    setSelectedGroupTypeCount(groupTypes[i].groupCount);
                    setAcronym("L")
                }
            }
        }
    };

    const handleKierunekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedCourseId(selectedValue);
    };

    const kierunkiOptions = selectedFacultyId ? Object.entries(kierunki) : [];
    const grupyOptions = Object.entries(grupy);

    const [lessons, setLessons] = useState([]);
    const [grid, setGrid] = useState<Array<Array<ObiektNew | null>>>([]);

    useEffect(() => {
        const updatedGrid: Array<Array<ObiektNew | null>> = Array(fixedRows)
            .fill(null)
            .map(() => Array(selectedGroupTypeCount).fill(null));

        lessons.forEach(item => {
            const { x, y } = item;
            if (x >= 0 && x < fixedRows && y >= 0 && y < selectedGroupTypeCount) {
                updatedGrid[x][y] = item;
            }
        });

        setGrid(updatedGrid);
    }, [lessons,  selectedGroupTypeCount, acronym, fixedRows]);

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

        const newGrid: Array<Array<ObiektNew | null>> = grid.map(row => [...row]);
        const draggedItem :ObiektNew = lessons.find(item => item.id === active.id);

        if(!draggedItem.name.includes((toCol+1).toString())) return;

        if (!draggedItem) return;

        if (draggedItem.isset === false || toId.includes('ugabuga')) {
            //Wkładaniew pasek boczny
            if (toId.includes('ugabuga')) {
                setLessons(prevLessons =>
                    prevLessons.map(item =>
                        item.id === draggedItem.id
                            ? { ...item, isset: false, x: -1, y: -1 }
                            : item
                    )
                );
                newGrid[draggedItem.x][draggedItem.y] = null;
                //Wyjmowanie z paska bocznego
            } else if (draggedItem.isset === false) {
                setPopup(true);
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
                setPopup(true);
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
        <>
            <h1 className='text-center'> PLAN ZAJĘĆ</h1>
        <div className='d-flex flex-row p-3 mx-3'>
            <div className="bg-secondary text-center w-15">
                <select
                    className="form-select"
                    aria-label="Default select example"
                    value={selectedFacultyId}
                    onChange={handleFacultyChange}
                >
                    <option value="" disabled hidden>Wybierz Wydział</option>
                    {faculties.map((faculty, index) => (
                        <option key={faculty._id} value={faculty._id}>
                            {faculty.name}
                        </option>
                    ))}
                </select>
                {selectedFacultyId && (
                    selectedFaculty?.courses ? (
                        <select
                        className="form-select"
                        aria-label="Default select example"
                        value={selectedCourseId}
                        onChange={handleKierunekChange}
                        >
                        <option value="" disabled hidden>Wybierz kierunek</option>
                        {kierunkiOptions.map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>): ("Brak kierunków do wyświetlenia")
                )}
                {selectedFacultyId && selectedCourseId && (
                    <select
                        className="form-select"
                        aria-label="Default select example"
                        value={selectedSemester}
                        onChange={handleSemesterChange}
                    >
                        <option value="" disabled hidden>Wybierz Semestr</option>
                        {/*{kierunkiOptions.map(([key, value]) => (*/}
                        {/*    <option key={key} value={key}>{value}</option>*/}
                        {/*))}*/}
                        <option value={4}>Semestr 4</option>
                    </select>
                )}
                {selectedSemester && (
                    <select
                        className="form-select"
                        aria-label="Default select example"
                        value={selectedGroupType}
                        onChange={handleGroupChange}
                    >
                        <option value="" disabled hidden>Wybierz typ grupy</option>
                        {grupyOptions.map(([key, value]) => (
                            <option key={key} value={key}>{value}</option>
                        ))}
                    </select>
                )}
            </div>
            <RoomPopup trigger={popup} setTrigger={setPopup}>

            </RoomPopup>
            <div className="mb-1 bg-secondary ms-5 d-flex flex-row w-100">
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <table
                        className="table table-striped table-hover table-bordered border-primary table-fixed-height w-100">
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
                                                <Draggable id={item.id} name={item.name} x={item.x} y={item.y} type={item.type} color={item.color} group={item.group}
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
                                <Draggable id={item.id} name={item.name} x={item.x} y={item.y} isset={item.isset} type={item.type} color={item.color} group={item.group}
                                           key={item.name}>
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




