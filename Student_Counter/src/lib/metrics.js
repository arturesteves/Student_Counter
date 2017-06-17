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

const worksheetRows = {
    class: ["Student Number", "Student Name", "Student Email"],
    lesson: "",
    presence: "",
    student: "",
    teacher: ""
}

function Metrics(teacherId) {

    console.log("Metrics Object is being created");
    let teacher = teacherId;

    function getClassMetrics() {
        return new Promise((resolve, reject) => {
            console.log("getClassMetrics function was called");
            Class.all().then((classes) => {
                if (classes.length == 0) {
                    console.log("No Classes");
                    return undefined;
                }
                console.log("We have classes:", classes.length);
                console.log("Trying to get eligible classes");
                let eligibleClasses = [];
                classes.map((_class) => {
                    Subject.all().then((subjects) => {
                        if (subjects.length == 0) {
                            console.log("No Subjects");
                            return undefined;
                        }
                        console.log("We have subjects:", subjects.length);
                        console.log("Trying to get eligible subjects");
                        let eligibleSubjects = [];
                        subjects.map((subject) => {
                            console.log("Checking Subject", subject.id);
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
                            console.log("Checking Subject", subject.id);
                            eligibleSubjects.map((eliSubject) => {
                                console.log("Checking if subject match", subject, eliSubject);
                                if (subject == eliSubject) {
                                    console.log("Subjects Match", subject, eliSubject);
                                    eligibleClasses.push(_class);
                                }
                            })
                        })
                        if (eligibleClasses.length == 0) {
                            console.log("No Subjects");
                            return undefined;
                        }
                        console.log("We have eligible classes:", eligibleClasses.length);
                        let data = [];
                        let allStudents = [];
                        data.push(worksheetHeaders.class);
                        data.push(worksheetHeaders.class);
                        eligibleClasses.map((_class) => {
                            data.push([""])
                            data.push([_class.name]);

                            _class.studentIds.map((studentId) => {
                                let allPromises = [];
                                allStudents.push(Student.retrieve(studentId));
                            })

                        })
                        Promise.all(allStudents).then((students) => {
                            students.map((student) => {
                                console.log(student);
                                data.push([student.number, student.name, student.email]);
                            })
                            console.log("XLSX", data);
                            resolve(data);
                        }).catch((err) => reject(err))
                    }).catch((err) => reject(err))
                })

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
                    let worksheet = XLSX.utils.aoa_to_sheet(_metric, {cellDates:true});
                    XLSX.utils.book_append_sheet(workbook, worksheet, getMetricName(metric));
                    let wbout = XLSX.write(workbook, workbookOptions);
                    RNFetchBlob.fs.writeFile(`${metricsDir}/${getMetricName(metric)}.xlsx`, wbout, "base64").then(()=>console.log("XLSX file was created")).catch((err)=>console.log(err))
                    resolve("");
                }else{
                    reject("Something Went Wrong!");
                }
            }).catch((err) => reject(err));
        })
        })
    }

    function getMetric(metricId) {
        switch (metricId) {
            case 0:
                return getClassMetrics();
            case 1:
                return getLessonMetrics();
            case 2:
                return getPresenceMetrics();
            case 3:
                return getStudentMetrics();
            case 4:
                return getTeacherMetrics();
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