/*
* 行政班排课模块接口列表
* */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'      //导入从http众创建的axios实例
const scheduleCourse = base.root +'/a/scheduleCourse'
const scheduleTeacherClass = base.root + '/a/scheduleTeacherClass'
const xzbRuleSetting = base.root + '/a/xzbRuleSetting'
const xzbRuleBanAdjacent = base.root + '/a/xzbRuleBanAdjacent'
const xzbRuleSingleDoubleLesson = base.root + '/a/xzbRuleSingleDoubleLesson'
const schedulePlan=base.root+'/a/schedulePlan/'
const basicSettingQuery=base.root+'/a/basicSettingQuery/'
const scheduleSyllabus=base.root+'/a/scheduleSyllabus'
const scheduleTask=base.root+'/a/scheduleTask'
const adminClass = {
    //行政班排课查看
    //行政班排课修改
    //课节设置修改
    saveTime(params){
        return axios.post(`${schedulePlan}/saveXZBSelectLessonData.json`, params);
    },
    //走班课位置查看
    searchLocation(params){
        return axios.get(`${scheduleSyllabus}/getZouBanPosition.json`, {params});
    },
   //课节设置查看(已调）
    getLesson(params) {
        return axios.get(`${schedulePlan}/getDataInfo.json`, {params});
    },
    // 学科设置查看(已调）
    getCourseSetting(params){
        return axios.get(`${scheduleCourse}/getClassSettingDataList.json`,{params});
    },
    //学科设置删除(已调）
    deleteCourseSetting(params){
        return axios.post(`${scheduleCourse}/deleteData.json`,params);
    },
    //学科设置新增/修改(已调）
    addCourseSetting(params){
        return axios.post(`${scheduleCourse}/saveData.json`,params);
    },
    //班级设置查看(已调）
    getClassSetting(params){
        return axios.get(`${scheduleTeacherClass}/getClassSettingDataList.json`,{params});
    },
    //班级设置修改/新增(已调)
    addClassSetting(params){
        return axios.post(`${scheduleTeacherClass}/saveData.json`,params);
    },
    //班级设置删除(已调）
    deleteCoursesetting(params){
        return axios.post(`${scheduleTeacherClass}/deleteData.json`,params);
    },
    //教师设置查找老师
    searchTeacher(params){
        return axios.get(`${basicSettingQuery}/getTecByGradeId.json`,{params});
    },
    //规则设置-学科时间规则查看(已调）
    searchSubjectTimeRule(params) {
        return axios.get(`${xzbRuleSetting}/searchXzbSubjectTimeRule.json`, {params});
    },
    //规则设置-教师时间规则查看(已调）
    searchTeacherTimeRule(params) {
        return axios.get(`${xzbRuleSetting}/searchXzbTeacherTimeRule.json`,{params});
    },
    //规则设置-班级时间规则设置(已调）
    searchClassTimeRule(params) {
        return axios.get(`${xzbRuleSetting}/searchXzbClassTimeRule.json`, {params});
    },
    //添加/修改规则设置(已调)
    addRuleSetting(params) {
        return axios.post(`${xzbRuleSetting}/saveData.json`, params);
    },
    //删除时间规则(已调)
    deleteRule(params) {
        return axios.post(`${xzbRuleSetting}/deleteData.json`, params);
    },
    //规则设置-查询禁止相邻规则(已调）
    searchBanRule(params) {
        return axios.get(`${xzbRuleBanAdjacent}/searchXzbBanAdjacentRule.json`, {params});
    },
    //禁止相邻规则新增和更新(已调)
    addBanRule(params) {
        return axios.post(`${xzbRuleBanAdjacent}/saveData.json`, params);
    },
    //禁止相邻规则删除(已调)
    deleteBanRule(params) {
        return axios.post(`${xzbRuleBanAdjacent}/deleteData.json`, params);
    },
    //规则设置-查看单双周课程规则(已调)
    searchLessonRule(params) {
        return axios.get(`${xzbRuleSingleDoubleLesson}/searchXzbSingleDoubleLessonRule.json`,{params});
    },
    //单双周课程规则新增/修改(已调)
    addLessonRule(params) {
        return axios.post(`${xzbRuleSingleDoubleLesson}/saveData.json`, params);
    },
    //单双周课程规则删除(已调)
    deleteLessonRule(params) {
        return axios.post(`${xzbRuleSingleDoubleLesson}/deleteData.json`, params);
    },
    //保存之后设置行政班排课算法
    continueClass(params){
        return axios.get(`${scheduleTask}/saveXzbAlgorithm.json`, {params});
    }
}
export default adminClass;

