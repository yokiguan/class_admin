/*
* 选课统计模块接口列表
* */
import schedule from '.../schedule';    //导入接口域名列表
import axios from '../../axios'      //导入从http众创建的axios实例
const baseUrl1=base.root+'/a/scheduleResult'
const baseUrl2=base.root+'/a/scheduleStatics'
const baseUrl3=base.root+'/a/schedulePlan'
const plan={
    // 课程组合统计查看
    getsubjectCombination(params){
        return axios.get(`${baseUrl1}/subjectCombination.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //统计选课人数以及课程被选情况
    getStudentSelectNum(params){
        return axios.get(`${baseUrl2}/getStudentSelectSubNumberStatistic.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //修改选课时间
    alterTime(params){
        return axios.get(`${baseUrl3}/saveData.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //选课结果详情查看
    getResult(params){
        return axios.get(`${baseUrl2}/getSubContainsStu.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //选课结果详情删除
    delResult(params){
        return axios.get(`${baseUrl1}/deleteData.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //修改选课结果-添加按钮-查询出的学生
    alterResultButtonFind(params){
        return axios.get(`${baseUrl2}/getArrangeStuInfo.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //修改选课结果-添加按钮-添加结果
    alterResultButtonResult(params){
        return axios.get(`${baseUrl1}/saveDataList.json`,params, {
            'Content-Type': 'multipart/form-data'});
    }
}

