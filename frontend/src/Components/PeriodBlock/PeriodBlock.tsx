import React from 'react';
import { Card, Typography } from '@mui/material';

import './PeriodBlock.css';
import EPeriodBlockType from '../../enums/EPeriodBlockType';
import i18n, { i18nPromise } from '../../i18n';

const { t } = i18n;
await i18nPromise;

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
