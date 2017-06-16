import * as firebase from 'firebase';

let namespaces = require("./namespaces").namespaces;


class Teacher{ 

    constructor(name, email){
        this.name = name;
        this.email = email;
    }

    save(){
        if(this.id){
            return firebase.database().ref(namespaces.teachers + this.id).update({
                name: this.name,
                email: this.email,
            });
        } else {
            return new Promise((resolve, reject)=>{
                let obj = firebase.database().ref(namespaces.teachers).push(this);
                this.id = obj.key;
                resolve(this.id);
            });
        }
    }

    delete(){
        firebase.database().ref(namespaces.teachers + this.id).remove();
    }

    //TODO: Obter as disciplinas que lecciona
    //TODO: obter as turmas que tem
    //TODO: obter os alunos que possui  -> basta ver as disciplinas que tem e obter os alunos dessas disciplinas

    static all(){
        return firebase.database().ref(namespaces.teachers).once("value").then(function (snapshot) {
            let teachers = [];
            snapshot.forEach(function(teacherValues){
                let id = teacherValues.key;
                let name = teacherValues.val().name;
                let email = teacherValues.val().email;
                let teacher = new Teacher(name, email);
                teacher.id = id;
                teachers.push(teacher);
            });
            return teachers;
        }, function(error) {
            console.error(error);
        }).then(function(value) {
            return value;
        });
    }

    static retrieve(id){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(namespaces.teachers + id).once('value').then(function(snapshot){
                let name = snapshot.val().name;
                let email = snapshot.val().email;
                let teacher = new Teacher(name, email);
                teacher.id = id;
                resolve(teacher);
            });
        });
    }
}

module.exports = Teacher;
