import base from '../base'; // 导入接口域名列表
import axios from '../../axios'
const syllabusAdministrative = base.root +'/a/syllabusAdministrative'
const basicSettingQuery = base.root +'/a/basicSettingQuery'


const adminTask={
    //根据老师查看课表(已调)
    teacherTable(params) {
        return axios.get(`${syllabusAdministrative}/getDataSelectByTeacherId.json`,{params});
    },
    //根据班级查看课表
    classTable(params){
        return axios.get(`${syllabusAdministrative}/getSyllabusByClass.json`,{params});
    },
    //根据课程查看课表(已调)
    courseTable(params){
        return axios.get(`${syllabusAdministrative}/getSyllabusBySub.json`,{params});
    },
    //课程列表查看(已调)
    lookCourseList(params){
        return axios.get(`${syllabusAdministrative}/getSubjects.json`,{params});
    },
    //班级列表查看
    lookClassList(params){
        return axios.get(`${syllabusAdministrative}/getClasses.json`,{params});
    },
    //查看老师列表
    lookTeacher(params){
        return axios.get(`${basicSettingQuery}/getTeacherListSchedule.json`,{params});
    }


}
export default adminTask;

