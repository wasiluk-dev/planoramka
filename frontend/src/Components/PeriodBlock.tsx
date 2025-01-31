import React, { JSX } from 'react';
import {
    Card, CardActions,
    List, ListItem,
    Typography,
} from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

import EPeriodBlockType from '../enums/EPeriodBlockType.ts';
import {
    ClassPopulated,
    ClassTypePopulated,
    CoursePopulated,
    FacultyPopulated,
    PeriodPopulated,
    RoomPopulated,
    SemesterPopulated,
    SubjectPopulated,
} from '../../services/DBTypes.ts';
import i18n, { i18nPromise } from '../i18n.ts';

const { t } = i18n;
await i18nPromise;

function decimalToRoman(num: number): string {
    if (num <= 0 || num >= 4000) return '';

    const romanMap: { [key: number]: string } = {
        1000: "M",
        900: "CM",
        500: "D",
        400: "CD",
        100: "C",
        90: "XC",
        50: "L",
        40: "XL",
        10: "X",
        9: "IX",
        5: "V",
        4: "IV",
        1: "I"
    };

    let roman: string = '';
    for (const value of Object.keys(romanMap).map(Number).sort((a, b) => b - a)) {
        while (num >= value) {
            roman += romanMap[value];
            num -= value;
        }
    }

    return roman;
}

type Content = {
    subject: string;
    subjectShort: string;
    period: string;
    faculty: string;
    facultyAcronym: string;
    room: string;
    organizer: string;
    course: string;
    courseCode: string;
    semesterIndex: string;
    semesterYear: string;
}

export type PeriodBlockPopulated = {
    classType: ClassTypePopulated;
    subject: Pick<SubjectPopulated, '_id' | 'code' | 'name' | 'acronym'>;
    room: Pick<RoomPopulated, '_id' | 'roomNumber'>;
    period: Pick<PeriodPopulated, 'startTime' | 'endTime'>;
    faculty: Pick<FacultyPopulated, '_id' | 'name' | 'acronym'>;
    course: Pick<CoursePopulated, '_id' | 'code' | 'name'>;
    semester: Pick<SemesterPopulated, '_id' | 'index'> & { year: number };
}

type PeriodBlockProps = {
    setDialogData: React.Dispatch<React.SetStateAction<{ title: string; content: JSX.Element }>>;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    variant?: 'infoLess' | 'titleOnly';
    classType: ClassPopulated['classType'];
    subject: ClassPopulated['subject'];
    period?: Partial<PeriodPopulated>;
    faculty?: FacultyPopulated;
    room?: Partial<ClassPopulated['room']>;
    organizer?: ClassPopulated['organizer'];
    course?: Partial<CoursePopulated>;
    semester?: Partial<SemesterPopulated>;
};

const PeriodBlock: React.FC<PeriodBlockProps> = ({ setDialogData, setDialogOpen, variant, classType, subject, room, organizer, faculty, period, course, semester }) => {
    const fontSize = '0.85rem';
    const content: Content = {
        subject: subject ? subject.name : '',
        subjectShort: subject ? (subject.acronym ? subject.acronym : subject.code) : '',
        period: period ? `${ period.startTime } – ${ period.endTime }` : '',
        faculty: faculty ? faculty.name : '',
        facultyAcronym: faculty ? faculty.acronym : '',
        room: (room && room.roomNumber) ? room.roomNumber : '',
        organizer: organizer ? (organizer.title ? `${ organizer.title } ` : '') + `${ organizer.names } ${ organizer.surnames }` : '',
        course: course ? (course.name + (course.specialization ? ` (${ course.specialization })` : '')) : '',
        courseCode: (course && course.code) ? course.code : '',
        semesterYear: (semester && semester.index) ? decimalToRoman(Math.round(semester.index / 2)) : '',
        semesterIndex: (semester && semester.index) ? semester.index.toString() : '',
    };

    let type: EPeriodBlockType = EPeriodBlockType.Generic;
    if (faculty && room && period && course && semester) {
        type = EPeriodBlockType.Professor;
    } else if (organizer && course && semester) {
        type = EPeriodBlockType.Room;
    } else if (room && organizer) {
        type = EPeriodBlockType.Student;
    }

    const handleDialog = () => {
        setDialogData({
            title: t('dialog_title_classDetails'),
            content: <List>
                { Object.entries(content).map(([k, v]) => {
                    if (
                        v === ''
                        || k === 'facultyAcronym'
                        || k === 'courseCode'
                        || (k === 'subjectShort' && variant === 'titleOnly')
                    ) return;

                    return <ListItem key={ k }>
                        { `${ t(`periodBlock_content_${ k }`) }: ${ v }` }
                    </ListItem>
                }) }
            </List>,
        });

        setDialogOpen(true);
    }

    return (
        <Card
            className={`cell-content d-grid p-1`}
            sx={{
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                minHeight: '60px',
                zIndex: 900,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: classType.color ?? 'white',
            }}
        >
            <Typography align="center" sx={{ fontWeight: 'bold', fontSize: fontSize }}>
                { (variant === 'titleOnly' && content.subjectShort !== '') ? content.subjectShort : content.subject }
            </Typography>

            { variant !== 'titleOnly' && (<>
                { type === EPeriodBlockType.Professor && (
                    <Typography align="center" sx={{ fontStyle: 'italic', fontSize: fontSize }}>{ content.period }</Typography>
                ) }

                { type !== EPeriodBlockType.Generic && (
                    <Typography align="center" sx={{ fontSize: fontSize }}>{
                        (faculty ? `[${ content.facultyAcronym }] ` : '')
                        + (room ? content.room : '')
                        + (organizer ? `, ${ content.organizer }` : '')
                    }</Typography>
                ) }

                { (type === EPeriodBlockType.Professor || type === EPeriodBlockType.Room) && (
                    <Typography align="center" sx={{ fontSize: fontSize }}>{
                        `[${ content.courseCode }] `
                        + t('periodBlock_semester', {
                            year: content.semesterYear,
                            index: content.semesterIndex,
                        })
                    }</Typography>
                ) }
            </>) }

            { variant !== 'infoLess' && (<>
                <CardActions
                    disableSpacing
                    sx={{
                        p: 0,
                        display: "flex",
                        alignSelf: "stretch",
                        alignItems: "flex-start",
                        justifyContent: "space-evenly",
                    }}
                >
                    <InfoOutlined onClick={ handleDialog } sx={{ cursor: 'pointer' }}/>
                </CardActions>
            </>) }
        </Card>
    );
}

export default PeriodBlock;
