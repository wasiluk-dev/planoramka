import React, {useEffect, useState} from 'react';

import ENavTabs from '../enums/ENavTabs';
import i18n, { i18nPromise } from '../i18n';
import SearchableDropdown from "../Components/SearchableDropdown/SearchableDropdown.tsx";
import apiService from "../../services/apiService.tsx";
import APIUtils from "../utils/APIUtils.ts";
import EUserRole from "../../../backend/src/enums/EUserRole.ts";
import {UserPopulated} from "../../services/databaseTypes.tsx";

const { t } = i18n;
await i18nPromise;

type HomeProps = {
    setDocumentTitle: React.Dispatch<React.SetStateAction<string>>;
    setCurrentTabValue: React.Dispatch<React.SetStateAction<number | boolean>>;
}

const Home: React.FC<HomeProps> = ({ setDocumentTitle, setCurrentTabValue }) => {

    const [selectedScheduleType, setSelectedScheduleType] = useState<string>("")
    const [teacherList, setTeacherList] = useState([])
    const [allTeachers, setAllTeachers] = useState<Array<UserPopulated>>([])
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>("")
    const [selectedTeacher, setSelectedTeacher] = useState<string>("")
    const [teacherSurnameList, setTeacherSurnameList] = useState<Pick<UserPopulated, '_id' | 'surnames' | 'names'>[]>([])

    useEffect(() => {
        setDocumentTitle(t('nav_route_main'));
        setCurrentTabValue(ENavTabs.Home);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await apiService.getUsers();

            setAllTeachers(APIUtils.getUsersWithRole(data, EUserRole.Professor));
        };

        fetchData();
    }, []);

    useEffect(() => {
        const modifiedNames = allTeachers.map(teacher => {
            const surnames = teacher.surnames
            const names = teacher.names
            return {
                _id: teacher._id,
                names: teacher.names,
                surnames: teacher.surnames,
                fullName: `${surnames} ${names}`
            };
        });

        setTeacherSurnameList(modifiedNames);
    }, [allTeachers]);

    useEffect(() => {
        setTeacherList(teacherSurnameList.map(teacher => ({
            _id: teacher._id,
            name: teacher.names + " " + teacher.surnames,
        })))
    }, [teacherSurnameList]);

    const handleTeacherChange = (val: { name: string; _id: string } | null) => {
            const teacherValue = val ? val._id : '';
            const teacherValueName = val ? val.name : '';
            console.log(teacherValue)
            setSelectedTeacherId(teacherValue);
            setSelectedTeacher(teacherValueName)
    };

    const handleScheduleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedScheduleType(event.target.value)
    }

    return (
        <div className="d-flex">
            <div className="navbar flex-1 bg-danger p-4">
                <select
                    className="form-select mb-2 w-100"
                    aria-label="Default select example"
                    value={selectedScheduleType}
                    onChange={handleScheduleTypeChange}
                >
                    <option value="" disabled hidden>Wybierz Rozkład</option>
                    <option value="teacher">Rozkład Nauczyciela</option>
                    <option value="student">Rozkład Ucznia</option>
                </select>
                {selectedScheduleType === "teacher" ? (
                    <SearchableDropdown
                        placeholder = "Wybierz nauczyciela..."
                        options={ teacherList }
                        label="name"
                        id="id"
                        selectedVal={ selectedTeacher }
                        handleChange={ (val) => handleTeacherChange(val) } // Set empty string if val is null
                    />
                ) : null}
            </div>
            <div className="main flex-fill bg-success w-100 p-5">
                <table>
                    <tbody>
                    <tr>
                        <td className="text-center">
                            Elo!
                        </td>
                    </tr>
                    <tr>
                        <td className="text-center">
                            Elo!
                        </td>
                    </tr>
                    <tr>
                        <td className="text-center">
                            Elo!
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>);
};

export default Home;
