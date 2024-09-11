import CourseRoutes from './courses/CourseRoutes';
import ElectiveSubjectRoutes from './courses/ElectiveSubjectRoutes';
import SemesterRoutes from './courses/SemesterRoutes';
import SubjectRoutes from './courses/SubjectRoutes';
import SubjectTypeRoutes from './courses/SubjectTypeRoutes';
import BuildingRoutes from './faculty/BuildingRoutes';
import FacultyRoutes from './faculty/FacultyRoutes';
import RoomRoutes from './faculty/RoomRoutes';
import RoomTypeRoutes from './faculty/RoomTypeRoutes';
import ClassRoutes from './timetable/ClassRoutes';
import PeriodRoutes from './timetable/PeriodController';
import TimetableRoutes from './timetable/TimetableRoutes';
import UserRoutes from './UserRoutes.js';

const routes = {
    UserRoutes,

    CourseRoutes,
    ElectiveSubjectRoutes,
    SemesterRoutes,
    SubjectRoutes,
    SubjectTypeRoutes,

    BuildingRoutes,
    FacultyRoutes,
    RoomRoutes,
    RoomTypeRoutes,

    ClassRoutes,
    PeriodRoutes,
    TimetableRoutes,
};

export default routes;
