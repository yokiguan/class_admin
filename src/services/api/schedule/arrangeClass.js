/*
* 选课排课模块接口列表
* */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'      //导入从http众创建的axios实例
const baseUrl1=base.root+'/a/schedulePlan'
const baseUrl2 = base.root + '/a/classroomSetting'
const baseUrl3 = base.root + '/a/scheduleTeacherClass'
const baseUrl4 = base.root + '/a/courseRule'
const startBaseUrl=base.root + '/a/scheduleTask'
const classroomUrl=base.root+'/a/classroomSetting'
const arrangeClass={
    // 选课排课 课时设置保存(已调）
    saveCoursetime(params){
        return axios.post(`${baseUrl1}/saveData.json`,params);
    },
    //课节设置保存(已调）
    saveLesson(params){
        return axios.post(`${baseUrl1}/saveSelectLessonData.json`,params);
    },
    // 课程设置 列表信息查看(查看）
    getList(params){
        return axios.get(`${baseUrl1}/getClassTeaDataList.json`,{params});
    },
    //教室设置查看(已调）
    getClass(params){
        return axios.get(`${baseUrl2}/getDatasList.json`,{params});
    },
    //教室设置保存(已调）
    saveClass(params){
        return axios.post(`${baseUrl2}/saveClassRoomSettingData.json`,params);
    },
    //课程设置保存/修改
    saveCoursesetting(params){
        return axios.post(`${baseUrl3}/saveDatas.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //互斥设置,同时上课,禁止相邻 新增/修改(已调）
    banAdding(params) {
        return axios.post(`${baseUrl4}/saveDatas.json`, params);
    },
    //互斥设置,同时上课,禁止相邻查看(已调）
    banGetting(params) {
        return axios.get(`${baseUrl4}/getDataList.json`, {params});
    },
    //互斥设置,同时上课,禁止相邻删除(已调）
    banDeleting(params) {
        return axios.get(`${baseUrl4}/deleteData.json`, {params});
    },
    //课节设置 查看(已调）
    getLesson(params) {
        return axios.get(`${baseUrl1}/getSelectLessonDataInfo.json`, {params});
    },
    // 开始排课 保存/修改(已调）
    updateSchedule(params){
        return axios.post(`${startBaseUrl}/saveData.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //添加教室(选中教室信息查看)(已调）
    addClassRoom(params){
        return axios.get(`${classroomUrl}/getClassRoomDatas.json`,{params});
        },
    //课时设置查看(已调）
    timeLookInfo(params){
        return axios.get(`${baseUrl1}/getDataInfo.json`,{params});
    },
}
export default arrangeClass

