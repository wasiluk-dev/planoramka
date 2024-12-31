import React from 'react';
import { Card, Typography } from '@mui/material';

import './PeriodBlock.css';
import EPeriodBlockType from '../../enums/EPeriodBlockType';
import i18n, { i18nPromise } from '../../i18n';
import {
    ClassPopulated,
    ClassTypePopulated,
    CoursePopulated,
    FacultyPopulated,
    PeriodPopulated,
    RoomPopulated,
    SemesterPopulated,
    SubjectPopulated,
} from '../../../services/databaseTypes.tsx';

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

export type PeriodBlockPopulated = {
    classType: ClassTypePopulated;
    subject: Pick<SubjectPopulated, '_id' | 'name' | 'shortName'>;
    room: Pick<RoomPopulated, '_id' | 'roomNumber'>;
    period: Pick<PeriodPopulated, 'startTime' | 'endTime'>;
    faculty: Pick<FacultyPopulated, '_id' | 'name' | 'acronym'>;
    course: Pick<CoursePopulated, '_id' | 'code'>;
    semester: Pick<SemesterPopulated, '_id' | 'index'> & { year: number };
}

type PeriodBlockProps = {
    classType: {
        color: string;
    };
    subject: {
        name: string;
    };
    room?: {
        roomNumber: string;
    };
    organizer?: {
        names: string;
        surnames: string;
    };
    faculty?: {
        name: string;
        acronym: string;
    };
    period?: {
        startTime: string;
        endTime: string;
    };
    course?: {
        code: string;
    };
    semester?: {
        index: number;
        year: number;
    };
};

const PeriodBlock: React.FC<PeriodBlockProps> = ({ classType, subject, room, organizer, faculty, period, course, semester }) => {
    const content = {
        subject: subject.name,
        room: room ? `${ room.roomNumber }, ` : '',
        organizer: organizer ? `${ organizer.names } ${ organizer.surnames }` : '',
        faculty: faculty ? `[${ faculty.acronym }] ` : '',
        period: period ? `${ period.startTime } – ${ period.endTime }` : '',
        course: course ? `[${ course.code }] ` : '',
        semester: semester ? t('periodBlock_semester', { year: semester.year, index: semester.index }) : '',
    };

    let type: EPeriodBlockType = EPeriodBlockType.Generic;
    if (faculty && room && period && course && semester) {
        type = EPeriodBlockType.Professor;
    } else if (organizer && course && semester) {
        type = EPeriodBlockType.Room;
    } else if (room && organizer) {
        type = EPeriodBlockType.Student;
    }

    return (
        <Card className={`text-black cell-content perioddiv d-grid p-1`}
              sx={{
                  zIndex: 900,
                  backgroundColor: classType.color,
              }}
        >
            <Typography sx={{ fontWeight: 'bold' }}>{ subject.name }</Typography>
            { type !== EPeriodBlockType.Generic && (
                <Typography>{ content.faculty + content.room + content.organizer + content.period }</Typography>
            ) }
            { (type === EPeriodBlockType.Professor || type === EPeriodBlockType.Room) && (
                <Typography>{ content.course + content.semester }</Typography>
            ) }
        </Card>
        // <div className={`text-black cell-content perioddiv d-grid p-1`}
        //      style={{
        //          zIndex: 900,
        //          backgroundColor: classType.color,
        //      }}
        // >
        //     <div className="fw-bold">
        //         { subject.name }
        //     </div>
        //     <div className="d-inline">
        //         { room.roomNumber }, { organizer.names + ' ' + organizer.surnames }
        //     </div>
        // </div>
    );
}

export default PeriodBlock;
