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
                        if(_class.length != 0){
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
            let data = [];
            let allStudents = [];
            data.push(worksheetHeaders.student)
            data.push([""]);
            Student.all().then((students) => {
                if (students.length == 0) {
                    //No Students
                    reject("No Students | Can't Create Metrics");
                }
                data.push(["Student Number", "Student Name", "Student Email", "Class"])
                students.map((student) => {
                    allStudents.push(getStudentMetrics(student));
                })
                Promise.all(allStudents).then((students) => {
                    students.map((student) => {
                        if(student.length != 0){
                            console.log(student);
                            data.push(student);
                        }
                    })
                    resolve(data);
                })
            }).catch((err) => reject(err))
        })

    }

    function getStudentMetrics(student) {
        return new Promise((resolve, reject) => {
            let allClasses = [];
            let eligibleTeacherClasses = []
            let data = [];
            Class.all().then((classes) => {
                if (classes.length == 0) {
                    reject("No Classes | Can't Create Metrics");
                }
                classes.map((_class) => {
                    _class.studentIds.map((studentId) => {
                        if (studentId == student.number) {
                            allClasses.push(_class);
                        }
                    })
                })
            }).then(() => {
                //Get Teacher Eligible Classes
                if (allClasses.length == 0) {
                    resolve([]);
                }
                allClasses.map((_class) => {
                    _class.subjectIds.map((subjectId) => {
                        Subject.retrieve(subjectId).then((subject) => {
                            subject.overseersIds.map((overseerId) => {
                                if (overseerId == teacher) {
                                    eligibleTeacherClasses.push(_class);
                                }
                            })
                        }).then(() => {
                            if (eligibleTeacherClasses.length == 0) {
                                resolve([]);
                            }
                            eligibleTeacherClasses.map((_class) => {
                                _class.studentIds.map((studentId) => {
                                    if (studentId == student.number) {
                                        data.push(student.number, student.name, student.email, _class.name)
                                        resolve(data);
                                    }
                                })
                            })
                        }).catch((err) => reject(err))
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
                if(subjects.length == 0){
                    reject("No Subjects | Can't Create Metrics");
                }
                subjects.map((subject)=>{
                    subject.overseersIds.map((overseerId) => {
                        if(overseerId == teacher){
                            eligibleSubjects.push(subject);
                        }
                    })
                })
                if(eligibleSubjects.length == 0){
                    resolve([])
                }
                data.push(worksheetHeaders.subject)
                data.push([""])
                data.push(["Subject Name","Subject Acronym"])
                eligibleSubjects.map((subject) => {
                    data.push([subject.name,subject.acronym]);   
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

    return {
        createMetrics: createMetrics,
    }
}

module.exports = Metrics;