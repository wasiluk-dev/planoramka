// TODO: make the type dynamic
type SubjectDetails = {
    _id: string;
    course: string;
    subject: {
        _id: string;
        code: string;
        name: string;
        shortName: string;
        isElective: boolean;
        targetedSemesters: number[];
    };
    details: [{
        classType: {
            name: string;
            acronym: string;
            color: string;
        };
        weeklyBlockCount: number;
    }];
};

export default class APIUtils {
    static getSubjectDetailsForSpecificSemesters(subjectDetails: SubjectDetails[], targetedSemesters: number[]) {
        if(!subjectDetails || !targetedSemesters){
            return null;
        }
        const newSubjectDetails = [];
        for (const subjectDetail of subjectDetails) {
            try {
                if (targetedSemesters.every(v => subjectDetail.subject.targetedSemesters.includes(v))) {
                    newSubjectDetails.push(subjectDetail);
                }
            } catch (err) {
                // console.error(err);
            }
        }

        return newSubjectDetails;
    }
}
