import * as firebase from 'firebase';

let classPath = '/class/';

class Class {

    constructor(number, alunos, subjects) {
        this.number = number;
        this.alunos = alunos;
        this.subjects = subjects;
    }

    save(){
        if(this.id){
            return firebase.database().ref(classPath + this.id).update({
                number: this.number,
                alunos: this.alunos,
                subjects: this.subjects
            });
        } else {
            return new Promise((resolve, reject)=>{
                let obj = firebase.database().ref(classPath).push(this);
                this.id = obj.key;
                resolve(this.id);
            });
        }
    }

    delete(){
        firebase.database().ref(classPath + this.id).remove();
    }

    static retrieve(id){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(classPath + id).once('value').then(function(snapshot){
                let number = snapshot.val().number;
                let alunos = snapshot.val().alunos;
                let subjects = snapshot.val().subjects;

                let clazz = new Class(number, alunos, subjects);
                clazz.id = id;
                resolve(clazz);
            });
        });
    }
}

module.exports = Class;

