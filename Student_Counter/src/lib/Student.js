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

    // TODO: Obter presenças de um aluno por cada disciplina em que esteja presente
    // é preciso verificar se o aluno é o mesmo
    getPresences(subjectId){
        return new Promise((resolve, reject) => {
            let countPresences = 0;
            let countAbsence = 0;
            firebase.database().ref(namespaces.presences).once("value").then(function(snapshot){
                console.log("entrei 1 ");
                return new Promise((resolver, reject) => {
                    snapshot.forEach((presence) => {
                        console.log("entrei 2 ");
                        firebase.database().ref(namespaces.lessons + presence.val().lessonId).once("value").then(function(snapshot2){
                            if (snapshot2.val().subject === subjectId) {
                                console.log("entrei 3");
                                console.log(presence.key);
                                presence.val().late ? countPresences += 1 : countAbsence += 1;
                                console.log("countPresences", countPresences);
                                console.log("countAbsence", countAbsence);
                                resolver();   // not all results
                            }
                        });
                    });
                    //resolver(); not working -> result logged to soon
                }).then(function(data){
                    resolve({
                        presences: countPresences,
                        absence: countAbsence
                    })
                });
            });
        });
    }

    getPresencesOld(className){
        return new Promise((resolve, reject) => {
            firebase.database().ref("/presences").once("value", function(snapshot) {
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

       /*

        firebase.database().ref(namespaces.subjects).once("value", function(snapshot){
        if(snapshot.key === subjectId){

        }
        });
        */
    }


    getClasses(){

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
