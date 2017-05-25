import * as firebase from 'firebase';

let classPath = '/classes/';

class Class {

    constructor(className, studentIds, subjectIds) {
        this.className = className;
        this.studentIds = studentIds;
        this.subjectIds = subjectIds;
    }

    save(){
        return firebase.database().ref(classPath + this.className).set({
            studentIds: this.studentIds,
            subjectIds: this.subjectIds
        });
    }

    delete(){
        firebase.database().ref(classPath + this.className).remove();
    }

    static retrieve(className){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(classPath + className).once('value').then(function(snapshot){
                let studentIds = snapshot.val().studentIds;
                let subjectIds = snapshot.val().subjectIds;
                let clazz = new Class(className, studentIds, subjectIds);
                resolve(clazz);
            });
        });
    }

}

module.exports = Class;
