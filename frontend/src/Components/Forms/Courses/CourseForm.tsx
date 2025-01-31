import React, { useEffect, useState } from 'react';

import BaseForm, { BaseFormProps } from '../BaseForm.tsx';

import APIService from '../../../../services/APIService.ts';
import ECourseMode from '../../../../../backend/src/enums/ECourseMode.ts';
import ECourseCycle from '../../../../../backend/src/enums/ECourseCycle.ts';
import { SemesterPopulated } from '../../../../services/DBTypes.ts';
import StringUtils from '../../../utils/StringUtils.ts';

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
    const [mode, setMode] = useState<ECourseMode | false>(false);
    const [cycle, setCycle] = useState<ECourseCycle | false>(false);

    const [semesters, setSemesters] = useState<SemesterPopulated[]>([]);
    const [selectedSemesterIds, setSelectedSemesterIds] = useState<string[]>([]);

    useEffect(() => {
        console.log(mode);
        console.log(cycle);
    }, [mode, cycle]);

    // TODO: fix value and setter types for enums
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
            label: 'Tryb',
            select: {
                value: mode,
                setter: setMode,
                enumData: {
                    keys: Object.values(ECourseMode)
                        .filter(mode => isNaN(Number(mode)))
                        .map(mode => mode as string),
                    values: StringUtils.modes,
                }
            },
            required: true,
        },
        {
            label: 'Cykl',
            select: {
                value: cycle,
                setter: setCycle,
                enumData: {
                    keys: Object.values(ECourseCycle)
                        .filter(cycle => isNaN(Number(cycle)))
                        .map(cycle => cycle as string),
                    values: StringUtils.cycles,
                }
            },
            required: true,
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
            || mode === false
            || cycle === false
        ) return;

        const postData = async() => {
            const formData = new URLSearchParams();
            formData.append('code', code);
            formData.append('name', name);
            if (specialization !== '') formData.append('specialization', specialization);
            formData.append('mode', mode.toString());
            formData.append('cycle', cycle.toString());
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
