/**
 * curriculumBuildings模块接口列表
 */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'; // 导入http中创建的axios实例
const baseUrl=base.root+'/a/classroom'
const ruleUrl=baseUrl+'Rule'
const baseRoomUrl=base.root+'a/classroomRule'
const classroom = {
    // 查询全部教室的简要信息(已调）
    fetchList(params){
        return axios.get(`${baseUrl}/getDataListWithBuilding.json`,{params});
    },
    // 查询指定教室信息，用于教室规则等的教室选择，编辑模板前，先查询模板信息，利用模板id(已调）
    fetchBuilding(params){
        return axios.get(`${baseUrl}/getDataInfo.json`,params);
    },
    // 教室新增接口(已调）
    saveClassRoom(params){
        return axios.post(`${baseUrl}/saveData.json`,params);
    },
    // 教室删除接口(已调）
    deleteBuilding(params){
        return axios.post(`${baseUrl}/deleteData.json`,params);
    },
    // 场地规则列表查看
    fetchRuleList(params){
     return axios.get(`${ruleUrl}/getDataListByCurrId.json`,{params});
    },
    // 场地规则项查看
    fetchRule(params){
        return axios.get(`${ruleUrl}/getDataListByCurrId.json`,params)
    },

    // 场地规则删除
    deleteRule(params){
        return axios.post(`${baseRoomUrl}/deleteDataJoint.json`,{params});
    },

    // 场地规则新增编辑
    saveRule(params){
        return axios.post(`${ruleUrl}/saveDataJoint.json`,params)
    },
    // 教室树(已调）
    fetchRoomList(params){
        return axios.get(`${ruleUrl}/getClassroomList.json`,params)
    }
}

export default classroom;
