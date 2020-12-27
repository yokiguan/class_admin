/*
* 选课排课模块接口列表
* */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'      //导入从http众创建的axios实例
const baseUrl1=base.root+'/a/schedulePlan'
const baseUrl2 = base.root + '/a/classroomSetting'
const baseUrl3 = base.root + '/a/scheduleTeacherClass'
const baseUrl4 = base.root + '/a/courseRule'
const arrangeClass={
    // 选课排课 课时设置保存
    saveCoursetime(params){
        return axios.post(`${baseUrl1}/saveData.json`,params);
    },
    //课节设置保存
    saveLesson(params){
        return axios.post(`${baseUrl1}/saveSelectLessonData.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    // 课程设置 列表信息查看(接口有问题）
    getList(params){
        return axios.get(`${baseUrl1}/getClassTeaDataList.json`,params);
    },
    // 排课计划查看
    getSchedulePlan(params){
        return axios.get(`${baseUrl1}/getDataList.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    deleteSchedulePlan(params){
        return axios.get(`${baseUrl1}/deleteData.json`,{params:params})
    },
    //教室设置查看
    getClass(params){
        return axios.get(`${baseUrl2}/getDatasList.json`,params);
    },
    //教室设置保存
    saveClass(params){
        return axios.post(`${baseUrl2}/saveData.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //课程设置保存/修改
    saveCoursesetting(params){
        return axios.post(`${baseUrl3}/saveDatas.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //互斥设置,同时上课,禁止相邻查看
    banGetting(params) {
        return axios.get(`${baseUrl4}/getDataList.json`, params, {
            'Content-Type': 'multipart/form-data'});
    },
    //互斥设置,同时上课,禁止相邻 新增/修改(前端获取数据时存在问题）
    banAdding(params) {
        return axios.post(`${baseUrl4}/saveDatas.json`, params);
    },
    //互斥设置,同时上课,禁止相邻删除
    banDeleting(params) {
        return axios.get(`${baseUrl4}/deleteData.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },

    //课节设置 查看
    getLesson(params) {
        return axios.get(`${baseUrl1}/getSelectLessonDataInfo.json`, {params});
    }
}
export default arrangeClass

