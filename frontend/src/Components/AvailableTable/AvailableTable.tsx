import React, {useEffect, useState} from "react";
import EWeekday from "../../enums/EWeekday.ts";
import "./AvailableTable.css"
import PeriodBlock from "../PeriodBlock/PeriodBlock.tsx";
import APIUtils from "../../utils/APIUtils.ts";
import {
    ClassPopulated,
    ClassTypePopulated, CoursePopulated,
    FacultyPopulated, PeriodPopulated, RoomPopulated, SemesterPopulated, SubjectPopulated,
    TimetablePopulated
} from "../../../services/databaseTypes.tsx";

type TeacherInfo = {
    _id: string;
    classesAll: Array<ClassPopulated>;
    timetablesAll: Array<TimetablePopulated>;
    facultiesAll: Array<FacultyPopulated>;
}

type PeriodBlockPopulated = {
    classType: ClassTypePopulated;
    subject: Pick<SubjectPopulated, '_id' | 'name' | 'shortName'>;
    room: Pick<RoomPopulated, '_id' | 'roomNumber'>;
    period: Pick<PeriodPopulated, 'startTime' | 'endTime'>;
    faculty: Pick<FacultyPopulated, '_id' | 'name' | 'acronym'>;
    course: Pick<CoursePopulated, '_id' | 'code'>;
    semester: Pick<SemesterPopulated, '_id' | 'index'> & { year: number };
}



const AvailableTable: React.FC<TeacherInfo> = (props: TeacherInfo) => {
    
    const [orderedWeekdays, setOrderedWeekdays] = useState<string[]>([]);
    const [teacherPlan, setTeacherPlan] = useState<Record<EWeekday, PeriodBlockPopulated[]>>(() => {
        const initialPlan: Record<EWeekday, PeriodBlockPopulated[]> = {
            [EWeekday.Sunday]: [],
            [EWeekday.Monday]: [],
            [EWeekday.Tuesday]: [],
            [EWeekday.Wednesday]: [],
            [EWeekday.Thursday]: [],
            [EWeekday.Friday]: [],
            [EWeekday.Saturday]: [],
        };
        return initialPlan;
    });

    const test = {
        names: "Name",
        surnames: "Surname"
    }
    const test2 = {
        color: "black",
        weight: 2
    }

    useEffect(() => {
        const reorderWeekdays = () => {
            const weekdays = Object.keys(EWeekday).filter(
                (key) => isNaN(Number(key)) // Exclude numeric keys
            );
            // Move Sunday to the end
            return [...weekdays.filter((day) => day !== "Sunday"), "Sunday"];
        };

        setOrderedWeekdays(reorderWeekdays());
    }, []);


    useEffect(() => {
        if (props._id != ""){
            const teacherData = APIUtils.getProfessorClasses(props.classesAll, props.timetablesAll, props.facultiesAll, props._id)
            const reorderedData: Record<EWeekday, PeriodBlockPopulated[]> = Object.keys(teacherData)
                .map(key => Number(key) as EWeekday)
                .sort((a, b) => (a === EWeekday.Sunday ? 1 : b === EWeekday.Sunday ? -1 : a - b))
                .reduce((acc, key) => {
                    acc[key] = teacherData[key];
                    return acc;
                }, {} as Record<EWeekday, PeriodBlockPopulated[]>);
            setTeacherPlan(teacherData)
        }

    }, [props._id]);
    console.log(teacherPlan)
    return (
        <table className="table table-dark table-striped text-center table-bordered border-white">
            <thead>
            <tr>
                {orderedWeekdays.map((day) => (
                    <th className="col-1" key={day}>{day}</th>
                ))}
            </tr>
            </thead>
            <tbody className="">
            {!teacherPlan ? (
                <tr>
                    <td colSpan={7}>Loading...</td>
                </tr>
            ) : (

                <tr>
                    {[
                        ...Object.values(teacherPlan).slice(1),  // All weekdays except Sunday
                        teacherPlan[0]                           // Add Sunday (teacherPlan[0]) at the end
                    ].map((blocks, colIndex) => (
                        <td key={colIndex} className="p-0">
                            {blocks.length > 0 ? (
                                blocks.map((block) => (
                                    <p className="border borde-2 border-white mt-1"><strong>{block.subject.shortName}</strong></p>
                                ))

                            ) : (
                                <></>
                            )}
                        </td>
                    ))}
                </tr>
            )}
            </tbody>
        </table>
    );
};

export default AvailableTable;