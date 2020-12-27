/*
* 选课统计模块接口列表
* */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'      //导入从http众创建的axios实例
const baseUrl1=base.root+'/a/scheduleResult'
const baseUrl2=base.root+'/a/scheduleStatics'
const baseUrl3=base.root+'/a/schedulePlan'
const statics={
    // 课程组合统计查看
    getSubjectCombination(params){
        return axios.get(`${baseUrl1}/subjectCombination.json`,{params});
    },
    //统计选课人数以及课程被选情况
    getStudentSelectNum(params){
        return axios.get(`${baseUrl2}/getStudentSelectSubNumberStatistic.json`,{params});
    },
    //修改选课时间
    alterTime(params){
        return axios.post(`${baseUrl3}/saveData.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //选课结果详情查看
    getResult(params){
        return axios.get(`${baseUrl2}/getSubContainsStu.json`,{params});
    },
    //选课结果详情删除
    delResult(params){
        return axios.post(`${baseUrl1}/deleteData.json`,params);
    },
    //修改选课结果-添加按钮-查询出的学生
    alterResultButtonFind(params){
        return axios.get(`${baseUrl2}/getArrangeStuInfo.json`,{params});
    },
    //修改选课结果-添加按钮-添加结果
    alterResultButtonResult(params){
        return axios.post(`${baseUrl1}/saveDataList.json`,params);
    }
}
export default statics

