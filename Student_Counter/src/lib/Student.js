import * as firebase from 'firebase';

let teacherPath = '/teacher/';

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
            return firebase.database().ref(teacherPath + this.id).update({
                name: this.name,
                email: this.email,
                birthDate: this.birthDate,
                photo: this.photo,
            });
        } else {
            return new Promise((resolve, reject)=>{
                let obj = firebase.database().ref(teacherPath).push(this);
                this.id = obj.key;
                resolve(this.id);
            });
        }
    }

    delete(){
        firebase.database().ref(teacherPath + this.id).remove();
    }

    static retrieve(id){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(teacherPath + id).once('value').then(function(snapshot){
                let number = snapshot.val().number;
                let name = snapshot.val().name;
                let email = snapshot.val().email;
                let birthdate = snapshot.val().birthDate;
                let photo = snapshot.val().photo;

                let teacher = new Teacher(name, email, birthdate, photo);
                teacher.id = id;
                resolve(teacher);
            });
        });
    }
}

module.exports = Teacher;
