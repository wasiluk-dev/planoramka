import React, { JSX, useEffect, useState } from 'react';
import { List, ListItem, Typography } from '@mui/material';

import PeriodBlock, { PeriodBlockPopulated } from './PeriodBlock.tsx';

import APIUtils from '../utils/APIUtils.ts';
import EWeekday from '../enums/EWeekday.ts';
import { FacultyPopulated, TimetablePopulated } from '../../services/DBTypes.ts';

type StudentClassesProps = {
    setDialogData: React.Dispatch<React.SetStateAction<{ title: string; content: JSX.Element }>>;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    semesterId: string;
    weekday: EWeekday;
    groups: { [classTypeId: string]: number };
    timetablesAll: TimetablePopulated[];
    facultiesAll: FacultyPopulated[];
}

const StudentClasses: React.FC<StudentClassesProps> = ({ setDialogData, setDialogOpen, semesterId, weekday, groups, timetablesAll, facultiesAll }) => {
    const [studentPlan, setStudentPlan] = useState<Record<EWeekday, PeriodBlockPopulated[]>>({
        0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    });

    useEffect(() => {
        if (semesterId !== '') {
            const studentData = APIUtils.getStudentClasses(timetablesAll, facultiesAll, semesterId, groups);
            setStudentPlan(studentData);
        }
    }, [semesterId, groups]);

    return (<List>
        { studentPlan[weekday].length === 0 ? (
            <ListItem sx={{ alignItems: 'top', justifyContent: 'center' }}>
                <Typography variant="overline">Brak zajęć</Typography>
            </ListItem>
        ) : (
            studentPlan[weekday].map((block, index) => (
                <ListItem key={ index }>
                    <PeriodBlock
                        setDialogData={ setDialogData }
                        setDialogOpen={ setDialogOpen }
                        variant="small"
                        classType={ block.classType }
                        subject={ block.subject }
                        room={ block.room }
                        faculty={ facultiesAll.find(
                            faculty => faculty.buildings.find(
                                building => building.rooms.find(
                                    room => room._id === block.room._id
                                ))) }
                        period={ block.period }
                        course={ block.course }
                        semester={ block.semester }
                    />
                </ListItem>
            ))
        ) }
    </List>);
};

export default StudentClasses;
