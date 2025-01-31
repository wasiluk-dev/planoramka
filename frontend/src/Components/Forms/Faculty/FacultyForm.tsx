import React, { useEffect, useState } from 'react';

import BaseForm, { BaseFormProps } from '../BaseForm.tsx';

import APIService from '../../../../services/APIService.ts';
import { BuildingPopulated, CoursePopulated } from '../../../../services/DBTypes.ts';

type FacultyFormProps = {
    activeStep: number;
    refresh: number;
    setRefresh: React.Dispatch<React.SetStateAction<number>>;
};
const FacultyForm: React.FC<FacultyFormProps> = ({ activeStep, refresh, setRefresh }) => {
    const [created, setCreated] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [acronym, setAcronym] = useState<string>('');

    const [buildings, setBuildings] = useState<BuildingPopulated[]>([]);
    const [courses, setCourses] = useState<CoursePopulated[]>([]);

    const [selectedBuildingIds, setSelectedBuildingIds] = useState<string[]>([]);
    const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

    const fields: BaseFormProps['fields'] = [
        {
            label: 'Nazwa',
            helperText: 'Nazwa wydziału, np. Wydział Informatyki',
            value: name,
            setter: setName,
            required: true,
        },
        {
            label: 'Skrót',
            helperText: 'Skrót od nazwy wydziału, np. WI',
            value: acronym,
            setter: setAcronym,
            required: true,
        },
        {
            label: 'Budynki',
            select: {
                value: selectedBuildingIds,
                setter: setSelectedBuildingIds,
                items: buildings,
                multiple: true,
            },
        },
        {
            label: 'Kierunki',
            select: {
                value: selectedCourseIds,
                setter: setSelectedCourseIds,
                items: courses,
                multiple: true,
            },
        },
    ];

    const fetchData = async() => {
        setBuildings(await APIService.getBuildings());
        setCourses(await APIService.getCourses());
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
            || name === ''
            || acronym === ''
        ) return;

        const postData = async() => {
            const formData = new URLSearchParams();
            formData.append('name', name);
            formData.append('acronym', acronym);
            if (selectedBuildingIds.length > 0) {
                selectedBuildingIds.forEach(id => {
                    formData.append('buildings[]', id);
                });
            }
            if (selectedCourseIds.length > 0) {
                selectedCourseIds.forEach(id => {
                    formData.append('courses[]', id);
                });
            }

            return await APIService.saveFaculties(formData);
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

export default FacultyForm;
