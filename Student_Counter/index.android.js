/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from "react";
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from "react-native";

let Class = require("./src/lib/Class");
let Lesson = require("./src/lib/Lesson");
let Presence = require("./src/lib/Presence");
let Student = require("./src/lib/Student");
let Subject = require("./src/lib/Subject");
let Teacher = require("./src/lib/Teacher");
import CameraScreen from "./src/components/CameraScreen";
import HomeScreen from "./src/screens/HomeScreen";

let firebase = require("firebase");

//import * as firebase from 'firebase';

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCJO-fJa5dlYXKK1zy8bt4TxzwoniSvtsU",
    authDomain: "gpbitteam-59ca2.firebaseapp.com",
    databaseURL: "https://gpbitteam-59ca2.firebaseio.com",
    projectId: "gpbitteam-59ca2",
    storageBucket: "gpbitteam-59ca2.appspot.com",
    messagingSenderId: "571714718837"
});

export default class Student_Counter extends Component {


    componentWillMount() {

        this.init().then();
    }

    async init() {
        this.signup("artur_esteves1995@hotmail.com", "pw_test1");
        this.login("artur_esteves1995@hotmail.com", "pw_test1");
        //let student_artur = new Subject('140221076', 'Artur', 'Esteves');

        let teacher_jf = new Teacher("Joaquim Filipe", "joaquim.filipe@gmail.com", "13-12-1980", "myphoto");
        let teacher_jv = new Teacher("João Ventura", "joao.ventura@gmail.com", "13-12-1980", "myphoto");

        await teacher_jf.save();
        await teacher_jv.save();

        let student_ricardo = new Student("140221066", "Ricardo Morais", new Date().toISOString(), "moraispgsi@gmail.com", "src/image1");
        let student_bruno = new Student("140221067", "Bruno Batista", new Date().toISOString(), "batistamofo@gmail.com", "src/image2");

        await student_ricardo.save();
        await student_bruno.save();

        let subject_gp = new Subject("Gestão de Projeto", "GP", [teacher_jf.id, teacher_jv.id]);
        let subject_dbm = new Subject("Desenvolvimento Baseado em Modelos", "DBM", [teacher_jf.id]);

        await subject_gp.save();
        await subject_dbm.save();

        let clazz_1 = new Class("Class 1", [student_ricardo.number,student_bruno.number], [subject_gp.id, subject_dbm.id]);
        let clazz_2 = new Class("Class 2", [student_ricardo.number], [subject_dbm.id]);

        await clazz_1.save();
        await clazz_2.save();

        let lesson_gp_1 = new Lesson(teacher_jv.id, subject_gp.id, new Date().toISOString(), new Date().toISOString(), "src/image3", "sumário..");
        let lesson_gp_2 = new Lesson(teacher_jv.id, subject_gp.id, new Date().toISOString(), new Date().toISOString(), "src/image4", "sumário..");
        let lesson_gp_3 = new Lesson(teacher_jv.id, subject_gp.id, new Date().toISOString(), new Date().toISOString(), "src/image5", "sumário..");
        let lesson_gp_4 = new Lesson(teacher_jv.id, subject_gp.id, new Date().toISOString(), new Date().toISOString(), "src/image6", "sumário..");
        let lesson_dbm_1 = new Lesson(teacher_jf.id, subject_dbm.id, new Date().toISOString(), new Date().toISOString(), "src/image7", "sumário..");
        let lesson_dbm_2 = new Lesson(teacher_jf.id, subject_dbm.id, new Date().toISOString(), new Date().toISOString(), "src/image8", "sumário..");
        let lesson_dbm_3 = new Lesson(teacher_jf.id, subject_dbm.id, new Date().toISOString(), new Date().toISOString(), "src/image9", "sumário..");
        let lesson_dbm_4 = new Lesson(teacher_jf.id, subject_dbm.id, new Date().toISOString(), new Date().toISOString(), "src/image10", "sumário..");

        lesson_gp_1.save();
        lesson_gp_2.save();
        console.log("heheh", lesson_gp_2);
    /*    lesson_gp_3.save();
        lesson_gp_4.save();
        lesson_dbm_1.save();
        lesson_dbm_2.save();
        lesson_dbm_3.save();
        lesson_dbm_4.save();
*/

        // define the presences of a student in a class
        //TODO: marcar uma presença requer verificações do tipo: o aluno tem que estar inscrito na disciplina
        // Ou seja, é necessário obter a classe(turma) a que o aluno pertence e verificar se a turma tem aquela disciplina ou nao

     /*   let presence_ricardo_gp_lesson_1 = new Presence(student_ricardo.number, lesson_gp_1.id, true, true);
        let presence_ricardo_gp_lesson_2 = new Presence(student_ricardo.number, lesson_gp_2.id, false);
        let presence_ricardo_gp_lesson_3 = new Presence(student_ricardo.number, lesson_gp_3.id, true, true);
        let presence_ricardo_gp_lesson_4 = new Presence(student_ricardo.number, lesson_gp_4.id, true, false);
        let presence_ricardo_dbm_lesson_1 = new Presence(student_ricardo.number, lesson_dbm_1.id, true, true);
        let presence_ricardo_dbm_lesson_2 = new Presence(student_ricardo.number, lesson_dbm_2.id, false);
        let presence_ricardo_dbm_lesson_3 = new Presence(student_ricardo.number, lesson_dbm_3.id, false);
        let presence_ricardo_dbm_lesson_4 = new Presence(student_ricardo.number, lesson_dbm_4.id, false);

        presence_ricardo_gp_lesson_1.save();
        presence_ricardo_gp_lesson_2.save();
        presence_ricardo_gp_lesson_3.save();
        presence_ricardo_gp_lesson_4.save();
        presence_ricardo_dbm_lesson_1.save();
        presence_ricardo_dbm_lesson_2.save();
        presence_ricardo_dbm_lesson_3.save();
        presence_ricardo_dbm_lesson_4.save();

*/
        student_ricardo.getPresencesAsync(subject_gp.id).then(function(data){
           // console.log("GP assiduity :", data);
        });

        student_ricardo.getPresencesAsync(subject_dbm.id).then(function(data){
            //console.log("DBM assiduity :", data);
        });

        clazz_1.numberOfregisteredStudentsAsync().then(function(data){
            //console.log("number of students at class " + clazz_1.name +":",data);
        });

        Class.all().then(function(data){
            //console.log("all classes:",data);
        });

        Teacher.all().then(function (data) {
           // console.log("all teachers:", data);
        })

        Subject.all().then(function (data) {
           // console.log("all subjects:", data);
        })

        Student.all().then(function (data) {
           // console.log("all students:", data);
        })

        Presence.all().then(function (data) {
           // console.log("all presences:", data);
        })

        Lesson.all().then(function (data) {
           // console.log("all lessons:", data);
        })

        /*subject_gp.getLessonsAsync(function(data){
            console.log("All lessons of gp:", data);
        });*/

        this.logout();
    }

    // Signup Function
    async signup(email, pass) {
        try {
            await firebase.auth().createUserWithEmailAndPassword(email, pass);
            // console.log("Account Created");
        } catch (error) {
            //console.log(error.toString());
        }
    }

    // Login Function
    async login(email, pass) {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, pass);
            //  console.log("Logged In!");
        } catch (error) {
            // console.log(error.toString())
        }
    }

    // Logout Function
    async logout() {
        try {
            await firebase.auth().signOut();
        } catch (error) {
            // console.log(error);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <HomeScreen/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent('Student_Counter', () => Student_Counter);
