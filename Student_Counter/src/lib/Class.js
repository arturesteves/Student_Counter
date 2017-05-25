import * as firebase from 'firebase';

class Class{
  constructor(number, alunos, disciplinas){
    this.name = 'Turma' + number;
    this.alunos = [];
    this.disciplinas = [];

    this.save();
  }

  save(){
    let classPath = '/class/' + this.name;
    firebase.database().ref(classPath).set(this);
  }
}

module.exports = Class;

