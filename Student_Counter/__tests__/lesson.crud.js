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

const Lesson = require("../src/lib/Lesson");
const Subject = require("../src/lib/Subject");
const Teacher = require("../src/lib/Teacher");

test('Create a lesson in database and check id after and before creation', () => {
    var teacher = new Teacher("Cédric B.", "email.ah@gmail.com", "13-12-1894", "myPhoto.png");
    teacher.save();
    var subject = new Subject("Gestão de Projectos",[teacher.id]);
    subject.save();
    var lesson = new Lesson(teacher.id, subject.id, "08:30:00", "10:30:00", "photo.png");

    expect(lesson.id).toBeUndefined();
    lesson.save();
    expect(lesson).toHaveProperty("id");
    expect(lesson).toHaveProperty("subject");
    expect(lesson).toHaveProperty("teacher");
    expect(lesson).toHaveProperty("photo");
    expect(lesson).toHaveProperty("startDate");
    expect(lesson).toHaveProperty("endDate");

    expect(Lesson.retrieve(lesson.id).endDate).resolves.toBe("10:30:00");
    expect(Lesson.retrieve(lesson.id).startDate).resolves.toBe("08:30:00");
    expect(Lesson.retrieve(lesson.id).subject).resolves.toBe(subject.id);
    expect(Lesson.retrieve(lesson.id).photo).resolves.toBe("photo.png");
    expect(Lesson.retrieve(lesson.id).teacher).resolves.toBe(teacher.id);
});

test('Update a lesson', () => {
    var teacher_1 = new Teacher("Cédric B.", "email.ah@gmail.com", "13-12-1894", "myPhoto.png");
    teacher_1.save();
    var teacher_2 = new Teacher("Rui C.", "email.ah@gmail.com", "13-12-1994", "myPhoto.png");
    teacher_2.save();
    var subject_1 = new Subject("Gestão de Projectos",[teacher_1.id, teacher_2.id]);
    subject_1.save();
    var subject_2 = new Subject("Engenharia de Software",[teacher_1.id, teacher_2.id]);
    subject_2.save();
    var lesson = new Lesson(teacher_1.id, subject_1.id, "08:30:00", "10:30:00", "photo.png");
    lesson.save();

    lesson.startDate = "14:00:00";
    lesson.endDate = "15:00:00";
    lesson.subject = subject_2.id;
    lesson.teacher = teacher_2.id;
    lesson.photo = "newPhoto.png";

    lesson.save();
    expect(lesson.startDate).not.toBe("08:30:00");
    expect(lesson.endDate).not.toBe("10:30:00");
    expect(lesson.subject).not.toBe(subject_1.id);
    expect(lesson.teacher).not.toBe(teacher_1.id);
    expect(lesson.photo).not.toBe("photo.png");

    expect(Lesson.retrieve(lesson.id).startDate).resolves.toBe("14:00:00");
    expect(Lesson.retrieve(lesson.id).endDate).resolves.toBe("15:00:00");
    expect(Lesson.retrieve(lesson.id).subject).resolves.toBe(subject_2.id);
    expect(Lesson.retrieve(lesson.id).teacher).resolves.toBe(teacher_2.id);
    expect(Lesson.retrieve(lesson.id).photo).resolves.toBe("newPhoto.png");
});

test('Delete a lesson', () => {
    var teacher_1 = new Teacher("Cédric B.", "email.ah@gmail.com", "13-12-1894", "myPhoto.png");
    teacher_1.save();
    var teacher_2 = new Teacher("Rui C.", "email.ah@gmail.com", "13-12-1994", "myPhoto.png");
    teacher_2.save();
    var subject_1 = new Subject("Gestão de Projectos",[teacher_1.id, teacher_2.id]);
    subject_1.save();
    var subject_2 = new Subject("Engenharia de Software",[teacher_1.id, teacher_2.id]);
    subject_2.save();
    var lesson = new Lesson(teacher_1.id, subject_1.id, "08:30:00", "10:30:00", "photo.png");
    lesson.save();
    lesson.delete();

    expect(Lesson.retrieve(lesson.id).startDate).resolves.not.toBe("08:30:00");
    expect(Lesson.retrieve(lesson.id).startDate).resolves.toBeUndefined();
    expect(Lesson.retrieve(lesson.id).endDate).resolves.toBeUndefined();
    expect(Lesson.retrieve(lesson.id).subject).resolves.toBeUndefined();
    expect(Lesson.retrieve(lesson.id).teacher).resolves.toBeUndefined();
    expect(Lesson.retrieve(lesson.id).photo).resolves.toBeUndefined();

});