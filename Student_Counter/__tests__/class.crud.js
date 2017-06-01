import * as firebase from 'firebase';

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCJO-fJa5dlYXKK1zy8bt4TxzwoniSvtsU",
    authDomain: "gpbitteam-59ca2.firebaseapp.com",
    databaseURL: "https://gpbitteam-59ca2.firebaseio.com",
    projectId: "gpbitteam-59ca2",
    storageBucket: "gpbitteam-59ca2.appspot.com",
    messagingSenderId: "571714718837"
});

const Class = require("../src/lib/Class");
const Student = require("../src/lib/Student");
const Subject = require("../src/lib/Subject");
const Teacher = require("../src/lib/Teacher");


test('Create a class in database and check id after and before creation', () => {
    let student = new Student("1400222", "João Batata", "14:22:1984", "batatas@gmail.com", "myFile/photo.png");
    student.save();
    let teacher = new Teacher("João Ventura", "joao.ventura@gmail.com", "13:02:1990", "p.png");
    teacher.save();
    let subject = new Subject("Programação para a Internet", [teacher.id]);
    subject.save();
    let clazz = new Class("Turma A", [student.number], [subject.id]);
    clazz.save();

    expect(clazz).toHaveProperty("className");
    expect(clazz).toHaveProperty("studentIds");
    expect(clazz).toHaveProperty("subjectIds");

    expect(Class.retrieve(clazz.className).className).resolves.toBe("Turma A");
    expect(Class.retrieve(clazz.className).studentIds).resolves.toBe([student.number]);
    expect(Class.retrieve(clazz.className).subjectIds).resolves.toBe([subject.id]);

});

test('Update a class', () => {
    let student_1 = new Student("1400222", "João Batata", "14:22:1984", "batatas@gmail.com", "myFile/photo.png");
    student_1.save();
    let student_2 = new Student("1422132", "João Arroz", "16:21:1987", "arroz@gmail.com", "myFileee/photo.png");
    student_2.save();
    let teacher_1 = new Teacher("João Ventura", "joao.ventura@gmail.com", "13:02:1990", "p.png");
    teacher_1.save();
    let teacher_2 = new Teacher("Marco Paulo", "marco.paulo@gmail.com", "09:02:1990", "photo.png");
    teacher_2.save();
    let subject_1 = new Subject("Programação para a Internet", [teacher_1.id, teacher_2.id]);
    subject_1.save();
    let subject_2 = new Subject("Sistemas Operativos", [teacher_1.id, teacher_2.id]);
    subject_2.save();
    let clazz = new Class("Turma A", [student_1.number], [subject_1.id]);
    clazz.save();

    clazz.name = "Turma B";
    clazz.studentIds.push(student_2.number);
    clazz.subjectIds.push(subject_2.id)
    clazz.save();

    expect(clazz.name).not.toBe("Turma A");
    expect(clazz.studentIds).not.toBe([student_1.number]);
    expect(clazz.subjectIds).not.toBe([subject_1.id]);

    expect(Class.retrieve(clazz.className).name).resolves.toBe("Turma B");
    expect(Class.retrieve(clazz.className).studentIds).resolves.toBe([student_1.number, student_2.number]);
    expect(Class.retrieve(clazz.className).subjectIds).resolves.toBe([subject_1.id, subject_2.id]);
});

test('Delete a class', () => {
    let student_1 = new Student("1400222", "João Batata", "14:22:1984", "batatas@gmail.com", "myFile/photo.png");
    student_1.save();
    let student_2 = new Student("1422132", "João Arroz", "16:21:1987", "arroz@gmail.com", "myFileee/photo.png");
    student_2.save();
    let teacher_1 = new Teacher("João Ventura", "joao.ventura@gmail.com", "13:02:1990", "p.png");
    teacher_1.save();
    let teacher_2 = new Teacher("Marco Paulo", "marco.paulo@gmail.com", "09:02:1990", "photo.png");
    teacher_2.save();
    let subject_1 = new Subject("Programação para a Internet", [teacher_1.id, teacher_2.id]);
    subject_1.save();
    let subject_2 = new Subject("Sistemas Operativos", [teacher_1.id, teacher_2.id]);
    subject_2.save();
    let clazz = new Class("Turma A", [student_1.number], [subject_1.id]);
    clazz.save();
    clazz.delete();

    expect(Class.retrieve(clazz.className).name).resolves.not.toBe("Turma A");
    expect(Class.retrieve(clazz.className).studentIds).resolves.toBeUndefined();
    expect(Class.retrieve(clazz.className).subjectIds).resolves.toBeUndefined();

});

test('Get students of a class', () => {
    let student_1 = new Student("1400222", "João Batata", "14:22:1984", "batatas@gmail.com", "myFile/photo.png");
    student_1.save();
    let student_2 = new Student("1422132", "João Arroz", "16:21:1987", "arroz@gmail.com", "myFileee/photo.png");
    student_2.save();
    let teacher_1 = new Teacher("João Ventura", "joao.ventura@gmail.com", "13:02:1990", "p.png");
    teacher_1.save();
    let teacher_2 = new Teacher("Marco Paulo", "marco.paulo@gmail.com", "09:02:1990", "photo.png");
    teacher_2.save();
    let subject_1 = new Subject("Programação para a Internet", [teacher_1.id, teacher_2.id]);
    subject_1.save();
    let subject_2 = new Subject("Sistemas Operativos", [teacher_1.id, teacher_2.id]);
    subject_2.save();
    let clazz = new Class("Turma A", [student_1.number, student_2.number], [subject_1.id, subject_2.id]);
    clazz.save();

    let students = [student_1, student_2];
    let subjects = [subject_1, subject_2];

    expect.assertions(10 * students.length + 6 * subjects.length + 2);

    expect(clazz).toHaveProperty("studentIds");
    expect(clazz).toHaveProperty("subjectIds");
    return clazz.getStudents().then(function(data){

        for(let i = 0; i < data.length; i++){
            expect(data[i]).toHaveProperty("number");
            expect(data[i]).toHaveProperty("name");
            expect(data[i]).toHaveProperty("email");
            expect(data[i]).toHaveProperty("birthDate");
            expect(data[i]).toHaveProperty("photo");

            expect(data[i].number).toBe(students[i].number);
            expect(data[i].name).toBe(students[i].name);
            expect(data[i].email).toBe(students[i].email);
            expect(data[i].birthDate).toBe(students[i].birthDate);
            expect(data[i].photo).toBe(students[i].photo);
        }

    }).then(()=> clazz.getSubjects()).then(function (data) {

        for (let i = 0; i < data.length; i++) {
            expect(data[i]).toHaveProperty("id");
            expect(data[i]).toHaveProperty("name");
            expect(data[i]).toHaveProperty("overseers");

            expect(data[i].id).toEqual(subjects[i].id);
            expect(data[i].name).toEqual(subjects[i].name);
            expect(data[i].overseers).toEqual(expect.arrayContaining(subjects[i].overseers));
        }

    });
});
