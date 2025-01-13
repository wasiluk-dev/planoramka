import React, { useEffect, useState } from 'react';

import APIService from '../../../../services/APIService.ts';
import BaseForm, { BaseFormProps } from '../BaseForm.tsx';
import { RoomPopulated } from '../../../../services/DBTypes.ts';

type BuildingFormProps = {
    activeStep: number;
    refresh: number;
    setRefresh: React.Dispatch<React.SetStateAction<number>>,
};

const BuildingForm: React.FC<BuildingFormProps> = ({ activeStep, refresh, setRefresh }) => {
    const [created, setCreated] = useState<boolean>(false);

    const [name, setName] = useState<string>('');
    const [acronym, setAcronym] = useState<string>('');
    const [address, setAddress] = useState<string>('');

    const [rooms, setRooms] = useState<RoomPopulated[]>([]);
    const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);

    const fields: BaseFormProps['fields'] = [
        {
            label: 'Nazwa',
            helperText: 'Ogólna nazwa budynku, np. Budynek A',
            value: name,
            setter: setName,
            required: true,
        },
        {
            label: 'Skrót',
            helperText: 'Skrót od nazwy budynku, np. A',
            value: acronym,
            setter: setAcronym,
        },
        {
            label: 'Adres',
            helperText: 'Adres budynku, np. Wiejska 45A, 15-351 Białystok',
            value: address,
            setter: setAddress,
        },
        {
            label: 'Sale',
            select: {
                value: selectedRoomIds,
                setter: setSelectedRoomIds,
                items: rooms,
                multiple: true,
            },
        },
    ];

    const fetchData = async() => {
        const roomsPopulated = await APIService.getRooms();
        setRooms(roomsPopulated);
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
        ) return;

        const postData = async() => {
            const formData = new URLSearchParams();
            formData.append('name', name);
            if (acronym !== '') formData.append('acronym', acronym);
            if (address !== '') formData.append('address', address);
            if (selectedRoomIds.length > 0) {
                selectedRoomIds.forEach(id => {
                    formData.append('rooms[]', id);
                });
            }

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

export default BuildingForm;
