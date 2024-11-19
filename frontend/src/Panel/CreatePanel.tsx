import React, { useEffect, useState } from "react";

import APIService from "../../services/APIService.ts";
import { TimetablePopulated } from '../../services/DBTypes.ts';

const CreatePanel: React.FC = () => {
    const [timetables, setTimetables] = useState<TimetablePopulated[] | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            const data = await APIService.getTimetables()
            setTimetables(data); // store fetched timetables in state
        };

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
