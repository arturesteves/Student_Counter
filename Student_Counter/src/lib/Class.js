import * as firebase from 'firebase';
let Student = require("./Student");
let Subject = require("./Subject");
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
     * Saves an instance of the Class in the database, if the instance already exists updates the current instance otherwise creates a new one.
     */
    save(){
        return firebase.database().ref(namespaces.classes + this.name).set({
            studentIds: this.studentIds,
            subjectIds: this.subjectIds
        });
    }

    /**
     * Deletes the Class's instance from the database.
     */
    delete(){
        firebase.database().ref(namespaces.classes + this.name).remove();
    }

    /**
     * 
     */
    async getStudents(){
        let array = [];
        for(let studentId of this.studentIds) {
            array.push(await Student.retrieve(studentId));
        }
        return array;
    }

    /**
     * 
     */
    async getSubjects(){
        let array = [];
        for(let subjectId of this.subjectIds) {
            array.push(await Subject.retrieve(subjectId));
        }
        return array;
    }

    /**
     * 
     */
    numberOfregisteredStudentsAsync(){
        let that = this;
        return firebase.database().ref(namespaces.students).once("value").then(function (snapshot) {
            let numberStudents = 0;
            snapshot.forEach(function(student){
                if(that.studentIds.includes(student.key)){
                    numberStudents++;
                }
            });
            return numberStudents;
        }, function(error) {
            console.error(error);
        }).then(function(value) {
            return {
                name: that.name,
                numberStudents: value
            };
        });
    }

    //TODO consultar a assiduidad de uma turma? - COULD - talvez nao
    getClassAssiduity(){
       /** TO COMPLETE */
    }

    /**
     * 
     */
    static all(){
        return firebase.database().ref(namespaces.classes).once("value").then(function (snapshot) {
            let classes = [];
            snapshot.forEach(function(classValues){
                let name = classValues.key;
                let studentId = classValues.val().studentIds;
                let subjectIds = classValues.val().subjectIds;
                classes.push(new Class(name, studentId, subjectIds))
            });
            return classes;
        }, function(error) {
            console.error(error);
        }).then(function(value) {
            return value;
        });
    }

    /**
     * Gets the Class that has the name passed in the param.
     * @param {string} name 
     */
    static retrieve(name){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(namespaces.classes + name).once('value').then(function(snapshot){
                let studentIds = snapshot.val().studentIds;
                let subjectIds = snapshot.val().subjectIds;
                let clazz = new Class(name, studentIds, subjectIds);
                resolve(clazz);
            });
        });
    }
}

module.exports = Class;
