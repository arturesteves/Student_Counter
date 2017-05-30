
const Teacher = require('../src/lib/Teacher');



test('Create a teacher in database and check id after and before creation', () => {
    var teacher = new Teacher("Manuel Tremoço", "manuel.tremoco@gmail.com", "13-02-1800", "mYpHOTO.JPEG");
    expect(teacher.id).toBeUndefined();
    teacher.save();
    expect(teacher).toHaveProperty("name");
    expect(teacher).toHaveProperty("email");
    expect(teacher).toHaveProperty("birthDate");
    expect(teacher).toHaveProperty("photo");

    expect(Teacher.retrieve(teacher.id).name).resolves.toBe("Manuel Tremoço");
    expect(Teacher.retrieve(teacher.id).email).resolves.toBe("manuel.tremoco@gmail.com");
    expect(Teacher.retrieve(teacher.id).birthDate).resolves.toBe("13-02-1800");
    expect(Teacher.retrieve(teacher.id).photo).resolves.toBe("mYpHOTO.JPEG");
});

test('Update a teacher', () => {
    var teacher = new Teacher("Manuel Tremoço", "manuel.tremoco@gmail.com", "13-02-1800", "mYpHOTO.JPEG");
    teacher.save();

    teacher.name = "Pedro Manteigas";
    teacher.email = "pedro.manteigas@gmail";
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
