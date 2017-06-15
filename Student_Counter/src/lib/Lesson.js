import * as firebase from 'firebase';
let Subject = require("./Subject");
let Teacher = require("./Teacher");
let Presence = require("./Presence");
let Class = require("./Class");
let StudentLib = require("./Student");
let PresenceLib = require("./Presence");
let namespaces = require("./namespaces").namespaces;

// TODO: suportar o número da aula
class Lesson{
    constructor(teacherId, subjectId, classes, startDate, endDate, photo, summary){
        this.teacherId = teacherId;
        this.subjectId = subjectId;
        this.startDate = startDate;
        this.classes = classes;
        this.endDate = endDate;
        this.photo = photo || "No Photo";
        this.summary = summary || ""
    }

    createPresences(lessonId){
        if(this.classes.length != 0){
            let allClasses = this.classes.map((_class) => {
                return Class.retrieve(_class);
            })
            let studentIds = [];
            Promise.all(allClasses).then((classes) =>{
                classes.map((_class) => {
                    studentIds = studentIds.concat(_class.studentIds);
                })
            }).then(()=>{
                studentIds.map((studentId)=>{
                    p = new Presence(studentId, lessonId,false,false);
                    p.save();
                })
            })
        }    
    }

    updatePresences(lessonId){
        if(this.classes.length != 0){
            let allClasses = this.classes.map((_class) => {
                return Class.retrieve(_class);
            })
            let studentIds = [];
            Promise.all(allClasses).then((classes) =>{
                classes.map((_class) => {
                    studentIds = studentIds.concat(_class.studentIds);
                })
            }).then(()=>{
                studentIds.map((studentId)=>{
                    StudentLib.all().then((students) => {
                        PresenceLib.all().then((presences) => {
                            let currentPresences = [];
                            presences.map((presence) => {
                                if(presence.lessonId == lessonId){
                                    currentPresences.push(presence);
                                }
                            })
                            let studentsToCreatePresence = [];
                            students.map((student) => {
                                currentPresences.map((presence) => {
                                    if(presence.studentId == student.id){
                                        studentsToCreatePresence.push(student);
                                    }
                                })        
                            })
                            studentsToCreatePresence.map((student) => {
                                p = new Presence(student.id, lessonId,false,false);
                                p.save();
                            }) 
                        })  
                    })
                    
                })
            })
        }
    }
    save(){
        let that = this;
        if(this.id){
            return firebase.database().ref(namespaces.lessons + this.id).update({
                teacherId: this.teacherId,
                subjectId: this.subjectId,
                startDate: this.startDate,
                endDate: this.endDate,
                photo: this.photo,
                summary: this.summary,
                classes:this.classes
            }).then(()=> {
                that.updatePresences(that.id);
            });
        } else {
            return new Promise((resolve, reject)=>{
                // aqui seria necessario ver quantas aulas existem para esta disciplina (count)
                let obj = firebase.database().ref(namespaces.lessons).push(that);
                that.id = obj.key;
                that.createPresences(that.id);
                resolve(that.id);
            });
        }
    }

    delete(){
        let that = this;
        firebase.database().ref(namespaces.lessons + this.id).remove();
        PresenceLib.all().then((presences) => {
            presences.map((presence) => {
                if(presence.lessonId = that.id){
                    presence.delete();
                }
            })
        })
    }

    async getSubject(){
        return await Subject.retrieve(this.subjectId);
    }

    async getTeacher(){
        return await Teacher.retrieve(this.teacherId);
    }

    static all(){
        return firebase.database().ref(namespaces.lessons).once("value").then(function (snapshot) {
            let lessons = [];
            snapshot.forEach(function(lessonValues){
                let id = lessonValues.key;
                let endDate = lessonValues.val().endDate;
                let photo = lessonValues.val().photo;
                let startDate = lessonValues.val().startDate;
                let subjectId = lessonValues.val().subjectId;
                let summary = lessonValues.val().summary;
                let teacherId = lessonValues.val().teacherId;
                let classes = lessonValues.val().classes;
                let lesson = new Lesson(teacherId, subjectId,classes, startDate, endDate, photo, summary);
                lesson.id = id;
                lessons.push(lesson);
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
            firebase.database().ref(namespaces.lessons + id).once('value').then(function(snapshot){
                let teacherId = snapshot.val().teacherId;
                let subjectId = snapshot.val().subjectId;
                let startDate = snapshot.val().startDate;
                let endDate = snapshot.val().endDate;
                let photo = snapshot.val().photo;
                let summary = snapshot.val().summary;
                let classes = snapshot.val().classes;
                let lesson = new Lesson(teacherId, subjectId,classes, startDate, endDate, photo, summary);
                lesson.id = id;
                resolve(lesson);
            });
        });
    }
}

module.exports = Lesson;
