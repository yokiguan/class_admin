/*
* 选课分班模块接口列表
* */
import base from '../base';    //导入接口域名列表
import axios from '../../axios'      //导入从http众创建的axios实例
const scheduleCourse=base.root+'/a/scheduleCourse'
const scheduleTeacherClass=base.root+'/a/scheduleTeacherClass'
const scheduleTeacher=base.root+'/a/scheduleTeacher'
const schedulePlan=base.root+'/a/schedulePlan'
const subjectChild=base.root+'/a/subjectChild'
const sortClass={
    // 选课分班查看(已调)
    classGet(params){
        return axios.get(`${scheduleCourse}/getCourseClassList.json`,{params});
    },
    //选课分班修改(已测）(已调)
    classAlter(params){
        return axios.post(`${scheduleTeacherClass}/updateDataBoth.json`,params);
    },
    //选课分班删除(已测）(已调)
    classDelete(params){
        return axios.post(`${scheduleCourse}/deleteClass.json`,params);
    },
    //自动分班查看(已调)
    classAutoGet(params){
        return axios.get(`${scheduleCourse}/getAutoDivideList.json`,{params});
    },
    //自动分班修改(已调）
    classAutoAlter(params){
        return axios.post(`${scheduleCourse}/saveDataList.json`,params,);
    },
    //自动分班 查看已选教师列表(已测）(已调)
    classGetTeacherlist(params){
        return axios.get(`${scheduleTeacher}/getDataListBySubPlan.json`,{params});
    },
    //自动分班 教师列表的修改和新增(已调）
    classAlterTeacherlist(params){
        return axios.get(`${scheduleCourse}/saveTeacher.json`,params);
    },
    //自动分班 删除教师(已测）(已调）
    classDeleteTeacher(params){
        return axios.post(`${scheduleCourse}/deleteTeacher.json`,params);
    },
    //可选教室数量 查看(已测）
    classGetroomNum(params){
        return axios.post(`${schedulePlan}/getClassroomNum.json`,params);
    },
    //可选教室 修改(已测）
    classAlterroomNum(params){
        return axios.post(`${schedulePlan}/saveClassroomNum.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //手动分班查看(已测）
    classGetManual(params){
        return axios.get(`${scheduleCourse}/getDataDivide.json`,{params});
    },
    //手动分班修改班级(已测）
    classAlterManual(params){
        return axios.post(`${scheduleTeacherClass}/updateDataBoth.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //手动分班 添加班级(已测）
    classAddManual(params){
        return axios.post(`${scheduleTeacherClass}/saveClass.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //手动分班 删除班级(已测）
    classDeleteManual(params){
        return axios.post(`${scheduleCourse}/deleteClass.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //手动分班 添加学生(已测）
    classAddstuManual(params){
        return axios.post(`${scheduleCourse}/saveStudent`,params);
    },
    //手动分班 删除学生(已测）
    classDeletestuManual(params){
        return axios.post(`${scheduleCourse}/deleteStudent.json`,params);
    },
    //清空(已测）
    classDeleteAll(params){
        return axios.post(`${scheduleCourse}/deleteStudent`,params);
    },
    //查看未分班人数（总）(已测）
    classGetUnscheduledNum(params){
        return axios.get(`${schedulePlan}/getUnscheduledNum.json`,{params});
    },
    //新增教师 查看教师列表(已测)(已调)
    classGetTeacherList(params){
        return axios.get(`${subjectChild}/searchTeacherSubject.json`,{params});
    },
    //自动分班 搜索教师(已测)
    classSearchTeacher(params){
        return axios.get(`${subjectChild}/searchTeacher.json`,{params});
    },
    //自动分班算法(已测)
    classSaveResult(params){
        return axios.post(`${scheduleCourse}/saveDivideResult.json`,params);
    },
    //统一设置最大人数(已调)
    settingMaxNum(params){
        return axios.post(`${scheduleCourse}/saveMaxPeople.json`,params);
    },
    //统一设置课时数(已调)
    settingTimeNum(params){
        return axios.post(`${scheduleCourse}/saveLessonNum.json`,params);
    },
    //自动分班清除教师(已调)
    clearTeacher(params){
      return axios.post(`${scheduleCourse}/deleteTeachers.json`,params);
    },
}
export default sortClass;

