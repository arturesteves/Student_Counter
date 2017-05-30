import * as firebase from 'firebase';
var Teacher = require("./Teacher");

let subjectPath = '/subjects/';

class Subject{

    constructor(name, overseers){
        this.name = name;
        this.overseers = overseers;
    }

    save(){
        if(this.id){
            return firebase.database().ref(subjectPath + this.id).update({
                name: this.name,
                overseers: this.overseers
            });
        } else {
            return new Promise((resolve, reject)=>{
                let obj = firebase.database().ref(subjectPath).push(this);
                this.id = obj.key;
                resolve(this.id);
            });
        }
    }

    delete(){
        firebase.database().ref(subjectPath + this.id).remove();
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
            firebase.database().ref(subjectPath + id).once('value').then(function(snapshot){
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
