/**
 * curriculumBuildings模块接口列表
 */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'; // 导入http中创建的axios实例
const baseUrl=base.root+'/a/classroom'
// const ruleUrl=baseUrl+'Rule'
const classroom = {    
    // 查询全部教室的简要信息
    fetchList(params){
        return axios.get(`${baseUrl}/getDataListWithBuilding.json`,params, {
            'Content-Type': 'multipart/form-data'});    
    },

    // 查询指定教室信息，用于教室规则等的教室选择，编辑模板前，先查询模板信息，利用模板id
    fetchBuilding(params){
        return axios.get(`${baseUrl}/getDataInfo.json`,params, {
            'Content-Type': 'multipart/form-data'});    
    },

    // 教室新增接口
    saveBuilding(params){
        return axios.post(`${baseUrl}/saveData.json`,params, {
            'Content-Type': 'multipart/form-data'});    
    },

    // 教室删除接口
    deleteBuilding(params){
        return axios.get(`${baseUrl}/deleteData.json`,params, {
            'Content-Type': 'multipart/form-data'});   
    },

    // 
}

export default classroom;