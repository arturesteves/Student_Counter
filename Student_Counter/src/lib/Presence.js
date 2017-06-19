import * as firebase from 'firebase';
let Student = require("./Student");
let Lesson = require("./Lesson");

let namespaces = require("./namespaces").namespaces;

/** Class representing a Presence */
class Presence{
    /**
     * 
     * @param {number} studentId 
     * @param {number} lessonId 
     * @param {boolean} present 
     * @param {boolean} delay 
     */
    constructor(studentId, lessonId, present, delay){
        this.studentId = studentId;
        this.lessonId = lessonId;
        this.present = present;
        this.delay = present ? delay : false; // this check exists because: a student couldn't be late if he didn't show up
    }

    /**
     * Saves an instance of the Presence in the database, if the instance already exists updates the current instance otherwise creates a new one.
     */
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

    /**
     * 
     * @param {boolean} isPresent 
     */
    updatePresence(isPresent){
        if(this.id){
            return firebase.database().ref(namespaces.presences + this.id).update({
                present:isPresent        
            });
        }
    }

    /**
     * Updates de value of the delay in the Presence
     * @param {boolean} isDelayed 
     */
    updateDelay(isDelayed){
        if(this.id){
            return firebase.database().ref(namespaces.presences + this.id).update({
                delay:isDelayed
            });
        }
    }

    /**
     * Deletes de Presence's instance in the database
     */
    delete(){
        firebase.database().ref(namespaces.presences + this.id).remove();
    }

    /**
     * 
     */
    async getStudent(){
        return await Student.retrieve(this.studentId);
    }

    /**
     * 
     */
    async getLesson(){
        return await Lesson.retrieve(this.lessonId);
    }

    /**
     * Returns all the Presences in the database.
     */
    static all(){
        return firebase.database().ref(namespaces.presences).once("value").then(function (snapshot) {
            let presences = [];
            snapshot.forEach(function(presenceValues){
                let id = presenceValues.key;
                let delay = presenceValues.val().delay;
                let present = presenceValues.val().present;
                let lessonId = presenceValues.val().lessonId;
                let studentId = presenceValues.val().studentId;
                let presence = new Presence(studentId, lessonId, present, delay);
                presence.id = id;
                presences.push(presence);
            });
            return presences;
        }, function(error) {
            console.error(error);
        }).then(function(value) {
            return value;
        });
    }

    /**
     * Gets the Presence that has the id passed in the param.
     * @param {number} id 
     */
    static retrieve(id){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(namespaces.presences + id).once('value').then(function(snapshot){
                let studentId = snapshot.val().studentId;
                let lessonId = snapshot.val().lessonId;
                let present = snapshot.val().present;
                let delay = snapshot.val().delay;
                let presence = new Presence(studentId, lessonId, present, delay);
                presence.id = id;
                resolve(presence);
            });
        });
    }
}

module.exports = Presence;
