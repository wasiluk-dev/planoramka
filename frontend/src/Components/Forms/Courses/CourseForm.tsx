import React, { useEffect, useState } from 'react';

import APIService from '../../../../services/APIService.ts';
import BaseForm, { BaseFormProps } from '../BaseForm.tsx';
import { SemesterPopulated } from '../../../../services/DBTypes.ts';

type CourseFormProps = {
    activeStep: number;
    refresh: number;
    setRefresh: React.Dispatch<React.SetStateAction<number>>,
};

const CourseForm: React.FC<CourseFormProps> = ({ activeStep, refresh, setRefresh }) => {
    const [created, setCreated] = useState<boolean>(false);

    const [code, setCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [specialization, setSpecialization] = useState<string>('');

    const [semesters, setSemesters] = useState<SemesterPopulated[]>([]);
    const [selectedSemesterIds, setSelectedSemesterIds] = useState<string[]>([]);

    const fields: BaseFormProps['fields'] = [
        {
            label: 'Kod',
            helperText: 'Unikalny kod kierunku, np. INF1',
            value: code,
            setter: setCode,
            required: true,
        },
        {
            label: 'Nazwa',
            helperText: 'Nazwa kierunku, np. Informatyka',
            value: name,
            setter: setName,
            required: true,
        },
        {
            label: 'Specjalizacja',
            helperText: 'Nazwa specjalizacji kierunku, np. Inżynieria oprogramowania',
            value: specialization,
            setter: setSpecialization,
        },
        {
            label: 'Semestry',
            select: {
                value: selectedSemesterIds,
                setter: setSelectedSemesterIds,
                items: semesters,
                multiple: true,
            },
        },
    ];

    const fetchData = async() => {
        const semestersPopulated = await APIService.getSemesters();
        setSemesters(semestersPopulated);
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
            || code === ''
            || name === ''
        ) return;

        const postData = async() => {
            const formData = new URLSearchParams();
            formData.append('code', code);
            formData.append('name', name);
            if (specialization !== '') formData.append('specialization', specialization);
            if (selectedSemesterIds.length > 0) {
                selectedSemesterIds.forEach(id => {
                    formData.append('semesters[]', id);
                });
            }

            return await APIService.saveCourses(formData);
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

export default CourseForm;
