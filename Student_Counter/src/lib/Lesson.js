import * as firebase from "firebase";
var Subject = require("./Subject");
var Teacher = require("./Teacher");

let namespaces = require("./namespaces").namespaces;

// TODO: suportar o número da aula
class Lesson{
    constructor(teacherId, subjectId, startDate, endDate, photo, summary){
        this.teacherId = teacherId;
        this.subjectId = subjectId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.photo = photo || "No Photo";
        this.summary = summary || ""
    }

    save(){
        if(this.id){
            return firebase.database().ref(namespaces.lessons + this.id).update({
                teacherId: this.teacherId,
                subjectId: this.subjectId,
                startDate: this.startDate,
                endDate: this.endDate,
                photo: this.photo,
                summary: this.summary
            });
        } else {
            return new Promise((resolve, reject)=>{
                // aqui seria necessario ver quantas aulas existem para esta disciplina (count)
                let obj = firebase.database().ref(namespaces.lessons).push(this);
                this.id = obj.key;
                resolve(this.id);
            });
        }
    }

    delete(){
        firebase.database().ref(namespaces.lessons + this.id).remove();
    }

    async getSubject(){
        return await Subject.retrieve(this.subjectId);
    }

    async getTeacher(){
        return await Teacher.retrieve(this.teacherId);
    }

    static retrieve(id){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(namespaces.lessons + id).once('value').then(function(snapshot){
                let teacherId = snapshot.val().teacherId;
                let subjectId = snapshot.val().subjectId;
                let startDate = snapshot.val().startDate;
                let endDate = snapshot.val().endDate;
                let photo = snapshot.val().photo;
                let summary = snapshot.val().summary;
                let lesson = new Lesson(teacherId, subjectId, startDate, endDate, photo, summary);
                lesson.id = id;
                resolve(lesson);
            });
        });
    }
}

module.exports = Lesson;
