import React, { useState, useEffect } from 'react';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import {
    Accordion, AccordionDetails, AccordionSummary,
    Button,
    FormControl, InputLabel, ListItemText,
    MenuItem, Select, SelectChangeEvent,
    Stack,
    Table, TableBody, TableCell, TableRow,
    Typography,
} from '@mui/material';

import Draggable from '../Components/DND/Draggable.tsx';
import Droppable from '../Components/DND/Droppable.tsx';
import RoomPopup from '../Components/Popups/RoomPopup.tsx';

import './plans.css';
import APIService from '../../services/APIService.ts';
import APIUtils from '../utils/APIUtils.ts';
import ENavTabs from '../enums/ENavTabs.ts';
import {
    ClassPopulated,
    ClassTypePopulated,
    ClassUnpopulated,
    FacultyPopulated,
    RoomPopulated,
    SemesterPopulated,
    SubjectDetailsPopulated,
    TimetablePopulated,
    UserPopulated,
} from '../../services/DBTypes.ts';
import i18n, { i18nPromise } from '../i18n';
import { ArrowDropDownRounded } from '@mui/icons-material';
import StringUtils from '../utils/StringUtils.ts';

const { t } = i18n;
await i18nPromise;

type SubjectPopup = {
    color: string;
    groups: number;
    id: string;
    isset: boolean;
    // isweekly: boolean;
    name: string;
    room: string;
    setday: number;
    teacher: string;
    type: string;
    weeklyCount: number;
    x: number;
    y: number;
    note?: string;
};

type TimetableMakerProps = {
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
    setCurrentTabValue: React.Dispatch<React.SetStateAction<number | false>>;
}

