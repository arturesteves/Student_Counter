import * as firebase from 'firebase';

let lessonPath = '/lesson/';

class Lesson{
  constructor(nLesson, date, time, started, finished, photo){
    this.nLesson = nLesson;
    this.date = date;
    this.time = time;
    this.started = started || false;
    this.finished = finished || false;
    this.photo = photo || 'photoTest';
  }

  save(){
    if(this.id){
        return firebase.database().ref(lessonPath + this.id).update({
          nLesson: this.nLesson,
          date: this.date,
          time: this.time,
          started: this.started,
          finished: this.finished,
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
              let nLesson = snapshot.val().nLesson;
              let date = snapshot.val().date;
              let time = snapshot.val().time;
              let started = snapshot.val().started;
              let finished = snapshot.val().finished;
              let photo = snapshot.val().photo;

              let lesson = new Lesson(nLesson, date, time, started, finished, photo);
              lesson.id = id;
              resolve(lesson);
          });
      });
  }
}

module.exports = Lesson;
