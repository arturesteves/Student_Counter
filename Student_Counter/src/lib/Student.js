import * as firebase from 'firebase';

let Presence = require("./Presence");

let namespaces = require("./namespaces").namespaces;

/**
 * Represent a student
 */
class Student{

    constructor(number, name, birthDate, email, photo) {
        this.number = number;
        this.name = name;
        this.birthDate = birthDate;
        this.email = email;
        this.photo = photo || "no photo";
    }

    save(){
        return firebase.database().ref(namespaces.students + this.number).set({
            name: this.name,
            email: this.email,
            birthDate: this.birthDate,
            photo: this.photo
        });
    }

    delete(){
        firebase.database().ref(namespaces.students + this.number).remove();
    }

    getPresencesAsync(subjectId){
        return firebase.database().ref(namespaces.presences).once("value").then(function (snapshot) {
            let numberPresences = 0;
            let numberAbsences = 0;
            let numberDelays = 0;
            let promises = [];
            snapshot.forEach(function(presence){
                let promise = firebase.database().ref(namespaces.lessons + presence.val().lessonId).once("value").then(function(snapshot2) {
                    if (snapshot2.val().subjectId === subjectId) {
                        presence.val().present ? numberPresences += 1 : numberAbsences += 1;
                        numberDelays += presence.val().delay ? 1 : 0;
                    }
                    // not returning value
                }, function(error){
                    console.log("error fetching presences:", error);
                });
                promises.push(promise);
            });
            return Promise.all(promises).then(function(){
                return {
                    presences: numberPresences,
                    absences: numberAbsences,
                    delays: numberDelays
                };
            })
        }, function(error) {
            console.error(error);
        }).then(function(values) {
            return values;
        });
    }

    static all(){
        return firebase.database().ref(namespaces.students).once("value").then(function (snapshot) {
            let students = [];
            snapshot.forEach(function(studentValues){
                let number = studentValues.key;
                let name = studentValues.val().name;
                let email = studentValues.val().email;
                let birthDate = studentValues.val().birthDate;
                let photo = studentValues.val().photo;
                let student = new Student(number, name, birthDate, email, photo);
                students.push(student);
            });
            return students;
        }, function(error) {
            console.error(error);
        }).then(function(value) {
            return value;
        });
    }

    static retrieve(number){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(namespaces.students + number).once('value').then(function(snapshot){
                let name = snapshot.val().name;
                let email = snapshot.val().email;
                let birthDate = snapshot.val().birthDate;
                let photo = snapshot.val().photo;
                let student = new Student(number, name, birthDate, email, photo);
                resolve(student);
            });
        });
    }
}

module.exports = Student;

