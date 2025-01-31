import React, { JSX, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Checkbox,
    Chip,
    Divider,
    Grid2,
    SpeedDial, SpeedDialAction, SpeedDialIcon,
    Stack,
    Tab, Tabs,
    Tooltip,
} from '@mui/material';
import { DataGrid, gridClasses, GridColDef, GridRowsProp, GridSortModel, useGridApiRef } from '@mui/x-data-grid';
import {
    AccountBalanceRounded,
    AddRounded,
    AltRouteRounded,
    BiotechRounded,
    CalendarMonthRounded,
    CategoryRounded,
    DashboardCustomizeRounded,
    DateRangeRounded,
    DeleteRounded,
    EditRounded,
    HistoryEduRounded,
    ListRounded,
    LocationCityRounded,
    MeetingRoomRounded,
    NotificationsRounded,
    ScheduleRounded,
    SchoolRounded,
} from '@mui/icons-material';

import Loading from '../components/Loading.tsx';

import APIService from '../../services/APIService.ts';
import ENavTabs from '../enums/ENavTabs.ts';
import StringUtils from '../utils/StringUtils.ts';
import {
    BuildingPopulated,
    ClassPopulated,
    ClassTypePopulated,
    CoursePopulated,
    ElectiveSubjectPopulated,
    PeriodPopulated,
    RoomPopulated,
    SchedulePopulated,
    SemesterPopulated,
    SubjectDetailsPopulated,
    SubjectPopulated,
    TimetablePopulated,
} from '../../services/DBTypes.ts';
import i18n, { i18nPromise } from '../i18n';

const { t } = i18n;
await i18nPromise;

type GridData = {
    name: string;
    icon: JSX.Element;
    getData: () => Promise<any>;
    sortModel?: GridSortModel,
    fields: string[],
};
type TableData = {
    name: string;
    rows: GridRowsProp;
    columns: GridColDef[];
    sortModel: GridSortModel;
};

