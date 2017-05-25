/**
 * Created by artur on 25/05/2017.
 */
import * as firebase from 'firebase';

let studentPath = '/student/';


class Student{



    save(){
        if(this.id){
            return firebase.database().ref(studentPath + this.id).update({
                name: this.name,
                email: this.email,
                birthdate: this.birthdate,
                photo: this.photo,
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
                let name = snapshot.val().name;
                let email = snapshot.val().email;
                let birthdate = snapshot.val().birthdate;
                let photo = snapshot.val().photo;
                let teacher = new Student(name, email, birthdate, photo);
                teacher.id = id;
                resolve(teacher);
            });
        });
    }
}

module.exports = Student;
