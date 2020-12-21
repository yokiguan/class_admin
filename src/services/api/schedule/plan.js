/*
* 排课计划模块接口列表
* */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'      //导入从http众创建的axios实例
const baseUrl=base.root+'/a/schedulePlan'
const baseUrl2=base.root+'/a/qualifiedStudent'
const plan={
    // 新增/修改排课计划
    scheduleAdd(params){
        return axios.get(`${baseUrl}/saveData.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //排课计划删除
    scheduleDelete(params){
        return axios.get(`${baseUrl}/deleteData.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //排课计划查看（全部）
    schedulegetList(params){
        return axios.get(`${baseUrl}/getDataList.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //排课计划查看（单个）
    schedulegetInfo(params){
        return axios.get(`${baseUrl}/getDataInfo.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //发布选课查看学生
    scheduleDistribute(params){
        return axios.get(`${baseUrl}/getDistribute.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //发布选课
    schedulesaveQua(params){
        return axios.post(`${baseUrl2}/saveQualification.json`,params, {
            'Content-Type': 'multipart/form-data'});
    }
}
export default plan

