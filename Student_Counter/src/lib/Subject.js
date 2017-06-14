import * as firebase from 'firebase';


// circular dependencies : https://coderwall.com/p/myzvmg/circular-dependencies-in-node-js
//https://gist.github.com/lperrin/5934098
//let Lesson = require("./Lesson.js");
let Teacher = require("./Teacher");


let namespaces = require("./namespaces").namespaces;

//TODO: Acrescentar a um acrónimo ou sigla para a disciplina
//TODO: modificar overseers para overseersIds -> ATENÇÃO: que esta alteração requer que talvez seja necessário alterar os testes
class Subject{

    constructor(name, acronym, overseersIds){
        this.name = name;
        this.acronym = acronym;
        this.overseersIds = overseersIds;
    }

    save(){
        if(this.id){
            return firebase.database().ref(namespaces.subjects + this.id).update({
                name: this.name,
                acronym: this.acronym,
                overseersIds: this.overseersIds
            });
        } else {
            return new Promise((resolve, reject)=>{
                let obj = firebase.database().ref(namespaces.subjects).push(this);
                this.id = obj.key;
                resolve(this.id);
            });
        }
    }

    delete(){
        firebase.database().ref(namespaces.subjects + this.id).remove();
    }

    async getOverseers(){
        let array = [];
        for(let overseerId of this.overseersIds) {
            array.push(await Teacher.retrieve(overseerId));
        }
        return array;
    }

    static all(){
        return firebase.database().ref(namespaces.subjects).once("value").then(function (snapshot) {
            let subjects = [];
            snapshot.forEach(function(subjectValues){
                let id = subjectValues.key;
                let name = subjectValues.val().name;
                let acronym = subjectValues.val().acronym;
                let overseersIds = subjectValues.val().overseersIds;
                let subject = new Subject(name, acronym, overseersIds);
                subject.id = id;
                subjects.push(subject);
            });
            return subjects;
        }, function(error) {
            console.error(error);
        }).then(function(value) {
            return value;
        });
    }

    // NOT WORKING BECAUSE OF CIRCULAR DEPENDENCY
    getLessonsAsync(){
        console.log("l76",Lesson);
        console.log("l77",Teacher);
        return firebase.database().ref(namespaces.lessons).once("value").then(function (snapshot) {
            let lessons = [];
            snapshot.forEach(function(lessonValues){
                if(lessonValues.subjectId === this.id){
                    let id = lessonValues.key;
                    let endDate = lessonValues.val().endDate;
                    let photo = lessonValues.val().photo;
                    let startDate = lessonValues.val().startDate;
                    let subjectId = lessonValues.val().subjectId;
                    let summary = lessonValues.val().summary;
                    let teacherId = lessonValues.val().teacherId;
                    let lesson = new Lesson(teacherId, subjectId, startDate, endDate, photo, summary);
                    lesson.id = id;
                    lessons.push(lesson);
                }
            });
            return lessons;
        }, function(error) {
            console.error(error);
        }).then(function(value) {
            return value;
        });
    }

    static retrieve(id){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(namespaces.subjects + id).once('value').then(function(snapshot){
                let name = snapshot.val().name;
                let acronym = snapshot.val().acronym;
                let overseersIds = snapshot.val().overseersIds;
                let subject = new Subject(name, acronym, overseersIds);
                subject.id = id;
                resolve(subject);
            });
        });
    }
}

module.exports = Subject;
