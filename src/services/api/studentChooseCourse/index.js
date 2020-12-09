/*
* 学生端选课模块接口列表
* */
import schedule from '.../schedule';    //导入接口域名列表
import axios from '../../axios'      //导入从http众创建的axios实例
const baseUrl1 = base.root +'/a/scheduleSyllabus'
const baseUrl2 = base.root + '/a/schedulePlan'
const baseUrl3 = base.root + '/a/scheduleTeacher'
const plan = {
    // 学生端选课课表查看（已测）
    getStuCourse(params){
        return axios.get(`${baseUrl1}/getStuData.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //开始选课修改（已测）
    alterCourseSelect(params){
        return axios.get(`${baseUrl2}/saveCourseSelect.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //开始选课查看（已测）
    getCourseSelect(params){
        return axios.get(`${baseUrl2}/getCourseSelect.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //添加课程/修改课程的查看接口（已测）
    getCourseStatus(params){
        return axios.get(`${baseUrl3}/getCourseStatus.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //规则说明查看（已测）
    getTips(params){
        return axios.get(`${baseUrl2}/getTips.json`,params, {
            'Content-Type': 'multipart/form-data'});
    }
    //矫正规则说明查看
}


