import React, { useEffect, useState } from 'react';

import APIService from '../../../../services/APIService.ts';
import BaseForm, { BaseFormProps } from '../BaseForm.tsx';

type RoomFormProps = {
    activeStep: number;
    setRefresh: React.Dispatch<React.SetStateAction<number>>,
};

const RoomForm: React.FC<RoomFormProps> = ({ activeStep, setRefresh }) => {
    const [created, setCreated] = useState<boolean>(false);

    const [number, setNumber] = useState<string>('');
    const [numberSecondary, setNumberSecondary] = useState<string>('');
    const [capacity, setCapacity] = useState<string>('');

    useEffect(() => {
        if (
            created
            || number === ''
        ) return;

        const postData = async() => {
            const formData = new URLSearchParams();
            formData.append('number', number);
            if (numberSecondary !== '') formData.append('numberSecondary', numberSecondary);
            if (capacity !== '') formData.append('capacity', capacity);

            return await APIService.saveRooms(formData);
        }

        postData().then(() => {
            setCreated(true);
            setRefresh(prev => prev + 1);
        });
    }, [activeStep]);

    const fields: BaseFormProps['fields'] = [
        {
            label: 'Numer',
            helperText: 'Numer sali, np. A203',
            value: number,
            setter: setNumber,
            required: true,
        },
        {
            label: 'Numer alternatywny',
            helperText: 'Alternatywny numer sali widoczny obok głównego (może to być przykładowo numer przed zmianą numeracji pokojów) np. 203 ',
            value: numberSecondary,
            setter: setNumberSecondary,
        },
        {
            label: 'Pojemność',
            helperText: 'Deklarowana pojemność sali (może przydać się przy układaniu planów), np. 30',
            value: capacity,
            setter: setCapacity,
        },
    ];

    return (<>
        <BaseForm
            fields={ fields }
        />
    </>);
};

export default RoomForm;
