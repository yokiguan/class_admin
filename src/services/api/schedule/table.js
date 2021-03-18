import base from '../base'; // 导入接口域名列表
import axios from '../../axios'
const scheduleTask = base.root +'/a/scheduleTask'
const scheduleSyllabus = base.root +'/a/scheduleSyllabus'
const table={
    //总课表查看
    allTable(params) {
        return axios.get(`${scheduleTask}/searchAllSyllabus.json`,{params});
    },
    //按老师查看
    teacherTable(params) {
        return axios.get(`${scheduleTask}/searchAllSyllabusByTeacherId.json`,{params});
    },
    //按课程和班级查看课表
    courseClassTable(params) {
        return axios.get(`${scheduleTask}/getSyllabusBySubClass.json`,{params});
    },
    //课程班级列表树查看
    courseClasstree(params) {
        return axios.get(`${scheduleSyllabus}/getClassesList.json`,{params});
    },
    //场地课表查看
    placeTable(params) {
        return axios.get(`${scheduleTask}/getSyllabusBySubClass.json`,{params});
    },
}
export default table;
