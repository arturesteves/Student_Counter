import * as firebase from 'firebase';

let namespaces = require("./namespaces").namespaces;

/** Class representing a Teacher */
class Teacher{ 
    /**
     * Create a Teacher.
     * @param {string} name 
     * @param {string} email 
     * @param {string} password 
     */
    constructor(name, email, password){
        this.name = name;
        this.email = email;
        this.password = password || "teacher123";
    }

    /**
     * Saves an instance of Teacher in the Database, if the instance already exists updates the current instance otherwise creates a new one.
     */
    save(){
        if(this.id){
            return firebase.database().ref(namespaces.teachers + this.id).update({
                name: this.name,
                email: this.email,
                password: this.password,
            });
        } else {
            return new Promise((resolve, reject)=>{
                let obj = firebase.database().ref(namespaces.teachers).push(this);
                this.id = obj.key;
                resolve(this.id);
            });
        }
    }

    /**
     * Deletes the Teacher's instance in the database.
     */
    delete(){
        firebase.database().ref(namespaces.teachers + this.id).remove();
    }

    /**
     * Gets all the Subjects that the Teacher is in.
     */
    getAllSubjects(){
        return new Promise((resolve, reject)=>{
            let that = this;
            firebase.database().ref(namespaces.subjects).once('value').then(function(snapshot){
                let subjects = [];
                snapshot.forEach(function(subject){
                    let overseersIds = subject.val().overseersIds;
                    if(overseersIds.includes(that.id)){
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


    /**
     * Gets all the Classes that the Teacher is in.
     */
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

                            for(let i = 0; i < subjectsLength; i++){
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

    /**
     * Gets the number of students that the Teacher has.
     */
    getNumStudents(){
        let that = this;
        return new Promise((function(resolve, reject){
            that.getAllClasses().then(function(results){
                let numberStudents = 0;
                let resultsLength = results.length;
                for(let i = 0; i < resultsLength; i++){
                    numberStudents += results[i].studentIds.length;
                }
                resolve(numberStudents);
            });
        }));
    }

    /**
     * Returns all the Teacher in the database.
     * @return {Teacher} teachers
     */
    static all(){
        return firebase.database().ref(namespaces.teachers).once("value").then(function (snapshot) {
            let teachers = [];
            snapshot.forEach(function(teacherValues){
                let id = teacherValues.key;
                let name = teacherValues.val().name;
                let email = teacherValues.val().email;
                let password = teacherValues.val().password;
                let teacher = new Teacher(name, email, password);
                teacher.id = id;
                teachers.push(teacher);
            });
            return teachers;
        }, function(error) {
            console.error(error);
        }).then(function(value) {
            return value;
        });
    }

    /**
     * Gets the Teacher that has the id passed in the param.
     * @param {number} id 
     */
    static retrieve(id){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(namespaces.teachers + id).once('value').then(function(snapshot){
                let name = snapshot.val().name;
                let email = snapshot.val().email;
                let password = snapshot.val().password;
                let teacher = new Teacher(name, email, password);
                teacher.id = id;
                resolve(teacher);
            });
        });
    }

    /**
     * Gets a Teacher by using the email and password.
     * @param {string} email 
     * @param {string} password 
     */
    static find(email, password){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(namespaces.teachers).once('value').then(function(snapshot){
                let validTeacher = null;
                snapshot.forEach(function(teacher){
                    if(teacher.val().email === email && teacher.val().password === password){
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

}

module.exports = Teacher;
