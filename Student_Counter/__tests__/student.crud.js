
const Student = require('../src/lib/Student');



test('Create a student in database', () => {
    var student = new Student("1400000", "João José", "13-02-1990", "joao.jose@gmail.com", "myPhoto.png");
    student.save();
    expect(student).toHaveProperty("number");
    expect(student).toHaveProperty("name");
    expect(student).toHaveProperty("birthDate");
    expect(student).toHaveProperty("email");
    expect(student).toHaveProperty("photo");
    expect(Student.retrieve(student.number).number).resolves.toBe("1400000");
    expect(Student.retrieve(student.number).name).resolves.toBe("João José");
    expect(Student.retrieve(student.number).birthDate).resolves.toBe("13-02-1990");
    expect(Student.retrieve(student.number).email).resolves.toBe("joao.jose@gmail.com");
    expect(Student.retrieve(student.number).photo).resolves.toBe("myPhoto.png");
});

test('Update a student', () => {
    var student = new Student("1400001", "João José", "13-02-1990", "joao.jose@gmail.com", "myPhoto.png");
    student.save();

    student.number = "1500000";
    student.name = "Pedro Manteigas";
    student.birthDate = "14-02-2000";
    student.email = "pedro.manteigas@gmail";
    student.photo = "newPhoto.png";

    student.save();

    expect(student.number).not.toBe("1400001");
    expect(student.name).not.toBe("João José");
    expect(student.birthDate).not.toBe("13-02-1990");
    expect(student.email).not.toBe("joao.jose@gmail.com");
    expect(student.photo).not.toBe("myPhoto.png");

    expect(Student.retrieve(student.number).number).resolves.toBe("1500000");
    expect(Student.retrieve(student.number).name).resolves.toBe("Pedro Manteigas");
    expect(Student.retrieve(student.number).birthDate).resolves.toBe("14-02-2000");
    expect(Student.retrieve(student.number).email).resolves.toBe("pedro.manteigas@gmail");
    expect(Student.retrieve(student.number).photo).resolves.toBe("newPhoto.png");
});

test('Delete a student', () => {
    var student = new Student("1400001", "João José", "13-02-1990", "joao.jose@gmail.com", "myPhoto.png");
    student.save();
    student.delete();

    expect(Student.retrieve(student.number).number).resolves.not.toBe("1500000");
    expect(Student.retrieve(student.number).name).resolves.toBeUndefined();
    expect(Student.retrieve(student.number).birthDate).resolves.toBeUndefined();
    expect(Student.retrieve(student.number).email).resolves.toBeUndefined();
    expect(Student.retrieve(student.number).photo).resolves.toBeUndefined();
});
