import * as firebase from "firebase";
var Teacher = require("./Teacher");

let namespaces = require("./namespaces").namespaces;

//TODO: Acrescentar a um acrónimo ou sigla para a disciplina
//TODO: modificar overseers para overseersIds -> ATENÇÃO: que esta alteração requer que talvez seja necessário alterar os testes
class Subject{

    constructor(name, overseers){
        this.name = name;
        this.overseers = overseers;
    }

    save(){
        if(this.id){
            return firebase.database().ref(namespaces.subjects + this.id).update({
                name: this.name,
                overseers: this.overseers
            });
        } else {
            return new Promise((resolve, reject)=>{
                let obj = firebase.database().ref(namespaces.subjects).push(this);
                this.id = obj.key;
                resolve(this.id);
            });
        }
    }

    delete(){
        firebase.database().ref(namespaces.subjects + this.id).remove();
    }

    async getOverseers(){
        let array = [];
        for(let overseer of this.overseers) {
            array.push(await Teacher.retrieve(overseer));
        }
        return array;
    }

    static retrieve(id){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(namespaces.subjects + id).once('value').then(function(snapshot){
                let name = snapshot.val().name;
                let overseers = snapshot.val().overseers;
                let subject = new Subject(name, overseers);
                subject.id = id;
                resolve(subject);
            });
        });
    }
}

module.exports = Subject;
