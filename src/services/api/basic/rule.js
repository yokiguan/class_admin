/**
 * rule模块接口列表
 */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'; // 导入http中创建的axios实例
const baseUrl=base.root+'/a/selectionRule'
const detailUrl=baseUrl+'Detail'
const rule = {
    // 查询全部规则
    fetchList(params){
        return axios.get(`${baseUrl}/getDataList.json`,params);
    },

    // 查询指定规则
    fetchRule(params){
        return axios.get(`${detailUrl}/getDetailDataList.json`,params);
    },

    // 规则新增接口
    saveRule(params){
        return axios.post(`${baseUrl}/saveData.json`,params);
    },

    // 规则删除接口
    deleteRule(params){
        return axios.get(`${baseUrl}/deleteData.json`,{params});
        // return axios.get(`${baseUrl}/deleteData.json`,{params}, {
        //     'Content-Type': 'application/json'});
    },

// 指定规则详情 删除
    deleteRuleItem(params){
        return axios.post(`${detailUrl}/deleteData.json`,params);
    },
    // 指定规则详情 新增
    saveRuleItem(params){
        return axios.get(`${detailUrl}/saveDetailData.json`,params);
    },

}

export default rule;
