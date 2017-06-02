import * as firebase from "firebase";

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

    // diminui a coesao esta funcao certo?
    // createPresence(lessonId, late){
    //     let presence = new Presence(this.number, lessonId, late);
    //     return presence.id;
    // }

    getPresencesAsync(subjectId){
        return firebase.database().ref(namespaces.presences).once("value").then(function (snapshot) {
            let numberPresences = 0;
            let numberAbsences = 0;
            let promises = [];
            snapshot.forEach(function(presence){
                let promise = firebase.database().ref(namespaces.lessons + presence.val().lessonId).once("value").then(function(snapshot2) {
                    if (snapshot2.val().subject === subjectId) {
                        presence.val().late ? numberPresences += 1 : numberAbsences += 1;
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
                    absences: numberAbsences
                };
            })
        }, function(error) {
            console.error(error);
        }).then(function(values) {
            return values;
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

