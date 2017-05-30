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

const Presence = require("../src/lib/Presence");
const Teacher = require("../src/lib/Teacher");
const Subject = require("../src/lib/Subject");
const Student = require("../src/lib/Student");
const Lesson = require("../src/lib/Lesson");


test('Create a presence in database and check id after and before creation', () => {
    var student = new Student("1303412", "Miguel Saraiva", "13-03-1993", "miguel.saraia@gmail.com", "photos/1303412.png");
    student.save();
    var teacher = new Teacher("Cédric B.", "email.ah@gmail.com", "13-12-1894", "myPhoto.png");
    teacher.save();
    var subject = new Subject("Gestão de Projectos",[teacher.id]);
    subject.save();
    var lesson = new Lesson(teacher.id, subject.id, "08:30:00", "10:30:00", "photo.png");
    lesson.save();

    var presence_Miguel = new Presence(student.number, lesson.id, true);
    expect(presence_Miguel.id).toBeUndefined();

    presence_Miguel.save();

    expect(presence_Miguel).toHaveProperty("id");
    expect(presence_Miguel).toHaveProperty("studentId");
    expect(presence_Miguel).toHaveProperty("lessonId");
    expect(presence_Miguel).toHaveProperty("late");

    expect(Presence.retrieve(presence_Miguel.id).studentId).resolves.toBe(student.number);
    expect(Presence.retrieve(presence_Miguel.id).lessonId).resolves.toBe(lesson.id);
    expect(Presence.retrieve(presence_Miguel.id).late).resolves.toBe(true);
});


test('Update a presence', () => {
    var student = new Student("1303412", "Miguel Saraiva", "13-03-1993", "miguel.saraia@gmail.com", "photos/1303412.png");
    student.save();
    var teacher = new Teacher("Cédric B.", "email.ah@gmail.com", "13-12-1894", "myPhoto.png");
    teacher.save();
    var subject_1 = new Subject("Gestão de Projectos",[teacher.id]);
    subject_1.save();
    var subject_2 = new Subject("Análise I",[teacher.id]);
    subject_2.save();
    var lesson_1 = new Lesson(teacher.id, subject_1.id, "08:30:00", "10:30:00", "photo.png");
    lesson_1.save();
    var lesson_2 = new Lesson(teacher.id, subject_1.id, "08:30:00", "10:30:00", "photo.png");
    lesson_2.save();

    var presence_Miguel = new Presence(student.number, lesson_1.id, true);

    presence_Miguel.lessonId = lesson_2.id;
    presence_Miguel.late = false;

    presence_Miguel.save();

    expect(presence_Miguel.studentId).not.toBe(lesson_1.id);
    expect(presence_Miguel.late).not.toBe(true);


    expect(Presence.retrieve(presence_Miguel.id).studentId).resolves.toBe(student.number);
    expect(Presence.retrieve(presence_Miguel.id).lessonId).resolves.toBe(lesson_2.id);
    expect(Presence.retrieve(presence_Miguel.id).late).resolves.toBe(false);
});


test('Delete a presence', () => {
    var student = new Student("1303412", "Miguel Saraiva", "13-03-1993", "miguel.saraia@gmail.com", "photos/1303412.png");
    student.save();
    var teacher = new Teacher("Cédric B.", "email.ah@gmail.com", "13-12-1894", "myPhoto.png");
    teacher.save();
    var subject_1 = new Subject("Gestão de Projectos",[teacher.id]);
    subject_1.save();
    var subject_2 = new Subject("Análise I",[teacher.id]);
    subject_2.save();
    var lesson_1 = new Lesson(teacher.id, subject_1.id, "08:30:00", "10:30:00", "photo.png");
    lesson_1.save();
    var lesson_2 = new Lesson(teacher.id, subject_1.id, "08:30:00", "10:30:00", "photo.png");
    lesson_2.save();
    var presence_Miguel = new Presence(student.number, lesson_1.id, true);

    presence_Miguel.save();
    presence_Miguel.delete();

    expect(Presence.retrieve(presence_Miguel.id).studentId).resolves.not.toBe(student.number);
    expect(Presence.retrieve(presence_Miguel.id).studentId).resolves.toBeUndefined();
    expect(Presence.retrieve(presence_Miguel.id).lessonId).resolves.toBeUndefined();
    expect(Presence.retrieve(presence_Miguel.id).late).resolves.toBeUndefined();

});

test('Get student of a presence', () => {
    var student = new Student("1303412", "Miguel Saraiva", "13-03-1993", "miguel.saraia@gmail.com", "photos/1303412.png");
    student.save();
    var teacher = new Teacher("Cédric B.", "email.ah@gmail.com", "13-12-1894", "myPhoto.png");
    teacher.save();
    var subject_1 = new Subject("Gestão de Projectos",[teacher.id]);
    subject_1.save();
    var subject_2 = new Subject("Análise I",[teacher.id]);
    subject_2.save();
    var lesson_1 = new Lesson(teacher.id, subject_1.id, "08:30:00", "10:30:00", "photo.png");
    lesson_1.save();
    var presence_Miguel = new Presence(student.number, lesson_1.id, true);

    //expect.assertions(11);

    expect(presence_Miguel).toHaveProperty("studentId");

    return presence_Miguel.getStudent().then(function(data){
        //success
        expect(data).toHaveProperty("number");
        expect(data).toHaveProperty("name");
        expect(data).toHaveProperty("birthDate");
        expect(data).toHaveProperty("email");
        expect(data).toHaveProperty("photo");

        expect(data.number).toBe(student.number);
        expect(data.name).toBe(student.name);
        expect(data.email).toBe(student.email);
        expect(data.birthDate).toBe(student.birthDate);
        expect(data.photo).toBe(student.photo);

    });

});


test('Get lesson of a presence', () => {
    var student = new Student("1303412", "Miguel Saraiva", "13-03-1993", "miguel.saraia@gmail.com", "photos/1303412.png");
    student.save();
    var teacher = new Teacher("Cédric B.", "email.ah@gmail.com", "13-12-1894", "myPhoto.png");
    teacher.save();
    var subject_1 = new Subject("Gestão de Projectos",[teacher.id]);
    subject_1.save();
    var subject_2 = new Subject("Análise I",[teacher.id]);
    subject_2.save();
    var lesson_1 = new Lesson(teacher.id, subject_1.id, "08:30:00", "10:30:00", "photo.png");
    lesson_1.save();
    var presence_Miguel = new Presence(student.number, lesson_1.id, true);

    expect.assertions(11);

    expect(presence_Miguel).toHaveProperty("studentId");

    return presence_Miguel.getLesson().then(function(data){
        //success
        expect(data).toHaveProperty("teacher");
        expect(data).toHaveProperty("subject");
        expect(data).toHaveProperty("startDate");
        expect(data).toHaveProperty("endDate");
        expect(data).toHaveProperty("photo");

        expect(data.teacher).toBe(lesson_1.teacher);
        expect(data.subject).toBe(lesson_1.subject);
        expect(data.startDate).toBe(lesson_1.startDate);
        expect(data.endDate).toBe(lesson_1.endDate);
        expect(data.photo).toBe(lesson_1.photo);

    });

});