type AdminPanelProps = {
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
    setCurrentTabValue: React.Dispatch<React.SetStateAction<number | false>>;
}
const AdminPanel: React.FC<AdminPanelProps> = ({ setDocumentTitle, setCurrentTabValue }) => {
    const apiRef = useGridApiRef();
    const navigate = useNavigate();
    const isInitializedRef = useRef<boolean>(false);

    const [currentAdminTabValue, setCurrentAdminTabValue] = useState<number>(0);
    const [currentTable, setCurrentTable] = useState<TableData | undefined>(undefined);
    const [dataLoading, setDataLoading] = useState<boolean>(true);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const addData = () => {

    }
    const editData = () => {

    }
    const deleteData = () => {

    }

    const actions = [
        {
            icon: <AddRounded/>,
            name: 'Dodaj',
            handler: addData,
        },
        {
            icon: <EditRounded/>,
            name: 'Edytuj',
            handler: editData,
        },
        {
            icon: <DeleteRounded/>,
            name: 'Usuń',
            handler: deleteData,
        },
    ];
    const data: GridData[] = [
        // faculties
        {
            name: 'faculties',
            icon: <AccountBalanceRounded/>,
            getData: () => APIService.getFaculties(),
            sortModel: [{ field: 'name', sort: 'asc' }],
            fields: [
                '_id',
                'acronym',
                'name',
                'buildings',
                'courses',
            ],
        },
        {
            name: 'buildings',
            icon: <LocationCityRounded/>,
            getData: () => APIService.getBuildings(),
            sortModel: [{ field: 'name', sort: 'asc' }],
            fields: [
                '_id',
                'acronym',
                'name',
                'address',
                'rooms',
            ],
        },
        {
            name: 'rooms',
            icon: <MeetingRoomRounded/>,
            getData: () => APIService.getRooms(),
            sortModel: [{ field: 'number', sort: 'asc' }],
            fields: [
                '_id',
                'number',
                'numberSecondary',
                'capacity',
            ],
        },

        // courses
        {
            name: 'courses',
            icon: <SchoolRounded/>,
            getData: () => APIService.getCourses(),
            sortModel: [{ field: 'name', sort: 'asc' }],
            fields: [
                '_id',
                'code',
                'name',
                'specialization',
                'degree',
                'cycle',
                'mode',
                'semesters',
                'electiveSubjects',
            ],
        },
        {
            name: 'semesters',
            icon: <DateRangeRounded/>,
            getData: () => APIService.getSemesters(),
            fields: [
                '_id',
                'academicYear',
                'index',
                'subjects',
            ],
        },
        {
            name: 'subjects',
            icon: <BiotechRounded/>,
            getData: () => APIService.getSubjects(),
            sortModel: [{ field: 'name', sort: 'asc' }],
            fields: [
                '_id',
                'code',
                'name',
                'acronym',
                'isElective',
                'classTypes',
            ],
        },
        {
            name: 'subjectDetails',
            icon: <ListRounded/>,
            getData: () => APIService.getSubjectDetails(),
            sortModel: [{ field: 'subject', sort: 'asc' }],
            fields: [
                '_id',
                'course',
                'subject',
                'details',
            ],
        },
        {
            name: 'electiveSubjects',
            icon: <AltRouteRounded/>,
            getData: () => APIService.getElectiveSubjects(),
            sortModel: [{ field: 'name', sort: 'asc' }],
            fields: [
                '_id',
                'name',
                'subjects',
            ],
        },

        // timetables
        {
            name: 'timetables',
            icon: <CalendarMonthRounded/>,
            getData: () => APIService.getTimetables(),
            fields: [
                '_id',
                'semesters',
                'weekdays',
                'schedules',
                'groups',
                'classes',
            ],
        },
        {
            name: 'classes',
            icon: <HistoryEduRounded/>,
            getData: () => APIService.getClasses(),
            sortModel: [{ field: 'weekday', sort: 'asc' }],
            fields: [
                '_id',
                'organizer',
                'subject',
                'classType',
                'weekday',
                'periodBlocks',
                'room',
                'semester',
                'studentGroups',
            ],
        },
        {
            name: 'classTypes',
            icon: <CategoryRounded/>,
            getData: () => APIService.getClassTypes(),
            sortModel: [{ field: 'name', sort: 'asc' }],
            fields: [
                '_id',
                'acronym',
                'name',
                'color',
            ],
        },
        {
            name: 'schedules',
            icon: <ScheduleRounded/>,
            getData: () => APIService.getSchedules(),
            fields: [
                '_id',
                'weekdays',
                'periods',
                'active',
            ],
        },
        {
            name: 'periods',
            icon: <NotificationsRounded/>,
            getData: () => APIService.getPeriods(),
            sortModel: [{ field: 'weekdays', sort: 'asc' }],
            fields: [
                '_id',
                'weekdays',
                'order',
                'startTime',
                'endTime',
            ],
        },
        // {
        //     name: 'personalTimetables',
        //     icon: <PermContactCalendarRounded/>,
        //     getData: () => APIService.getPersonalTimetables,
        // },
    ];

    useEffect(() => {
        setDocumentTitle(t('nav_route_admin_panel'));
        setCurrentTabValue(ENavTabs.AdminPanel);

        const initTable = async () => {
            fetchData(
                await data[currentAdminTabValue].getData(),
                data[currentAdminTabValue].name,
                data[currentAdminTabValue].fields,
                data[currentAdminTabValue].sortModel ?? [{ field: 'id', sort: 'asc' }],
            );
        }

        initTable().then();
    }, []);
    useEffect(() => {
        if (currentTable) {
            setTimeout(() => {
                autosizeAndSort();
                setDataLoading(false);
            }, 20);
        }
    }, [currentTable]);
    useEffect(() => {
        if (currentTable && apiRef.current) {
            const handleStateChange = () => {
                if (!isInitializedRef.current) {
                    isInitializedRef.current = true;

                    apiRef.current.autosizeColumns({
                        expand: true,
                        includeHeaders: true,
                        includeOutliers: true,
                        outliersFactor: 1.5,
                    }).then(() => {
                        apiRef.current.applySorting();
                    });
                }
            };

            const unsubscribeStateChange = apiRef.current.subscribeEvent(
                "stateChange",
                handleStateChange
            );

            return () => {
                unsubscribeStateChange();
            };
        }
    }, [currentTable, apiRef]);
    useEffect(() => {
        if (isInitializedRef.current && currentTable) {
            if (apiRef.current) {
                apiRef.current.autosizeColumns({
                    expand: true,
                    includeHeaders: true,
                    includeOutliers: true,
                    outliersFactor: 1.5,
                }).then(() => {
                    apiRef.current.applySorting();
                });
            }
        }
    }, [currentTable?.rows, currentTable?.columns, apiRef]);

    const fetchData = <T extends { _id: string }>(
        data: T[],
        modelName: string,
        fields: string[],
        sortModel: GridSortModel,
    ) => {
        let rows: GridRowsProp;
        let columns: GridColDef[];
        if (data.length === 0) {
            rows = {} as GridRowsProp;
            columns = [];
        }

        rows = data.map(({ _id, ...fields }) => ({
            id: _id,
            ...fields,
        }));

        columns = fields
            .filter(field => field !== '_id')
            .map(field => ({
                field,
                headerName: t(`dataGrid_${ modelName }_${ String(field) }`),
                renderCell: params => renderCustomCell(field, params.value),
            }));

        setCurrentTable({
            name: t(`dataGrid_${ modelName }`),
            rows,
            columns,
            sortModel,
        });
        setDataLoading(false);
    };

    const autosizeAndSort = () => {
        if (apiRef.current) {
            apiRef.current.autosizeColumns({
                expand: true,
                includeHeaders: true,
                includeOutliers: true,
                outliersFactor: 1.5,
            }).then(() => {
                apiRef.current.applySorting();
            });
        }
    };
    const packToGrid = (element: React.ReactNode) => {
        return <Grid2
            container
            spacing={ 1 }
            direction="row"
            alignItems="center"
            component="span"
            height="100%"
        >
            { element }
        </Grid2>
    }
    const renderCustomCell = <T,>(field: keyof T, value: any) => {
        if (!value) return '';
        console.log(value);

        switch (field) {
            case 'classType': {
                return <Chip
                    label={ String(value.name) }
                    sx={{
                        color: 'black',
                        backgroundColor: value.color,
                    }}
                />;
            }
            case 'color': {
                return <Chip
                    label={ String(value).toUpperCase() }
                    sx={{
                        color: 'black',
                        backgroundColor: value,
                    }}
                />
            }
            case 'course': {
                return <Tooltip title={`${ value.name }` + (value.specialization ? ` (${ value.specialization })` : '')}>
                    <Chip label={ value.code }/>
                </Tooltip>;
            }
            case 'cycle': return StringUtils.cycles[value];
            case 'mode': return StringUtils.modes[value];
            case 'organizer': return `${ value.surnames } ${ value.names }`;
            case 'room': return value.roomNumber;
            case 'semester': {
                return <Tooltip title={ value.academicYear }>
                    <Chip
                        key={ value._id }
                        label={ `${ t('dataGrid_classes_semester') } ${ value.index }` }
                    />
                </Tooltip>
            }
            case 'subject': return value.name;
            case 'weekday': return StringUtils.day[value];
            case 'weekdays': {
                return Object.values(value as number[])
                    .map(day => StringUtils.dayShort[day])
                    .join(' | ');
            }
        }

        if (Array.isArray(value)) {
            switch (field) {
                case 'buildings': {
                    return packToGrid(Object.values(value as BuildingPopulated[])
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(building =>
                            <Chip
                                key={ building._id }
                                label={ building.name }
                            />
                        )
                    );
                }
                case 'classes': {
                    return packToGrid(Object.values(value as ClassPopulated[])
                        .map(c =>
                            <Chip
                                key={ c._id }
                                label={ `${ StringUtils.dayShort[c.weekday] }, ${ c.classType.acronym }, ${ c.organizer?.surnames } ${ c.organizer?.names[0] }.` }
                                sx={{
                                    color: 'black',
                                    backgroundColor: c.classType.color,
                                }}
                            />
                        )
                    );
                }
                case 'classTypes': {
                    return packToGrid(Object.values(value as ClassTypePopulated[])
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(classType =>
                            <Chip
                                key={ classType._id }
                                label={ classType.name }
                                sx={{
                                    color: 'black',
                                    backgroundColor: classType.color,
                                }}
                            />
                        )
                    );
                }
                case 'courses': {
                    return packToGrid(Object.values(value as CoursePopulated[])
                        .sort((a, b) => a.code.localeCompare(b.code))
                        .map(course =>
                            <Tooltip title={ `${ course.name }` + (course.specialization ? ` (${ course.specialization })` : '') }>
                                <Chip
                                    key={ course._id }
                                    label={ course.code }
                                />
                            </Tooltip>
                        )
                    );
                }
                case 'details': {
                    return packToGrid(Object.values(value as SubjectDetailsPopulated['details'])
                        .sort((a, b) => a.classType.name.localeCompare(b.classType.name))
                        .map(subjectDetails =>
                            <Chip
                                key={ subjectDetails.classType._id }
                                label={ `${ subjectDetails.weeklyBlockCount }x ${ subjectDetails.classType.name }` }
                                sx={{
                                    color: 'black',
                                    backgroundColor: subjectDetails.classType.color,
                                }}
                            />
                        )
                    );
                }
                case 'electiveSubjects': {
                    return packToGrid(Object.values(value as ElectiveSubjectPopulated[])
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(electiveSubject =>
                            <Chip
                                key={ electiveSubject._id }
                                label={ electiveSubject.name }
                            />
                        )
                    );
                }
                case 'groups': {
                    return packToGrid(Object.values(value as TimetablePopulated['groups'])
                        .map(group =>
                            <Chip
                                key={ group.classType._id }
                                label={ `${ group.classType.name } x${ group.groupCount }` }
                                sx={{
                                    color: 'black',
                                    backgroundColor: group.classType.color,
                                }}
                            />
                        )
                    );
                }
                case 'periods': {
                    return packToGrid(Object.values(value as PeriodPopulated[])
                        .sort((a, b) => a.order - b.order)
                        .map(period =>
                            <Chip
                                key={ period._id }
                                label={ `${ period.startTime } – ${ period.endTime }` }
                            />
                        )
                    );
                }
                case 'rooms': {
                    return packToGrid(Object.values(value as RoomPopulated[])
                        .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))
                        .map(room =>
                            <Chip
                                key={ room._id }
                                label={ room.roomNumber }
                            />
                        )
                    );
                }
                case 'schedules': {
                    return packToGrid(Object.values(value as SchedulePopulated[])
                        .map(schedule => {
                            const label = Object.values(schedule.periods as SchedulePopulated['periods'])
                                .map(period => {
                                    return `${period.startTime} – ${period.endTime}`;
                                })
                                .join(', ');

                            return <Tooltip title={ label }>
                                <Chip
                                    key={ schedule._id }
                                    label={ label }
                                />
                            </Tooltip>
                        })
                    );
                }
                case 'semesters': {
                    return packToGrid(Object.values(value as SemesterPopulated[])
                        .sort((a, b) => a.academicYear.localeCompare(b.academicYear))
                        .map(semester =>
                            <Tooltip title={ semester.academicYear }>
                                <Chip
                                    key={ semester._id }
                                    label={ `${ t('dataGrid_classes_semester') } ${ semester.index }` }
                                />
                            </Tooltip>
                        )
                    );
                }
                case 'subjects': {
                    return packToGrid(Object.values(value as SubjectPopulated[])
                        .sort((a, b) => a.code.localeCompare(b.code))
                        .map(subject =>
                            <Tooltip title={ subject.name }>
                                <Chip
                                    key={ subject._id }
                                    label={ subject.code }
                                />
                            </Tooltip>
                        )
                    );
                }
            }

            return value.map(item => (typeof item === 'object' ? (item.name ?? item._id) : item)).join(', ');
        }
        if (typeof value === 'boolean') {
            return <Checkbox checked={ value } disabled/>;
        }
        if (typeof value === 'object') {
            return value._id;
        }

        return value;
    };

    const handleAdminTabChange = async (_e: React.SyntheticEvent, value: number) => {
        if (value === data.length + 1) {
            navigate('/onboarding');
            return;
        }

        setDataLoading(true);
        setCurrentAdminTabValue(value);
        fetchData(await data[value].getData(), data[value].name, data[value].fields ?? ['_id'], data[value].sortModel ?? [{
            field: 'id',
            sort: 'asc',
        }]);
    };

    return (
        // TODO: choose a good maxHeight, so the table doesn't overflow
        <Stack spacing={ 2 } sx={{ maxHeight: '86.3vh' }}>
            <Tabs
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
                value={ currentAdminTabValue }
                onChange={ handleAdminTabChange }
            >
                { data.map(tab =>
                    <Tab
                        key={ tab.name }
                        icon={ tab.icon }
                        label={ t(`dataGrid_${ tab.name }`) }
                    />
                ) }

                <Tab icon={ <Divider/> } disabled/>

                <Tab
                    key={ t('nav_route_onboarding') }
                    icon={ <DashboardCustomizeRounded/> }
                    label={ t('nav_route_onboarding') }
                />
            </Tabs>

            { currentTable ? (<>
                <DataGrid
                    // styling
                    sx={{
                        margin: 0,
                        [`& .${ gridClasses.cell }`]: {
                            py: 1,
                        },
                    }}
                    autosizeOptions={{
                        expand: true,
                        includeHeaders: true,
                        includeOutliers: true,
                        outliersFactor: 1.5,
                    }}
                    getRowHeight={ () => 'auto' }

                    // paging
                    pageSizeOptions={ [25, 50, 100] }

                    // loading overlay
                    loading={ dataLoading }
                    slotProps={{
                        loadingOverlay: {
                            variant: 'skeleton',
                            noRowsVariant: 'skeleton',
                        },
                    }}

                    // selection
                    checkboxSelection
                    onRowSelectionModelChange={ selection => setSelectedRows(selection as number[]) }

                    // data
                    apiRef={ apiRef }
                    rows={ currentTable.rows ?? [] }
                    columns={ currentTable.columns ?? [] }
                    initialState={{
                        sorting: { sortModel: currentTable.sortModel },
                        pagination: { paginationModel: { pageSize: 25, page: 0 } },
                    }}
                    onStateChange={ () => {
                        if (!isInitializedRef.current) {
                            isInitializedRef.current = true;
                            autosizeAndSort();
                        }
                    } }
                />

                <SpeedDial
                    ariaLabel="Akcje"
                    icon={ <SpeedDialIcon/> }
                    sx={{
                        position: 'absolute',
                        bottom: '-3%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    { actions.map(action => {
                        if (action.name === 'Edytuj' && selectedRows.length !== 1) return;
                        if (action.name === 'Usuń' && selectedRows.length === 0) return;

                        return <SpeedDialAction
                            key={ action.name }
                            icon={ action.icon }
                            tooltipTitle={ action.name }
                            onClick={ action.handler }
                        />;
                    }) }
                </SpeedDial>
            </>) : (
                <Loading/>
            ) }
        </Stack>
    );
};

export default AdminPanel;
