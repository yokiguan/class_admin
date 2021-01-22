/*
* 排课计划模块接口列表
* */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'      //导入从http众创建的axios实例
const baseUrl=base.root+'/a/schedulePlan'
const baseUrl2=base.root+'/a/qualifiedStudent'
const tableUrl=base.root+'a/tabTermInfo'
const plan={
    //学期信息查看（已测）
    termInfo(params){
        return axios.get(`${tableUrl}/getTermList.json`,params);
    },
    // 新增/修改排课计划（已调）
    saveCoursetime(params){
        return axios.post(`${baseUrl}/saveData.json`,params);
    },
    //排课计划删除（已调）
    deleteSchedulePlan(params){
        return axios.get(`${baseUrl}/deleteData.json`,{params:params})
    },
    //排课计划查看（全部）（已调）
    getSchedulePlan(params){
        return axios.get(`${baseUrl}/getDatasList.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //排课计划查看（单个）（已调）
    schedulegetInfo(params){
        return axios.get(`${baseUrl}/getDataInfo.json`,{params});
    },
    //发布选课查看学生(已调）
    scheduleDistribute(params){
        return axios.get(`${baseUrl}/getDistribute.json`,{params});
    },
    //发布选课(已调）
    schedulesaveQua(params){
        return axios.post(`${baseUrl2}/publishSelection.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
}
export default plan

