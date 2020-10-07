/**
 * teacher模块接口列表
 */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'; // 导入http中创建的axios实例
const baseUrl=base.root+'/a/teacherRule'
const teacher = {    
    // 查询全部教师时间规则的
    fetchList(params){
        return axios.get(`${baseUrl}/getData.json`,params);    
    },

    // 查询指定教师时间规则
    fetchRule(params){
        return axios.get(`${baseUrl}/searchData.json`,params);    
    },

    // 教师时间规则新增接口
    saveRule(params){
        return axios.get(`${baseUrl}/saveOneData.json`,params);    
    },

    // 教师时间规则删除接口
    deleteRule(params){
        return axios.get(`${baseUrl}/deleteData.json`,params);   
    },
}

export default teacher;