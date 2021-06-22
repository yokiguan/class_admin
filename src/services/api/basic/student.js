/**
 * 学生管理模块接口列表
 * */
import base from '../base';    //导入接口域名列表
import axios from '../../axios';      //导入http中创建的axios实例
const baseUrl=base.root+'/a/basicSettingQuery'
const student={
    //指定人员查看(已测）
    fetchList(params){
        return axios.get(`${baseUrl}/getStudent.json`,{params});
    },
    //学生管理中的年级查看(已测）
    fetchGradeList(params){
        return axios.get(`${baseUrl}/getDepartTree.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
}
export default student;
