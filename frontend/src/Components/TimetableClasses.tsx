import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, ListItemText, MenuItem, Select, Stack } from '@mui/material';
import { useCookies } from 'react-cookie';

import APIService from '../../services/APIService.ts';
import APIUtils from '../utils/APIUtils.ts';
import ECourseMode from '../../../backend/src/enums/ECourseMode.ts';
import ECourseCycle from '../../../backend/src/enums/ECourseCycle.ts';
import {
    ClassPopulated,
    CoursePopulated,
    FacultyPopulated,
    SemesterPopulated,
    TimetablePopulated,
} from '../../services/DBTypes.ts';
import i18n, { i18nPromise } from '../i18n';

const { t } = i18n;
await i18nPromise;

type TimetableClassesProps = {
    setAccordionExpanded: React.Dispatch<React.SetStateAction<boolean>>;
    states: {
        timetable: {
            value: TimetablePopulated | undefined,
            set: React.Dispatch<React.SetStateAction<TimetablePopulated | undefined>>;
        },
        semesterId: {
            value: string;
            set: React.Dispatch<React.SetStateAction<string>>;
        },
        semesterClasses: {
            value: ClassPopulated[];
            set: React.Dispatch<React.SetStateAction<ClassPopulated[]>>
        },
        groupTypes: {
            value: TimetablePopulated['groups'];
            set: React.Dispatch<React.SetStateAction<TimetablePopulated['groups']>>
        },
    };
}

