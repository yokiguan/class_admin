/*
* 走班排课任务模块接口列表
* */
import schedule from '.../schedule';    //导入接口域名列表
import axios from '../../axios'      //导入从http众创建的axios实例
const baseUrl1 = base.root +'/a/schedulePlan'
const baseUrl2 = base.root + '/a/scheduleTeacher'
const baseUrl3 = base.root + '/a/classroomSetting'
const baseUrl4 = base.root + '/a/scheduleTeacherClass'
const baseUrl5 = base.root + '/a/scheduleResult'
const baseUrl6 = base.root + '/a/scheduleSyllabus'
const plan = {
    // 开始排课 保存/修改
    updateSchedule(params){
        return axios.get(`${baseUrl1}/updateSchedule.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //走班排课任务页面
    getScheduleTask(params){
        return axios.get(`${baseUrl1}/getScheduleTask.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //走班排课任务 删除（待做）
    //老师树形列表查询
    getTeacherList(params){
        return axios.get(`${baseUrl2}/getTeacherList.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //教室树形列表查询
    getClassList(params){
        return axios.get(`${baseUrl3}/getClassroomList.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //课程列表查询
    getCourseList(params){
        return axios.get(`${baseUrl4}/getClassList.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //学生列表查看
    getStudentList(params){
        return axios.get(`${baseUrl5}/getStudentList.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //按姓名查找学生
    getStudent(params) {
        return axios.get(`${baseUrl5}/getStudent.json`, params, {
            'Content-Type': 'multipart/form-data'});
    },
    //整体/按老师/按教室/按课程/按学生/按班级查看
    getData(params) {
        return axios.get(`${baseUrl6}/getDataSelect.json`, params, {
            'Content-Type': 'multipart/form-data'});
    },
    //学生调班查看
    getStudentResult(params) {
        return axios.get(`${baseUrl5}/getStudentResult.json`, params, {
            'Content-Type': 'multipart/form-data'
        });
    }
    //冲突查看
    //学生调班
    //手动调课查看
    //手动调课修改（需讨论）
}


