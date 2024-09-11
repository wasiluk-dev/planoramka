import CourseRoutes from './courses/CourseRoutes';
import ElectiveSubjectRoutes from './courses/ElectiveSubjectRoutes';
import SemesterRoutes from './courses/SemesterRoutes';
import SubjectRoutes from './courses/SubjectRoutes';
import BuildingRoutes from './faculty/BuildingRoutes';
import FacultyRoutes from './faculty/FacultyRoutes';
import RoomRoutes from './faculty/RoomRoutes';
import RoomTypeRoutes from './faculty/RoomTypeRoutes';
import ClassRoutes from './timetable/ClassRoutes';
import ClassTypeRoutes from './timetable/ClassTypeRoutes';
import PeriodRoutes from './timetable/PeriodController';
import TimetableRoutes from './timetable/TimetableRoutes';
import UserRoutes from './UserRoutes.js';

const routes = {
    UserRoutes,

    CourseRoutes,
    ElectiveSubjectRoutes,
    SemesterRoutes,
    SubjectRoutes,

    BuildingRoutes,
    FacultyRoutes,
    RoomRoutes,
    RoomTypeRoutes,

    ClassRoutes,
    ClassTypeRoutes,
    PeriodRoutes,
    TimetableRoutes,
};

export default routes;
