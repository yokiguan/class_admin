/**
 * curriculumBuildings模块接口列表
 */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'; // 导入http中创建的axios实例
const baseUrl=base.root+'/a/building'
const building = {
    // 查询全部教学楼的简要信息
    fetchList(params){
        return axios.get(`${baseUrl}/getDataList.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },

    // 查询指定教学楼信息，用于教室规则等的教学楼选择，编辑模板前，先查询模板信息，利用模板id
    fetchBuilding(params){
        return axios.get(`${baseUrl}/getDataInfo.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    // 教学楼新增接口
    saveBuilding(params){
        return axios.post(`${baseUrl}/saveData.json`,params);
    },
    // 教学楼删除接口
    deleteBuilding(params){
        return axios.post(`${baseUrl}/deleteData.json`,params);
    }
}

export default building;
