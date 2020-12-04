/**
 * curriculumBuildings模块接口列表
 */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'; // 导入http中创建的axios实例
const baseUrl=base.root+'/a/subjectMain'
const subUrl=base.root+'/a/subjectChild'
const subject = {
    // 查询全部主课程的简要信息
    fetchMainList(params){
        return axios.get(`${baseUrl}/getDataList.json`,params);
    },

    // 查询指定主课程
    fetchMainItem(params){
        return axios.post(`${baseUrl}/getDataInfo.json`,params);
    },

    // 主课程新增接口
    saveMain(params){
        return axios.post(`${baseUrl}/saveData.json`,params);
    },

    // 主课程删除接口
    deleteMain(params){
        return axios.post(`${baseUrl}/deleteData.json`,params);
    },

    // 主课程对应子课程列表查看
    fetchChildList(params){
     return axios.post(`${baseUrl}/getChildSubjectDataList.json`,params);
    },

    // 子课程查看
    fetchChild(params){
        return axios.get(`${subUrl}/getDataInfo.json`,params)
    },

    // 子课程删除
    deleteSubject(params){
        return axios.post(`${subUrl}/deleteData.json`,params)
    },

    // 子课程新增编辑
    saveChildrenSubject(params){
        return axios.post(`${subUrl}/saveData.json`,params)
    },

    // 课程树
    fetchSubjectList(params){
        return axios.get(`${baseUrl}/getMainChildSubjectTree.json`,params)
    }
}

export default subject;
