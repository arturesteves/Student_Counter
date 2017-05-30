import * as firebase from 'firebase';
var Student = require("./Student");
var Lesson = require("./Lesson");

let presencePath = '/presences/';


class Presence{

    constructor(studentId, lessonId, late){
        this.studentId = studentId;
        this.lessonId = lessonId;
        this.late = late;
    }

    save(){
        if(this.id){
            return firebase.database().ref(presencePath + this.id).update({
                studentId: this.studentId,
                lessonId: this.lessonId,
                late: this.late
            });
        } else {
            return new Promise((resolve, reject)=>{
                let obj = firebase.database().ref(presencePath).push(this);
                this.id = obj.key;
                resolve(this.id);
            });
        }
    }

    delete(){
        firebase.database().ref(presencePath + this.id).remove();
    }

    async getStudent(){
        return await Student.retrieve(this.studentId);
    }

    async getLesson(){
        return await Lesson.retrieve(this.lessonId);
    }

    static retrieve(id){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(presencePath + id).once('value').then(function(snapshot){
                let studentId = snapshot.val().studentId;
                let lessonId = snapshot.val().lessonId;
                let late = snapshot.val().late;
                let lesson = new Lesson(studentId, lessonId, late);
                lesson.id = id;
                resolve(lesson);
            });
        });
    }
}

module.exports = Presence;
