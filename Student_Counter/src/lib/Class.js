import * as firebase from 'firebase';
let Student = require("./Student");
let Subject = require("./Subject");

let classPath = '/classes/';

class Class {

    constructor(className, studentIds, subjectIds) {
        this.className = className;
        this.studentIds = studentIds;
        this.subjectIds = subjectIds;
    }

    save(){
        return firebase.database().ref(classPath + this.className).set({
            studentIds: this.studentIds,
            subjectIds: this.subjectIds
        });
    }

    delete(){
        firebase.database().ref(classPath + this.className).remove();
    }

    // get students
    async getStudents(){
        let array = [];
        for(let studentId of this.studentIds) {
            array.push(await Student.retrieve(studentId));
        }
        return array;
    }
    // get subjects
    async getSubjects(){
        let array = [];
        for(let subjectId of this.subjectIds) {
            array.push(await Subject.retrieve(subjectId));
        }
        return array;
    }

    static retrieve(className){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(classPath + className).once('value').then(function(snapshot){
                let studentIds = snapshot.val().studentIds;
                let subjectIds = snapshot.val().subjectIds;
                let clazz = new Class(className, studentIds, subjectIds);
                resolve(clazz);
            });
        });
    }

}

module.exports = Class;
