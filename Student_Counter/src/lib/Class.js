import * as firebase from "firebase";
let Student = require("./Student");
let Subject = require("./Subject");

let namespaces = require("./namespaces").namespaces;


class Class {

    constructor(className, studentIds, subjectIds) {
        this.className = className;
        this.studentIds = studentIds;
        this.subjectIds = subjectIds;
    }

    save(){
        return firebase.database().ref(namespaces.classes + this.className).set({
            studentIds: this.studentIds,
            subjectIds: this.subjectIds
        });
    }

    delete(){
        firebase.database().ref(namespaces.classes + this.className).remove();
    }

    async getStudents(){
        let array = [];
        for(let studentId of this.studentIds) {
            array.push(await Student.retrieve(studentId));
        }
        return array;
    }

    async getSubjects(){
        let array = [];
        for(let subjectId of this.subjectIds) {
            array.push(await Subject.retrieve(subjectId));
        }
        return array;
    }

    //TODO consultar a assiduidad de uma turma? - COULD - talvez nao
    //TODO acabar all function
    //TODO obter o numero de alunos inscritos
    static all(){
        return new Promise((resolve, reject) => {
            firebase.database().ref(namespaces.classes).once("value", function(snapshot) {
                let classes = [];
                snapshot.forEach((child) => {
                    console.log("child key", child.key);
                    console.log("child val ", child.val());
                    console.log("child val ", child.val().studentIds);
                    classes.push(child);    // mudar que nao e isto
                    // falta obter alunos e cadeiras
                });
                resolve(classes)
            });
        });
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
