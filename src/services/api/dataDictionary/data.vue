/*
* 数据字典模块接口列表
* */
import schedule from '.../schedule';    //导入接口域名列表
import axios from '../../axios'      //导入从http众创建的axios实例
//const baseUrl1 = base.root + '/a/scheduleSyllabus'
//const baseUrl2 = base.root + '/a/schedulePlan'
//const baseUrl3 = base.root + '/a/scheduleTeacher'
const plan = {
// 检查实体类是否为空
getStuCourse(params) {
return axios.get(`${baseUrl1}/getStuData.json`, params, {
'Content-Type': 'multipart/form-data'
});
}
}