const TimetableMaker: React.FC<TimetableMakerProps> = ({ setDocumentTitle, setCurrentTabValue }) => {
    const [accordionExpanded, setAccordionExpanded] = useState<boolean>(true);
    const [accordionTitle, setAccordionTitle] = useState<string>('Wybór planu');

    const [faculties, setFaculties] = useState<FacultyPopulated[]>([]);
    const [rooms, setRooms] = useState<RoomPopulated[]>([]);
    const [timetables, setTimetables] = useState<TimetablePopulated[]>([]);
    const [users, setUsers] = useState<UserPopulated[]>([]);

    const [classTypeId, setClassTypeId] = useState<string>('');
    const [subjectDetails, setSubjectDetails] = useState<SubjectDetailsPopulated[]>([]);
    const [test, setTest] = useState<SubjectDetailsPopulated[]>([]);
    const [weekday, setWeekday] = useState<number>(new Date().getDay());
    const [fixedRows, setFixedRows] = useState<number>(1);
    const [fixedRowsPerDay, setFixedRowsPerDay] = useState<number[]>([]);
    const [popup, setPopup] = useState<boolean>(false);
    const [facultyCourses, setFacultyCourses] = useState<FacultyPopulated['courses']>([]);
    const [lessonPerDay, setLessonPerDay] = useState<ClassPopulated[][]>([]);
    const [lessons, setLessons] = useState<SubjectPopup[]>([]);
    const [lessonsAvailable, setLessonsAvailable] = useState<SubjectPopup[]>([]);
    const [lessonsBackup, setLessonsBackup] = useState<SubjectPopup[]>([]);
    const [grid, setGrid] = useState<SubjectPopup[][]>([]);
    const [dayGrid, setDayGrid] = useState<SubjectPopup[][][]>([]);
    const [dayGridNew, setDayGridNew] = useState<SubjectPopup[][][]>([]);
    const [subjectPopup, setSubjectPopup] = useState<SubjectPopup | undefined>(undefined);
    const [semesterList, setSemesterList] = useState<SemesterPopulated[]>([]);
    const [classTypesList, setClassTypesList] = useState<Omit<ClassTypePopulated, 'color'>[]>([]);
    const [previousClassTypeId, setPreviousClassTypeId] = useState<string>('');

    const [selectedFaculty, setSelectedFaculty] = useState<FacultyPopulated | undefined>(undefined);
    const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');
    const [selectedCourse, setSelectedCourse] = useState<FacultyPopulated['courses'][number] | undefined>(undefined);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');
    const [selectedSemesterIndex, setSelectedSemesterIndex] = useState<number>(0);
    const [selectedClassTypeId, setSelectedClassTypeId] = useState<string>('');
    const [selectedClassTypeCount, setSelectedClassTypeCount] = useState<number>(1);
    const [selectedTimetable, setSelectedTimetable] = useState<TimetablePopulated | undefined>(undefined);

    useEffect(() => {
        setDocumentTitle(t('nav_route_timetable_maker'));
        setCurrentTabValue(ENavTabs.TimetableMaker);

        const fetchData = async () => {
            setFaculties(await APIService.getFaculties());
            setRooms(await APIService.getRooms());
            setTest(await APIService.getSubjectDetails());
            setTimetables(await APIService.getTimetables());
            setUsers(await APIService.getUsers());
        };

        fetchData().then(() => {
            for (let i: number = 0; i < 7; i++) {
                if (timetables[0]?.schedules[i].weekdays.includes(weekday)) {
                    setFixedRows(timetables[0]?.schedules[i].periods.length);
                    break;
                }
            }
        });
    }, []);
    useEffect(() => {
        if (selectedSemesterId && selectedTimetable){
        // Create a temporary array to store periods for each weekday
            const tempPeriods = [...fixedRowsPerDay];

            // Process each schedule to populate the periods count
            selectedTimetable.schedules.forEach((schedule) => {
                schedule.weekdays.forEach((day) => {
                    tempPeriods[day] = schedule.periods.length;
                });
            });

            // Update the state with the computed periods per day
            setFixedRowsPerDay(tempPeriods);
        }
    }, [selectedTimetable]);
    useEffect(() => {
        if(selectedSemesterId && timetables){
            setSelectedTimetable(timetables.find((item) => item.semester === selectedSemesterId))
        }

    }, [selectedSemesterId]);
    useEffect(() => {
        if (selectedTimetable && typeof selectedTimetable === "object") {
            const classesArray = selectedTimetable?.classes;

            if (!Array.isArray(classesArray)) {
                console.error("Classes is not an array or is undefined.");
            }
        }
    }, [selectedTimetable, selectedClassTypeId]);
    useEffect(() => {
        const fetchData = async () => {
            const data = APIUtils.getSubjectDetailsForSpecificSemesters(test, semesterList, selectedSemesterId);
            setSubjectDetails(data)
        };

        fetchData().then();
    }, [selectedSemesterIndex]);
    useEffect(() => {
        if (classTypeId && dayGridNew.length <= 0) {
            function getObiektyById(subjects: SubjectDetailsPopulated[], id: string, groupNumber: number): SubjectPopup[] {
                return subjects.flatMap(item => {
                    return item.details
                        .filter(detail => detail.classType._id === id)
                        .flatMap(detail =>
                            Array.from({ length: detail.weeklyBlockCount })
                                .map((_, index) => ({
                                    id: `${item.subject._id}_${groupNumber}_${index}`, // Unique ID for each repetition
                                    name: `${item.subject.name} (gr. ${groupNumber})`,
                                    type: detail.classType._id,
                                    color: detail.classType.color ?? '#ffffff',
                                    weeklyCount: detail.weeklyBlockCount,
                                    // isweekly: detail.isweekly,
                                    x: -1,
                                    y: -1,
                                    isset: false,
                                    groups: groupNumber,
                                    setday: -1,
                                    teacher: "none",
                                    room: "none"
                                }))
                        );
                });
            }

            let allResults: SubjectPopup[] = [];
            for (let i = 1; i <= selectedClassTypeCount; i++) {
                const result = getObiektyById(subjectDetails, selectedClassTypeId, i);
                allResults = [...allResults, ...result];
            }

            setLessons(allResults);
            setLessonsBackup(allResults)
        }
    }, [classTypeId, weekday]);

    const handleAccordionChange = () => {
        // if (!accordionExpanded) {
        //     setAccordionTitle('Wybór planu')
        // } else {
        //     // const professor = professors.find(p => p._id === selectedProfessorId);
        //     setAccordionTitle('Wybór planu');
        // }

        setAccordionExpanded(!accordionExpanded);
    };
    const handleFacultyChange = (event: SelectChangeEvent) => {
        const facultyId: string = event.target.value;
        const faculty = faculties.find(faculty => faculty._id === facultyId);

        setSelectedFaculty(faculty);
        setSelectedFacultyId(facultyId);
        if (faculty) setFacultyCourses(faculty.courses ?? []);

        setSelectedCourseId('');
        setSelectedSemesterId('');
        setSelectedClassTypeId('');
        setLessons([]);
    };
    const handleCourseChange = (event: SelectChangeEvent) => {
        const courseId: string = event.target.value;
        const course = facultyCourses.find(course => course._id === courseId);

        setSelectedCourseId(courseId);
        setSelectedCourse(course)
        if (course) setSemesterList(course.semesters ?? []);

        setSelectedSemesterId('');
        setSelectedClassTypeId('');
        setLessons([]);
    };
    const handleSemesterChange = (event: SelectChangeEvent) => {
        const semesterId: string = event.target.value;
        const semester = semesterList.find(semester => semester._id === semesterId);
        const semesterClassTypes = APIUtils.getSemesterClassTypes(semesterList, semesterId);

        setSelectedSemesterId(semesterId);
        if (semester) setSelectedSemesterIndex(semester.index);
        if (semesterClassTypes) setClassTypesList(semesterClassTypes);

        setSelectedClassTypeId('');
        setLessons([]);
    };
    const handleClassTypeChange = (event: SelectChangeEvent) => {
        const classTypeId: string = event.target.value;

        setSelectedClassTypeId(classTypeId);
        setLessons([]);

        if (selectedClassTypeId !== previousClassTypeId) {
            setDayGrid([]);
            setDayGridNew([]);
            setPreviousClassTypeId(selectedClassTypeId);
        }

        if (selectedTimetable) {
            const groupCounts = APIUtils.getTimetableGroupCounts(timetables, selectedTimetable._id);

            if (groupCounts) {
                for (const [groupCount, classTypes] of Object.entries(groupCounts)) {
                    for (let i = 0; i < classTypes.length; i++) {
                        if (classTypes[i]._id === classTypeId) {
                            setClassTypeId(classTypes[i]._id);
                            setSelectedClassTypeCount(Number(groupCount));
                            break;
                        }
                    }
                }
            }
        }

        setAccordionExpanded(false);
    };

    useEffect(() => {
        if (dayGrid.length > 0){
            if (dayGridNew.length > 0){
                setGrid(dayGridNew[weekday])
            }else {
                setGrid(dayGrid[weekday])
            }

        }
    }, [dayGrid, selectedClassTypeId, dayGridNew, weekday]);
    useEffect(() => {
        // this makes the drag-and-drop work after changing the weekday
        const filteredLessons = lessonsBackup.filter(
            lesson => lesson.setday === weekday
        );

        setLessons(filteredLessons);
    }, [grid]);
    useEffect(() => {
        const lessonsAvailableHelper: SubjectPopup[] = [];
        lessonsBackup.forEach(lesson => {
            if (!lesson.isset) {
                lessonsAvailableHelper.push(lesson);
            }
        });

        setLessonsAvailable(lessonsAvailableHelper);
    }, [lessonsBackup, lessons]);
    useEffect(() => {
        // Initialize dayGrid when lessonPerDay or selectedClassTypeId changes

        if (!lessonPerDay.length || !selectedClassTypeId || dayGridNew.length > 0) return;

        const initializeDayGrid = () => {
            const filteredsmth: SubjectPopup[][][] = []; // Initialize day grid array

            lessonPerDay.forEach((value, index) => {

                // Create a fresh grid for the current day
                const currentGrid: SubjectPopup[][] = Array(fixedRows)
                    .fill(null)
                    .map(() => Array(selectedClassTypeCount).fill(null));

                if (value.length > 0) {
                    value.forEach((item) => {
                        const filteredLessons: Array<SubjectPopup> = [];
                        const lessonIndices = new Map<string, number>(); // Track indices for each identifier

                        item.studentGroups.forEach(group => {
                            const identifier = `${item.subject._id}_${group}`;
                            lessonIndices.set(identifier, 0); // Initialize index for this identifier

                            lessons.forEach(lesson => {
                                const isMatch = lesson.id.includes(identifier);
                                if (isMatch) {
                                    // Get the index for this identifier and increment it
                                    const currentIndex = lessonIndices.get(identifier) ?? 0;

                                    // Extract tempLessonId correctly (second number between underscores)
                                    const lessonId = lesson.id.match(/_(\d+)_/);
                                    const tempLessonId = lessonId ? Number(lessonId[1]) : -1; // Default to -1 if extraction fails
                                    if (tempLessonId === -1) {
                                        return; // Skip invalid IDs
                                    }

                                    lesson.groups = tempLessonId;
                                    if (item.organizer) lesson.teacher = item.organizer._id;
                                    lesson.isset = true;
                                    lesson.room = item.room._id;
                                    lesson.setday = item.weekday;
                                    lesson.x = item.periodBlocks[currentIndex] - 1; // Calculate x
                                    lesson.y = tempLessonId - 1; // Calculate y based on tempLessonId

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
                                if (!currentGrid[lesson.x]) return;
                                currentGrid[lesson.x][lesson.y] = lesson;
                            });
                        });
                    });
                }

                // assign the grid for this weekday
                filteredsmth[index] = currentGrid;
            });

            return filteredsmth;
        };

        const newDayGrid = initializeDayGrid();

        if (dayGridNew.length > 0) {
            setDayGrid(dayGridNew);
        } else {
            setDayGrid(newDayGrid);
        }
    }, [lessonPerDay, selectedClassTypeId, fixedRows, selectedClassTypeCount]);

    const changeDay = (newDay: number) => {
        setWeekday(newDay); // Set the new current day
        let i: number = 0;
        if (newDay == 0 || newDay == 6) {
            i = 1;
        } else if (newDay >= 1 && newDay <= 5) {
            i = 0;
        } else {
            console.error("Invalid day selected!");
            return;
        }

        const epic = selectedTimetable?.schedules[i]?.periods;

        if (!epic) {
            console.error(`No schedule data available for day ${newDay}`);
            setFixedRows(0); // Or handle the error in a user-friendly way
            return;
        }

        setFixedRows(epic.length);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const toId = over.id as string;
        const fromRow = active.data.current?.x;
        const fromCol = active.data.current?.y;

        let [toRow, toCol] = toId.split('_').map(Number);
        if (toId.includes('ugabuga')) {
            toRow = -1;
            toCol = -1;
        }

        // indexes are not valid numbers
        if (
            isNaN(fromRow)
            || isNaN(fromCol)
            || isNaN(toRow)
            || isNaN(toCol)
        ) {
            return;
        }

        if (fromRow === toRow && fromCol === toCol) {
            console.log("same place noobie");
            return;
        }

        const newGrid: Array<Array<SubjectPopup | null>> = grid.map(row => [...row]);
        let draggedItem: SubjectPopup | undefined;

        if (lessons.length === 0) {
            draggedItem = lessonsBackup.find(item => item.id === active.id);
        }else {
            draggedItem = lessons.find(item => item.id === active.id);
        }

        if (!draggedItem) return;

        if (!draggedItem.name.includes((toCol+1).toString()) && !toId.includes('ugabuga')) {
            return
        }

        if (!draggedItem.isset || toId.includes('ugabuga')) {
            const newDayGrid: Array<Array<Array<SubjectPopup | null>>> = dayGrid.map(row => [...row]);

            if (toId.includes('ugabuga')) {
                // putting items in the sidebar

                setLessonsBackup(prevLessons =>
                    prevLessons.map(item =>
                        item.id === draggedItem.id
                            ? { ...item, isset: false, x: -1, y: -1 }
                            : item
                    )
                );
                newGrid[draggedItem.x][draggedItem.y] = null;
                newDayGrid[weekday] = newGrid;
                setDayGridNew(newDayGrid);
                setDayGrid(newDayGrid);
            } else if (!draggedItem.isset) {
                // moving items out of the sidebar

                if (grid[toRow][toCol]) return;

                const updatedItem = { ...draggedItem, isset: true, x: toRow, y: toCol, setday: weekday };
                setSubjectPopup(updatedItem)
                setPopup(true);
                setLessonsBackup(prevLessons =>
                    prevLessons.map(item =>
                        item.id === draggedItem.id ? updatedItem : item
                    )
                );
                newGrid[toRow][toCol] = updatedItem;
                newDayGrid[weekday] = newGrid;
                setDayGridNew(newDayGrid)
                setDayGrid(newDayGrid)
            }
        } else {
            const newDayGrid: Array<Array<Array<SubjectPopup | null>>> = dayGrid.map(row => [...row]);
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
                newDayGrid[weekday] = newGrid;
                setDayGridNew(newDayGrid);
                setDayGrid(newDayGrid);
            }
        }

        setGrid(newGrid);
    };

    useEffect(() => {
        if (selectedTimetable && selectedClassTypeId) {
            // Assuming the data is in a variable called `data`
            const filterClasses = (weekday: number, classTypeId: string) => {
                return selectedTimetable.classes.filter(
                    (cls) => cls.weekday === weekday && cls.classType._id === classTypeId
                );
            };

            let filteredClassesWeek: ClassPopulated[][] = []
            for (let i: number = 0; i < 7; i++) {
                filteredClassesWeek[i] = filterClasses(i, selectedClassTypeId);
            }

            setLessonPerDay(filteredClassesWeek);
        }
    }, [selectedTimetable, weekday, selectedClassTypeId]);

    const handleSubjectChange = (updatedSubject: SubjectPopup) => {
        const newLessons = lessons.map(lesson => ({ ...lesson }));
        const updatedLessons = newLessons.map(lesson =>
            lesson.id === updatedSubject.id
                ? { ...lesson, ...updatedSubject } // Update teacher property
                : lesson
        );
        if (updatedSubject.setday == weekday){
            setLessons(updatedLessons)
            setLessonsBackup(updatedLessons)
        }
        setSubjectPopup(updatedSubject); // Update the parent's state or perform other actions
        const newGrid: Array<Array<SubjectPopup | null>> = grid.map(row => [...row]);
        newGrid[updatedSubject.x][updatedSubject.y] = updatedSubject;
        const newDayGrid: Array<Array<Array<SubjectPopup | null>>> = dayGrid.map(row => [...row]);
            if (selectedTimetable?.schedules && dayGridNew.length <= 0){
                let arr : number[] = []
                selectedTimetable.schedules.forEach((schedule) => {
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
        const rdyToSend: Omit<ClassUnpopulated, '_id'>[] = [];
        const subjectsToSend: SubjectPopup[] = [];

        if (dayGridNew.length > 0) {
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
        } else if (dayGrid.length > 0){
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
        }

        // console.log(subjectsToSend);
        if (subjectsToSend.length > 0) {
            subjectsToSend.forEach((subject) => {
                const id: string = subject.id.split('_')[0];
                const subjectHelper: Omit<ClassUnpopulated, '_id'> = {
                    organizer: subject.teacher,
                    subject: id,
                    classType: subject.type,
                    weekday: subject.setday,
                    periodBlocks: [subject.x + 1],
                    room: subject.room,
                    semester: selectedSemesterId,
                    studentGroups: [subject.groups]
                }
                rdyToSend.push(subjectHelper)
            })
        }
        console.log(rdyToSend);
    }

    // TODO: zmienić wyświetlanie dni na dynamiczne bazujące na weekdays
    return (<>
        <Accordion expanded={ accordionExpanded } onChange={ handleAccordionChange }>
            <AccordionSummary expandIcon={ <ArrowDropDownRounded/> }>
                <Typography>{ accordionTitle }</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Stack spacing={ 2 }>
                    <FormControl>
                        <InputLabel>Wydział</InputLabel>
                        <Select
                            label="Wydział"
                            value={ selectedFacultyId }
                            onChange={ handleFacultyChange }
                        >
                            { faculties.sort((a, b) => a.name.localeCompare(b.name, 'pl'))
                                .map(faculty =>
                                    <MenuItem
                                        key={ faculty._id }
                                        value={ faculty._id }
                                        disabled={ faculty.courses.length === 0 }
                                    >
                                        { faculty.name }
                                    </MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>

                    { selectedFacultyId && (
                        selectedFaculty?.courses ? (
                            <FormControl>
                                <InputLabel>Kierunek</InputLabel>
                                <Select
                                    label="Kierunek"
                                    value={ selectedCourseId }
                                    onChange={ handleCourseChange }
                                >
                                    { facultyCourses.sort((a, b) => a.name.localeCompare(b.name, 'pl'))
                                        .map(course =>
                                            <MenuItem
                                                key={ course._id }
                                                value={ course._id }
                                            >
                                                <ListItemText
                                                    primary={ course.name + (course.specialization ? ` (${ course.specialization })` : '') }
                                                    secondary={ course.code }
                                                />
                                            </MenuItem>
                                        )
                                    }
                                </Select>
                            </FormControl>
                        ) : (
                            'Wydział nie posiada przypisanych kierunków'
                        )
                    ) }
                    {selectedFacultyId && selectedCourseId && (
                        selectedCourse?.semesters && selectedFaculty?.courses ? (
                            <FormControl>
                                <InputLabel>Semestr</InputLabel>
                                <Select
                                    label="Semestr"
                                    value={ selectedSemesterId }
                                    onChange={ handleSemesterChange }
                                >
                                    { semesterList.map((semester) => (
                                        <MenuItem
                                            key={ semester._id }
                                            value={ semester._id }
                                        >
                                            { "Semestr " + semester.index }
                                        </MenuItem>
                                    )) }
                                </Select>
                            </FormControl>
                        ) : (
                            'Kierunek nie ma przypisanych semestrów'
                        )
                    )}
                    {selectedSemesterId && (
                        classTypesList.length > 0 ? (
                            <FormControl>
                                <InputLabel>Typ zajęć</InputLabel>
                                <Select
                                    label="Typ zajęć"
                                    value={ selectedClassTypeId }
                                    onChange={ handleClassTypeChange }
                                >
                                    { classTypesList.map(type => (
                                        <MenuItem
                                            key={ type._id }
                                            value={ type._id }
                                        >
                                            { type.name }
                                        </MenuItem>
                                    )) }
                                </Select>
                            </FormControl>
                        ) : (
                            'Brak grup do wyświetlenia'
                        )
                    )}
                </Stack>
            </AccordionDetails>
        </Accordion>
        <div className='d-flex flex-row p-3 mx-3'>
            <RoomPopup
                trigger={popup}
                setTrigger={setPopup}
                pickedFaculty={selectedFaculty}
                subject={subjectPopup}
                onSubjectChange={handleSubjectChange}
            />
            <div className="mb-1 bg-secondary ms-5 d-flex flex-row w-100">
                { selectedClassTypeId && (
                    <DndContext
                        collisionDetection={ closestCenter }
                        onDragEnd={ handleDragEnd }
                    >
                        <Table className="table table-striped table-hover table-bordered border-primary table-fixed-height w-100">
                            <TableBody style={{ height: '100%' }}>
                                {/* DAYS OF THE WEEK */}
                                <TableRow className="table-dark text-center">
                                    <TableCell
                                        colSpan={selectedClassTypeCount + 1}
                                        className="table-dark text-center fw-bolder fs-5"
                                    >
                                        <div className="d-flex justify-content-center">
                                            { Object.entries(StringUtils.day)
                                                .filter(([key]) => key !== '0')
                                                .map(([key, value]) => (
                                                    <div
                                                        key={key}
                                                        className="flex-fill text-center me-2" // Flex item
                                                    >
                                                        { key === weekday.toString() ? (
                                                            <div className="fw-bold" role="button">{value}</div>
                                                        ) : (
                                                            <div className="fw-light" role="button"
                                                                 onClick={() => changeDay(parseInt(key))}>{value}</div>
                                                        ) }
                                                    </div>
                                                ))
                                            }

                                            { StringUtils.day['0'] && (
                                                <div
                                                    key="0"
                                                    className="flex-fill text-center me-2" // Flex item
                                                >
                                                    { weekday.toString() === '0' ? (
                                                        <div className="fw-bold" role="button">{StringUtils.day['0']}</div>
                                                    ) : (
                                                        <div
                                                            role="button"
                                                            className="fw-light"
                                                            onClick={() => changeDay(0)}
                                                        >
                                                            { StringUtils.day['0'] }
                                                        </div>
                                                    ) }
                                                </div>
                                            ) }

                                        </div>
                                    </TableCell>
                                </TableRow>
                            <TableRow className="table-dark text-center">
                                <TableCell className="fw-bold">
                                    Godzina
                                </TableCell>

                                { Array.from({ length: selectedClassTypeCount }, (_, colIndex) => (
                                    <TableCell key={ colIndex } className="col-3 text-center fw-bold" scope="col">
                                        Grupa {colIndex + 1}
                                    </TableCell>
                                )) }
                            </TableRow>
                            { grid.map((row, rowIndex) => (
                                <TableRow key={ rowIndex } className="table-dark w-100">
                                    <TableCell scope="col" className="col-1 text-nowrap">
                                        {selectedTimetable ? (
                                            (weekday == 0 || weekday == 6) && selectedTimetable ? (
                                                selectedTimetable?.schedules[1].periods[rowIndex].startTime + ' – ' + selectedTimetable?.schedules[1].periods[rowIndex].endTime
                                            ) : (weekday > 0 && weekday < 6 && selectedTimetable ? (
                                                selectedTimetable?.schedules[0].periods[rowIndex] ? (
                                                    selectedTimetable?.schedules[0].periods[rowIndex].startTime + ' – ' + selectedTimetable?.schedules[0].periods[rowIndex].endTime
                                                ) : "Loading..."
                                            ) : "Error in showing period per day!")
                                        ) : (
                                            <p>Loading...</p>
                                        )}
                                    </TableCell>
                                    { row.map((item, colIndex) => (
                                        <TableCell key={colIndex} className="col-3 text-center" scope="col">
                                            <Droppable id={`${rowIndex}_${colIndex}`}>
                                                { item && (
                                                    <Draggable
                                                        id={item.id}
                                                        name={item.name}
                                                        x={item.x}
                                                        y={item.y}
                                                        type={item.type}
                                                        color={item.color}
                                                        group={item.groups}
                                                        isset={item.isset}
                                                        teacher={ (() => {
                                                            const teacher = users?.find(user => user._id === item.teacher);
                                                            if (teacher) {
                                                                return `${ teacher.names } ${ teacher.surnames }`;
                                                            } else {
                                                                return 'Unknown teacher';
                                                            }
                                                        })() }
                                                        room={ (() => {
                                                            const room = rooms?.find(room => room._id === item.room);
                                                            if (room) {
                                                                return `${ room.roomNumber } `;
                                                            } else {
                                                                return 'Unknown room';
                                                            }
                                                        })() }
                                                    >
                                                        { item.name }
                                                    </Draggable>
                                                )}
                                            </Droppable>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        <div className='flex-sm-grow-1 ms-5 w-15 border border-black'>
                            <Droppable id='ugabuga'>
                                { lessonsAvailable.filter(item => !item.isset)
                                    .map(item => (
                                        <Draggable
                                            id={ item.id }
                                            name={ item.name }
                                            x={ item.x }
                                            y={ item.y }
                                            isset={ item.isset }
                                            type={ item.type }
                                            color={ item.color }
                                            group={ item.group }
                                            key={ item.id }
                                            setday={ item.setday }
                                        >
                                            { item.name }
                                        </Draggable>
                                    ))
                                }
                            </Droppable>
                        </div>
                    </DndContext>
                ) }
            </div>
        </div>

        { selectedClassTypeId && (
            <div className="text-center">
                {/* TODO: add the prompt "Are you sure?" */}
                <Button
                    variant="contained"
                    onClick={ confirmSchedule }
                >
                    Zapisz
                </Button>
            </div>
        ) }
    </>);
};

export default TimetableMaker;
