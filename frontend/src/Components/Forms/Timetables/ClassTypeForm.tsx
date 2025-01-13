import React, { useEffect, useState } from 'react';

import APIService from '../../../../services/APIService.ts';
import BaseForm, { BaseFormProps } from '../BaseForm.tsx';

type ClassTypeFormProps = {
    activeStep: number;
    setRefresh: React.Dispatch<React.SetStateAction<number>>,
};

const ClassTypeForm: React.FC<ClassTypeFormProps> = ({ activeStep, setRefresh }) => {
    const [created, setCreated] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [acronym, setAcronym] = useState<string>('');
    const [color, setColor] = useState<string>('');

    const fields: BaseFormProps['fields'] = [
        {
            label: 'Nazwa',
            helperText: 'Nazwa typu zajęć, np. Wykład',
            value: name,
            setter: setName,
            required: true,
        },
        {
            label: 'Skrót',
            helperText: 'Skrót od nazwy typu zajęć, np. W',
            value: acronym,
            setter: setAcronym,
            required: true,
        },
        {
            label: 'Kolor',
            helperText: 'Kolor, po którym będzie można na pierwszy rzut oka rozpoznać dany typ zajęć, zapisany w systemie szesnastkowym, np. #60ff40',
            value: color,
            setter: setColor,
        },
    ];

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
            if (color !== '') formData.append('color', color);

            return await APIService.saveClassTypes(formData);
        }

        postData().then(response => {
            if (response) {
                setCreated(true);
                setRefresh(prev => prev + 1);
            }
        });
    }, [activeStep]);

    return (<>
        <BaseForm
            fields={ fields }
        />
    </>);
};

export default ClassTypeForm;
