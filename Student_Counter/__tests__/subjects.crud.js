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


const Teacher = require('../src/lib/Teacher');
const Subject = require('../src/lib/Subject');


test('Create a subject in database', () => {
    var teacher_1 = new Teacher("Artur Miguel", "artur.miguel@gmail.com", "13-12-1990", "PHOto.png");
    teacher_1.save();
    var teacher_2 = new Teacher("Ricardo Silva", "ricardo.silva@gamail.com", "13-12-1994", "PHOto.png");
    teacher_2.save();

    var subject = new Subject("MEC", [teacher_1.id, teacher_2.id]);
    expect(subject.id).toBeUndefined();
    subject.save();

    expect(subject).toHaveProperty("id");
    expect(subject).toHaveProperty("name");
    expect(subject).toHaveProperty("overseers");

    expect(Subject.retrieve(subject.id).name).resolves.toBe("MEC");
    expect(Subject.retrieve(subject.id).overseers).resolves.toBe([teacher_1.id, teacher_2.id]);
});

test('Update a subject', () => {
    var teacher_1 = new Teacher("Artur Miguel H.", "artur.miguel@gmail.com", "13-12-1990", "PHOto.png");
    teacher_1.save();
    var teacher_2 = new Teacher("Ricardo M. Silva", "ricardo.silva@gamail.com", "13-12-1994", "PHOto.png");
    teacher_2.save();
    var teacher_3 = new Teacher("Joaquim Filipe", "joaquim.filipe@gamail.com", "13-12-1985", "photo.png");
    teacher_3.save();

    var subject = new Subject("MSI", [teacher_1.id, teacher_2.id]);
    subject.save();

    subject.name = "Modelação de Sistemas de Informação - MSI";
    subject.overseers = [teacher_3];

    expect(subject.name).not.toBe("MSI");
    expect(subject.overseers).not.toBe([teacher_1.id, teacher_2.id]);

    expect(Subject.retrieve(subject.id).name).resolves.toBe("Modelação de Sistemas de Informação - MSI");
    expect(Subject.retrieve(subject.id).overseers).resolves.toBe([teacher_3]);
});


test('Delete a subject', () => {
    var teacher_1 = new Teacher("Artur Miguel H.", "artur.miguel@gmail.com", "13-12-1990", "PHOto.png");
    teacher_1.save();

    var subject = new Subject("MAT", [teacher_1.id]);
    subject.save();

    subject.save();
    subject.delete();

    expect(Subject.retrieve(subject.id).name).resolves.not.toBe("MAT");
    expect(Subject.retrieve(subject.id).name).resolves.toBeUndefined();
    expect(Subject.retrieve(subject.id).overseers).resolves.toBeUndefined();
});

//test getOverssers