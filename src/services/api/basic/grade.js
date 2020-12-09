/**
 * grade模块接口列表
 */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'; // 导入http中创建的axios实例
const baseUrl=base.root+'/a/admin'
const gradeUrl=base.root+'/a/grade'
const grade = {
    // 查询全部级部的简要信息
    fetchList(params){
        return axios.post(`${baseUrl}/getAdminGradeDataList.json`,params);
    },

    // 查询年级的简要信息
    fetchGradeList(params){
        return axios.get(`${gradeUrl}/getGradeDataList.json`,params);
    },

    // 查询指定年级信息
    fetchGrade(params){
        return axios.post(`${gradeUrl}/getGradeDataInfo.json`,params);
    },

    // 年级新增接口
    saveGrade(params){
        return axios.post(`${gradeUrl}/saveGradeSubjectData.json`,params);
    },

    // 年级删除接口
    deleteGrade(params){
        return axios.post(`${gradeUrl}/deleteGradeSubByGradeIds.json`,params);
    },

    // 年级子课程新增
    saveGradeSubject(params){
     return axios.post(`${gradeUrl}/insertSubToGrade.json`,params);
    },

    // 年级子课程删除
    deleteGradeSubject(params){
        return axios.post(`${gradeUrl}/deleteGradeSubChild.json`,params)
    },
}

export default grade;
