import React, { JSX, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {
    Accordion, AccordionDetails, AccordionSummary,
    Autocomplete,
    FormControl, FormControlLabel, FormLabel,
    Radio, RadioGroup,
    Stack,
    Tab, Tabs,
    Table, TableBody, TableCell, TableHead, TableRow,
    TextField,
    Typography,
} from '@mui/material';
import {
    ArrowDropDownRounded,
    EditCalendarRounded,
    MeetingRoomRounded,
    PermContactCalendarRounded,
    PublicRounded,
} from '@mui/icons-material';

import PersonalTimetableOptions from '../components/PersonalTimetableOptions.tsx';
import ProfessorClasses from '../components/ProfessorClasses.tsx';
import StudentClasses from '../components/StudentClasses.tsx';

import APIService from '../../services/APIService.ts';
import APIUtils from '../utils/APIUtils.ts';
import StringUtils from '../utils/StringUtils.ts';
import ECourseCycle from '../../../backend/src/enums/ECourseCycle.ts';
import ECourseMode from '../../../backend/src/enums/ECourseMode.ts';
import ENavTabs from '../enums/ENavTabs';
import EUserRole from '../../../backend/src/enums/EUserRole.ts';
import EWeekday from '../enums/EWeekday.ts';
import { ClassPopulated, FacultyPopulated, TimetablePopulated, UserPopulated } from '../../services/DBTypes.ts';
import i18n, { i18nPromise } from '../i18n';

const { t } = i18n;
await i18nPromise;

type StudentInfo = {
    facultyId: string;
    mode: ECourseMode;
    cycle: ECourseCycle;
    courseId: string;
    semesterId: string;
    groups: { [p: string]: number };
}

type HomeProps = {
    isUserOnMobile: boolean;
    setCurrentTabValue: React.Dispatch<React.SetStateAction<number | false>>;
    setDialogData: React.Dispatch<React.SetStateAction<{ title: string; content: JSX.Element }>>;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
}
const Home: React.FC<HomeProps> = ({ isUserOnMobile, setCurrentTabValue, setDialogData, setDialogOpen, setDocumentTitle }) => {
    const [cookies, setCookie, removeCookie] = useCookies();

    const [weekday, setWeekday] = useState<EWeekday>(new Date().getDay());
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [outerAccordionExpanded, setOuterAccordionExpanded] = useState<boolean>(true);
    const [innerAccordionExpanded, setInnerAccordionExpanded] = useState<boolean>(false);
    const [outerAccordionTitle, setOuterAccordionTitle] = useState<string>('Personalny plan zajęć');
    const [innerAccordionTitle, setInnerAccordionTitle] = useState<string>('Właściwości planu');
    const [groupCount, setGroupCount] = useState<number>(-1);

    const [childMessage, setChildMessage] = useState<StudentInfo>({
        facultyId: '',
        mode: 0,
        cycle: 0,
        courseId: '',
        semesterId: '',
        groups: {},
    });
    const [childMessageToSend, setChildMessageToSend] = useState<StudentInfo>({
        facultyId: '',
        mode: 0,
        cycle: 0,
        courseId: '',
        semesterId: '',
        groups: {},
    });

    const [classes, setClasses] = useState<ClassPopulated[]>([]);
    const [faculties, setFaculties] = useState<FacultyPopulated[]>([]);
    const [professors, setProfessors] = useState<UserPopulated[]>([]);
    const [timetables, setTimetables] = useState<TimetablePopulated[]>([]);

    const [selectedProfessor, setSelectedProfessor] = useState<UserPopulated | null>(null);
    const [selectedProfessorId, setSelectedProfessorId] = useState<string>('');
    const [selectedTimetableType, setSelectedTimetableType] = useState<EUserRole>(EUserRole.Guest);

    useEffect(() => {
        setDocumentTitle(t('nav_route_main'));
        setCurrentTabValue(ENavTabs.Home);

        const fetchData = async () => {
            setClasses(await APIService.getClasses());
            setFaculties(await APIService.getFaculties());
            setTimetables(await APIService.getTimetables());
            setProfessors(APIUtils.getUsersWithRole(await APIService.getUsers(), EUserRole.Professor));
            setOuterAccordionTitle(t('personal_timetable'));
        };

        fetchData().then(() => {
            const timetableType = cookies['personal-type'] as EUserRole;
            if (timetableType === EUserRole.Student) {
                setSelectedTimetableType(EUserRole.Student);
                setChildMessage({
                    facultyId: cookies['personal-facultyId'] ?? '',
                    mode: cookies['personal-mode'] ?? 0,
                    cycle: cookies['personal-cycle'] ?? 0,
                    courseId: cookies['personal-courseId'] ?? '',
                    semesterId: cookies['personal-semesterId'] ?? '',
                    groups: cookies['personal-groups'] ?? {},
                });
            } else if (timetableType === EUserRole.Professor) {
                setSelectedTimetableType(EUserRole.Professor);
                const professor = cookies['personal-professor'] as UserPopulated;
                setSelectedProfessor(professor ?? null);
                setSelectedProfessorId(cookies['personal-professorId'] ?? '');
                setOuterAccordionTitle(t('personal_timetable') + (professor ? ` – ${ professor.surnames } ${ professor.names }` : ''));
            } else {
                setInnerAccordionExpanded(true);
            }
        });
    }, []);
    useEffect(() => {
        setChildMessageToSend(childMessage)
    }, [childMessage]);
    useEffect(() => {
        setRefreshKey(prev => prev + 1);
        if (Object.keys(childMessage.groups).length === groupCount) {
            setInnerAccordionExpanded(false);
        }
    }, [childMessage.groups]);

    const handleChildData = (data: StudentInfo) => {
        setCookie('personal-type', EUserRole.Student);
        setCookie('personal-facultyId', data.facultyId);
        setCookie('personal-mode', data.mode);
        setCookie('personal-cycle', data.cycle);
        setCookie('personal-courseId', data.courseId);
        setCookie('personal-semesterId', data.semesterId);
        setCookie('personal-groups', data.groups);
        setChildMessage(data);
    };
    const handleWeekdayChange = (_e: React.SyntheticEvent, v: EWeekday) => {
        setWeekday(v);
    }
    const handleOuterAccordionChange = () => {
        if (!outerAccordionExpanded) {
            setOuterAccordionTitle(t('personal_timetable'))
        } else {
            const professor = professors.find(p => p._id === selectedProfessorId);
            setOuterAccordionTitle(t('personal_timetable') + (professor ? ` – ${ professor.surnames } ${ professor.names }` : ''));
        }

        setOuterAccordionExpanded(!outerAccordionExpanded);
    };
    const handleInnerAccordionChange = () => {
        setInnerAccordionExpanded(!innerAccordionExpanded);
    };
    const handleTimetableTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const type = parseInt(event.target.value) as EUserRole;
        setSelectedTimetableType(type);

        if (type === EUserRole.Student) {
            setCookie('personal-type', EUserRole.Student);
            setSelectedProfessorId('');
        } else if (type === EUserRole.Professor) {
            setCookie('personal-type', EUserRole.Professor);
            setRefreshKey(0);
        }
    }
    const handleProfessorChange = (_e: React.SyntheticEvent, professor: UserPopulated | null) => {
        let title: string = '';

        if (professor) {
            title = ` – ${ professor.surnames } ${ professor.names }`;
            setSelectedProfessor(professor);
            setSelectedProfessorId(professor._id);
            setCookie('personal-professor', professor);
            setCookie('personal-professorId', professor._id);
            setInnerAccordionExpanded(false);
        } else {
            setSelectedProfessor(null);
            setSelectedProfessorId('');
            removeCookie('personal-professor');
            removeCookie('personal-professorId');
        }

        setInnerAccordionTitle(t('personal_timetable') + title);
    };

    return (<>
        <Accordion expanded={ outerAccordionExpanded } onChange={ handleOuterAccordionChange }>
            <AccordionSummary expandIcon={ <ArrowDropDownRounded/> }>
                <Typography><PermContactCalendarRounded sx={{ mr: 1 }}/>{ outerAccordionTitle }</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Accordion expanded={ innerAccordionExpanded } onChange={ handleInnerAccordionChange }>
                    <AccordionSummary expandIcon={ <ArrowDropDownRounded/> }>
                        <Typography><EditCalendarRounded sx={{ mr: 1 }}/>{ innerAccordionTitle }</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormControl>
                            <FormLabel>{ t('personal_timetable_type') }</FormLabel>
                            <RadioGroup
                                row
                                value={ selectedTimetableType }
                                onChange={ handleTimetableTypeChange }
                            >
                                <FormControlLabel
                                    value={ EUserRole.Student }
                                    control={ <Radio/> }
                                    label={ t('personal_timetable_student\'s') }
                                />
                                <FormControlLabel
                                    value={ EUserRole.Professor }
                                    control={ <Radio/> }
                                    label={ t('personal_timetable_professor\'s') }
                                />
                            </RadioGroup>
                        </FormControl>

                        { selectedTimetableType === EUserRole.Student && (<>
                            <Stack
                                spacing={ 2 }
                                direction="column"
                                component={ FormControl }
                                sx={{
                                    height: '100%',
                                    // minHeight: '100vh',
                                }}
                            >
                                <FormLabel>{ t('personal_timetable_details') }</FormLabel>
                                <PersonalTimetableOptions
                                    setGroupCount={ setGroupCount }
                                    onSendData={ handleChildData }
                                />
                            </Stack>
                        </>) }

                        { selectedTimetableType === EUserRole.Professor && (
                            <Stack
                                spacing={ 2 }
                                direction="column"
                                component={ FormControl }
                                sx={{
                                    height: '100%',
                                    // minHeight: '100vh',
                                }}
                            >
                                <FormLabel>{ t('personal_timetable_details') }</FormLabel>
                                <Autocomplete
                                    clearOnEscape
                                    value={ selectedProfessor }
                                    options={ professors.sort((a, b) => a.surnames.localeCompare(b.surnames)) }
                                    groupBy={ professor => professor.surnames[0] }
                                    getOptionLabel={ professor => professor.surnames + ' ' + professor.names }
                                    onChange={ handleProfessorChange }
                                    renderInput={ params => <TextField { ...params } label={ t('personal_timetable_professor') }/> }
                                />
                            </Stack>
                        ) }
                    </AccordionDetails>
                </Accordion>

                { (selectedProfessorId || refreshKey > 0) && (<>
                    { isUserOnMobile ? (<>
                        <Tabs
                            variant="fullWidth"
                            value={ weekday }
                            onChange={ handleWeekdayChange }
                        >
                            { Object.entries(StringUtils.day)
                                .filter(([k]) => k !== '0')
                                .map(([k, v]) =>
                                    <Tab label={ v } key={ parseInt(k) } value={ parseInt(k) }/>
                                )
                            }
                            <Tab value={ 0 } label={ StringUtils.day['0'] }/>
                        </Tabs>

                        { selectedTimetableType === EUserRole.Student ? (
                            <StudentClasses
                                weekday={ weekday }
                                groups={ childMessageToSend.groups }
                                semesterId={ childMessageToSend.semesterId }
                                facultiesAll={ faculties }
                                timetablesAll={ timetables }
                                setDialogData={ setDialogData }
                                setDialogOpen={ setDialogOpen }
                            />
                        ) : selectedTimetableType === EUserRole.Professor && (
                            <ProfessorClasses
                                weekday={ weekday }
                                userId={ selectedProfessorId }
                                classesAll={ classes }
                                facultiesAll={ faculties }
                                timetablesAll={ timetables }
                                setDialogData={ setDialogData }
                                setDialogOpen={ setDialogOpen }
                            />
                        ) }
                    </>) : (<Table>
                        <TableHead>
                            <TableRow>
                                { Object.entries(StringUtils.day)
                                    .filter(([k]) => k !== '0')
                                    .map(([k, v]) =>
                                        <TableCell key={ k }>
                                            <Typography variant="h6">{ v }</Typography>
                                        </TableCell>
                                    )
                                }
                                <TableCell key={ 0 }>
                                    <Typography variant="h6">{ StringUtils.day[0] }</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow sx={{ verticalAlign: 'top' }}>
                                { Object.entries(StringUtils.day)
                                    .filter(([k]) => k !== '0')
                                    .map(([k]) =>
                                        <TableCell key={ k }>
                                            { selectedTimetableType === EUserRole.Student ? (
                                                <StudentClasses
                                                    weekday={ parseInt(k) }
                                                    groups={ childMessageToSend.groups }
                                                    semesterId={ childMessageToSend.semesterId }
                                                    facultiesAll={ faculties }
                                                    timetablesAll={ timetables }
                                                    setDialogData={ setDialogData }
                                                    setDialogOpen={ setDialogOpen }
                                                />
                                            ) : selectedTimetableType === EUserRole.Professor && (
                                                <ProfessorClasses
                                                    weekday={ parseInt(k) }
                                                    userId={ selectedProfessorId }
                                                    classesAll={ classes }
                                                    facultiesAll={ faculties }
                                                    timetablesAll={ timetables }
                                                    setDialogData={ setDialogData }
                                                    setDialogOpen={ setDialogOpen }
                                                />
                                            ) }
                                        </TableCell>
                                    )
                                }

                                <TableCell key={ 0 }>
                                    { selectedTimetableType === EUserRole.Student ? (
                                        <StudentClasses
                                            weekday={ 0 }
                                            groups={ childMessageToSend.groups }
                                            semesterId={ childMessageToSend.semesterId }
                                            facultiesAll={ faculties }
                                            timetablesAll={ timetables }
                                            setDialogData={ setDialogData }
                                            setDialogOpen={ setDialogOpen }
                                        />
                                    ) : selectedTimetableType === EUserRole.Professor && (
                                        <ProfessorClasses
                                            weekday={ 0 }
                                            userId={ selectedProfessorId }
                                            classesAll={ classes }
                                            facultiesAll={ faculties }
                                            timetablesAll={ timetables }
                                            setDialogData={ setDialogData }
                                            setDialogOpen={ setDialogOpen }
                                        />
                                    ) }
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>) }
                </>) }
            </AccordionDetails>
        </Accordion>

        <Stack
            spacing={ 2 }
            sx={{
                mt: 2,
                pl: 10, pr: 10,
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'pre-line',
                textAlign: 'center'
            }}
        >
            <Typography variant="h4">Witamy w Planoramce!</Typography>
            <Typography variant="body1">
                Planoramka to aplikacja, dzięki której szybko sprawdzisz swój uczelniany plan zajęć.
            </Typography>

            <Typography variant="h5"><PermContactCalendarRounded/> Personalny plan zajęć</Typography>
            <Typography variant="body1">
                {
                    `To twoja pierwsza wizyta i nie wiesz co ze sobą zrobić?
                    Zacznij od rozwinięcia personalnego planu zajęć znajdującego się pod zakładkami 😉`
                }
            </Typography>

            <Typography variant="h5"><MeetingRoomRounded/> Zajętość sal</Typography>
            <Typography variant="body1">
                {
                    `Jesteś wykładowcą i szukasz wolnej sali? A może studentem organizującym jakieś wydarzenie?
                    Dzięki tabeli przedstawiającej zajętość sal na każdym wydziale z łatwością znajdziesz jakiś pusty pokój 😌`
                }
            </Typography>

            <Typography variant="h5"><PublicRounded/> Dostęp do strony</Typography>
            <Typography variant="body1">
                {
                    `Nasza strona jest dostępna dla wszystkich, nie trzeba się na niej rejestrować.
                    Jeśli już jednak ktoś się na to zdecyduje, to apka zapamięta ustawienia jego personalnego planu.
                    Posiadamy również wersję mobilną, bo to właśnie na telefonach studenci najczęściej sprawdzają swój plan 😄`
                }
            </Typography>
        </Stack>
    </>);
};

export default Home;
