import Class from "./Class";
import Lesson from "./Lesson";
import Presence from "./Presence";
import Student from "./Student";
import Subject from "./Subject";
import Teacher from "./Teacher";
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
    subject: ["##########Subject##########"],
    evaluation: ["##########Evaluation##########"]
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

    function getLessonsMetrics() {
        return new Promise((resolve, reject) => {
            Lesson.all().then((lessons) => {
                if (lessons.length == 0) {
                    resolve([]);
                }
                let eligibleLessons = lessons.filter((lesson) => lesson.teacherId == teacher);
                let data = [];
                let allClassesNames = [];
                eligibleLessons.map((lesson) => {
                    lesson.classes.map((classId) => {
                        allClassesNames.push(Class.retrieve(classId));
                    })
                })
                Promise.all(allClassesNames).then((classes) => {
                    let classesNames = classes.map((_class) => {
                        return _class.name;
                    })
                    classesNames = removeDuplicatesBy(x => x, classesNames);
                    allLessons = [];
                    classesNames.map((className) => {
                        let _class = {
                            class: className,
                            lessons: []
                        };
                        eligibleLessons.map((lesson) => {
                            if (lesson.classes.includes(className)) {
                                _class.lessons.push(lesson);
                            }
                        })
                        allLessons.push(_class);
                    })
                    let data = [];
                    data.push(worksheetHeaders.lesson);
                    allLessons.map((lesson) => {
                        data.push([""]);
                        data.push(["Class:", lesson.class])
                        data.push(["Summary", "Start Date", "End Date", "Subject", "Teacher"]);
                        let _promises = lesson.lessons.map((lesson) => {
                            return new Promise((resolve, reject) => {
                                let teacherName;
                                let subjectName;
                                Teacher.retrieve(lesson.teacherId).then((teacher) => {
                                    teacherName = teacher.name;
                                }).then(() => {
                                    Subject.retrieve(lesson.subjectId).then((subject) => {
                                        console.log(subject);
                                        subjectName = subject.name;
                                    }).then(() => {
                                        resolve([lesson.summary, lesson.endDate, lesson.startDate, subjectName, teacherName]);
                                    }).catch((err) => reject(err))
                                })
                            })
                        })
                        Promise.all(_promises).then((nData) => {
                            nData.map((_data) => {
                                data.push(_data);
                            });
                        }).then(() => {
                            resolve(data);
                        }).catch((err) => reject(err))
                    })
                })
            })
        })

    }

    function getPresencesMetrics() {
        return new Promise((resolve, reject) => {
            let eligiblePresences = [];
            let lessonPromises = [];
            let eligibleLessons = [];
            Presence.all().then((presences) => {
                if (presences.length == 0) {
                    resolve([]);
                }
                presences.map((presence) => {
                    lessonPromises.push(Lesson.retrieve(presence.lessonId));
                })
                Promise.all(lessonPromises).then((lessons) => {
                    lessons.map((lesson, index) => {
                        if (lesson.teacherId == teacher) {
                            eligiblePresences.push(presences[index]);
                            eligibleLessons.push(lesson);
                        }
                    })
                }).then(() => {
                    //Neste Momento Temos as Presences e as Respeticas Lessons que pertencem ao professor em especifico.
                    let data = [];
                    data.push(worksheetHeaders.presence);
                    let all = eligibleLessons.map((lesson, index) => {
                        return new Promise((resolve, reject) => {
                            let currentPresence = eligiblePresences[index];
                            let currentSubject;
                            let currentStudent;
                            let currentClasses = [];
                            let classPromises = [];
                            lesson.classes.map((classId) => {
                                classPromises.push(Class.retrieve(classId));
                            })
                            Promise.all(classPromises).then((classes) => {
                                classes.map((_class) => {
                                    if (_class.subjectIds.includes(lesson.subjectId) && _class.studentIds.includes(currentPresence.studentId)) {
                                        currentClasses.push(_class);
                                    }
                                })
                            }).then(() => {
                                Subject.retrieve(lesson.subjectId).then((subject) => currentSubject = subject).then(() => {
                                    Student.retrieve(currentPresence.studentId).then((student) => currentStudent = student).then(() => {
                                        let obj = {};
                                        obj.lesson = lesson;
                                        obj.presence = currentPresence;
                                        obj.classes = currentClasses;
                                        obj.subject = currentSubject;
                                        obj.student = currentStudent;
                                        resolve(obj);
                                    })
                                })
                            }).catch((err) => reject(err))
                        })
                    })
                    Promise.all(all).then((infos) => {
                        infos.sort((infoA, infoB) => {
                            let nameA = infoA.student.name.toUpperCase();
                            let nameB = infoB.student.name.toUpperCase();
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }
                            return 0;
                        })
                        let previousStudent;
                        let studentData = [];
                        console.log(infos);
                        infos.map((info) => {
                            if (!previousStudent || previousStudent != info.student.number) {
                                previousStudent = info.student.number;
                                studentData.push([""]);
                                studentData.push(["#####" + info.student.name + "#####"]);
                                studentData.push([""]);
                                studentData.push(["Subject Name", "Class Name", "Start Date", "End Date", "Delay", "Present"]);
                            }

                            if (previousStudent == info.student.number) {
                                let currentStudentData = [];
                                currentStudentData.push(info.subject.name);
                                let classes = [];
                                info.classes.map((_class) => {
                                    classes.push(_class.name)
                                })
                                currentStudentData.push(classes);
                                currentStudentData.push(info.lesson.startDate);
                                currentStudentData.push(info.lesson.endDate);
                                currentStudentData.push(info.presence.delay ? "Yes" : "No");
                                currentStudentData.push(info.presence.present ? "Yes" : "No")
                                studentData.push(currentStudentData)
                            }
                        });
                        data = data.concat(studentData);
                        resolve(data);
                    }).catch((err) => reject(err))
                })
            })
        })
    }

    function getEvaluationMetrics() {
        return new Promise((resolve, reject) => {
            let eligibleSubjects;
            let eligibility = [];
            Subject.all().then((subjects) => {
                if (subjects.length == 0) {
                    resolve([]);
                }
                eligibleSubjects = subjects.filter((subject) => subject.overseersIds.includes(teacher));
            }).then(() => {
                Class.all().then((classes) => {
                    if (classes.length == 0) {
                        resolve([]);
                    }
                    classes.map((_class) => {
                        eligibleSubjects.map((subject) => {
                            if (_class.subjectIds.includes(subject.id)) {
                                eligibility.push({
                                    subject: subject,
                                    class: _class,
                                    lessons: []
                                })
                            }
                        })
                    })
                }).then(() => {
                    Lesson.all().then((lessons) => {
                        if (lessons.length == 0) {
                        resolve([]);
                        }
                        lessons.map((lesson) => {
                            eligibility.map((eligible, index) => {
                                if (lesson.classes.includes(eligible.class.name)) {
                                    eligibility[index].lessons.push(lesson);
                                }
                            })
                        })
                    }).then(() => {
                        Presence.all().then((presences) => {
                            if (presences.length == 0) {
                            resolve([]);
                            }
                            let info = [];
                            if(eligibility.length == 0){
                                resolve([]);
                            }
                            eligibility.map((eligible) => {
                                //If there are no lessons no evaluation will take place.
                                let eligibleInfo = {};
                                eligibleInfo.class = eligible.class;
                                eligibleInfo.subject = eligible.subject;

                                if (eligible.lessons.length != 0) {
                                    let current = {
                                        numberOfLessons: eligible.lessons.length,
                                        students: []
                                    }
                                    eligible.class.studentIds.map((studentId) => {
                                        let currentStudent = {
                                            student: studentId,
                                            numberOfPresences: 0
                                        };
                                        let studentPresences = presences.filter((presence) => presence.studentId == studentId && eligible.lessons.filter((lesson) => lesson.id == presence.lessonId).length != 0);
                                        studentPresences.map((presence) => {
                                            if (presence.present == true) {
                                                currentStudent.numberOfPresences = currentStudent.numberOfPresences + 1;
                                            }
                                        })
                                        current.students.push(currentStudent);
                                    })
                                    eligibleInfo.lessons = current;
                                    info.push(eligibleInfo);
                                }
                            })
                            if(info.length == 0){
                                resolve([]);
                            }
                            let data = [];
                            data.push(worksheetHeaders.evaluation);
                            data.push("");
                            data.push(["Subject Name", "Class Name", "Student Number", "Number Of Lessons", "Number Of Attended Lessons By Student", "Current Position In Plan"]);
                            console.log(info);
                            info.map((innerInfo) => {
                                innerInfo.lessons.students.map((student) => {
                                    let _info = [];
                                    _info.push(innerInfo.subject.name);
                                    _info.push(innerInfo.class.name);
                                    _info.push(student.student);
                                    _info.push(innerInfo.lessons.numberOfLessons);
                                    _info.push(student.numberOfPresences);
                                    student.numberOfPresences >= innerInfo.lessons.numberOfLessons * 0.75 ? _info.push("Approved") : _info.push("Disapproved");
                                    data.push(_info);
                                })
                            })
                            resolve(data);
                        })
                    })
                })
            })
        })
    }

    function getSubjectsMetrics() {
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
                return getSubjectsMetrics();
            case 5:
                return getEvaluationMetrics();
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
            case 5:
                return "Evaluation"
        }
    }

    function removeDuplicatesBy(keyFn, array) {
        var mySet = new Set();
        return array.filter(function (x) {
            var key = keyFn(x),
                isNew = !mySet.has(key);
            if (isNew) mySet.add(key);
            return isNew;
        });
    }

    return {
        createMetrics: createMetrics,
    }
}

module.exports = Metrics;