import React, { JSX, useEffect, useState } from 'react';
import { List, ListItem, Typography } from '@mui/material';

import APIUtils from '../utils/APIUtils.ts';
import EWeekday from '../enums/EWeekday.ts';
import PeriodBlock, { PeriodBlockPopulated } from './PeriodBlock.tsx';
import {
    ClassPopulated,
    FacultyPopulated,
    TimetablePopulated,
} from '../../services/DBTypes.ts';

type ProfessorClassesProps = {
    setDialogData: React.Dispatch<React.SetStateAction<{ title: string; content: JSX.Element }>>;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    userId: string;
    weekday: EWeekday;
    classesAll: ClassPopulated[];
    timetablesAll: TimetablePopulated[];
    facultiesAll: FacultyPopulated[];
}

const ProfessorClasses: React.FC<ProfessorClassesProps> = ({ setDialogData, setDialogOpen, userId, weekday, classesAll, timetablesAll, facultiesAll }) => {
    const [teacherPlan, setTeacherPlan] = useState<Record<EWeekday, PeriodBlockPopulated[]>>({
        0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    });

    useEffect(() => {
        if (userId !== '') {
            const teacherData = APIUtils.getProfessorClasses(classesAll, timetablesAll, facultiesAll, userId);
            setTeacherPlan(teacherData);
        }
    }, [userId]);

    return (<List>
        { teacherPlan[weekday].length === 0 ? (
            <ListItem sx={{ alignItems: 'top', justifyContent: 'center' }}>
                <Typography variant="overline">Brak zajęć</Typography>
            </ListItem>
        ) : (
            teacherPlan[weekday].map((block, index) => (
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

export default ProfessorClasses;