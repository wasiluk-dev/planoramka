import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Tabs } from '@mui/material';
import { DeleteForeverRounded, EditRounded } from '@mui/icons-material';

import APIService from '../../services/APIService.ts';
import ENavTabs from '../enums/ENavTabs.ts';
import i18n, { i18nPromise } from '../i18n';

const { t } = i18n;
await i18nPromise;

type AdminPanelProps = {
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
    setCurrentTabValue: React.Dispatch<React.SetStateAction<number | false>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ setDocumentTitle, setCurrentTabValue }) => {
    const [tableData, setTableData] = useState([]);
    const [tableColumns, setTableColumns] = useState<string[]>([]);
    const [tableColumnsNoId, setTableColumnsNoId] = useState([]);
    const [tablePopupData, setTablePopupData] = useState({});
    const [tableTitle, setTableTitle] = useState("Budynki");

    const [showEditPopup, setShowEditPopup] = useState(false);
    const [selectedObjectId, setSelectedObjectId] = useState("");
    const [isCreate, setIsCreate] = useState(false);

    useEffect(() => {
        setDocumentTitle(t('nav_route_admin_panel'));
        setCurrentTabValue(ENavTabs.AdminPanel);

        fetchBuildings().then();
    }, []);

    function handleListButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
        switch (e.currentTarget.id) {
            case "buildings":
                fetchBuildings();
                setTableTitle("Budynki");
                break;
            case "rooms":
                fetchRooms();
                setTableTitle("Sale");
                break;
            case "courses":
                fetchCourses();
                setTableTitle("Kursy");
                break;
            case "users":
                fetchUsers();
                setTableTitle("Użytkownicy");
                break;
            case "classtypes":
                fetchClassTypes();
                setTableTitle("Typy zajęć");
                break;
            case "electivesubjects":
                fetchElectiveSubjects();
                setTableTitle("Przedmioty obieralne");
                break;
            case "faculties":
                fetchFaculties();
                setTableTitle("Wydziały");
                break;
            case "periods":
                fetchPeriods();
                setTableTitle("Okresy");
                break;
            default:
                break;
        }
    }

    async function fetchBuildings() {
        const data = await APIService.getBuildings();
        setTablePopupData(data);
        let table_columns = Object.keys(data[0]).filter(column => column);
        let table_data = data.map(building => {
            return Object.values(building);
        });

        table_data.forEach((row) => {
            try {
                row[4] = row[4].map(room => room.number || room.numberSecondary).join(', ');
            } catch (err) {
                row[4] = "";
            }
        });

        setTableColumns(table_columns);
        setTableData(table_data);

        let tableColumnsNoId = table_columns;
        tableColumnsNoId = tableColumnsNoId.filter(column => column !== '_id');
        console.log(tableColumnsNoId);

        setTableColumnsNoId(tableColumnsNoId)
    }

    async function fetchRooms() {
        const data = await APIService.getRooms();
        setTablePopupData(data);
        let table_columns = Object.keys(data[0]);
        let table_data = data.map(room => {
            return Object.values(room);
        });

        setTableColumns(table_columns);
        setTableData(table_data);
    }

    async function fetchCourses() {
        const data = await APIService.getCourses();
        setTablePopupData(data);
        let table_columns = Object.keys(data[0]);
        let table_data = data.map(course => {
            return Object.values(course);
        });

        table_data.forEach((row) => {
            try {
                row[7] = row[7].map(course => course.academicYear).join(", ");
            } catch (err) {
                row[7] = "";
            }
        })

        table_data.forEach((row) => {
            try {
                console.log(row)
                row[8] = row[8].map(course => course.name).join(", ");
            } catch (err) {
                row[8] = "";
            }
        })

        setTableColumns(table_columns);
        setTableData(table_data);
    }

    async function fetchUsers() {
        const data = await APIService.getUsers();
        console.log(data)
        setTablePopupData(data);
        let table_columns = Object.keys(data[0]);
        let table_data = data.map(user => {
            return Object.values(user);
        });

        setTableColumns(table_columns);
        setTableData(table_data);
    }

    async function fetchClasses() {
        const data = await APIService.getClasses();
        setTablePopupData(data);
        let table_columns = Object.keys(data[0]);
        let table_data = data.map(row => {
            return Object.values(row);
        });

        setTableColumns(table_columns);
        setTableData(table_data);
    }

    async function fetchClassTypes() {
        const data = await APIService.getClassTypes();
        setTablePopupData(data);
        let table_columns = Object.keys(data[0]);
        let table_data = data.map(classType => {
            return Object.values(classType);
        });

        setTableColumns(table_columns);
        setTableData(table_data);
    }

    async function fetchElectiveSubjects() {
        const data = await APIService.getElectiveSubjects();
        setTablePopupData(data);
        let table_columns = Object.keys(data[0]);
        let table_data = data.map(electiveSubject => {
            return Object.values(electiveSubject);
        });

        setTableColumns(table_columns);
        setTableData(table_data);
    }

    async function fetchFaculties() {
        const data = await APIService.getFaculties();
        setTablePopupData(data);
        let table_columns = Object.keys(data[0]);
        let table_data = data.map(faculty => {
            return Object.values(faculty);
        });

        setTableColumns(table_columns);
        setTableData(table_data);
    }

    async function fetchPeriods() {
        const data = await APIService.getPeriods();
        setTablePopupData(data);
        let table_columns = Object.keys(data[0]);
        let table_data = data.map(period => {
            return Object.values(period);
        });

        setTableColumns(table_columns);
        setTableData(table_data);
    }
    function handleActionElementEditClick(e: React.MouseEventHandler<HTMLButtonElement>) {
        console.log(e.currentTarget.parentElement?.parentElement?.parentElement.id);
        setSelectedObjectId(e.currentTarget.parentElement?.parentElement?.parentElement.id);
        setIsCreate(false);
        setShowEditPopup(true);
    }

    function handleActionAddElementClick() {
        setIsCreate(true);
        setShowEditPopup(true);
    }

    function handleActionDeleteElementClick(e: React.MouseEventHandler<HTMLButtonElement>) {
        let id = e.currentTarget.parentElement?.parentElement?.parentElement.id;
        let obj = {};
        obj.id = id;
        console.log(obj);
        switch (tableTitle) {
            case "Budynki":
                APIService.deleteBuildingAdmin(obj);
                break;
            case "Sale":
                //APIService.deleteRoomAdmin(selectedObjectId);
                break;
            case "Kursy":
                APIService.deleteCourseAdmin(obj);
                break;
            case "Użytkownicy":
                //APIService.deleteUserAdmin(selectedObjectId);
                break;
            case "Typy Zajęć":
                //APIService.deleteClassTypeAdmin(selectedObjectId);
                break;
            case "Przedmioty Obieralne":
                //APIService.deleteElectiveSubjectAdmin(selectedObjectId);
                break;
            case "Wydziały":
                //APIService.deleteFacultyAdmin(selectedObjectId);
                break;
            case "Okresy":
                //APIService.deletePeriodAdmin(selectedObjectId);
                break;
            default:
                break
        }
    }

    return (
        <div className="container-fluid main">
            { (() => {
                switch (tableTitle) {
                    case "Budynki":
                        return showEditPopup ? <BuildingEditPopup onClose={() => setShowEditPopup(false)} tableData={tablePopupData} tableColumns={tableColumns} object_id={selectedObjectId} isCreate={isCreate}/> : null;
                    // Add other cases for different popups here
                    case "Sale":
                        return null;
                    case "Kursy":
                        return showEditPopup ? <CourseEditPopup onClose={() => setShowEditPopup(false)} tableData={tablePopupData} tableColumns={tableColumns} object_id={selectedObjectId} isCreate={isCreate}/> : null;
                    default:
                        return null;
                }
            })() }
            <Tabs>

            </Tabs>
            <ul className="button_list">
                <Button id="buildings" onClick={handleListButtonClick}>
                    Budynki
                </Button>
                {/*<button id="classes" className="d-flex justify-content-between align-items-center button" onClick={handleListButtonClick}>*/}
                {/*    Zajęcia*/}
                {/*    <span className="badge bg-primary rounded-pill">{entryCount["classes"]}</span>*/}
                {/*</button>*/}
                <Button id="classtypes" onClick={handleListButtonClick}>
                    Typy zajęć
                </Button>
                <Button id="courses" onClick={handleListButtonClick}>
                    Kierunki
                </Button>
                <Button id="electivesubjects" onClick={handleListButtonClick}>
                    Przedmioty obieralne
                </Button>
                <Button id="faculties" onClick={handleListButtonClick}>
                    Wydziały
                </Button>
                <Button id="periods" onClick={handleListButtonClick}>
                    Okresy
                </Button>
                <Button id="rooms" onClick={handleListButtonClick}>
                    Sale
                </Button>
                <Button id="users" onClick={handleListButtonClick}>
                    Użytkownicy
                    {/*<span className="badge bg-primary rounded-pill">{entryCount["users"]}</span>*/}
                </Button>
            </ul>
            <div id="table_container">
                <div>
                    <h1 className="table_title p-2 pb-0">{tableTitle}</h1>
                    <div className="p-2">
                        <button className="btn btn-primary mx-1" onClick={() => handleActionAddElementClick()}>
                            Dodaj
                        </button>
                        <button className="btn btn-danger mx-1">
                            Usuń wybrane
                        </button>
                        <button className="btn btn-primary mx-1">
                            Filtry
                        </button>
                    </div>
                </div>
                <Table>
                    <TableHead>
                        <TableRow>
                            { tableColumns.map(column => {
                                if (column === '_id') return;
                                return <TableCell key={column}>{t(`admin_column_${column}`)}</TableCell>;
                            }) }
                            <TableCell className="fixed_width">Akcje</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    { tableData.map((row, i) =>
                        <TableRow key={ i } id={ row.toString().split(',')[0] }>
                            { row.map((cell, j) => {
                                if (j === 0) return;
                                return <td key={ j }>{ cell }</td>
                            }) }
                            <TableCell>
                                <div>
                                    <Button
                                        variant="contained"
                                        startIcon={ <EditRounded/> }
                                        onClick={ handleActionElementEditClick }
                                    >
                                        Edytuj
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={ <DeleteForeverRounded/> }
                                        onClick={handleActionDeleteElementClick}
                                    >
                                        Usuń
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) }
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminPanel;
