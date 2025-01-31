import React, { JSX, useEffect, useState } from 'react';
import { Box, Button, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';

import BuildingForm from '../components/Forms/Faculty/BuildingForm.tsx';
import ClassTypeForm from '../components/Forms/Timetables/ClassTypeForm.tsx';
import CourseForm from '../components/Forms/Courses/CourseForm.tsx';
import FacultyForm from '../components/Forms/Faculty/FacultyForm.tsx';
import RoomForm from '../components/Forms/Faculty/RoomForm.tsx';
import SemesterForm from '../components/Forms/Courses/SemesterForm.tsx';
import SubjectForm from '../components/Forms/Courses/SubjectForm.tsx';
import SubjectDetailsForm from '../components/Forms/Courses/SubjectDetailsForm.tsx';

import ENavTabs from '../enums/ENavTabs.ts'
import i18n, { i18nPromise } from '../i18n';

const { t } = i18n;
await i18nPromise;

type Step = {
    label: string;
    description: string;
    optional?: boolean;
    components?: {
        label: string;
        component: JSX.Element;
    }[];
    // variant?: string;
    // select?: [];
}

type OnboardingProps = {
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
    setCurrentTabValue: React.Dispatch<React.SetStateAction<number | false>>;
}
const Onboarding: React.FC<OnboardingProps> = ({ setDocumentTitle, setCurrentTabValue }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set<number>());

    const [refresh, setRefresh] = useState<number>(0);

    useEffect(() => {
        setDocumentTitle(t('nav_route_onboarding'));
        setCurrentTabValue(ENavTabs.AdminPanel);
    }, []);

    const steps: Step[] = [
        {
            label: 'Wstęp',
            description: `Witamy w Planoramce!
            \nW ramach wprowadzenia do aplikacji przygotowaliśmy krótki tutorial, który zapozna Cię z podstawowymi modelami danych.
            Jedyne o co prosimy to o uważne wypełnianie pól, ponieważ nie będzie możliwości cofania się.
            \nJeżeli wszystko jest jasne, no to lecimy dalej ;)`,
        },
        {
            label: 'Typ zajęć / Sala',
            description: `Zacznijmy od modeli podstawowych, a więc takich, które nie odwołują się do innych.
                \nW tym kroku utworzymy:
                • typ zajęć, czyli np. wykład, ćwiczenia, laboratorium,
                • salę, w której będzie można później planować zajęcia.`,
            components: [
                {
                    label: 'Typ zajęć',
                    component: <ClassTypeForm
                        activeStep={ activeStep }
                        setRefresh={ setRefresh }
                    />,
                },
                {
                    label: 'Sala',
                    component: <RoomForm
                        activeStep={ activeStep }
                        setRefresh={ setRefresh }
                    />,
                },
            ],
        },
        {
            label: 'Przedmiot / Budynek',
            description: 'Teraz wykorzystamy wcześniej wprowadzone dane przy tworzeniu nowych wpisów.',
            components: [
                {
                    label: 'Przedmiot',
                    component: <SubjectForm
                        activeStep={ activeStep }
                        refresh={ refresh }
                        setRefresh={ setRefresh }
                    />,
                },
                {
                    label: 'Budynek',
                    component: <BuildingForm
                        activeStep={ activeStep }
                        refresh={ refresh }
                        setRefresh={ setRefresh }
                    />,
                },
            ],
        },
        {
            label: 'Semestr',
            description: '',
            components: [
                {
                    label: 'Semestr',
                    component: <SemesterForm
                        activeStep={ activeStep }
                        refresh={ refresh }
                        setRefresh={ setRefresh }
                    />,
                },
            ],
        },
        {
            label: 'Kierunek',
            description: '',
            components: [
                {
                    label: 'Kierunek',
                    component: <CourseForm
                        activeStep={ activeStep }
                        refresh={ refresh }
                        setRefresh={ setRefresh }
                    />,
                },
            ],
        },
        {
            label: 'Szczegóły przedmiotu / Wydział',
            description: '',
            components: [
                {
                    label: 'Szczegóły przedmiotu',
                    component: <SubjectDetailsForm
                        activeStep={ activeStep }
                        refresh={ refresh }
                        setRefresh={ setRefresh }
                    />,
                },
                {
                    label: 'Wydział',
                    component: <FacultyForm
                        activeStep={ activeStep }
                        refresh={ refresh }
                        setRefresh={ setRefresh }
                    />,
                },
            ],
        },
        {
            label: 'Podsumowanie',
            description: '',
        },
    ];
    const isStepOptional = (step: Step) => {
        return step.optional;
    };
    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };
    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };
    const handleSkip = () => {
        if (!isStepOptional(steps[activeStep])) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };
    const handleReset = () => {
        setActiveStep(0);
    };
    // const handleBack = () => {
    //     setActiveStep((prevActiveStep) => prevActiveStep - 1);
    // };

    return (
        <Box sx={{ width: '100%', padding: '32px' }}>
            <Stepper activeStep={ activeStep }>
                { steps.map((step, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                        optional?: React.ReactNode;
                    } = {};
                    if (isStepOptional(step)) {
                        labelProps.optional = (
                            <Typography variant="caption">Opcjonalny</Typography>
                        );
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={step.label} {...stepProps}>
                            <StepLabel {...labelProps}>{step.label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            { activeStep === steps.length ? (<>
                <Typography sx={{ mt: 2, mb: 1 }}>
                    All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={ handleReset }>Reset</Button>
                </Box>
            </>) : (<>
                <Typography sx={{ mt: 2, mb: 1 }} variant="h5">Krok { activeStep + 1 }.</Typography>
                <Typography sx={{ whiteSpace: 'pre-line' }}>{ steps[activeStep].description }</Typography>
                <Stack spacing={ 1 }>
                    { steps.map((step, i) => (
                        <div key={ i } hidden={ activeStep !== i }>
                            { step.components?.map(component => (
                                <Stack key={ component.label } sx={{ mt: 1 }}>
                                    <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>{ component.label }</Typography>
                                    { component.component }
                                </Stack>
                            )) }
                        </div>
                    )) }
                    {/*<Button*/}
                    {/*    color="inherit"*/}
                    {/*    disabled={ activeStep === 0 }*/}
                    {/*    onClick={ handleBack }*/}
                    {/*    sx={{ mr: 1 }}*/}
                    {/*>*/}
                    {/*    { t('onboarding_button_previous') }*/}
                    {/*</Button>*/}
                    <Box sx={{ flex: '1 1 auto' }} />
                    { isStepOptional(steps[activeStep]) && (
                        <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                            { t('onboarding_button_skip') }
                        </Button>
                    ) }
                    <Button variant="contained" onClick={ handleNext }>
                        { activeStep === steps.length - 1 ? t('onboarding_button_finish') : t('onboarding_button_next') }
                    </Button>
                </Stack>
            </>) }
        </Box>
    );
};

export default Onboarding;