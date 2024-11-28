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
import {Room, SubjectDetails, Courses, Semesters, Periods} from "../../services/databaseTypes.tsx";
import RoomPopup from "../Components/Popups/RoomPopup.tsx";
import {scheduler} from "node:timers/promises";


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

type GroupInSemester ={
    acronym: string | null;
    name: string;
    _id: string;
}


const Plans: React.FC = () => {


    const [subjectTypeName, setSubjectTypeName]  = useState<string>("");
    const [subjectTypeId, setSubjectTypeId]  = useState<string>("");
    const [subjects, setSubjects] = useState<Array>([]);
    const [test, setTest] = useState<Array<SubjectDetails>>([]);
    const [groupTypes, setGroupTypes] = useState<Array<GroupInfo> | null>([])
    const [showCurrentDay, setShowCurrentDay] = useState<number>(5);
    const [fixedRows, setFixedRows]= useState<number>(1)
    const [timeTables, setTimeTables] = useState<Array<dataType.Classdata> | null>(null);// Fetch data from API when component mounts
    const [selectedTimeTable, setSelectedTimeTable] = useState<dataType.Classdata | null>(null)
    const [selectedGroupTypeCount, setSelectedGroupTypeCount] = useState<number>(1)
    const [popup, setPopup] = useState<boolean>(true)
    const [faculties, setFaculties] = useState<Array<Faculties>>([])
    const [courses, setCourses] = useState<Array<Courses>>([])

    const [semesterList, setSemesterList] = useState<Array<Semesters>>([])
    const [groupTypeList, setGroupTypeList] = useState<Array<GroupInSemester>>([])
    const [selectedGroupType, setSelectedGroupType] = useState<string>("");
    const [selectedFacultyId, setSelectedFacultyId] = useState<string>("");
    const [selectedFaculty, setSelectedFaculty] = useState<Faculties>();
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [selectedCourse, setSelectedCourse] = useState<Courses>();
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<number>(0);


    useEffect(() => {
        if(selectedSemesterId && timeTables){
            setSelectedTimeTable(timeTables.find((item) => item.semester === selectedSemesterId))
        }

    }, [selectedSemesterId]);


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

    }, []);

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
        if (subjectTypeId) {
            function getObiektyById(subjects: any[], id: string, groupNumber: number): ObiektNew[] {
                return subjects.flatMap((item) =>
                    item.details
                        .filter((detail) => detail.classType._id === id)
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
                const result = getObiektyById(subjects, subjectTypeId, i);
                allResults = [...allResults, ...result];
            }
            setLessons(allResults);

        }

    }, [subjectTypeId]);

    useEffect(() => {
        //Trzeba tutaj dodać ile jest grup bazując na timetables i na podstawie tego je wyświetlać
        // const result = selectedTimeTable.groups.find((group, index) => group[index].classType._id === subjectTypeId);
//TODO: wyświetlanie grup po ich wybraniu
    }, [subjectTypeId]);



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
        setLessons([])
        setSelectedSemesterId("")
        setSelectedCourseId("")
        const faculty = faculties.find((faculty) => faculty._id === event.target.value);
        setSelectedFaculty(faculty);
        setCourses(faculty.courses)
        setSelectedGroupType("")
    };

    const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSemesterId(event.target.value);
        setLessons([])
        setSelectedGroupType("")
        const getsemester = semesterList.find((semester) => semester._id === event.target.value);
        setSelectedSemester(getsemester.index);
        const selectedSemesterGroups = APIUtils.getSemesterClassTypes(semesterList, event.target.value)
        if(selectedSemesterGroups && selectedSemesterGroups.length > 0){
            setGroupTypeList(selectedSemesterGroups)
        }

    };

    const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // const selectedValue : string = event.target.value;
        setSelectedGroupType(event.target.value);

        for(let i= 0; i<groupTypeList.length; i++){
            if(groupTypeList[i]._id === event.target.value){
                setSubjectTypeName(groupTypeList[i].name)
                setSubjectTypeId(groupTypeList[i]._id)
                setSelectedGroupTypeCount(1);
                break;
            }
        }

        // if (selectedValue === '2') {  // W
        //     for (let i = 0; i < groupTypes.length; i++) {
        //         if (groupTypes[i].classType.acronym == 'W'){
        //             setSelectedGroupTypeCount(groupTypes[i].groupCount);
        //             setSubjectTypeName("W")
        //         }
        //     }
        // }else
        //
        // if (selectedValue === '1') {  // PS
        //     for (let i = 0; i < groupTypes.length; i++) {
        //         if (groupTypes[i].classType.acronym == 'PS'){
        //             setSelectedGroupTypeCount(groupTypes[i].groupCount);
        //             setSubjectTypeName("PS")
        //         }
        //     }
        // }else
        //
        // if (selectedValue === '3') {  // La
        //     for (let i = 0; i < groupTypes.length; i++) {
        //         if (groupTypes[i].classType.acronym == 'L'){
        //             setSelectedGroupTypeCount(groupTypes[i].groupCount);
        //             setSubjectTypeName("L")
        //         }
        //     }
        // }else {
        //     setSubjectTypeName("N")
        // }
    };
    const handleKierunekChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const course = courses.find((course) => course._id === event.target.value);
        setSelectedCourseId(selectedValue);
        setSelectedCourse(course)
        setLessons([])
        setSelectedSemesterId("")
        setSemesterList(course.semesters || [])
        setSelectedGroupType("")
    };


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

    }, [fixedRows, lessons,  selectedGroupTypeCount, subjectTypeId]);

    const changeDay = (newDay: number) => {
        setShowCurrentDay(newDay); // Set the new current day
        let i: number = 0;
        if (newDay == 0 || newDay == 6) {
            i = 1;
        } else if (newDay >= 1 && newDay <= 5) {
            i = 0;
        } else {
            console.error("Invalid day selected!");
            return;
        }

        const epic = selectedTimeTable?.schedules[i]?.periods;

        if (!epic) {
            console.error(`No schedule data available for day ${newDay}`);
            setFixedRows(0); // Or handle the error in a user-friendly way
            return;
        }

        setFixedRows(epic.length);
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

        if(!draggedItem.name.includes((toCol+1).toString()) && !toId.includes('ugabuga')){
            return
        }

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

    console.log(groupTypeList)
    console.log(selectedTimeTable)
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
                        {courses.map((course) => (
                            course.specialization ? (
                                <option key={course._id} value={course._id}>{course.name + " (" + course.specialization + ")"}</option>
                            ) : ( <option key={course._id} value={course._id}>{course.name}</option>)
                        ))}
                    </select>): ("Brak danych do wyświetlenia")
                )}
                {selectedFacultyId && selectedCourseId && (
                    selectedCourse.semesters && selectedFaculty?.courses ? (
                            <select
                                className="form-select"
                                aria-label="Default select example"
                                value={selectedSemesterId}
                                onChange={handleSemesterChange}
                            >
                                <option value="" disabled hidden>Wybierz Semestr</option>
                                {semesterList.map((semester) => (
                                    <option key={semester._id} value={semester._id}>{"Semestr " + semester.index}</option>
                                ))}
                            </select>
                    ):("")
                )}
                {selectedSemesterId && (
                    groupTypeList.length > 0 ? (
                        <select
                        className="form-select"
                        aria-label="Default select example"
                        value={selectedGroupType}
                        onChange={handleGroupChange}
                    >
                        <option value="" disabled hidden>Wybierz typ grupy</option>
                        {groupTypeList.map((type) => (
                            <option key={type._id} value={type._id}>{type.name}</option>
                        ))}
                    </select>): ("Brak grup do wyświetlenia")
                )}
            </div>
            <RoomPopup trigger={popup} setTrigger={setPopup} pickedFaculty={selectedFacultyId}/>
            <div className="mb-1 bg-secondary ms-5 d-flex flex-row w-100">
                {/*Tutaj if apropo tego czy wybrany semestr czy nie*/}
                {selectedSemesterId ? (
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
                            <tr className="table-dark text-center">
                                <td className="fw-bold">
                                    Godzina
                                </td>
                                {Array.from({ length: selectedGroupTypeCount }, (_, colIndex) => (
                                    <td key={colIndex} className="col-3 text-center fw-bold" scope="col">
                                        Grupa {colIndex+1}
                                    </td>
                                ))}
                            </tr>
                            {grid.map((row, rowIndex) => (
                                <tr key={rowIndex} className="table-dark w-100">
                                    <th scope="col" className="col-1 text-nowrap">
                                        {selectedTimeTable ? (
                                            (showCurrentDay == 0 || showCurrentDay == 6) && selectedTimeTable ? (
                                                selectedTimeTable?.schedules[1].periods[rowIndex].startTime + ' - ' + selectedTimeTable?.schedules[1].periods[rowIndex].endTime
                                            ) : (showCurrentDay > 0 && showCurrentDay < 6 && selectedTimeTable ? (
                                                    selectedTimeTable?.schedules[0].periods[rowIndex] ? (
                                                        selectedTimeTable?.schedules[0].periods[rowIndex].startTime + ' - ' + selectedTimeTable?.schedules[0].periods[rowIndex].endTime
                                                    ): ("Loading...")
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
                ) : (<div className="text-center fw-bold fs-5 align-content-center ms-auto me-auto">
                    Wybierz dane z tabel
                </div>)}
            </div>
        </div>
        </>
    );
};

export default Plans;




