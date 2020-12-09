/*
* 选课设置模块接口列表
* */
import schedule from '.../schedule';    //导入接口域名列表
import axios from '../../axios'      //导入从http众创建的axios实例
const baseUrl=base.root+'/a/schedulePlan'
const plan={
    // 选课设置新增/修改
    settingAdd(params){
        return axios.get(`${baseUrl}/saveSettingData.json`,params, {
            'Content-Type': 'multipart/form-data'});
    },
    //选课设置清空(或许不需要)
    /* settingdelete(params){
         return axios.get(`${baseUrl}/settingdeleteData.json`,params, {
             'Content-Type': 'multipart/form-data'});
     },*/
    //选课设置查看（单个）
    settingGet(params){
        return axios.get(`${baseUrl}/getSettingData.json`,params, {
            'Content-Type': 'multipart/form-data'});
    }
    //选课设置删除(待讨论)

}

