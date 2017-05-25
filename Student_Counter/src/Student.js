import * as firebase from 'firebase';

class Student{
  constructor(number, fName, lName, birthdate, email, photo){
    this.number = number;
    this.fName = fName;
    this.lName = lName;
    this.birthdate = 'test';
    this.email = 'test@test.com';
    this.photo = 'testPhoto';

    this.save();
  }

  save(){
    let studentPath = '/student/' + this.number;
    firebase.database().ref(studentPath).set({
      fName: this.fName,
      lName: this.lName,
      birthdate: this.birthdate,
      email: this.email,
      photo: this.photo
    })
  }
}

module.exports = Student;
