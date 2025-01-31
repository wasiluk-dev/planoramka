import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';

import APIService from '../../services/APIService.ts';
import APIUtils from '../utils/APIUtils.ts';
import ECourseCycle from '../../../backend/src/enums/ECourseCycle.ts';
import ECourseMode from '../../../backend/src/enums/ECourseMode.ts';
import {
    CoursePopulated,
    FacultyPopulated,
    SemesterPopulated,
    TimetablePopulated
} from '../../services/DBTypes.ts';
import i18n, { i18nPromise } from '../i18n';

const { t } = i18n;
await i18nPromise;

type StudentInfo = {
    facultyId: string;
    mode: ECourseMode;
    cycle: ECourseCycle;
    courseId: string;
    semesterId: string;
    groups: { [p: string]: number };
}

type PersonalTimetableOptionsProps = {
    setGroupCount: React.Dispatch<React.SetStateAction<number>>;
    onSendData: (data: StudentInfo) => void;
}

const PersonalTimetableOptions: React.FC<PersonalTimetableOptionsProps> = ({ setGroupCount, onSendData }) => {
    const [messageToParent, setMessageToParent] = useState<StudentInfo>();
    const sendDataToParent = () => {
        if (messageToParent) {
            // pass data to parent via callback
            onSendData(messageToParent);
        }
    };

    const [courses, setCourses] = useState<CoursePopulated[]>([]);
    const [faculties, setFaculties] = useState<FacultyPopulated[]>([]);
    const [timetables, setTimetables] = useState<TimetablePopulated[]>([]);

    const [facultyCycles, setFacultyCycles] = useState<ECourseCycle[]>([]);
    const [availableCourses, setAvailableCourses] = useState<CoursePopulated[]>([]);
    const [semesterList, setSemesterList] = useState<SemesterPopulated[]>([]);
    const [classTypes, setClassTypes] = useState<TimetablePopulated['groups']>([]);

    const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');
    const [selectedStudyMode, setSelectedStudyMode] = useState<string>('');
    const [selectedStudyModeNum, setSelectedStudyModeNum] = useState<ECourseMode>(0);
    const [selectedCycle, setSelectedCycle] = useState<string>('');
    const [selectedCycleNum, setSelectedCycleNum] = useState<ECourseCycle>(0);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');
    const [selectedClassTypes, setSelectedClassTypes] = useState<{ [p: string]: number }>({});

    useEffect(() => {
        const fetchData = async () => {
            setCourses(await APIService.getCourses());
            setFaculties(await APIService.getFaculties());
            setTimetables(await APIService.getTimetables());
        };

        fetchData().then();
    }, []);
    useEffect(() => {
        if (messageToParent?.groups) {
            sendDataToParent();
        }
    }, [messageToParent]);
    useEffect(() => {
        if (
            selectedSemesterId
            && selectedCycleNum
            && selectedCourseId
            && selectedStudyModeNum
            && selectedFacultyId
        ) {
            const message: StudentInfo = {
                facultyId: selectedFacultyId,
                mode: selectedStudyModeNum,
                cycle: selectedCycleNum,
                courseId: selectedCourseId,
                semesterId: selectedSemesterId,
                groups: selectedClassTypes,
            };

            setMessageToParent(message);
        }
    }, [selectedClassTypes]);

    const handleFacultyChange = (event: SelectChangeEvent) => {
        setSelectedFacultyId(event.target.value);
        setSelectedStudyMode('');
        setFacultyCycles(APIUtils.getCourseCycles(courses));
        setSelectedStudyMode('');
        setSelectedSemesterId('');
        setSelectedCourseId('');
        setSelectedCycle('');
    };
    const handleModeChange = (event: SelectChangeEvent) => {
        const value = event.target.value as keyof typeof ECourseMode;
        const selectedStudyMode = ECourseMode[value];
        setSelectedStudyMode(event.target.value);
        setSelectedStudyModeNum(selectedStudyMode);
        setSelectedSemesterId('');
        setSelectedCourseId('');
        setSelectedCycle('');
    };
    const handleCycleChange = (event: SelectChangeEvent) => {
        const value = event.target.value as keyof typeof ECourseCycle;
        const selectedCycle = ECourseCycle[value as keyof typeof ECourseCycle];
        setSelectedCycle(event.target.value);
        setSelectedCycleNum(selectedCycle);
        setAvailableCourses(APIUtils.getCoursesOfCycle(courses, selectedCycle));
        setSelectedSemesterId('');
        setSelectedCourseId('');
    }
    const handleCourseChange = (event: SelectChangeEvent) => {
        setSelectedSemesterId('');
        setSelectedCourseId(event.target.value);
        const selected = courses.find((course) => course._id === event.target.value);
        if (selected?.semesters && selected?.semesters.length > 0){
            setSemesterList(selected?.semesters);
        } else {
            setSemesterList([]);
        }
    }
    const handleSemesterChange = (event: SelectChangeEvent) => {
        setSelectedSemesterId(event.target.value);

        if (timetables) {
            const timetable = timetables.find(timetable => timetable.semester === event.target.value);
            if (timetable) {
                const types: TimetablePopulated['groups'] = [];
                timetable.groups?.forEach(g => {
                    types.push(g);
                });

                setClassTypes(types);
                setGroupCount(types.length);
            }
        }
    }
    const handleClassTypeChange = (classTypeId: string, value: number) => {
        setSelectedClassTypes(prev => ({
            ...prev,
            [classTypeId]: value,
        }));
    };

    return (<>
        <FormControl>
            <InputLabel>{ t('timetables_details_faculty') }</InputLabel>
            <Select
                label={ t('timetables_details_faculty') }
                value={ selectedFacultyId }
                onChange={ handleFacultyChange }
            >
                { faculties.map(faculty =>
                    <MenuItem key={ faculty._id } value={ faculty._id }  disabled={ faculty.courses.length === 0 }>
                        { faculty.name }
                    </MenuItem>
                ) }
            </Select>
        </FormControl>

        { selectedFacultyId && (
            <FormControl>
                <InputLabel>{ t('timetables_details_mode') }</InputLabel>
                <Select
                    label={ t('timetables_details_mode') }
                    value={ selectedStudyMode }
                    onChange={ handleModeChange }
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

        { selectedFacultyId && selectedStudyMode && (
            <FormControl>
                <InputLabel>{ t('timetables_details_cycle') }</InputLabel>
                <Select
                    label={ t('timetables_details_cycle') }
                    value={ selectedCycle }
                    onChange={ handleCycleChange }
                >
                    { Object.values(ECourseCycle)
                        .filter(cycle => isNaN(Number(cycle)))
                        .map((cycle, i) =>
                            <MenuItem key={ i } value={ cycle } disabled={ !facultyCycles.includes(i) }>
                                { t(`timetables_details_cycle_${ cycle }`) }
                            </MenuItem>
                        )
                    }
                </Select>
            </FormControl>
        ) }

        { selectedFacultyId && selectedStudyMode && selectedCycle && (
            <FormControl>
                <InputLabel>{ t('timetables_details_course') }</InputLabel>
                <Select
                    label={ t('timetables_details_course') }
                    value={ selectedCourseId }
                    onChange={ handleCourseChange }
                >
                    { availableCourses.map(course => (
                        course.mode === selectedStudyModeNum && (
                            <MenuItem key={ course._id } value={ course._id }>
                                { course.name + (course.specialization ? ` (${ course.specialization })` : '') }
                            </MenuItem>
                        )
                    )) }
                </Select>
            </FormControl>
        ) }

        { selectedFacultyId && selectedStudyMode && selectedCycle && selectedCourseId && (
            <FormControl>
                { semesterList.length > 0 ? (<>
                    <InputLabel>{ t('timetables_details_semester') }</InputLabel>
                    <Select
                        label={ t('timetables_details_semester') }
                        value={ selectedSemesterId }
                        onChange={ handleSemesterChange }
                    >
                        { semesterList.map(semester => {
                            const timetable = timetables.find(timetable => timetable.semester === semester._id);
                            return <MenuItem key={ semester._id } value={ semester._id } disabled={ !timetable }>
                                { `Semestr ${ semester.index }` }
                            </MenuItem>
                        }) }
                    </Select>
                </>) : (
                    t('timetables_details_semester_none')
                ) }
            </FormControl>
        ) }

        { selectedFacultyId && selectedStudyMode && selectedCycle && selectedCourseId && selectedSemesterId && (<>
            { classTypes && classTypes.length > 0 ? (
                <Stack
                    direction="row"
                    spacing={ 2 }
                >
                    { classTypes.map((ct, i) => (
                        <FormControl key={ i } sx={{ width: '100%' }}>
                            <InputLabel>{ ct.classType.name }</InputLabel>
                            <Select
                                label={ ct.classType.name }
                                value={ selectedClassTypes[ct.classType._id] ?? '' }
                                onChange={ e => handleClassTypeChange(ct.classType._id, Number(e.target.value)) }
                            >
                                { Array.from({ length: ct.groupCount }, (_, j) => (
                                    <MenuItem key={ j + 1 } value={ j + 1 }>
                                        {`${ ct.classType.acronym } ${ j + 1 }`}
                                    </MenuItem>
                                )) }
                            </Select>
                        </FormControl>
                    )) }
                </Stack>
            ) : (
                <Typography variant="overline" >{ t('timetables_details_classType_none') }</Typography>
            ) }
        </>) }
    </>);
};

export default PersonalTimetableOptions;
