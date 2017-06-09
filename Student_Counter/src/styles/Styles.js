import {StyleSheet, Dimensions} from "react-native";

module.exports = StyleSheet.create({
    hamburger: {
        width:20,
        height:20,
        
    },
    hidden:{
        opacity:0
    },
    homeHeader: {
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginLeft:25,
        marginRight:25,
        marginTop:25
    },

    homeContent: {
        flexDirection:"column",
        marginLeft:35,
        marginRight:35,
    },

    twoCardsInRow:{
        flexDirection:"row",
        justifyContent:"space-between",
        width:(Dimensions.get("window").width - 70),
        marginTop:15
    },

    oneCardInRow:{
        marginTop:15
    },

    smallCard:{
        alignItems:"center",
        justifyContent:"center",
        width:(Dimensions.get("window").width -70 -12.5)/2,
        borderRadius:5,
        paddingTop:30,
        paddingBottom:30,
    },

    bigCard:{
        alignItems:"center",
        justifyContent:"center",
        width:(Dimensions.get("window").width -70),
        borderRadius:5,
        paddingTop:30,
        paddingBottom:30,
    },

    cardInner:{
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
    },

    cardImage:{
        width:75,
        height:75
    },

    cardTitle:{
        fontFamily:"MedulaOne",
        fontSize:25,
        color:"black",
        marginTop:10
    },

    headerTitle: {
        fontSize:30,
        fontFamily:"MedulaOne",
        color:"black",
    },

    drawer: {
        height:Dimensions.get("window").height,
        width:Dimensions.get("window").width * 3/4,
        marginTop:30
    },

    drawerHeader:{
        flexDirection:"column"
    },

    drawerIcon:{
        flexDirection:"row",
        justifyContent: "flex-end",
        marginRight:25
    },
    drawerUserInfo:{
        flexDirection:"row",
        alignItems:"center",
        marginTop:10,
        marginLeft:25,
        marginRight:25,
    },

    userInfoPic:{
        width:75,
        height:75,
        borderRadius:100
    },

    userAbout: {
        flexDirection:"column",
        marginLeft:20
    },

    userAboutName: {
        fontFamily:"MedulaOne",
        fontSize:30,
        color:"black"
    },

    userAboutOccupation:{
        fontSize:15,
    },

    drawerContent:{
        marginTop:30,
        flexDirection:"column",
    },

    drawerTab: {
        flexDirection:"row",
        alignItems:"center",
        marginLeft:47.5,
        marginBottom:7
    },

    drawerTabIcon: {
        width:30,
        height:30
    },

    drawerTabText: {
        fontSize:18,
        marginLeft:42.5,
        color:"black"
    },

    lessonContent: {
        flexDirection:"row",
        flexWrap:"wrap",
        marginTop:15,
        marginLeft:35,
        marginRight:35
    },

    lessonItem:{
        flexDirection:"column",
        width:(Dimensions.get("window").width -70 -12.5)/2,
        padding:10,
        borderRadius:4,
        marginBottom:12.5
    },

    lessonItemTime:{
        fontFamily:"MedulaOne",
        fontSize:30,
    },

    lessonItemDate:{
        fontFamily:"MedulaOne",
        fontSize:20,
    },

    lessonSubject:{
        marginTop:15,
        marginBottom:15,
        flexDirection:"row",
    },

    lessonSubjectImage:{
        width:25,
        height:25,
        marginRight:10,
    },

    lessonSubjectName:{
        fontSize:16,
    },

    lessonItemDelete:{
        width:25,
        height:25,
        alignSelf:"flex-end"
    },
    
    subjectContent: {
        flexWrap:"wrap",
        marginTop:15,
        marginLeft:35,
        marginRight:35,
    },

    subjectItem: {
        flexDirection:"row",
        justifyContent:"space-between",
        padding:10,
        borderRadius:4,
        marginBottom:12.5
    },

    subjectItemText: {
        fontSize:16,
        color:"black"
    },

    teacherContent: {
        marginTop:15,
        marginLeft:35,
        marginRight:35,
    },

    teacherImage: {
        height:200,
        width:200,
        borderRadius:200,
        alignSelf:"center",
        marginBottom:10,
        marginTop:50
    },

    teacherInfo: {
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        marginBottom:10
    },

    teacherInfoText:{
        fontFamily:"MedulaOne",
        fontSize:40,
        color:"black",
        marginRight:15,
    },

    teacherNumbers:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        marginTop:20
    },

    teacherNumberIcon:{
        width:40,
        height:40
    },

    teacherNumberText:{
        fontSize:20,
        color:"black"
    }
})