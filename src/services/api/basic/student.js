/**
 * class模块接口列表(行政班)
 */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'; // 导入http中创建的axios实例
const baseUrl=base.root+'/a/class'
const basicUrl=base.root +'/basic'
const student = {
    // 查询全部行政班的简要信息
    fetchList(params){
        return axios.get(`${baseUrl}/getDataList.json`,params);
    },

    // 查询指定行政班信息
    fetchClass(params){
        return axios.post(`${baseUrl}/getDataInfo.json`,params);
    },

    // 行政班新增接口
    saveClass(params){
        return axios.post(`${baseUrl}/saveData.json`,params);
    },

    // 行政班删除接口
    deleteClass(params){
        return axios.post(`${baseUrl}/deleteData.json`,params);
    },

    // 行政班人员查看
    fetchClassMember(params){
        return axios.post(`${basicUrl}/selMainclassMember`,params)
    },

    // 行政班人员新增
    addClassMember(params){
     return axios.post(`${basicUrl}/addMainclassMember`,params);
    },

    // 行政班人员编辑
    // eslint-disable-next-line no-dupe-keys
    addClassMember(params){
        return axios.post(`${basicUrl}/updateMainclassMember`,params);
    },

    // 行政班人员删除
    deleteClassMember(params){
        return axios.post(`${basicUrl}/delMainclassMember`,params)
    },

    // 行政班树
    fetchClassGrade(params){
        return axios.get(`${basicUrl}/selAdminGrade`,params)
    }
}

export default student;
