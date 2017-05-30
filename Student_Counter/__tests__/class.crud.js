
const Class = require("../src/lib/Class");
const Student = require("../src/lib/Student");
const Subject = require("../src/lib/Subject");


test('Create a class in database and check id after and before creation', () => {
    var student = new Student("1400222", "João Batata", "14:22:1984", "batatas@gmail.com", "myFile/photo.png");
    var teacher = new Teacher("João Ventura", "joao.ventura@gmail.com", "13:02:1990", "p.png");
    var subject = new Subject("Programação para a Internet", [teacher.id]);
    var clazz = new Class("Turma A", [student.number], [subject.id]);

    expect(clazz.id).toBeUndefined();
    clazz.save();

    expect(clazz).toHaveProperty("id");
    expect(clazz).toHaveProperty("studentIds");
    expect(teacher).toHaveProperty("subjectIds");

    expect(Class.retrieve(clazz.id).studentIds).resolves.toBe([student.number]);
    expect(Class.retrieve(clazz.id).subjectIds).resolves.toBe([subject.id]);
});

test('Update a teacher', () => {
    var student_1 = new Student("1400222", "João Batata", "14:22:1984", "batatas@gmail.com", "myFile/photo.png");
    var student_2 = new Student("1422132", "João Arroz", "16:21:1987", "arroz@gmail.com", "myFileee/photo.png");
    var teacher_1 = new Teacher("João Ventura", "joao.ventura@gmail.com", "13:02:1990", "p.png");
    var teacher_2 = new Teacher("Marco Paulo", "marco.paulo@gmail.com", "09:02:1990", "photo.png");
    var subject_1 = new Subject("Programação para a Internet", [teacher_1.id, teacher_2.id]);
    var subject_2 = new Subject("Sistemas Operativos", [teacher_1.id, teacher_2.id]);
    var clazz = new Class("Turma A", [student_1.number], [subject_1.id]);


    clazz.studentIds.ou
    clazz.subjectIds = "pedro.manteigas@gmail";
    teacher.birthDate = "14-02-2000";
    teacher.photo = "newPhoto.png";

    teacher.save();

    expect(teacher.number).not.toBe("1400001");
    expect(teacher.name).not.toBe("João José");
    expect(teacher.birthDate).not.toBe("13-02-1990");
    expect(teacher.email).not.toBe("joao.jose@gmail.com");
    expect(teacher.photo).not.toBe("myPhoto.png");

    expect(Teacher.retrieve(teacher.id).name).resolves.toBe("Manuel Tremoço");
    expect(Teacher.retrieve(teacher.id).birthDate).resolves.toBe("13-02-1800");
    expect(Teacher.retrieve(teacher.id).email).resolves.toBe("manuel.tremoco@gmail.com");
    expect(Teacher.retrieve(teacher.id).photo).resolves.toBe("mYpHOTO.JPEG");
});

test('Delete a teacher', () => {
    var teacher = new Teacher("Manuel Tremoço", "manuel.tremoco@gmail.com", "13-02-1800", "mYpHOTO.JPEG");
    teacher.save();
    teacher.delete();

    expect(Teacher.retrieve(teacher.id).name).resolves.not.toBe("Manuel Tremoço");
    expect(Teacher.retrieve(teacher.id).email).resolves.toBeUndefined();
    expect(Teacher.retrieve(teacher.id).birthDate).resolves.toBeUndefined();
    expect(Teacher.retrieve(teacher.id).photo).resolves.toBeUndefined();

});
