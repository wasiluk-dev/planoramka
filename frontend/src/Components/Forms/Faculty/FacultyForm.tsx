import React, { useEffect, useState } from 'react';

import BaseForm, { BaseFormProps } from '../BaseForm.tsx';
import { BuildingPopulated, CoursePopulated } from '../../../../services/DBTypes.ts';
import APIService from '../../../../services/APIService.ts';

type FacultyFormProps = {
    activeStep: number;
    refresh: number;
    setRefresh: React.Dispatch<React.SetStateAction<number>>;
};

const FacultyForm: React.FC<FacultyFormProps> = ({ activeStep, refresh, setRefresh }) => {
    const [name, setName] = useState<string>('');
    const [acronym, setAcronym] = useState<string>('');

    const [buildings, setBuildings] = useState<BuildingPopulated[]>([]);
    const [courses, setCourses] = useState<CoursePopulated[]>([]);

    const [selectedBuildingIds, setSelectedBuildingIds] = useState<string[]>([]);
    const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async() => {
            setBuildings(await APIService.getBuildings());
            setCourses(await APIService.getCourses());
        }

        fetchData().then();
    }, []);

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

    return (<>
        <BaseForm
            fields={ fields }
        />
    </>);
};

export default FacultyForm;
