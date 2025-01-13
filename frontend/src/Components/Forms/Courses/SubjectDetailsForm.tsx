import React, { useEffect, useState } from 'react';

import APIService from '../../../../services/APIService.ts';
import BaseForm, { BaseFormProps } from '../BaseForm.tsx';
import { CoursePopulated, SubjectPopulated } from '../../../../services/DBTypes.ts';

type SubjectDetailsFormProps = {
    activeStep: number;
    refresh: number;
    setRefresh: React.Dispatch<React.SetStateAction<number>>,
};

const SubjectDetailsForm: React.FC<SubjectDetailsFormProps> = ({ activeStep, refresh, setRefresh }) => {
    const [created, setCreated] = useState<boolean>(false);

    const [subjects, setSubjects] = useState<SubjectPopulated[]>([]);
    const [courses, setCourses] = useState<CoursePopulated[]>([]);
    const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
    const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

    const fields: BaseFormProps['fields'] = [
        {
            label: 'Przedmiot',
            select: {
                value: selectedSubjectIds,
                setter: setSelectedSubjectIds,
                items: subjects,
            },
            required: true,
        },
        {
            label: 'Kierunek',
            select: {
                value: selectedCourseIds,
                setter: setSelectedCourseIds,
                items: courses,
            },
            required: true,
        },
    ];

    const fetchData = async() => {
        const coursesPopulated = await APIService.getCourses();
        const subjectsPopulated = await APIService.getSubjects();

        setCourses(coursesPopulated);
        setSubjects(subjectsPopulated);
    }

    useEffect(() => {
        fetchData().then();
    }, []);
    useEffect(() => {
        fetchData().then();
    }, [refresh]);
    useEffect(() => {
        if (
            created
            || selectedSubjectIds.length !== 1
            || selectedCourseIds.length !== 1
        ) return;

        const postData = async() => {
            const formData = new URLSearchParams();
            formData.append('course', selectedCourseIds[0]);
            formData.append('subject', selectedSubjectIds[0]);

            return await APIService.saveBuildings(formData);
        }

        postData().then(() => {
            setCreated(true);
            setRefresh(prev => prev + 1);
        });
    }, [activeStep]);

    return (<>
        <BaseForm
            fields={ fields }
        />
    </>);
};

export default SubjectDetailsForm;
