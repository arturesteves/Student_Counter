import React from 'react';
import {View, Text, TouchableHighlight} from "react-native";
import Header from "../components/Header"

export default class Metrics extends React.Component {

    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        drawerLabel: "Metrics",
    };
    teste(){
    let DownloadDir = RNFetchBlob.fs.dirs.DownloadDir;
    alert(DownloadDir);
    var data = [
        ["##########Students#########"],
        ["Student Name", "Student Age", "Student Email"],
        ["Daniel Matos", 21, "itsdanielmatos@gmail.com"]
    ];
    var workbook = XLSX.utils.book_new(); //Criar um book;
    var worksheet = XLSX.utils.aoa_to_sheet(data, {cellDates:true});
    XLSX.utils.book_append_sheet(workbook, worksheet, "SheetJS");
    var wopts = {bookType: "xlsx", bookSST:false, type:"base64"};
    var wbout = XLSX.write(workbook, wopts);
    let excelLocation = DownloadDir + '/' + "out.xlsx";
    RNFetchBlob.fs.writeFile(excelLocation, RNFetchBlob.base64.encode(wbout), "base64").then(()=>alert("works")).catch((err)=>alert(err))};
    render(){
        const { navigate } = this.props.navigation;
        return(
            <View>
                <Header navigate={navigate} text="Metrics"/>
                <TouchableHighlight onPress={() => this.teste()}>
                <Text>Metrics</Text>
                </TouchableHighlight>
            </View>
        )
    }
}
