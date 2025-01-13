import React, { useEffect, useState } from 'react';

import BaseForm, { BaseFormProps } from '../BaseForm.tsx';

import APIService from '../../../../services/APIService.ts';
import { ClassTypePopulated } from '../../../../services/DBTypes.ts';

type SubjectFormProps = {
    activeStep: number;
    refresh: number;
    setRefresh: React.Dispatch<React.SetStateAction<number>>,
};

const SubjectForm: React.FC<SubjectFormProps> = ({ activeStep, refresh, setRefresh }) => {
    const [created, setCreated] = useState<boolean>(false);

    const [code, setCode] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [shortName, setShortName] = useState<string>('');

    const [classTypes, setClassTypes] = useState<ClassTypePopulated[]>([]);
    const [selectedClassTypeIds, setSelectedClassTypeIds] = useState<string[]>([]);

    const fields: BaseFormProps['fields'] = [
        {
            label: 'Kod',
            helperText: 'Unikalny kod przedmiotu, np. PPR',
            value: code,
            setter: setCode,
            required: true,
        },
        {
            label: 'Nazwa',
            helperText: 'Nazwa przedmiotu, np. Podstawy programowania',
            value: name,
            setter: setName,
            required: true,
        },
        {
            label: 'Skrót',
            helperText: 'Skrót od nazwy przedmiotu, wyświetlany najczęściej na urządzeniach mobilnych zamiast kodu przedmiotu, np. PP',
            value: shortName,
            setter: setShortName,
        },
        {
            label: 'Typy zajęć',
            select: {
                value: selectedClassTypeIds,
                setter: setSelectedClassTypeIds,
                items: classTypes,
                multiple: true,
            },
        },
    ];

    const fetchData = async() => {
        const classTypesPopulated = await APIService.getClassTypes();
        setClassTypes(classTypesPopulated);
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
            if (shortName !== '') formData.append('shortName', shortName);
            if (selectedClassTypeIds.length > 0) {
                selectedClassTypeIds.forEach(id => {
                    formData.append('classTypes[]', id);
                });
            }

            return await APIService.saveSubjects(formData);
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

export default SubjectForm;
