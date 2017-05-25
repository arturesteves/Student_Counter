import * as firebase from 'firebase';

let teacherPath = '/teacher/';

class Teacher{ 

    constructor(name, email, birthDate, photo){
        this.name = name;
        this.email = email;
        this.birthDate = birthDate || new Date(1900, 1, 1);
        this.photo = photo || "no photo";
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
                let name = snapshot.val().name;
                let email = snapshot.val().email;
                let birthDate = snapshot.val().birthDate;
                let photo = snapshot.val().photo;
                let teacher = new Teacher(name, email, birthDate, photo);
                teacher.id = id;
                resolve(teacher);
            });
        });
    }
}

module.exports = Teacher;