import * as firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';

let namespaces = require("./namespaces").namespaces;


class Teacher {

    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password || "teacher123";
        this.metrics = [];
    }

    save() {
        if (this.id) {
            return firebase.database().ref(namespaces.teachers + this.id).update({
                name: this.name,
                email: this.email,
                password: this.password,
                metrics: this.metrics,
            });
        } else {
            return new Promise((resolve, reject) => {
                let obj = firebase.database().ref(namespaces.teachers).push(this);
                this.id = obj.key;
                resolve(this.id);
            });
        }
    }

    delete() {
        firebase.database().ref(namespaces.teachers + this.id).remove();
    }

    //TODO: Obter as disciplinas que lecciona
    //TODO: obter as turmas que tem
    //TODO: obter os alunos que possui  -> basta ver as disciplinas que tem e obter os alunos dessas disciplinas

    getAllSubjects() {
        return new Promise((resolve, reject) => {
            let that = this;
            firebase.database().ref(namespaces.subjects).once('value').then(function (snapshot) {
                let subjects = [];
                snapshot.forEach(function (subject) {
                    let overseersIds = subject.val().overseersIds;
                    if (overseersIds.includes(that.id)) {
                        let name = subject.val().name;
                        let acronym = subject.val().acronym;
                        let id = subject.key;

                        let subjectObject = {
                            name: name,
                            acronym: acronym,
                            id: id,
                            overseersIds: overseersIds
                        };
                        // not sending real subject object because of modules circular dependencie
                        subjects.push(subjectObject);
                    }
                });
                resolve(subjects);
            });
        });
    }

    // TODO: problem, couting duplicated classes!
    getAllClasses() {
        return new Promise((resolve, reject) => {
            let that = this;
            this.getAllSubjects().then(function (subjects) {
                let classes = [];
                if (subjects.length < 1) {
                    resolve(classes)
                } else {
                    let subjectsLength = subjects.length;
                    firebase.database().ref(namespaces.classes).once('value').then(function (snapshot) {
                        snapshot.forEach(function (_class) {
                            let subjectIds = _class.val().subjectIds;
                            let subjectIdsLength = subjectIds.length;

                            for (let i = 0; i < subjectsLength; i++) {
                                for (let j = 0; j < subjectIdsLength; j++) {

                                    if (subjects[i].id.includes(subjectIds[j]) && subjects[i].overseersIds.includes(that.id)) {
                                        let studentIds = _class.val().studentIds;
                                        let id = _class.key;

                                        let _classObject = {
                                            id: id,
                                            studentIds: studentIds,
                                            subjectIds: subjectIds
                                        };
                                        classes.push(_classObject)
                                    }
                                }
                            }
                            resolve(classes);
                        });
                    });
                }
            });
        });
    }

    //TODO
    getNumStudents() {
        let that = this;
        return new Promise((function (resolve, reject) {
            that.getAllClasses().then(function (results) {
                let numberStudents = 0;
                let resultsLength = results.length;
                for (let i = 0; i < resultsLength; i++) {
                    numberStudents += results[i].studentIds.length;
                }
                resolve(numberStudents);
            });
        }));
    }

    static all() {
        return firebase.database().ref(namespaces.teachers).once("value").then(function (snapshot) {
            let teachers = [];
            snapshot.forEach(function (teacherValues) {
                let id = teacherValues.key;
                let name = teacherValues.val().name;
                let email = teacherValues.val().email;
                let password = teacherValues.val().password;
                let teacher = new Teacher(name, email, password);
                teacher.id = id;
                teachers.push(teacher);
            });
            return teachers;
        }, function (error) {
            console.error(error);
        }).then(function (value) {
            return value;
        });
    }

    static retrieve(id) {
        return new Promise((resolve, reject) => {
            firebase.database().ref(namespaces.teachers + id).once('value').then(function (snapshot) {
                let name = snapshot.val().name;
                let email = snapshot.val().email;
                let password = snapshot.val().password;
                let metrics;
                if (snapshot.val().metrics == undefined) {
                    metrics = [];
                } else {
                    metrics = snapshot.val().metrics
                }
                let teacher = new Teacher(name, email, password);
                teacher.id = id;
                teacher.metrics = metrics;
                resolve(teacher);
            });
        });
    }

    static find(email, password) {
        return new Promise((resolve, reject) => {
            firebase.database().ref(namespaces.teachers).once('value').then(function (snapshot) {
                let validTeacher = null;
                snapshot.forEach(function (teacher) {
                    if (teacher.val().email === email && teacher.val().password === password) {
                        let name = teacher.val().name;
                        let email = teacher.val().email;
                        let password = teacher.val().password;
                        let id = teacher.key;

                        validTeacher = new Teacher(name, email, password);
                        validTeacher.id = id;
                    }
                });
                resolve(validTeacher);
            });
        });
    }

    getTeacherMetrics() {
        let that = this;
        return new Promise((resolve, reject) => {
            firebase.database().ref(namespaces.teachers + that.id).once('value').then(function (snapshot) {
                resolve(snapshot.val().metrics);
            });
        })

    }

    addTeacherMetrics(base64, fileLocation, fileName) {
        let that = this;
        return new Promise((resolve, reject) => {
            firebase.database().ref(namespaces.teachers + that.id).once('value').then(function (snapshot) {
                let name = snapshot.val().name;
                let email = snapshot.val().email;
                let password = snapshot.val().password;
                let metrics = snapshot.val().metrics;
                let teacher = new Teacher(name, email, password);
                teacher.id = that.id;
                teacher.metrics = metrics;
                if (teacher.metrics == undefined) {
                    teacher.metrics = [];
                }
                that.saveOnFirebase(base64, fileLocation, fileName).then((result) => {
                    teacher.metrics.push({fileName: fileName, downloadUrl: result});
                }).then(() => {
                    teacher.save().then(() => {
                        resolve(teacher.metrics[teacher.metrics.length-1]);
                    }).catch((err) => reject(err))
                })
            });
        })
    }

    saveOnFirebase(base64, file, fileName) {
        let that = this;
        return new Promise((resolve, reject) => {
            let rnfbURI = RNFetchBlob.wrap(file);
            const polyfill = RNFetchBlob.polyfill
            window.XMLHttpRequest = polyfill.XMLHttpRequest
            window.Blob = polyfill.Blob
            
            RNFetchBlob.fs.readFile(file, 'base64').then((data) => {
                 var metadata = {
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                };

                Blob.build(RNFetchBlob.wrap(file), {type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}).then((blob) => {
                    let storageRef = firebase.storage().ref('metrics'); //path
                    let metricsRef = storageRef.child(`${this.id}/${fileName}`);
                    var uploadTask = metricsRef.put(blob,{contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}).then((snapshot) => {
                        resolve(snapshot.downloadURL);
                    });
                }).catch((err) => reject(err));
            }).catch((err) => reject(err));
        })
    }
}

module.exports = Teacher;