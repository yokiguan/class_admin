/*
* 选课分班模块接口列表
* */
import base from '../base';    //导入接口域名列表
import axios from '../../axios'      //导入从http众创建的axios实例
const baseUrl1=base.root+'/a/scheduleCourse'
const baseUrl2=base.root+'/a/scheduleTeacherClass'
const baseUrl3=base.root+'/a/scheduleTeacher'
const baseUrl4=base.root+'/a/schedulePlan'
const baseUrl5=base.root+'/a/subjectChild'
const sortClass={
    // 选课分班查看
    classGet(params){
        return axios.get(`${baseUrl1}/getCourseClassList.json`,{params});
    },
    //选课分班修改
    classAlter(params){
        return axios.post(`${baseUrl2}/updateDataBoth.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //选课分班删除
    classDelete(params){
        return axios.post(`${baseUrl1}/deleteClass.json`,params, );
    },
    //自动分班查看
    classAutoGet(params){
        return axios.get(`${baseUrl1}/getAutoDivideList.json`,{params});
    },
    //自动分班修改
    classAutoAlter(params){
        return axios.post(`${baseUrl1}/saveDataList.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //自动分班 查看已选教师列表
    classGetTeacherlist(params){
        return axios.get(`${baseUrl3}/getDataListBySubPlan`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //自动分班 教师列表的修改和新增（待重做）
    classAlterTeacherlist(params){
        return axios.get(`${baseUrl1}/saveTeacher.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //自动分班 删除教师
    classDeleteTeacher(params){
        return axios.post(`${baseUrl1}/deleteTeacher.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //可选教室数量 查看
    classGetroomNum(params){
        return axios.post(`${baseUrl4}/getClassroomNum.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //可选教室 修改(网页写的地址是/schedulePlan/a)
    classAlterroomNum(params){
        return axios.post(`${baseUrl4}/saveClassroomNum.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //手动分班查看
    classGetManual(params){
        return axios.get(`${baseUrl1}/getDataDivide.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //手动分班修改班级
    classAlterManual(params){
        return axios.get(`${baseUrl2}/updateDataBoth.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //手动分班 添加班级
    classAddManual(params){
        return axios.post(`${baseUrl2}/updateDataBoth.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //手动分班 删除班级
    classDeleteManual(params){
        return axios.post(`${baseUrl2}/deleteClass.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //手动分班 添加学生(无后缀？）
    classAddstuManual(params){
        return axios.post(`${baseUrl1}/saveStudent`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //手动分班 删除学生(和添加学生的目录不一样)
    classDeletestuManual(params){
        return axios.post(`${baseUrl2}/deleteStudent.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //清空(无后缀)
    classDeleteAll(params){
        return axios.post(`${baseUrl1}/deleteAll`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //查看未分班人数（总）
    classGetUnscheduledNum(params){
        return axios.post(`${baseUrl4}/getUnscheduledNum.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //新增教师 查看教师列表
    classGetTeacherList(params){
        return axios.post(`${baseUrl5}/searchTeacherSubject.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //自动分班 搜索教师
    classSearchTeacher(params){
        return axios.post(`${baseUrl5}/searchTeacher.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //自动分班算法
    classSaveResult(params){
        return axios.post(`${baseUrl1}/saveDivideResult.json`,params, {
            'Content-Type': 'multipart/form-data'});
    }
}
export default sortClass;

