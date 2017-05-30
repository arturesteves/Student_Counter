import * as firebase from 'firebase';
// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCJO-fJa5dlYXKK1zy8bt4TxzwoniSvtsU",
    authDomain: "gpbitteam-59ca2.firebaseapp.com",
    databaseURL: "https://gpbitteam-59ca2.firebaseio.com",
    projectId: "gpbitteam-59ca2",
    storageBucket: "gpbitteam-59ca2.appspot.com",
    messagingSenderId: "571714718837"
});

let studentPath = '/students/';

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
        return firebase.database().ref(studentPath + this.number).set({
            name: this.name,
            email: this.email,
            birthDate: this.birthDate,
            photo: this.photo
        });
    }

    delete(){
        firebase.database().ref(studentPath + this.number).remove();
    }

    static retrieve(number){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(studentPath + number).once('value').then(function(snapshot){
                let name = snapshot.val().name;
                let email = snapshot.val().email;
                let birthDate = snapshot.val().birthDate;
                let photo = snapshot.val().photo;
                let student = new Student(number,name, email, birthDate, photo);
                resolve(student);
            });
        });
    }
}

module.exports = Student;