const TimetableClasses: React.FC<TimetableClassesProps> = ({ setAccordionExpanded, states }) => {
    const [, setCookie, ] = useCookies();

    const [courses, setCourses] = useState<CoursePopulated[]>([]);
    const [faculties, setFaculties] = useState<FacultyPopulated[]>([]);
    const [timetables, setTimetables] = useState<TimetablePopulated[]>([]);

    const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');
    const [selectedMode, setSelectedMode] = useState<string>('');
    const [selectedCycle, setSelectedCycle] = useState<string>('');
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');

    const [facultyCycles, setFacultyCycles] = useState<ECourseCycle[]>([]);
    const [availableCourses, setAvailableCourses] = useState<CoursePopulated[]>([]);
    const [semesterList, setSemesterList] = useState<SemesterPopulated[]>([]);

    useEffect(() => {
        const fetchData = async() => {
            setCourses(await APIService.getCourses());
            setFaculties(await APIService.getFaculties());
            setTimetables(await APIService.getTimetables());
        };

        fetchData().then(() => {
            // TODO: fix cookies to load proper data
            // handleFacultyChange(cookies['timetables.facultyId'] ?? '');
            // handleModeChange(cookies['timetables.mode'] ?? '');
            // handleCycleChange(cookies['timetables.cycle'] ?? '');
            // handleCourseChange(cookies['timetables.courseId'] ?? '');
            // handleSemesterChange(cookies['timetables.semesterId'] ?? '');
        });
    }, []);

    const handleFacultyChange = (newValue: string) => {
        const facultyId: string = newValue;

        setCookie('timetables.facultyId', facultyId);
        setSelectedFacultyId(facultyId);
        setSelectedMode('');
        setSelectedCycle('');
        setSelectedCourseId('');
        states.semesterId.set('');

        setFacultyCycles(APIUtils.getCourseCycles(courses));
    };
    const handleModeChange = (newValue: string) => {
        const mode: string = newValue as keyof typeof ECourseMode;
        // const selectedMode = ECourseMode[mode as keyof typeof ECourseMode];

        setCookie('timetables.mode', mode);
        setSelectedMode(mode);
        setSelectedCycle('');
        setSelectedCourseId('');
        states.semesterId.set('');
    };
    const handleCycleChange = (newValue: string) => {
        const cycle = newValue as keyof typeof ECourseCycle;
        const selectedCycle = ECourseCycle[cycle as keyof typeof ECourseCycle];

        setCookie('timetables.cycle', cycle);
        setSelectedCycle(cycle);
        setSelectedCourseId('');
        states.semesterId.set('');

        setAvailableCourses(APIUtils.getCoursesOfCycle(courses, selectedCycle));
    }
    const handleCourseChange = (newValue: string) => {
        const courseId: string = newValue;

        setCookie('timetables.courseId', courseId);
        setSelectedCourseId(courseId);
        states.semesterId.set('');

        const selected = courses.find(course => course._id === courseId)
        if (selected?.semesters && selected?.semesters.length > 0){
            setSemesterList(selected.semesters);
        }else {
            setSemesterList([]);
        }
    }
    const handleSemesterChange = (newValue: string) => {
        const semesterId: string = newValue;

        setCookie('timetables.semesterId', semesterId);
        states.semesterId.set(semesterId);
        setAccordionExpanded(false);

        if (timetables) {
            const pickedTimetable = timetables.find(timetable => timetable.semester === semesterId);
            if (pickedTimetable) {
                states.timetable.set(pickedTimetable);
                states.semesterClasses.set(pickedTimetable.classes);
                states.groupTypes.set(pickedTimetable.groups);
                for (let i: number = 0; i < 7; i++) {
                    if (pickedTimetable.schedules[i].weekdays.includes(showCurrentDay)){
                        setFixedRows(pickedTimetable.schedules[i].periods.length);
                        break;
                    }
                }
            } else {
                states.timetable.set(undefined);
            }

            updateTableData();
        }
    }

    return (
        <Stack spacing={ 2 }>
            <FormControl>
                <InputLabel>{ t('timetables_details_faculty') }</InputLabel>
                <Select
                    label={ t('timetables_details_faculty') }
                    value={ selectedFacultyId }
                    onChange={ event => handleFacultyChange(event.target.value) }
                >
                    { faculties.map(faculty =>
                        <MenuItem key={ faculty._id } value={ faculty._id } disabled={ faculty.courses.length === 0 }>
                            { faculty.name }
                        </MenuItem>
                    ) }
                </Select>
            </FormControl>

            { selectedFacultyId !== '' && (
                <FormControl>
                    <InputLabel>{ t('timetables_details_mode') }</InputLabel>
                    <Select
                        label={ t('timetables_details_mode') }
                        value={ selectedMode }
                        onChange={ event => handleModeChange(event.target.value) }
                    >
                        { Object.values(ECourseMode)
                            .filter(mode => isNaN(Number(mode)))
                            .map(mode =>
                                <MenuItem key={ mode } value={ mode }>
                                    { t(`timetables_details_mode_${ mode }`) }
                                </MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            ) }

            { selectedFacultyId !== '' && selectedMode !== '' && (
                <FormControl>
                    <InputLabel>{ t('timetables_details_cycle') }</InputLabel>
                    <Select
                        label={ t('timetables_details_cycle') }
                        value={ selectedCycle }
                        onChange={ event => handleCycleChange(event.target.value) }
                    >
                        { Object.values(ECourseCycle)
                            .filter(cycle => isNaN(Number(cycle)))
                            .map((cycle, i) =>
                                <MenuItem key={ cycle } value={ cycle } disabled={ !facultyCycles.includes(i) }>
                                    { t(`timetables_details_cycle_${ cycle }`) }
                                </MenuItem>
                            )
                        }
                    </Select>
                </FormControl>
            ) }

            { selectedFacultyId !== '' && selectedMode !== '' && selectedCycle !== '' && (
                <FormControl>
                    <InputLabel>{ t('timetables_details_course') }</InputLabel>
                    <Select
                        label={ t('timetables_details_course') }
                        value={ selectedCourseId }
                        onChange={ event => handleCourseChange(event.target.value) }
                    >
                        { availableCourses.map(course => (
                            course.mode === ECourseMode[selectedMode as keyof typeof ECourseMode] && (
                                <MenuItem key={ course._id } value={ course._id }>
                                    <ListItemText
                                        primary={ course.name + (course.specialization ? ` (${ course.specialization })` : '') }
                                        secondary={ course.code }
                                    />
                                </MenuItem>
                            )
                        )) }
                    </Select>
                </FormControl>
            ) }

            { selectedFacultyId !== '' && selectedMode !== '' && selectedCycle !== '' && selectedCourseId !== '' && (
                <FormControl>
                    <InputLabel>{ t('timetables_details_semester') }</InputLabel>
                    { semesterList.length > 0 ? (
                        <Select
                            label={ t('timetables_details_semester') }
                            value={ states.semesterId.value }
                            onChange={ event => handleSemesterChange(event.target.value) }
                        >
                            { semesterList.map(semester => {
                                const timetable = timetables.find(timetable => timetable.semester === semester._id);
                                return <MenuItem key={ semester._id } value={ semester._id } disabled={ !timetable }>
                                    { `Semestr ${ semester.index }` }
                                </MenuItem>
                            }) }
                        </Select>
                    ) : (
                        t('timetables_details_semester_none')
                    ) }
                </FormControl>
            ) }
        </Stack>
    );
};

export default TimetableClasses;
