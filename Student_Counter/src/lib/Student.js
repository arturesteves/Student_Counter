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

let studentPath = '/student/';

class Student{

    constructor(number, name, birthDate, email, photo) {
        this.number = number;
        this.name = name;
        this.birthDate = birthDate;
        this.email = email;
        this.photo = photo;
    }

    save(){
        if(this.id){
            return firebase.database().ref(studentPath + this.id).update({
                number: this.number,
                name: this.name,
                email: this.email,
                birthDate: this.birthDate,
                photo: this.photo
            });
        } else {
            return new Promise((resolve, reject)=>{
                let obj = firebase.database().ref(studentPath).push(this);
                this.id = obj.key;
                resolve(this.id);
            });
        }
    }

    delete(){
        firebase.database().ref(studentPath + this.id).remove();
    }

    static retrieve(id){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(studentPath + id).once('value').then(function(snapshot){
                let number = snapshot.val().number;
                let name = snapshot.val().name;
                let email = snapshot.val().email;
                let birthDate = snapshot.val().birthDate;
                let photo = snapshot.val().photo;

                let student = new Student(number,name, email, birthDate, photo);
                student.id = id;
                resolve(student);
            });
        });
    }
}

module.exports = Student;
