import * as firebase from 'firebase';
let Student = require("./Student");
let Subject = require("./Subject");
let Presence = require("./Presence");
let namespaces = require("./namespaces").namespaces;

/** Class representing a Class */
class Class {

    /**
     * Creates a Class
     * @param {string} name 
     * @param {number} studentIds 
     * @param {number} subjectIds 
     */
    constructor(name, studentIds, subjectIds) {
        this.name = name;
        this.studentIds = studentIds;
        this.subjectIds = subjectIds;
    }

    /**
     * Saves an instance of the Class in the database, if the instance already exists updates the current instance
     * otherwise creates a new one.
     */
    save() {
        return firebase.database().ref(namespaces.classes + this.name).set({
            studentIds: this.studentIds,
            subjectIds: this.subjectIds
        });
    }

    /**
     * Deletes the Class's instance from the database.
     */
    delete() {
        let that = this;
        return new Promise((resolve, reject) => {
            firebase.database().ref(namespaces.lessons).once("value").then(function (snapshot) {
                let lessons = [];
                snapshot.forEach(function (lessonValues) {
                    let id = lessonValues.key;
                    let endDate = lessonValues.val().endDate;
                    let photo = lessonValues.val().photo;
                    let startDate = lessonValues.val().startDate;
                    let subjectId = lessonValues.val().subjectId;
                    let summary = lessonValues.val().summary;
                    let teacherId = lessonValues.val().teacherId;
                    let classes = lessonValues.val().classes;
                    let lesson = {teacherId:teacherId, subjectId:subjectId, classes:classes, startDate:startDate, endDate:endDate, photo:photo, summary:summary};
                    lesson.id = id;
                    lessons.push(lesson);
                });
                eligibleLessons = [];
                lessons.map((lesson) => {
                    console.log(lesson.classes.includes(that.name));
                    if (lesson.classes.includes(that.name)) {
                        eligibleLessons.push(lesson);
                    }
                });
                eligibleLessons.length > 0 ? reject("") : firebase.database().ref(namespaces.classes + that.name).remove().then(() => resolve("")).catch((err) => reject(err))
            }).catch((err)=>reject(err))
        })
        //
    }

    /**
     * Gets the Students that are in the Class.
     */
    async getStudents() {
        let array = [];
        for (let studentId of this.studentIds) {
            array.push(await Student.retrieve(studentId));
        }
        return array;
    }

    /**
     * Gets the Subjects related to this Class.
     */
    async getSubjects() {
        let array = [];
        for (let subjectId of this.subjectIds) {
            array.push(await Subject.retrieve(subjectId));
        }
        return array;
    }

    /**
     * Returns the number of registered Students in the Class.
     */
    numberOfregisteredStudentsAsync() {
        let that = this;
        return firebase.database().ref(namespaces.students).once("value").then(function (snapshot) {
            let numberStudents = 0;
            snapshot.forEach(function (student) {
                if (that.studentIds.includes(student.key)) {
                    numberStudents++;
                }
            });
            return numberStudents;
        }, function (error) {
            console.error(error);
        }).then(function (value) {
            return {
                name: that.name,
                numberStudents: value
            };
        });
    }

    /**
     * Returns all the Classes in the database.
     */
    static all() {
        return firebase.database().ref(namespaces.classes).once("value").then(function (snapshot) {
            let classes = [];
            snapshot.forEach(function (classValues) {
                let name = classValues.key;
                let studentId = classValues.val().studentIds;
                let subjectIds = classValues.val().subjectIds;
                classes.push(new Class(name, studentId, subjectIds))
            });
            return classes;
        }, function (error) {
            console.error(error);
        }).then(function (value) {
            return value;
        });
    }

    /**
     * Gets the Class that has the name passed in the param.
     * @param {string} name
     */
    static retrieve(name) {
        return new Promise((resolve, reject) => {
            firebase.database().ref(namespaces.classes + name).once('value').then(function (snapshot) {
                let studentIds = snapshot.val().studentIds;
                let subjectIds = snapshot.val().subjectIds;
                let clazz = new Class(name, studentIds, subjectIds);
                resolve(clazz);
            });
        });
    }
}

module.exports = Class;