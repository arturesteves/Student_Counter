import * as firebase from 'firebase';

let classPath = '/class/';

class Class {

    constructor(number, alunos, disciplinas) {
        this.number = number;
        this.alunos = alunos;
        this.disciplinas = disciplinas;
    }

    save(){
        if(this.id){
            return firebase.database().ref(classPath + this.id).update({
                number: this.number,
                alunos: this.alunos,
                disciplinas: this.disciplinas
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
                let disciplinas = snapshot.val().disciplinas;

                let clazz = new Class(number, alunos, disciplinas);
                clazz.id = id;
                resolve(clazz);
            });
        });
    }
}

module.exports = Class;

