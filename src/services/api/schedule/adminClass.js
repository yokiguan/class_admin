/*
* 行政班排课模块接口列表
* */
import schedule from '.../schedule';    //导入接口域名列表
import axios from '../../axios'      //导入从http众创建的axios实例
const baseUrl1 = base.root +'/a/scheduleCourse'
const baseUrl2 = base.root + '/a/scheduleTeacherClass'
const baseUrl3 = base.root + '/a/xzbRuleSetting'
const baseUrl4 = base.root + '/a/xzbRuleBanAdjacent'
const baseUrl5 = base.root + '/a/xzbRuleSingleDoubleLesson'
const plan = {
    //行政班排课查看
    //行政班排课修改

    // 学科设置查看
    getCourseSetting(params){
        return axios.get(`${baseUrl1}/getDataList.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //学科设置删除
    deleteCourseSetting(params){
        return axios.get(`${baseUrl1}/deleteData.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //学科设置新增/修改
    addCourseSetting(params){
        return axios.get(`${baseUrl1}/saveData.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //班级设置查看
    getClassSetting(params){
        return axios.get(`${baseUrl2}/getClassSettingDataList.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //班级设置修改/新增
    addClassSetting(params){
        return axios.get(`${baseUrl2}/saveData.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //班级设置删除
    deleteCoursesetting(params){
        return axios.get(`${baseUrl2}/deleteData.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //规则设置-学科时间规则查看
    searchSubjectTimeRule(params) {
        return axios.get(`${baseUrl3}/searchXzbSubjectTimeRule.json`, params, {
            'Content-Type': 'multipart/form-data'});
    },
    //规则设置-教师时间规则查看
    searchTeacherTimeRule(params) {
        return axios.get(`${baseUrl3}/searchXzbTeacherTimeRule.json`, params, {
            'Content-Type': 'multipart/form-data'});
    },
    //规则设置-班级时间规则设置
    searchClassTimeRule(params) {
        return axios.get(`${baseUrl3}/searchXzbClassTimeRule.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },
    //添加/修改规则设置
    addRuleSetting(params) {
        return axios.get(`${baseUrl3}/saveData.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },
    //删除时间规则
    deleteRule(params) {
        return axios.get(`${baseUrl3}/deleteData.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },
    //规则设置-查询禁止相邻规则
    searchBanRule(params) {
        return axios.get(`${baseUrl4}/searchXzbBanAdjacentRule.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },
    //禁止相邻规则新增和更新
    addBanRule(params) {
        return axios.get(`${baseUrl4}/saveData.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },
    //禁止相邻规则删除
    deleteBanRule(params) {
        return axios.get(`${baseUrl4}/deleteData.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },
    //规则设置-查看单双周课程规则
    searchLessonRule(params) {
        return axios.get(`${baseUrl5}/searchXzbSingleDoubleLessonRule.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },
    //单双周课程规则新增/修改
    addLessonRule(params) {
        return axios.get(`${baseUrl5}/saveData.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },
    //单双周课程规则删除
    deleteLessonRule(params) {
        return axios.get(`${baseUrl5}/deleteData.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    }
}

