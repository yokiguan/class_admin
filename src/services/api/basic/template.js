/**
 * curriculumTemplates模块接口列表
 */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'; // 导入http中创建的axios实例
const baseUrl=base.root+'/a/curriculumTemplates'
const curriculumTemplates = {
    // 查询全部课表模板的简要信息
    fetchList(){
        return axios.get(`${baseUrl}/getDataList.json`);
    },

    // 查询指定课表模板信息，用于教室规则等的课表模板选择，编辑模板前，先查询模板信息，利用模板id
    fetchTemplate(params){
        return axios.get(`${baseUrl}/getDataInfo.json`,{params});
    },

    // 课表模板新增接口
    saveTemplate(params){
        return axios.post(`${baseUrl}/saveData.json`,params, {
            'Content-Type': 'application/json'});
    },

    // 课表删除接口
    deleteTemplate(params){
        return axios.get(`${baseUrl}/deleteData.json`,{params});
    }
}

export default curriculumTemplates;
