import * as firebase from 'firebase';

let lessonPath = '/lessons/';

class Lesson{
    constructor(teacher, subject, startDate, endDate, photo){
        this.teacher = teacher;
        this.subject = subject;
        this.startDate = startDate;
        this.endDate = endDate;
        this.photo = photo || 'No Photo';
    }

    save(){
        if(this.id){
            return firebase.database().ref(lessonPath + this.id).update({
                teacher: this.teacher,
                subject: this.subject,
                startDate: this.startDate,
                endDate: this.endDate,
                photo: this.photo
            });
        } else {
            return new Promise((resolve, reject)=>{
                let obj = firebase.database().ref(lessonPath).push(this);
                this.id = obj.key;
                resolve(this.id);
            });
        }
    }

    delete(){
        firebase.database().ref(lessonPath + this.id).remove();
    }

    static retrieve(id){
        return new Promise((resolve, reject)=>{
            firebase.database().ref(lessonPath + id).once('value').then(function(snapshot){
                let teacher = snapshot.val().teacher;
                let subject = snapshot.val().subject;
                let startDate = snapshot.val().startDate;
                let endDate = snapshot.val().endDate;
                let photo = snapshot.val().photo;
                let lesson = new Lesson(teacher, subject, startDate, endDate, photo);
                lesson.id = id;
                resolve(lesson);
            });
        });
    }
}

module.exports = Lesson;
