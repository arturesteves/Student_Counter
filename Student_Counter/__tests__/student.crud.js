/**
 * Created by artur on 30/05/2017.
 */
const Student = require('../src/lib/Student');



test('Create a student in database and check id after and before creation', () => {
    var student = new Student("1400000", "João José", "13-02-1990", "joao.jose@gmail.com", "myPhoto.png");
    expect(student.id).toBeUndefined(); // check if id is null before inserting on database
    student.save();
    expect(student).toHaveProperty("id");   // check if id is now defined
    expect(typeof student.id).toBe("string");   // check if id is type of string
});

test('Update a student ', () => {
    var student = new Student("1400000", "João José", "13-02-1990", "joao.jose@gmail.com", "myPhoto.png");
    expect(student.id).toBeUndefined();
    student.save();
    expect(student).toHaveProperty("id");
    expect(typeof student.id).toBe("string");
});