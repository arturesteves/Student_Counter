import * as firebase from 'firebase';

let Presence = require("./Presence");
let namespaces = require("./namespaces").namespaces;

/**
 * Represent a student
 */
class Student {
    /**
     * Creates a Student
     * @param {int} number 
     * @param {string} name 
     * @param {string} email 
     */
    constructor(number, name, email) {
        this.number = number;
        this.name = name;
        this.email = email;
    }

    /**
     * Saves an instance of Student in the database, if the instance already exists updates the current instance otherwise creates a new one.
     */
    save() {
        return firebase.database().ref(namespaces.students + this.number).set({
            name: this.name,
            email: this.email,
        });
    }

    /**
     * Deletes the Student's instance from the database
     */
    delete() {
        let that = this;
        return new Promise((resolve, reject) => {
            firebase.database().ref(namespaces.classes).once("value").then(function (snapshot) {
                let classes = [];
                snapshot.forEach(function (classValues) {
                    let name = classValues.key;
                    let studentIds = classValues.val().studentIds;
                    let subjectIds = classValues.val().subjectIds;
                    classes.push({name:name, studentIds:studentIds, subjectIds:subjectIds})
                });
                let eligibleClasses = []
                classes.map((_class) => {
                    if (_class.studentIds.includes(that.number)) {
                        eligibleClasses.push(_class);
                    }
                })
                console.log(eligibleClasses);
                eligibleClasses.length > 0 ? reject("") : firebase.database().ref(namespaces.students + that.number).remove().then(() => resolve(""));
            });
        })
    }

    /**
     * Gets the Presences os the Student that has the given id by the param.
     * @param {number} subjectId 
     */
    getPresencesAsync(subjectId) {
        return firebase.database().ref(namespaces.presences).once("value").then(function (snapshot) {
            let numberPresences = 0;
            let numberAbsences = 0;
            let numberDelays = 0;
            let promises = [];
            snapshot.forEach(function (presence) {
                let promise = firebase.database().ref(namespaces.lessons + presence.val().lessonId).once("value").then(function (snapshot2) {
                    if (snapshot2.val().subjectId === subjectId) {
                        presence.val().present ? numberPresences += 1 : numberAbsences += 1;
                        numberDelays += presence.val().delay ? 1 : 0;
                    }
                    // not returning value
                }, function (error) {
                    console.log("error fetching presences:", error);
                });
                promises.push(promise);
            });
            return Promise.all(promises).then(function () {
                return {
                    presences: numberPresences,
                    absences: numberAbsences,
                    delays: numberDelays
                };
            })
        }, function (error) {
            console.error(error);
        }).then(function (values) {
            return values;
        });
    }

    /**
     * Gets all the Students from the database.
     */
    static all() {
        return firebase.database().ref(namespaces.students).once("value").then(function (snapshot) {
            let students = [];
            snapshot.forEach(function (studentValues) {
                let number = studentValues.key;
                let name = studentValues.val().name;
                let email = studentValues.val().email;
                let student = new Student(number, name, email);
                students.push(student);
            });
            return students;
        }, function (error) {
            console.error(error);
        }).then(function (value) {
            return value;
        });
    }

    /**
     * Gets the Student that has the number passed in the param.
     * @param {number} number 
     */
    static retrieve(number) {
        return new Promise((resolve, reject) => {
            firebase.database().ref(namespaces.students + number).once('value').then(function (snapshot) {
                let name = snapshot.val().name;
                let email = snapshot.val().email;
                let student = new Student(number, name, email);
                resolve(student);
            });
        });
    }
}

module.exports = Student;