import Class from "./Class";
import Lesson from "./Lesson";
import Presence from "./Presence";
import Student from "./Student";
import Subject from "./Subject";
import RNFetchBlob from 'react-native-fetch-blob';
import XLSX from "xlsx";
const metricsDir = `${RNFetchBlob.fs.dirs.DownloadDir}/TeachelpMetrics`;
const workbookOptions = {
    bookType: "xlsx",
    bookSST: false,
    type: "base64"
};

const worksheetHeaders = {
    class: ["##########Class##########"],
    lesson: ["##########Lesson##########"],
    presence: ["##########Presence##########"],
    student: ["##########Student##########"],
    teacher: ["##########Teacher##########"]
}

function Metrics(teacherId) {

    console.log("Metrics Object is being created");
    let teacher = teacherId;

    function getClassesMetrics() {
        return new Promise((resolve, reject) => {
            let data = [];
            let allClasses = [];
            data.push(worksheetHeaders.class);
            Class.all().then((classes) => {
                if (classes.length == 0) {
                    console.log("No Classes");
                    reject(undefined);
                }
                classes.map((_class) => {
                    allClasses.push(getClassMetrics(_class));
                });
                Promise.all(allClasses).then((classes) => {
                    classes.map((_class) => {
                        data = data.concat(_class);
                    })
                    resolve(data);
                }).catch((err) => reject(err));
            }).catch((err) => reject(err));
        });
    }

    function getClassMetrics(_class) {
        return new Promise((resolve, reject) => {
            let eligibleClass;
            let data = [];
            Subject.all().then((subjects) => {
                if (subjects.length == 0) {
                    console.log("No Subjects");
                    reject(undefined);
                }
                console.log("We have subjects:", subjects.length);
                console.log("Trying to get eligible subjects");
                let eligibleSubjects = [];
                subjects.map((subject) => {
                    console.log("Checking Subject", subject.id);
                    console.log(subject);
                    subject.overseersIds.map((overseerId) => {
                        console.log("Checking Overseer", overseerId);
                        if (overseerId == teacher) {
                            console.log("Subject is eligible", subject.id);
                            eligibleSubjects.push(subject.id);
                        }
                    })
                })
                console.log("Iterating SubjectIds", _class.subjectIds.length);
                _class.subjectIds.map((subject) => {
                    console.log("Checking Subject", subject);
                    eligibleSubjects.map((eliSubject) => {
                        console.log("Checking if subject match", subject, eliSubject);
                        if (subject == eliSubject) {
                            console.log("Subjects Match", subject, eliSubject);
                            eligibleClass = _class;
                        }
                    })
                })
                if (!eligibleClass) {
                    console.log("No Subjects");
                    resolve([])
                }
                console.log("We have an eligible class");

                let allStudents = [];
                let allSubjects = [];
                data.push([""])
                data.push([eligibleClass.name]);

                eligibleClass.studentIds.map((studentId) => {;
                    allStudents.push(Student.retrieve(studentId));
                })

                eligibleClass.subjectIds.map((subjectId) => {
                    allSubjects.push(Subject.retrieve(subjectId));
                })

                Promise.all(allStudents).then((students) => {
                    data.push([""])
                    data.push(["Students"])
                    data.push(["Student Number", "Student Name", "Student Email"]);
                    students.map((student) => {
                        data.push([student.number, student.name, student.email]);
                    })

                }).then(() => {
                    data.push([""])
                    data.push(["Subjects"])
                    data.push(["Subject Name", "Subject Acronym"]);
                    Promise.all(allSubjects).then((subjects) => {
                        subjects.map((subject) => {
                            data.push([subject.name, subject.acronym])
                        })
                        console.log("XLSX", data);
                        data.push([""])
                        resolve(data);
                    })
                }).catch((err) => reject(err))
            }).catch((err) => reject(err))
        })
    }

    function getLessonMetrics() {}

    function getPresenceMetrics() {}

    function getStudentMetrics() {}

    function getTeacherMetrics() {}

    function writeFile() {

    }

    function createMetrics(metricsToCreate) {
        return new Promise((resolve, reject) => {
            let workbook = XLSX.utils.book_new();
            metricsToCreate.map((metric) => {
                let _metric = getMetric(metric).then((_metric) => {
                    if (_metric) {
                        let worksheet = XLSX.utils.aoa_to_sheet(_metric, {
                            cellDates: true
                        });
                        XLSX.utils.book_append_sheet(workbook, worksheet, getMetricName(metric));
                        let wbout = XLSX.write(workbook, workbookOptions);
                        RNFetchBlob.fs.writeFile(`${metricsDir}/TeachelpMetrics.xlsx`, wbout, "base64").then(() => console.log("XLSX file was created")).catch((err) => console.log(err))
                        resolve("");
                    } else {
                        reject("");
                    }
                }).catch((err) => reject(err));
            })
        })
    }

    function getMetric(metricId) {
        switch (metricId) {
            case 0:
                return getClassesMetrics();
            case 1:
                return getLessonsMetrics();
            case 2:
                return getPresencesMetrics();
            case 3:
                return getStudentsMetrics();
            case 4:
                return getTeachersMetrics();
            default:
                return undefined;
        }
    }

    function getMetricName(metricId) {
        switch (metricId) {
            case 0:
                return "Class";
            case 1:
                return "Lesson";
            case 2:
                return "Presence";
            case 3:
                return "Student";
            case 4:
                return "Teacher";
        }
    }

    return {
        createMetrics: createMetrics,
    }
}

module.exports = Metrics;