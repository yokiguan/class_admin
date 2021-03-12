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
const adminClass = {
    //行政班排课查看
    //行政班排课修改
   //课节设置查看
    getLesson(params) {
        return axios.get(`${schedulePlan}/getDataInfo.json`, {params});
    },
    // 学科设置查看(已调）
    getCourseSetting(params){
        return axios.get(`${scheduleCourse}/getDataList.json`,{params});
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
    //班级设置修改/新增
    addClassSetting(params){
        return axios.post(`${scheduleTeacherClass}/saveData.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //班级设置删除(已调）
    deleteCoursesetting(params){
        return axios.post(`${scheduleTeacherClass}/deleteData.json`,params);
    },
    //规则设置-学科时间规则查看(已调）
    searchSubjectTimeRule(params) {
        return axios.get(`${xzbRuleSetting}/searchXzbSubjectTimeRule.json`, {params});
    },
    //规则设置-教师时间规则查看(已调)
    searchTeacherTimeRule(params) {
        return axios.get(`${xzbRuleSetting}/searchXzbTeacherTimeRule.json`,{params});
    },
    //规则设置-班级时间规则设置
    searchClassTimeRule(params) {
        return axios.get(`${xzbRuleSetting}/searchXzbClassTimeRule.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },
    //添加/修改规则设置
    addRuleSetting(params) {
        return axios.post(`${xzbRuleSetting}/saveData.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },
    //删除时间规则
    deleteRule(params) {
        return axios.post(`${xzbRuleSetting}/deleteData.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },
    //规则设置-查询禁止相邻规则
    searchBanRule(params) {
        return axios.post(`${xzbRuleBanAdjacent}/searchXzbBanAdjacentRule.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },
    //禁止相邻规则新增和更新
    addBanRule(params) {
        return axios.post(`${xzbRuleBanAdjacent}/saveData.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },
    //禁止相邻规则删除
    deleteBanRule(params) {
        return axios.post(`${xzbRuleBanAdjacent}/deleteData.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },
    //规则设置-查看单双周课程规则
    searchLessonRule(params) {
        return axios.post(`${xzbRuleSingleDoubleLesson}/searchXzbSingleDoubleLessonRule.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },
    //单双周课程规则新增/修改
    addLessonRule(params) {
        return axios.post(`${xzbRuleSingleDoubleLesson}/saveData.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },
    //单双周课程规则删除
    deleteLessonRule(params) {
        return axios.post(`${xzbRuleSingleDoubleLesson}/deleteData.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    }
}
export default adminClass;

