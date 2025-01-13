import React, { useEffect, useState } from 'react';

import APIService from '../../../../services/APIService.ts';
import BaseForm, { BaseFormProps } from '../BaseForm.tsx';
import { SubjectPopulated } from '../../../../services/DBTypes.ts';

type SemesterFormProps = {
    activeStep: number;
    refresh: number;
    setRefresh: React.Dispatch<React.SetStateAction<number>>,
};

const SemesterForm: React.FC<SemesterFormProps> = ({ activeStep, refresh, setRefresh }) => {
    const [created, setCreated] = useState<boolean>(false);

    const [academicYear, setAcademicYear] = useState<string>('');
    // const [academicYearIndex, setAcademicYearIndex] = useState('');
    const [index, setIndex] = useState<string>('');

    const [subjects, setSubjects] = useState<SubjectPopulated[]>([]);
    const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

    const fields: BaseFormProps['fields'] = [
        {
            label: 'Rok akademicki',
            helperText: 'Rok, w którym odbywać się będzie semestr, np. 2024/2025',
            value: academicYear,
            setter: setAcademicYear,
            required: true,
        },
        {
            label: 'Indeks',
            helperText: 'Numer semestru, np. 7',
            value: index,
            setter: setIndex,
            required: true,
        },
        {
            label: 'Przedmioty',
            select: {
                value: selectedSubjectIds,
                setter: setSelectedSubjectIds,
                items: subjects,
                multiple: true,
            },
        },
    ];

    const fetchData = async() => {
        const subjectsPopulated = await APIService.getSubjects();
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
            || academicYear === ''
            || index === ''
            || subjects.length === 0
        ) return;

        const postData = async() => {
            const formData = new URLSearchParams();
            formData.append('academicYear', academicYear);
            formData.append('index', index);
            if (selectedSubjectIds.length > 0) {
                selectedSubjectIds.forEach(id => formData.append('subjects[]', id));
            }

            return await APIService.saveSemesters(formData);
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

export default SemesterForm;
