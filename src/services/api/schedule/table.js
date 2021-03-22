import base from '../base'; // 导入接口域名列表
import axios from '../../axios'
const scheduleTask = base.root +'/a/scheduleTask'
const scheduleSyllabus = base.root +'/a/scheduleSyllabus'
const studentSyllabus=base.root+'/a/studentSyllabus'
const table={
    //总课表查看(已调)
    allTable(params) {
        return axios.get(`${scheduleTask}/searchAllSyllabus.json`,{params});
    },
    //按老师查看(已调)
    teacherTable(params) {
        return axios.get(`${scheduleTask}/searchAllSyllabusByTeacherId.json`,{params});
    },
    //按课程和班级查看课表
    courseClassTable(params) {
        return axios.get(`${scheduleSyllabus}/getSyllabusBySubClass.json`,{params});
    },
    //课程班级列表树查看(已调)
    courseClasstree(params) {
        return axios.get(`${scheduleSyllabus}/getClassesList.json`,{params});
    },
    //场地课表查看(已调)
    placeTable(params) {
        return axios.get(`${scheduleSyllabus}/getSyllabusByClassroom.json`,{params});
    },
    //按学生查看
    studentTable(params){
        return axios.get(`${studentSyllabus}/getFinalSyllabusByStuId.json`,{params});
    }
}
export default table;
