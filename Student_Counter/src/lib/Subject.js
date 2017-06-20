import * as firebase from 'firebase';
let Teacher = require("./Teacher");

// circular dependencies : https://coderwall.com/p/myzvmg/circular-dependencies-in-node-js
//https://gist.github.com/lperrin/5934098
//let Lesson = require("./Lesson.js");

let namespaces = require("./namespaces").namespaces;
/** Class representing a Subject */
class Subject{
    /**
     * Creates a Subject.
     * @param {string} name 
     * @param {string} acronym 
     * @param {number} overseersIds 
     */
    constructor(name, acronym, overseersIds){
        this.name = name;
        this.acronym = acronym;
        this.overseersIds = overseersIds;
    }

    /**
     * Saves an instance of Subject in the DataBase, if the instance already exists updates the current instance otherwise creates a new one.
     */
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

    /**
     * Deletes the Subject's instance in the database.
     */
    delete(){
        let that = this;
        firebase.database().ref(namespaces.subjects + this.id).remove();
        /*
        Lesson.all().then((lessons) => {
            lessons.map((lesson)=>{
                if(lesson.subjectId == that.id){
                    lesson.delete();
                }
            })
        })
        */

    }

    /**
     * Gets all the Overseers of the Subject.
     * @return {} 
     */
    async getOverseers(){
        let array = [];
        for(let overseerId of this.overseersIds) {
            array.push(await Teacher.retrieve(overseerId));
        }
        return array;
    }

    /**
     * Gets all the Subjects from the DataBase
     */D
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
    /**
     * Gets the Lessons from the Subject.
     */
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

    /**
     * Gets the Subject that has the id passed in the param.
     * @param {number} id 
     */
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
