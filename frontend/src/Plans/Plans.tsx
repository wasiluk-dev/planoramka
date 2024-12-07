import React, { useEffect, useState } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import Draggable from './Draggable.tsx';
import Droppable from './Droppable.tsx';
import './plans.css';
import APIService from '../../services/apiService.tsx';
import APIUtils from '../utils/APIUtils.ts';
import {
    ClassPopulated,
    ClassTypePopulated,
    CoursePopulated,
    FacultyPopulated,
    SemesterPopulated,
    SubjectDetailsPopulated,
    TimetablePopulated,
} from '../../services/databaseTypes.tsx';
import RoomPopup from '../Components/Popups/RoomPopup.tsx';

type ClassDraggable = {
    id: string;
    name: string;
    type: string;
    color: string;
    isweekly: boolean;
    x: number;
    y: number;
    isset: boolean;
    group?: number;
    groups: number;
    setday: number;
    teacher: string;
    room: string;
};

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
    const [, setMadeLessons] = useState<Pick<ClassPopulated, 'subject' | 'weekday' | 'periodBlocks' | 'studentGroups'>[]>([]);
    const [, setSubjectTypeName]  = useState<string>('');
    const [subjectTypeId, setSubjectTypeId]  = useState<string>('');
    const [subjectsDetails, setSubjectsDetails] = useState<SubjectDetailsPopulated[]>([]);
    const [, setGroups] = useState<TimetablePopulated['groups']>([]);
    const [currentDay, setCurrentDay] = useState<number>(new Date().getDay());
    const [fixedRows, setFixedRows]= useState<number>(1);
    const [timetables, setTimetables] = useState<TimetablePopulated[]>([]);
    const [selectedTimetable, setSelectedTimetable] = useState<TimetablePopulated>();
    const [selectedGroupTypeCount, setSelectedGroupTypeCount] = useState<number>(1);
    const [popup, setPopup] = useState<boolean>(false);
    const [faculties, setFaculties] = useState<FacultyPopulated[]>([]);
    const [courses, setCourses] = useState<Pick<CoursePopulated, "_id" | "name" | "code" | "specialization" | "semesters">[]>([]);
    const [lessonsOnBoard, setLessonsOnBoard] = useState<ClassPopulated[]>([]);

    const [semesters, setSemesters] = useState<SemesterPopulated[]>([]);
    const [classTypes, setClassTypes] = useState<Omit<ClassTypePopulated, "color">[]>([]);
    const [selectedClassType, setSelectedClassType] = useState<string>('');
    const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');
    const [selectedFaculty, setSelectedFaculty] = useState<FacultyPopulated>();
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [selectedCourse, setSelectedCourse] = useState<Pick<CoursePopulated, "_id" | "name" | "code" | "specialization" | "semesters">>();
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');
    const [selectedSemester, setSelectedSemester] = useState<number>(0);

    useEffect(() => {
        if (selectedSemesterId && timetables) {
            setSelectedTimetable(timetables.find((item) => item.semester === selectedSemesterId));
        }
    }, [selectedSemesterId]);

    useEffect(() => {
        if (selectedTimetable && typeof selectedTimetable === "object") {
            const classesArray = selectedTimetable.classes;

            if (!Array.isArray(classesArray)) {
                console.error('Classes is not an array or is undefined.');
                return setMadeLessons([]);
            }

            const filteredLessons = classesArray
                .filter((classItem: any) => {
                    return classItem?.classType?._id === selectedClassType;
                })
                .map((classItem: any) => ({
                    studentGroups: classItem.studentGroups,
                    weekday: classItem.weekday,
                    periodBlocks: classItem.periodBlocks,
                    subject: classItem.subject,
                }));

            setMadeLessons(filteredLessons || []);
        } else {
            // console.error("selectedTimeTable is not an object or is null/undefined");
            setMadeLessons([]);
        }


    }, [selectedTimetable, selectedClassType]);

    useEffect(() => {
        const fetchData = async() => {
            const data = await APIService.getTimetables();
            setTimetables(data);
            setGroups(data[0].groups);
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
        if (subjectTypeId) {
            function getObiektyById(subjects: SubjectDetailsPopulated[], id: string, groupNumber: number): ClassDraggable[] {
                return subjects.flatMap((item) => {
                    return item.details
                        .filter((detail) => detail.classType._id === id)
                        .flatMap((detail) =>
                            Array.from({ length: detail.weeklyBlockCount }).map((_, index) => ({
                                id: `${item.subject._id}_${groupNumber}_${index}`,
                                name: `${item.subject.name} (gr. ${groupNumber})`,
                                type: detail.classType.name,
                                color: (detail.classType.color) ? detail.classType.color : '#ffffff',
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

    const handleClassTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        // const selectedValue : string = event.target.value;
        setLessons([]);
        setSelectedClassType(event.target.value);
        if (selectedTimetable) {
            const groupCounts = APIUtils.getTimetableGroupCounts(timetables, selectedTimetable._id);

            if (groupCounts) { // Ensure groupCounts is not null
                for (const [key, groupTypeList] of Object.entries(groupCounts)) {
                    for (let i = 0; i < groupTypeList.length; i++) {
                        if (groupTypeList[i]._id === event.target.value) {
                            setSubjectTypeName(groupTypeList[i].name);
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

    const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCourseId = event.target.value;
        setSelectedCourseId(selectedCourseId);
        setSelectedSemesterId('');
        setSelectedClassType('');
        setLessons([]);

        const course = courses.find((course) => course._id === selectedCourseId);
        setSelectedCourse(course);

        if (course) {
            setSemesters(course.semesters);
        }
    };

    const [lessons, setLessons] = useState<ClassDraggable[]>([]);
    const [grid, setGrid] = useState<Array<Array<ClassDraggable | null>>>([]);

    useEffect(() => {
        const updatedGrid: Array<Array<ClassDraggable | null>> = Array(fixedRows)
            .fill(null)
            .map(() => Array(selectedGroupTypeCount).fill(null));

        lessons.forEach(item => {
            const { x, y } = item;
            if (x >= 0 && x < fixedRows && y >= 0 && y < selectedGroupTypeCount) {
                updatedGrid[x][y] = item;
            }
        });

        setGrid(updatedGrid);
    }, [fixedRows, lessons, selectedGroupTypeCount, subjectTypeId, currentDay]);

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

        const newGrid: Array<Array<ClassDraggable | null>> = grid.map(row => [...row]);
        const draggedItem = lessons.find(item => item.id === active.id);

        if (!draggedItem) return;

        if (!draggedItem.name.includes((toCol + 1).toString()) && !toId.includes('droppable-sidebar')) {
            return;
        }

        if (toId.includes('droppable-sidebar')) {
            // Wkładanie w pasek boczny
            setLessons(prevLessons =>
                prevLessons.map(item =>
                    item.id === draggedItem.id
                        ? { ...item, isset: false, x: -1, y: -1 }
                        : item
                )
            );

            newGrid[draggedItem.x][draggedItem.y] = null;
        } else if (!draggedItem.isset) {
            // Wyjmowanie z paska bocznego
            setPopup(true);
            if (grid[toRow][toCol]) return;
            const updatedItem = { ...draggedItem, isset: true, x: toRow, y: toCol };
            setLessons(prevLessons =>
                prevLessons.map(item =>
                    item.id === draggedItem.id ? updatedItem : item
                )
            );

            newGrid[toRow][toCol] = updatedItem;
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

    useEffect(() => {
        if (selectedTimetable && selectedClassType) {
            const filterClasses = (weekday: number, classTypeId: string) => {
                return selectedTimetable.classes.filter(
                    (cls) => cls.weekday === weekday && cls.classType._id === classTypeId
                );
            };

            const filteredClasses = filterClasses(currentDay, selectedClassType);
            setLessonsOnBoard(filteredClasses);
        }

    }, [selectedTimetable, currentDay, selectedClassType]);

    useEffect(() => {
        if (currentDay && selectedClassType && lessons && lessonsOnBoard) {
            // const newGrid: Array<Array<ObiektNew | null>> = grid.map(row => [...row]);
            lessonsOnBoard.forEach(item  => {
                item.studentGroups?.forEach(group => {
                    const identifier = `${item.subject?._id}_${group}`;

                    setLessons(prevLessons => {
                        const newLessons = prevLessons.filter(g => !g.id.includes(identifier));

                        if (newLessons.length < prevLessons.length) {
                            console.log(`Match found and items removed for identifier: ${identifier}`);
                        }

                        return newLessons;
                    });
                });
            });
        }
    }, [lessonsOnBoard, selectedClassType]);

    // TODO: zmienić wyświetlanie dni na dynamiczne bazujące na weekdays
    return (<>
        <h1 className='text-center'>PLAN ZAJĘĆ</h1>
        <div className='d-flex flex-row p-3 mx-3'>
            <div className="bg-secondary text-center w-15">
                <select className="form-select"
                        aria-label="Default select example"
                        value={ selectedFacultyId }
                        onChange={ handleFacultyChange }
                >
                    <option value="" disabled hidden>[Wydział]</option>
                    { faculties.map((faculty, _) => (
                        faculty.acronym ? (
                            <option key={ faculty._id } value={ faculty._id }>
                                { `[${ faculty.acronym }] ` + faculty.name }
                            </option>
                        ) : (
                            <option key={ faculty._id } value={ faculty._id }>
                                { faculty.name }
                            </option>
                        )
                    )) }
                </select>
                { selectedFacultyId && (
                    selectedFaculty?.courses ? (
                        <select className="form-select"
                                aria-label="Default select example"
                                value={ selectedCourseId }
                                onChange={ handleCourseChange }
                        >
                            <option value="" disabled hidden>[Kierunek]</option>
                            { courses.map((course) => (
                                course.specialization ? (
                                    <option key={course._id} value={course._id}>{`[${course.code}] ` + course.name + " (" + course.specialization + ")"}</option>
                                ) : (
                                    <option key={course._id} value={course._id}>{`[${course.code}] ` + course.name}</option>
                                )
                            )) }
                        </select>
                    ) : (
                        'Brak danych do wyświetlenia'
                    )
                ) }
                { selectedFacultyId && selectedCourseId && (
                    selectedCourse?.semesters && selectedFaculty?.courses ? (
                        <select className="form-select"
                                aria-label="Default select example"
                                value={ selectedSemesterId }
                                onChange={ handleSemesterChange }
                        >
                            <option value="" disabled hidden>[Semestr]</option>
                            { semesters.map((semester) => (
                                <option key={ semester._id } value={ semester._id }>{ 'Semestr ' + semester.index }</option>
                            )) }
                        </select>
                    ) : (
                        ''
                    )
                ) }
                { selectedSemesterId && (
                    classTypes.length > 0 ? (
                        <select className="form-select"
                                aria-label="Default select example"
                                value={ selectedClassType }
                                onChange={ handleClassTypeChange }
                        >
                            <option value="" disabled hidden>[Typ zajęć]</option>
                            { classTypes.map((type) => (
                                <option key={ type._id } value={ type._id }>{ type.name }</option>
                            )) }
                        </select>
                    ) : (
                        'Brak grup do wyświetlenia'
                    )
                ) }
            </div>
            <RoomPopup trigger={ popup } setTrigger={ setPopup } pickedFaculty={ selectedFaculty }/>
            <div className="mb-1 bg-secondary ms-5 d-flex flex-row w-100">
                { selectedSemesterId ? (
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <table
                            className="table table-striped table-hover table-bordered border-primary table-fixed-height w-100">
                            <tbody style={{ height: '100%' }}>
                            <tr className="table-dark text-center">
                                <td className="table-dark text-center fw-bolder fs-5" colSpan={ selectedGroupTypeCount + 1 }>
                                    <div className="d-flex justify-content-center"> {/* Flexbox container */}
                                        { Object.entries(day)
                                            .filter(([key]) => key !== '0') // Filter out the entry with key '0'
                                            .map(([key, value]) => (
                                                <div key={ key } className="flex-fill text-center me-2">
                                                    { key === currentDay.toString() ? (
                                                        <div className="fw-bold" role="button">{ value }</div>
                                                    ) : (
                                                        <div className="fw-light" role="button" onClick={ () => changeDay(parseInt(key)) }>{ value }</div>
                                                    ) }
                                                </div>
                                            ))
                                        }

                                        {/* Now display the entry with key '0' at the end */}
                                        { day['0'] && (
                                            <div key="0" className="flex-fill text-center me-2">
                                                { currentDay.toString() === '0' ? (
                                                    <div className="fw-bold" role="button">{ day['0'] }</div>
                                                ) : (
                                                    <div className="fw-light" role="button" onClick={ () => changeDay(0) }>{ day['0'] }</div>
                                                ) }
                                            </div>
                                        ) }
                                    </div>
                                </td>
                            </tr>
                            <tr className="table-dark text-center">
                                <td className="fw-bold">
                                    Godzina
                                </td>
                                { Array.from({ length: selectedGroupTypeCount }, (_, colIndex) => (
                                    <td key={ colIndex } className="col-3 text-center fw-bold" scope="col">
                                        Grupa { colIndex + 1 }
                                    </td>
                                )) }
                            </tr>
                            { grid.map((row, rowIndex) => (
                                <tr key={ rowIndex } className="table-dark w-100">
                                    <th scope="col" className="col-1 text-nowrap">
                                        { selectedTimetable ? (
                                            (currentDay == 0 || currentDay == 6) && selectedTimetable ? (
                                                selectedTimetable?.schedules[1].periods[rowIndex].startTime + ' - ' + selectedTimetable?.schedules[1].periods[rowIndex].endTime
                                            ) : (currentDay > 0 && currentDay < 6 && selectedTimetable ? (
                                                    selectedTimetable?.schedules[0].periods[rowIndex] ? (
                                                        selectedTimetable?.schedules[0].periods[rowIndex].startTime + ' - ' + selectedTimetable?.schedules[0].periods[rowIndex].endTime
                                                    ): ("Loading...")
                                            ) : ("Error in showing period per day!"))
                                        ) : (
                                            <p>Loading...</p>
                                        ) }
                                    </th>
                                    { row.map((item, colIndex) => (
                                        <td key={ colIndex } className="col-3 text-center" scope="col">
                                            <Droppable id={ `${rowIndex}_${colIndex}` }>
                                                { item && (
                                                    <Draggable id={ item.id }
                                                               name={ item.name }
                                                               x={ item.x }
                                                               y={ item.y }
                                                               type={ item.type }
                                                               color={ (item.color) ? item.color : '#ffffff' }
                                                               group={ item.group }
                                                               isset={ true }
                                                    >
                                                        { item.name }
                                                    </Draggable>
                                                ) }
                                            </Droppable>
                                        </td>
                                    )) }
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className='flex-sm-grow-1 ms-5 w-15 border border-black'>
                            <Droppable id="droppable-sidebar">
                                { lessons.filter(item => !item.isset).map(item => (
                                    <Draggable id={ item.id }
                                               name={ item.name }
                                               x={ item.x }
                                               y={ item.y }
                                               isset={ item.isset }
                                               type={ item.type }
                                               color={ (item.color) ? item.color : '#ffffff' }
                                               group={ item.group }
                                               key={ item.id }
                                               setday={ item.setday }
                                    >
                                        { item.name }
                                    </Draggable>
                                )) }
                            </Droppable>
                        </div>
                    </DndContext>
                ) : (
                    <div className="text-center fw-bold fs-5 align-content-center ms-auto me-auto">
                        Wybierz dane z tabel
                    </div>
                ) }
            </div>
        </div>
    </>);
};

export default Plans;
