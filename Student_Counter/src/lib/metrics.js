import Class from "./Class";
import Lesson from "./Lesson";
import Presence from "./Presence";
import Student from "./Student";
import RNFetchBlob from 'react-native-fetch-blob';
import XLSX from "xlsx";

const worksheetHeaders = {
    class: "##########Class##########",
    lesson:"##########Lesson##########",
    presence:"##########Presence##########",
    student:"##########Student##########",
    teacher:"##########Teacher##########"
}

function Metrics(teacherId){
    
    let teacher = teacherId;

    function getClassMetrics(){}
    function getLessonMetrics(){}
    function getPresenceMetrics(){}
    function getStudentMetrics(){}
    function getTeacherMetrics(){}

    function writeFile(){
    }

    function getMetrics(){
        
    }
}

module.exports = Metrics;
