import * as firebase from "firebase";
var Teacher = require("./Teacher");

let namespaces = require("./namespaces").namespaces;

//TODO: Acrescentar a um acrónimo ou sigla para a disciplina
//TODO: modificar overseers para overseersIds -> ATENÇÃO: que esta alteração requer que talvez seja necessário alterar os testes
class Subject{

    constructor(name, acronym, overseersIds){
        this.name = name;
        this.acronym = acronym;
        this.overseersIds = overseersIds;
    }

    save(){
        if(this.id){
            return firebase.database().ref(namespaces.subjects + this.id).update({
                name: this.name,
                acronym: this.acronym,
                overseersIds: this.overseersIds
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
        for(let overseerId of this.overseersIds) {
            array.push(await Teacher.retrieve(overseerId));
        }
        return array;
    }

    static retrieve(id){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(namespaces.subjects + id).once('value').then(function(snapshot){
                let name = snapshot.val().name;
                let acronym = snapshot.val().acronym;
                let overseersIds = snapshot.val().overseersIds;
                let subject = new Subject(name, acronym, overseersIds);
                subject.id = id;
                resolve(subject);
            });
        });
    }
}

module.exports = Subject;
