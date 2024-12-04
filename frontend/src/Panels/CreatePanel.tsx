import React, { useEffect, useState } from 'react';
import APIService from '../../services/apiService.tsx';
import { TimetablePopulated } from '../../services/databaseTypes.tsx';

const CreatePanel: React.FC = () => {
    const [timetables, setTimetables] = useState<TimetablePopulated[]>([]);

    useEffect(() => {
        const fetchData = async() => setTimetables(await APIService.getTimetables());
        fetchData();
    }, []);

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    Dodaj Course:
                </div>
                <div className="col">
                    Dodaj Coś innego:
                </div>
                <div className="col">
                    Dodaj Jeszcze coś innego:
                </div>
                <div className="col">
                    Dodaj Tamto:
                </div>
                <div className="col">
                    Dodaj Siamto:
                </div>
            </div>
        </div>
    );
};

export default CreatePanel;
