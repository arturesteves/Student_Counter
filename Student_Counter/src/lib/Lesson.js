import * as firebase from 'firebase';

class Lesson{
  constructor(nLesson, date, time, started, finished, photo){
    this.nLesson = 'Lesson' + nLesson;
    this.date = date;
    this.time = time;
    this.started = false;
    this.finished = false;
    this.photo = 'photoTest';

    this.save();
  }

  save(){
    let classPath = '/class/' + this.name;
    firebase.database().ref(classPath).set(this);
  }
}

module.exports = Class;