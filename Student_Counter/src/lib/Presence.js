import * as firebase from "firebase";
var Student = require("./Student");
var Lesson = require("./Lesson");

let namespaces = require("./namespaces").namespaces;


class Presence{

    constructor(studentId, lessonId, present, delay){
        this.studentId = studentId;
        this.lessonId = lessonId;
        this.present = present;
        this.delay = present ? delay : false; // this check exists because: a student couldn't be late if he didn't show up
    }

    save(){
        if(this.id){
            return firebase.database().ref(namespaces.presences + this.id).update({
                studentId: this.studentId,
                lessonId: this.lessonId,
                present: this.present,
                delay: this.delay
            });
        } else {
            return new Promise((resolve, reject)=>{
                let obj = firebase.database().ref(namespaces.presences).push(this);
                this.id = obj.key;
                resolve(this.id);
            });
        }
    }

    delete(){
        firebase.database().ref(namespaces.presences + this.id).remove();
    }

    async getStudent(){
        return await Student.retrieve(this.studentId);
    }

    async getLesson(){
        return await Lesson.retrieve(this.lessonId);
    }

    static retrieve(id){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(namespaces.presences + id).once('value').then(function(snapshot){
                let studentId = snapshot.val().studentId;
                let lessonId = snapshot.val().lessonId;
                let present = snapshot.val().present;
                let delay = snapshot.val().delay;
                let lesson = new Lesson(studentId, lessonId, present, delay);
                lesson.id = id;
                resolve(lesson);
            });
        });
    }
}

module.exports = Presence;
