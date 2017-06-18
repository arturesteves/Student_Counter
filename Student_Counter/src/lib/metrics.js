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
    teacher: ["##########Teacher##########"],
    subject: ["##########Subject##########"]
}

function Metrics(teacherId) {

    //Creation Of Metrics Object
    let teacher = teacherId;

    function getClassesMetrics() {
        return new Promise((resolve, reject) => {
            let data = [];
            let allClasses = [];
            data.push(worksheetHeaders.class);
            Class.all().then((classes) => {
                if (classes.length == 0) {
                    //No Classes
                    resolve("No Classes | Can't Create Metrics");
                }
                classes.map((_class) => {
                    allClasses.push(getClassMetrics(_class));
                });
                Promise.all(allClasses).then((classes) => {
                    classes.map((_class) => {
                        if (_class.length != 0) {
                            data = data.concat(_class);
                        }
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
                    //No Subjects
                    reject("No Subject | Can't Create Metrics");
                }
                //There is at least one subject
                //We will try to get eligible subjects
                let eligibleSubjects = [];
                subjects.map((subject) => {
                    //Checking the current subject
                    subject.overseersIds.map((overseerId) => {
                        //Checking Overseer
                        if (overseerId == teacher) {
                            //The Subject is eligible
                            eligibleSubjects.push(subject.id);
                        }
                    })
                })
                //Iterating Subject Ids
                _class.subjectIds.map((subject) => {
                    //Checking current subjects
                    eligibleSubjects.map((eliSubject) => {
                        //Checking is subjects match
                        if (subject == eliSubject) {
                            //Subjects Match
                            eligibleClass = _class;
                        }
                    })
                })
                if (!eligibleClass) {
                    resolve([]);
                }
                //There is a eligible class
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
                        data.push([""])
                        resolve(data);
                    })
                }).catch((err) => reject(err))
            }).catch((err) => reject(err))
        })
    }
    
    function getStudentsMetrics() {
        return new Promise((resolve, reject) => {
            let eligibleSubjects = [];
            Subject.all().then((subjects) => {
                if (subjects.length == 0) {
                    resolve([]);
                }
                subjects.map((subject) => {
                    if (subject.overseersIds.includes(teacher)) {
                        eligibleSubjects.push(subject.id);
                    }
                })
            }).then(() => {
                let eligibleClasses = [];
                Class.all().then((classes) => {
                    if (classes.length == 0) {
                        resolve([]);
                    }
                    classes.map((_class) => {
                        _class.subjectIds.map((subjectId) => {
                            if (eligibleSubjects.includes(subjectId)) {
                                eligibleClasses.push(_class);
                            }
                        })
                    })
                }).then(() => {
                    let data = [];
                    let eligibleStudents = [];
                    let eligibleStudentClass = [];
                    if (eligibleClasses.length == 0) {
                        resolve([]);
                    }
                    eligibleClasses.map((_class) => {
                        _class.studentIds.map((studentId) => {
                            eligibleStudents.push(Student.retrieve(studentId));
                            eligibleStudentClass.push(_class.name);
                        })
                    })
                    Promise.all(eligibleStudents).then((students) => {
                        let _students = removeDuplicatesBy(x => x.number, students);
                        let data = [];
                        data.push(worksheetHeaders.student);
                        data.push("")
                        data.push(["Student Number", "Student Name", "Student Email", "Class"]);
                        _students.map((_student, index) => {
                            data.push([_student.number, _student.name, _student.email, eligibleStudentClass[index]]);
                        })
                        resolve(data);
                    })
                })
            })
        })
    }

    function getLessonMetrics() {}

    function getPresenceMetrics() {}

    function getSubjectMetrics() {
        return new Promise((resolve, reject) => {
            let eligibleSubjects = [];
            let data = [];
            Subject.all().then((subjects) => {
                if (subjects.length == 0) {
                    resolve([]);
                }
                subjects.map((subject) => {
                    subject.overseersIds.map((overseerId) => {
                        if (overseerId == teacher) {
                            eligibleSubjects.push(subject);
                        }
                    })
                })
                if (eligibleSubjects.length == 0) {
                    resolve([])
                }
                data.push(worksheetHeaders.subject)
                data.push([""])
                data.push(["Subject Name", "Subject Acronym"])
                eligibleSubjects.map((subject) => {
                    data.push([subject.name, subject.acronym]);
                })
                resolve(data);
            })
        });
    }

    function createMetrics(metricsToCreate) {
        return new Promise((resolve, reject) => {
            if (metricsToCreate === undefined) {
                reject("Metrics are Undefined");
            }
            if (metricsToCreate.constructor !== Array) {
                reject("Metrics is not an Array");
            }
            if (metricsToCreate.length < 1) {
                reject("No Metrics in Array");
            }
            let allMetrics = [];
            metricsToCreate.map((metric) => {
                let _metric = getMetric(metric);
                _metric ? allMetrics.push(_metric) : reject("Invalid Metrics");
            })
            Promise.all(allMetrics).then((metrics) => {
                let workbook = XLSX.utils.book_new();
                metrics.map((metric, index) => {
                    if (metric) {
                        console.log(metric);
                        let worksheet = XLSX.utils.aoa_to_sheet(metric, {
                            cellDates: true
                        });
                        XLSX.utils.book_append_sheet(workbook, worksheet, getMetricName(metricsToCreate[index]));
                    }
                })
                let wbout = XLSX.write(workbook, workbookOptions);
                RNFetchBlob.fs.writeFile(`${metricsDir}/TeachelpMetrics.xlsx`, wbout, "base64").then(() => {
                        resolve("")
                    })
                    .catch((err) => reject(err))
            }).catch((err) => reject(err));
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
                return getSubjectMetrics();
            default:
                return undefined
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
                return "Subject";
        }
    }

    function removeDuplicatesBy(keyFn, array) {
        var mySet = new Set();
        return array.filter(function(x) {
            var key = keyFn(x), isNew = !mySet.has(key);
            if (isNew) mySet.add(key);
                return isNew;
            });
    }

    return {
        createMetrics: createMetrics,
    }
}

module.exports = Metrics;