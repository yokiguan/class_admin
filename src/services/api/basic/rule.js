/**
 * rule模块接口列表
 */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'; // 导入http中创建的axios实例
const baseUrl=base.root+'/a/selectionRuleDetail'
const rule = {
    //详细规则查看
    fetchRuleList(params){
        return axios.get(`${baseUrl}/getDetailDataList.json`,params, {
            'Content-Type': 'application/json'});
    },
    // 指定规则详情 新增
    saveRuleItem(params){
        return axios.get(`${baseUrl}/saveData.json`,{params});
    },

}

export default rule;
