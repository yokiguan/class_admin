# class admin
- src
    - assets 静态资源
    - components 可能需要的组件
    - config
    - layouts 布局
    - mock
    - pages 真正的页面
         - basic
         - login
         - result
         - schedule
    - router 路由及菜单栏
    - services 接口管理
        - api 把接口封装成函数
            - basic 基础设置
            - schedule 排课
# 当你需要增加接口时
1. 确定是在basic 还是在shedule
2. 找到对应的模块
3. 如果需要增加模块 新建一个.js 文件并记得导出到index

新建的js 类似下面
```
/**
 * grade模块接口列表
 */
import base from '../base'; // 导入接口域名列表
import axios from '../../axios'; // 导入http中创建的axios实例
const baseUrl=base.root+'/a/admin'
const gradeUrl=base.root+'/a/grade'
const grade = {    
    // 查询全部级部的简要信息
    fetchList(params){
        return axios.post(`${baseUrl}/getAdminGradeDataList.json`,params);    
    },

    // 查询年级的简要信息
    fetchGradeList(params){
        return axios.get(`${gradeUrl}/getGradeDataList.json`,params);    
    },

    // 查询指定年级信息
    fetchGrade(params){
        return axios.post(`${gradeUrl}/getGradeDataInfo.json?gradeId=${params.gradeId}`);    
    },

    // 年级新增接口
    saveGrade(params){
        return axios.post(`${gradeUrl}/saveGradeSubjectData.json`,params);    
    },

    // 年级删除接口
    deleteGrade(params){
        return axios.post(`${gradeUrl}/deleteGradeSubByGradeIds.json`,params);   
    },

    // 年级子课程新增
    saveGradeSubject(params){
     return axios.post(`${gradeUrl}/insertSubToGrade.json`,params);   
    },

    // 年级子课程删除
    deleteGradeSubject(params){
        return axios.post(`${gradeUrl}/deleteGradeSubChild.json`,params)
    },
}

export default grade;
```
# 当你需要使用封装好的接口时
如下图方式调用
```
let res = await this.$api.basic.grade.saveGrade(temptQuery);
console.log(formData,res);
```
# 当你需要新建页面时
1. 在pages地下写页面
2. 并在路由中配置你需要的pages

