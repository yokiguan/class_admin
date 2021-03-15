/*
* 学生端选课模块接口列表
* */
import base from '../base';    //导入接口域名列表
import axios from '../../axios'      //导入从http众创建的axios实例
const scheduleSyllabus = base.root +'/a/scheduleSyllabus'
const schedulePlan= base.root + '/a/schedulePlan'
const baseUrl3 = base.root + '/a/scheduleTeacher'
const startChoose = {
    // 学生端选课课表查看（已测）(已调）
    getStuCourse(params){
        return axios.get(`${scheduleSyllabus}/getStuData.json`,params);
    },
    //开始选课修改（已测）(已调）
    alterCourseSelect(params){
        return axios.post(`${schedulePlan}/saveCourseSelectPhone.json`,params);
    },
    //开始选课查看（已测）(已调）
    getCourseSelect(params){
        return axios.get(`${schedulePlan}/getCourseSelectPhone.json`,params);
    },
    //添加课程/修改课程的查看接口（已测）(已调)
    getCourseStatus(params){
        return axios.get(`${baseUrl3}/getCourseStatus.json`,{params});
    },
    //规则说明查看（已测）(已调）
    getTips(params){
        return axios.get(`${schedulePlan}/getTipsPhone.json`,{params});
    }
}
export default startChoose;


