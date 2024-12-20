import React, { useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import Draggable from './Draggable.tsx';
import Droppable from './Droppable.tsx';
import './plans.css';
import APIService from '../../services/apiService.tsx';
import APIUtils from '../utils/APIUtils.ts';
import {
    SubjectDetailsPopulated,
    CoursePopulated,
    SemesterPopulated, FacultyPopulated, ClassPopulated,
} from "../../services/databaseTypes.tsx";
import RoomPopup from "../Components/Popups/RoomPopup.tsx";

type ObiektNew = {
    color: string;
    groups: number;
    id: string;
    isset: boolean;
    isweekly: boolean;
    name: string;
    room: string;
    setday: number;
    teacher: string;
    type: string;
    weeklyCount: number;
    x: number;
    y: number;
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


type ClassDraggable = {
    id: string;
    name: string;
    _id: string;
}

type SubjcetPopup = {
    color: string;
    groups: number;
    id: string;
    isset: boolean;
    isweekly: boolean;
    name: string;
    room: string;
    setday: number;
    teacher: string;
    type: string;
    weeklyCount: number;
    x: number;
    y: number;
}


const day = {
    0: 'Niedziela',
    1: 'Poniedziałek',
    2: 'Wtorek',
    3: 'Środa',
    4: 'Czwartek',
    5: 'Piątek',
    6: 'Sobota',
};

const Plans: React.FC = () => {
    const [subjectTypeId, setSubjectTypeId]  = useState<string>("");
    const [subjects, setSubjects] = useState<Array>([]);
    const [test, setTest] = useState<Array<SubjectDetailsPopulated>>([]);
    const [showCurrentDay, setShowCurrentDay] = useState<number>(5);
    const [fixedRows, setFixedRows]= useState<number>(1)
    const [fixedRowsPerDay, setFixedRowsPerDay] = useState<Array<number>>([])
    const [timeTables, setTimeTables] = useState<Array<dataType.TimetablePopulated>>([]);// Fetch data from API when component mounts
    const [selectedTimeTable, setSelectedTimeTable] = useState<dataType.TimetablePopulated>()
    const [selectedGroupTypeCount, setSelectedGroupTypeCount] = useState<number>(1)
    const [popup, setPopup] = useState<boolean>(false)
    const [faculties, setFaculties] = useState<Array<FacultyPopulated>>([])
    const [courses, setCourses] = useState<Array<CoursePopulated>>([])
    const [lessonPerDay, setLessonPerDay] = useState<Array<Array<dataType.ClassPopulated>>>([])
    const [lessons, setLessons] = useState([]);
    const [lessonsAvailable, setLessonsAvailable] = useState([])
    const [lessonsBackup, setLessonsBackup] = useState([])
    const [grid, setGrid] = useState<Array<Array<ObiektNew>>>([]);
    const [dayGrid, setDayGrid] = useState<Array<Array<Array<ObiektNew>>>>([])
    const [dayGridNew, setDayGridNew] = useState<Array<Array<Array<ObiektNew>>>>([])
    const [subjectPopup, setSubjectPopup] = useState<SubjcetPopup | null>(null)

    const [semesterList, setSemesterList] = useState<Array<SemesterPopulated>>([])
    const [groupTypeList, setGroupTypeList] = useState<Array<GroupInSemester>>([])
    const [selectedGroupType, setSelectedGroupType] = useState<string>("");
    const [oldGroupType, setOldGroupType] = useState<string>("")
    const [selectedFacultyId, setSelectedFacultyId] = useState<string>("");
    const [selectedFaculty, setSelectedFaculty] = useState<FacultyPopulated>();
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [selectedCourse, setSelectedCourse] = useState<CoursePopulated>();
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");
    const [selectedSemester, setSelectedSemester] = useState<number>(0);

    useEffect(() => {
        if (selectedSemesterId && selectedTimeTable){
        // Create a temporary array to store periods for each weekday
            const tempPeriods = [...fixedRowsPerDay];

            // Process each schedule to populate the periods count
            selectedTimeTable.schedules.forEach((schedule) => {
                schedule.weekdays.forEach((day) => {
                    tempPeriods[day] = schedule.periods.length;
                });
            });

            // Update the state with the computed periods per day
            setFixedRowsPerDay(tempPeriods);
        }
    }, [selectedTimeTable]);

    useEffect(() => {
        if (selectedSemesterId && timetables) {
            setSelectedTimetable(timetables.find((item) => item.semester === selectedSemesterId));
        }
    }, [selectedSemesterId]);

    useEffect(() => {
        if (selectedTimetable && typeof selectedTimetable === "object") {
            const classesArray = selectedTimetable.classes;

            if (!Array.isArray(classesArray)) {
                console.error("Classes is not an array or is undefined.");
            }

        }


    }, [selectedTimetable, selectedClassType]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getTimetables();
            setTimeTables(data); // Store fetched time tables in state
        };

        fetchData().then();
    }, []);

    useEffect(() => {
        const fetchData = async() => {
            const data = await APIService.getFaculties();
            data.sort((a, b) => a.name.localeCompare(b.name));
            setFaculties(data);
        };

        fetchData().then();
    }, []);

    useEffect(() => {
        const fetchData = async() => {
            const data = await APIService.getSubjectDetails();
            setSubjectsDetails(data);
        };

        fetchData().then();
    }, []);

    useEffect(() => {
        const fetchData = async() => {
            const data = APIUtils.getSubjectDetailsForSpecificSemesters(subjectsDetails, [Number(selectedSemester)]);
            setSubjectsDetails(data);
        };

        fetchData().then();
    }, [selectedSemester]);

    useEffect(() => {
        if (subjectTypeId && dayGridNew.length <= 0) {
            function getObiektyById(subjects: any[], id: string, groupNumber: number): ObiektNew[] {
                return subjects.flatMap((item) => {
                    return item.details
                        .filter((detail) => detail.classType._id === id)
                        .flatMap((detail) =>
                            Array.from({ length: detail.weeklyBlockCount }).map((_, index) => ({
                                id: `${item.subject._id}_${groupNumber}_${index}`,
                                name: `${item.subject.name} (gr. ${groupNumber})`,
                                type: detail.classType._id,
                                color: detail.classType.color,
                                weeklyCount: detail.weeklyBlockCount,
                                isweekly: detail.weeklyBlockCount > 0,
                                x: -1,
                                y: -1,
                                isset: false,
                                groups: groupNumber,
                                setday: -1,
                                teacher: "none",
                                room: "none",
                            }))
                        );
                });
            }

            let allResults: ClassDraggable[] = [];
            for (let i = 1; i <= selectedGroupTypeCount; i++) {
                const result = getObiektyById(subjectsDetails, selectedClassType, i);
                allResults = [...allResults, ...result];
            }

            setLessons(allResults);
            setLessonsBackup(allResults)
        }
    }, [subjectTypeId, currentDay]);

    useEffect(() => {
        const fetchData = async() => {
            const data = await APIService.getTimetables();
            setTimetables(data);

            for (let i: number = 0; i < 7; i++) {
                if (data[0].schedules[i].weekdays.includes(currentDay)) {
                    setFixedRows(data[0].schedules[i].periods.length);
                    break;
                }
            }
        };

        fetchData().then();
    }, []);

    const handleFacultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFacultyId = event.target.value;
        setSelectedFacultyId(selectedFacultyId);
        setSelectedCourseId('');
        setSelectedSemesterId('');
        setSelectedClassType('');
        setLessons([]);

        const faculty = faculties.find((faculty) => faculty._id === selectedFacultyId);
        setSelectedFaculty(faculty);

        if (faculty) {
            const courses = faculty.courses;
            courses.sort((a, b) => a.code.localeCompare(b.code));
            setCourses(courses);
        }
    };

    const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSemesterId(event.target.value);
        setLessons([]);
        setSelectedClassType('');

        const semester = semesters.find((semester) => semester._id === event.target.value);
        if (semester) {
            setSelectedSemester(semester.index);
        }

        const selectedSemesterClassTypes = APIUtils.getSemesterClassTypes(semesters, event.target.value)
        if (selectedSemesterClassTypes) {
            setClassTypes(selectedSemesterClassTypes);
        }
    };

    const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (selectedGroupType != oldGroupType) {
            setDayGrid([])
            setDayGridNew([])
            setOldGroupType(selectedGroupType)
        }
        // const selectedValue : string = event.target.value;
        setLessons([]);
        setSelectedClassType(event.target.value);
        if (selectedTimetable) {
            const groupCounts = APIUtils.getTimetableGroupCounts(timetables, selectedTimetable._id);

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
            }
        }
    };

    useEffect(() => {
        if (dayGrid.length > 0){
            if (dayGridNew.length > 0){
                setGrid(dayGridNew[showCurrentDay])
            }else {
                setGrid(dayGrid[showCurrentDay])
            }

        }
    }, [dayGrid, selectedGroupType, dayGridNew, showCurrentDay]);


    //To sprawia że działą dnd po zmienie dnia
    useEffect(() => {
        const filteredLessons = lessonsBackup.filter(
            (lesson) => lesson.setday === showCurrentDay
        );
        setLessons(filteredLessons);
    }, [grid]);

    // Initialize dayGrid when lessonPerDay or selectedGroupType changes
    useEffect(() => {
        if (!lessonPerDay.length || !selectedGroupType || dayGridNew.length > 0) return;

        const initializeDayGrid = () => {
            const filteredsmth: Array<Array<Array<ObiektNew | null>>> = []; // Initialize day grid array

            lessonPerDay.forEach((value, index) => {

                // Create a fresh grid for the current day
                const currentGrid: Array<Array<ObiektNew | null>> = Array(fixedRows)
                    .fill(null)
                    .map(() => Array(selectedGroupTypeCount).fill(null));

                if (value.length > 0) {
                    value.forEach((item) => {
                        const filteredLessons: Array<ObiektNew> = [];
                        const lessonIndices = new Map<string, number>(); // Track indices for each identifier

                        item.studentGroups.forEach(group => {
                            const identifier = `${item.subject._id}_${group}`;
                            lessonIndices.set(identifier, 0); // Initialize index for this identifier

                            lessons.forEach((lesson) => {
                                const isMatch = lesson.id.includes(identifier);
                                if (isMatch) {
                                    // Get the index for this identifier and increment it
                                    const currentIndex = lessonIndices.get(identifier) ?? 0;

                                    // Extract helpid correctly (second number between underscores)
                                    const ajdi = lesson.id.match(/_(\d+)_/);
                                    const helpid = ajdi ? Number(ajdi[1]) : -1; // Default to -1 if extraction fails
                                    if (helpid === -1) {
                                        return; // Skip invalid IDs
                                    }

                                    lesson.groups = helpid;
                                    lesson.teacher = item.organizer?._id;
                                    lesson.isset = true;
                                    lesson.room = item.room._id;
                                    lesson.setday = item.weekday;
                                    lesson.x = item.periodBlocks[currentIndex] - 1; // Calculate x
                                    lesson.y = helpid - 1; // Calculate y based on helpid

                                    // Ensure lessons matching the current weekday are added
                                    if (item.weekday === index) {
                                        filteredLessons.push(lesson);
                                    }

                                    // Increment the index for this identifier
                                    lessonIndices.set(identifier, currentIndex + 1);
                                }
                            });

                            // Place filtered lessons into the grid
                            filteredLessons.forEach(lesson => {
                                currentGrid[lesson.x][lesson.y] = lesson;

                            });
                        });
                    });
                }

                filteredsmth[index] = currentGrid; // Assign the grid for this weekday
            });

            return filteredsmth;
        };

        const newDayGrid = initializeDayGrid();

        if (dayGridNew.length > 0){
            setDayGrid(dayGridNew);
        }else {
            setDayGrid(newDayGrid);
        }


    }, [lessonPerDay, selectedGroupType, fixedRows, selectedGroupTypeCount]);


    const changeDay = (newDay: number) => {
        setCurrentDay(newDay);

        let i: number = 0;
        if (newDay == 0 || newDay == 6) {
            i = 1;
        } else if (newDay >= 1 && newDay <= 5) {
            i = 0;
        } else {
            console.error("Invalid day selected!");
            return;
        }

        const periods = selectedTimetable?.schedules[i]?.periods;

        if (!periods) {
            console.error(`No schedule data available for day ${newDay}`);
            setFixedRows(0);
            return;
        }

        setFixedRows(periods.length);
    };


    useEffect(() => {
        const lessonsAvailableHelper = []
        lessonsBackup.forEach((lesson) => {
            if (lesson.isset === false){
                lessonsAvailableHelper.push(lesson)
            }
        })
        setLessonsAvailable(lessonsAvailableHelper)
    }, [lessonsBackup, lessons]);



    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || !active.data.current) {
            return;
        }

        const toId = over.id as string;

        const fromRow = active.data.current.x;
        const fromCol = active.data.current.y;

        let [toRow, toCol] = toId.split('_').map(Number);
        if (toId.includes('droppable-sidebar')) {
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
            const newDayGrid: Array<Array<Array<ObiektNew | null>>> = dayGrid.map(row => [...row]);
            //Wkładanie w pasek boczny
            if (toId.includes('ugabuga')) {
                setLessonsBackup(prevLessons =>
                    prevLessons.map(item =>
                        item.id === draggedItem.id
                            ? { ...item, isset: false, x: -1, y: -1 }
                            : item
                    )
                );
                newGrid[draggedItem.x][draggedItem.y] = null;
                newDayGrid[showCurrentDay] = newGrid;
                console.log("odpalam")
                setDayGridNew(newDayGrid)
                setDayGrid(newDayGrid)
                //Wyjmowanie z paska bocznego
            } else if (draggedItem.isset === false) {
                if (grid[toRow][toCol]) return;
                const updatedItem = { ...draggedItem, isset: true, x: toRow, y: toCol, setday: showCurrentDay };
                setSubjectPopup(updatedItem)
                setPopup(true);
                setLessonsBackup(prevLessons =>
                    prevLessons.map(item =>
                        item.id === draggedItem.id ? updatedItem : item
                    )
                );
                newGrid[toRow][toCol] = updatedItem;
                newDayGrid[showCurrentDay] = newGrid;
                setDayGridNew(newDayGrid)
                setDayGrid(newDayGrid)
            }
        } else {
            const newDayGrid: Array<Array<Array<ObiektNew | null>>> = dayGrid.map(row => [...row]);
            if (grid[toRow][toCol] === null) {
                const updatedItem = { ...draggedItem, x: toRow, y: toCol };
                setSubjectPopup(updatedItem)
                setPopup(true);
                setLessonsBackup(prevLessons =>
                    prevLessons.map(item =>
                        item.id === draggedItem.id ? updatedItem : item
                    )
                );
                newGrid[toRow][toCol] = updatedItem;
                newGrid[draggedItem.x][draggedItem.y] = null;
                newDayGrid[showCurrentDay] = newGrid;
                setDayGridNew(newDayGrid)
                setDayGrid(newDayGrid)
            }
        }

        setGrid(newGrid);
    };

    useEffect(() => {
        if (selectedTimetable && selectedClassType) {
            const filterClasses = (weekday: number, classTypeId: string) => {
                return selectedTimetable.classes.filter(
                    (cls) => cls.weekday === weekday && cls.classType._id === classTypeId
                );
            };

// Example usage
            let filteredClassesWeek : dataType.ClassPopulated[][] = []
            for (let i= 0; i < 7; i++){
                filteredClassesWeek[i] = filterClasses(i, selectedGroupType);
            }
            setLessonPerDay(filteredClassesWeek)
        }

    }, [selectedTimeTable, showCurrentDay, selectedGroupType]);

    const handleSubjectChange = (updatedSubject: SubjcetPopup) => {
        console.log("Updated Subject:", updatedSubject);
        const newLessons = lessons.map(lesson => ({ ...lesson }));
        const updatedLessons = newLessons.map(lesson =>
            lesson.id === updatedSubject.id
                ? { ...lesson, ...updatedSubject } // Update teacher property
                : lesson
        );
        if (updatedSubject.setday == showCurrentDay){
            setLessons(updatedLessons)
            setLessonsBackup(updatedLessons)
        }
        setSubjectPopup(updatedSubject); // Update the parent's state or perform other actions
        const newGrid: Array<Array<ObiektNew | null>> = grid.map(row => [...row]);
        newGrid[updatedSubject.x][updatedSubject.y] = updatedSubject;
        const newDayGrid: Array<Array<Array<ObiektNew | null>>> = dayGrid.map(row => [...row]);
            if (selectedTimeTable?.schedules && dayGridNew.length <= 0){
                let arr : number[] = []
                selectedTimeTable.schedules.forEach((schedule) => {
                    schedule.weekdays.forEach((day) => {
                        arr[day] = schedule.periods.length
                    })
                })
                    newDayGrid.forEach((item, index) => {
                        if (item.length > arr[index]) {
                            item.splice(index, item.length - arr[index])
                        }
                    })
                newDayGrid[updatedSubject.setday]=newGrid;
            } else {
                newDayGrid[updatedSubject.setday]=newGrid;
            }
        setDayGridNew(newDayGrid);
    };

    const confirmSchedule = () => {
        const rdyToSend : Array<ClassPopulated> = []
        const subjectsToSend : Array<ObiektNew> = []
        if (dayGridNew.length > 0 ){
                for (let i = 0; i < dayGridNew.length; i++) {
                    for (let j = 0; j < dayGridNew[i].length; j++) {
                        for (let k = 0; k < dayGridNew[i][j].length; k++) {
                            const element = dayGridNew[i][j][k];
                            if (element !== null) {
                                subjectsToSend.push(element)
                            }
                        }
                    }
                }
        }else if (dayGrid.length > 0){
                for (let i = 0; i < dayGrid.length; i++) {
                    for (let j = 0; j < dayGrid[i].length; j++) {
                        for (let k = 0; k < dayGrid[i][j].length; k++) {
                            const element = dayGrid[i][j][k];
                            if (element !== null) {
                                subjectsToSend.push(element)
                            }
                        }
                    }
                }


        }else {
            console.error("Błąd podczas zbierania danych z tabeli!")
        }
        console.log(subjectsToSend)
        if (subjectsToSend.length > 0){
            subjectsToSend.forEach((subject) => {
                const id : string = subject.id.split('_')[0]
                const subjectHelper: ClassPopulated = {
                    organizer: subject.teacher,
                    subject: id,
                    classType: subject.type,
                    weekday: subject.setday,
                    periodBlocks: [subject.x + 1], //TODO: nie wiem czy indeksowanie periodBlocks jest od 0 czy od 1, jeśli od 0, to wyjebać te +1
                    room: subject.room,
                    semester: selectedSemesterId,
                    studentGroups: [subject.groups]
                }
                rdyToSend.push(subjectHelper)
            })
        }
        console.log(rdyToSend)
    }

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
                                        <option key={course._id}
                                                value={course._id}>{course.name + " (" + course.specialization + ")"}</option>
                                    ) : (<option key={course._id} value={course._id}>{course.name}</option>)
                                ))}
                            </select>) : ("Brak danych do wyświetlenia")
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
                                    <option key={semester._id}
                                            value={semester._id}>{"Semestr " + semester.index}</option>
                                ))}
                            </select>
                        ) : ("")
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
                            </select>) : ("Brak grup do wyświetlenia")
                    )}
                </div>
                <RoomPopup trigger={popup} setTrigger={setPopup} pickedFaculty={selectedFaculty} subject={subjectPopup}
                           onSubjectChange={handleSubjectChange}/>
                <div className="mb-1 bg-secondary ms-5 d-flex flex-row w-100">
                    {selectedSemesterId ? (
                        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <table
                                className="table table-striped table-hover table-bordered border-primary table-fixed-height w-100">
                                <tbody style={{height: '100%'}}>
                                <tr className="table-dark text-center">
                                    <td className="table-dark text-center fw-bolder fs-5"
                                        colSpan={selectedGroupTypeCount + 1}>
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
                                    {Array.from({length: selectedGroupTypeCount}, (_, colIndex) => (
                                        <td key={colIndex} className="col-3 text-center fw-bold" scope="col">
                                            Grupa {colIndex + 1}
                                        </td>
                                    )) }
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
                                                    ) : ("Loading...")
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
                                                                   type={item.type} color={item.color}
                                                                   group={item.group}
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
                                    {lessonsAvailable.filter(item => !item.isset).map(item => (
                                        <Draggable id={item.id} name={item.name} x={item.x} y={item.y}
                                                   isset={item.isset} type={item.type} color={item.color}
                                                   group={item.group}
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
            {selectedGroupType ? (
                <div className="text-center">
                    {/*TODO: Add prompt "Are you sure?"*/}
                    <button className="btn btn-success" onClick={confirmSchedule}>Zatwierdź</button>
                </div>
            ) : ("")}
        </>
    );
};

export default Plans;
