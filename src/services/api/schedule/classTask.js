/*
* 走班排课任务模块接口列表
* */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'      //导入从http众创建的axios实例
const classroomSetting = base.root + '/a/classroomSetting'
const scheduleResult = base.root + '/a/scheduleResult'
const scheduleSyllabus = base.root + '/a/scheduleSyllabus'
const scheduleTask=base.root+'/a/scheduleTask'
const scheduleConflict=base.root+'/a/scheduleConflict'
const studentSyllabus=base.root+'/a/studentSyllabus'
const scheduleClass=base.root+'/a/scheduleClass'
const  classTask = {
    //走班排课任务查看(已调）
    getScheduleTask(params){
        return axios.get(`${scheduleTask}/getDataList.json`,{params});
    },
    //走班排课任务 删除(已调）
    deletScheduleTask(params){
        return axios.post(`${scheduleTask}/deleteDataJoint.json`,params);
    },
    //老师树形列表查询
    getTeacherList(params){
        return axios.get(`${scheduleSyllabus}/getTeacherList.json`,{params});
    },
    //教室树形列表查询(已调)
    getClassList(params){
        return axios.get(`${classroomSetting}/getClassroomList.json`,{params} );
    },
    //教室课表查看(已调）
    getClassroomList(params){
        return axios.get(`${scheduleSyllabus}/getDataSelectByClassroom.json`,{params} );
    },
    //学生列表查看(已调）
    getStudentList(params){
        return axios.get(`${scheduleResult}/getStudentList.json`,{params});
    },
    //按姓名查找学生(已调）
    getStudent(params) {
        return axios.get(`${scheduleResult}/getStudent.json`, {params});
    },
    //整体查看(已调）
    getData(params) {
        return axios.get(`${scheduleSyllabus}/getDataSelect.json`, {params});
    },
    //手动调课换课
    manualClass(){
        return axios.post(`${scheduleSyllabus}/updateSyllabus.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    },
    //冲突查看(已调）
    contrastLook(params){
        return axios.get(`${scheduleConflict}/getConflictList.json`,{params});
    },
    //学生调班（根据课程查看冲突信息）
    conflictInfo(params){
        return axios.get(`${scheduleSyllabus}/getConflictInfo.json`,{params});
    },
    //课程班级列表查询(已调）
    getCourseList(params){
        return axios.get(`${scheduleClass}/searchScheduleClassResult.json`,{params});
    },
    //课程课表查看(已调)
    courseLook(params){
        return axios.get(`${scheduleSyllabus}/getDataSelectBySubAndClass.json`,{params});
    },
    //学生课表查看(已调）
   studentLook(params){
        return axios.get(`${studentSyllabus}/getDataByStuId.json`,{params});
    },
}
export default  classTask


