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
import {
    RoomPopulated,
    SubjectDetailsPopulated,
    CoursePopulated,
    SemesterPopulated,
} from "../../services/databaseTypes.tsx";
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
    rooms: Array<RoomPopulated>;
}

type Faculties = {
    _id: string;
    acronym: string;
    name: string;
    buildings: Array<Buildings>;
    courses: Array<CoursePopulated>;
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

type GroupInSemester = {
    acronym: string | null;
    name: string;
    _id: string;
}

type Lessons = {
    periodBlocks: Array<number>;
    studentGroups: Array<number>;
    weekday: number;
    subject: SubjectDetailsPopulated;
}

type LessonsOnBoard = {

}


const Plans: React.FC = () => {
    const [subjectTypeId, setSubjectTypeId]  = useState<string>("");
    const [subjects, setSubjects] = useState<Array>([]);
    const [test, setTest] = useState<Array<SubjectDetailsPopulated>>([]);
    const [showCurrentDay, setShowCurrentDay] = useState<number>(5);
    const [fixedRows, setFixedRows]= useState<number>(1)
    const [timeTables, setTimeTables] = useState<Array<dataType.TimetablePopulated>>([]);// Fetch data from API when component mounts
    const [selectedTimeTable, setSelectedTimeTable] = useState<dataType.TimetablePopulated>()
    const [selectedGroupTypeCount, setSelectedGroupTypeCount] = useState<number>(1)
    const [popup, setPopup] = useState<boolean>(false)
    const [faculties, setFaculties] = useState<Array<Faculties>>([])
    const [courses, setCourses] = useState<Array<CoursePopulated>>([])
    const [lessonsOnBoard, setlessonsOnBoard] = useState<Array<dataType.ClassPopulated>>([])
    const [lessons, setLessons] = useState([]);
    const [lessonsBackup, setLessonsBackup] = useState([])
    const [grid, setGrid] = useState<Array<Array<ObiektNew>>>([]);
    const [dayGrid, setDayGrid] = useState<Array<Array<Array<ObiektNew>>>>([])

    const [semesterList, setSemesterList] = useState<Array<SemesterPopulated>>([])
    const [groupTypeList, setGroupTypeList] = useState<Array<GroupInSemester>>([])
    const [selectedGroupType, setSelectedGroupType] = useState<string>("");
    const [selectedFacultyId, setSelectedFacultyId] = useState<string>("");
    const [selectedFaculty, setSelectedFaculty] = useState<Faculties>();
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [selectedCourse, setSelectedCourse] = useState<CoursePopulated>();
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<number>(0);


    useEffect(() => {
        if(selectedSemesterId && timeTables){
            setSelectedTimeTable(timeTables.find((item) => item.semester === selectedSemesterId))
        }

    }, [selectedSemesterId]);

    useEffect(() => {
        if (selectedTimeTable && typeof selectedTimeTable === "object") {
            const classesArray = selectedTimeTable?.classes;

            if (!Array.isArray(classesArray)) {
                console.error("Classes is not an array or is undefined.");
            }


            const filteredLessons = classesArray
                .filter((classItem: any) => {
                    return classItem?.classType?._id === selectedGroupType;
                })
                .map((classItem: any) => ({
                    studentGroups: classItem.studentGroups,
                    weekday: classItem.weekday,
                    periodBlocks: classItem.periodBlocks,
                    subject: classItem.subject,
                }));

        }


    }, [selectedTimeTable, selectedGroupType]);


    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getTimetables();
            setTimeTables(data); // Store fetched time tables in state
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
                return subjects.flatMap((item) => {
                    return item.details
                        .filter((detail) => detail.classType._id === id)
                        .flatMap((detail) =>
                            Array.from({ length: detail.weeklyBlockCount }).map((_, index) => ({
                                id: `${item.subject._id}_${groupNumber}_${index}`, // Unique ID for each repetition
                                name: `${item.subject.name} (gr. ${groupNumber})`,
                                type: detail.classType.name,
                                color: detail.classType.color,
                                weeklyCount: detail.weeklyBlockCount,
                                isweekly: detail.weeklyBlockCount > 0,
                                x: -1,
                                y: -1,
                                isset: false,
                                groups: groupNumber, // Set groups to current groupNumber
                                setday: -1,
                                teacher: "none",
                                room: "none"
                            }))
                        );
                });
            }

            let allResults: ObiektNew[] = [];
            for (let i = 1; i <= selectedGroupTypeCount; i++) {
                const result = getObiektyById(subjects, selectedGroupType, i);
                allResults = [...allResults, ...result];
            }
            setLessons(allResults);
            setLessonsBackup(allResults)
        }
    }, [subjectTypeId, showCurrentDay]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getTimetables();
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
        if(selectedSemesterGroups){
            setGroupTypeList(selectedSemesterGroups)
        }
    };

    const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // const selectedValue : string = event.target.value;
        setLessons([]);
        setSelectedGroupType(event.target.value);
        if (selectedTimeTable){
            const groupCounts = APIUtils.getTimetableGroupCounts(timeTables, selectedTimeTable._id);

            if (groupCounts) { // Ensure groupCounts is not null
                for (const [key, groupTypeList] of Object.entries(groupCounts)) {
                    for (let i = 0; i < groupTypeList.length; i++) {
                        if (groupTypeList[i]._id === event.target.value) {
                            setSubjectTypeId(groupTypeList[i]._id);
                            setSelectedGroupTypeCount(Number(key)); // Set to the key value as a number
                            break;
                        }
                    }
                }
            } else {
                console.error("Group counts are null");
            }
        }else {
            console.error("Error w wybranym timetable")
        }
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

    useEffect(() => {
        const updatedGrid: Array<Array<ObiektNew | null>> = Array(fixedRows)
            .fill(null)
            .map(() => Array(selectedGroupTypeCount).fill(null));
        ////////////////////////////////////
        if (selectedGroupType && lessons && lessonsOnBoard){
            // const updatedGrid: Array<Array<ObiektNew | null>> = grid.map(row => [...row]);
            const filteredLessons = []
            lessonsOnBoard.forEach(item  => {
                // Loop through each student group
                item.studentGroups.forEach(group => {
                    // Create the identifier by combining classType._id and the current student group
                    const identifier = `${item.subject._id}_${group}`;
                    // Filter out all lessons that have an id containing the identifier
                    setLessons(prevLessons => {
                        const newLessons = prevLessons.filter((lesson, index) => {
                            const isMatch = lesson.id.includes(identifier);
                            if (isMatch) {
                                const ajdi = lesson.id.match(/_(.*?)_/)
                                const helpid = Number(ajdi[1])
                                lesson.groups = helpid
                                lesson.teacher = item.organizer?.fullName
                                lesson.isset = true
                                lesson.room = item.room.number
                                lesson.setday = item.weekday
                                lesson.x = item.periodBlocks[index] - 1
                                lesson.y = helpid - 1
                                filteredLessons.push(lesson);
                            }
                            return !isMatch;
                        });
                        filteredLessons.forEach(item =>{
                            updatedGrid[item.x][item.y] = item;
                        })
                        return newLessons; // Update state with the new array
                    });
                });
            });
            setGrid(updatedGrid)
            console.log("Update grid'a 3")
        }else {
            lessons.forEach(item => {
                const { x, y } = item;
                if (x >= 0 && x < fixedRows && y >= 0 && y < selectedGroupTypeCount) {
                    updatedGrid[x][y] = item;
                }
            });
            console.log("Update grid'a")
            setGrid(updatedGrid);
        }
        ////////////////////////////////////

    }, [fixedRows, selectedGroupTypeCount, subjectTypeId, showCurrentDay, lessonsOnBoard]);

    // useEffect(() => {
    //     if (selectedGroupType && lessons && lessonsOnBoard){
    //         const gridWithoutLessons: Array<Array<ObiektNew | null>> = grid.map(row => [...row]);
    //         const filteredLessons = []
    //         lessonsOnBoard.forEach(item  => {
    //             // Loop through each student group
    //             item.studentGroups.forEach(group => {
    //                 // Create the identifier by combining classType._id and the current student group
    //                 const identifier = `${item.subject._id}_${group}`;
    //                 // Filter out all lessons that have an id containing the identifier
    //                 setLessons(prevLessons => {
    //                     const newLessons = prevLessons.filter((lesson, index) => {
    //                         const isMatch = lesson.id.includes(identifier);
    //                         if (isMatch) {
    //                             const ajdi = lesson.id.match(/_(.*?)_/)
    //                             const helpid = Number(ajdi[1])
    //                             lesson.groups = helpid
    //                             lesson.teacher = item.organizer?.fullName
    //                             lesson.isset = true
    //                             lesson.room = item.room.number
    //                             lesson.setday = item.weekday
    //                             lesson.x = item.periodBlocks[index]
    //                             lesson.y = helpid - 1
    //                             filteredLessons.push(lesson);
    //                         }
    //                         return !isMatch;
    //                     });
    //                     filteredLessons.forEach(item =>{
    //                         gridWithoutLessons[item.x][item.y] = item;
    //                     })
    //                     return newLessons; // Update state with the new array
    //                 });
    //             });
    //         });
    //         console.log("Update grid'a 3")
    //         setGrid(gridWithoutLessons)
    //     }
    // }, [lessonsOnBoard, selectedGroupType]);


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
        let draggedItem :ObiektNew
        if (lessons.length == 0){
            draggedItem = lessonsBackup.find(item => item.id === active.id);
        }else {
            draggedItem = lessons.find(item => item.id === active.id);
        }

        if(!draggedItem.name.includes((toCol+1).toString()) && !toId.includes('ugabuga')){
            return
        }

        if (!draggedItem) return;

        if (draggedItem.isset === false || toId.includes('ugabuga')) {
            //Wkładaniew pasek boczny
            if (toId.includes('ugabuga')) {
                setLessonsBackup(prevLessons =>
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
                setLessonsBackup(prevLessons =>
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
                setLessonsBackup(prevLessons =>
                    prevLessons.map(item =>
                        item.id === draggedItem.id ? updatedItem : item
                    )
                );
                newGrid[toRow][toCol] = updatedItem;
                newGrid[draggedItem.x][draggedItem.y] = null;
            }
        }
        setGrid(newGrid);
    };

    useEffect(() => {
        if (selectedTimeTable && selectedGroupType){
            // Assuming the data is in a variable called `data`
            const filterClasses = (weekday: number, classTypeId: string) => {
                return selectedTimeTable.classes.filter(
                    (cls) => cls.weekday === weekday && cls.classType._id === classTypeId
                );
            };

// Example usage
            const filteredClasses = filterClasses(showCurrentDay, selectedGroupType);
            setlessonsOnBoard(filteredClasses)
        }

    }, [selectedTimeTable, showCurrentDay, selectedGroupType]);
    console.log(grid)
    //TODO: zmienić wyświetlanie dni na dynamiczne bazujące na weekdays
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
            <RoomPopup trigger={popup} setTrigger={setPopup} pickedFaculty={selectedFaculty}/>
            <div className="mb-1 bg-secondary ms-5 d-flex flex-row w-100">
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
                                                               isset={item.isset}>
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
                                               key={item.id} setday={item.setday}>
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




