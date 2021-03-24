<template>
  <div>
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="#">排课详情</router-link></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="operation-list">
      <a-row :gutter="[16,16]">
        <a-col v-for="item in operationList" :key="item.text" :span="6" @click="goDetail(item)">
          <div class="operation">
            <div class="operation-icon">
              <a-icon  :type="item.icon" style="font-size:40px;line-height:80px;color:white"/>
            </div>
            <h1 style="margin-top:10px">{{item.text}}</h1>
          </div>
        </a-col>
      </a-row>
    </div>
    <!--    修改-->
    <a-modal
            width="800px"
            :closable="false"
            v-model="editVisit">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <a-form-model v-bind="formItemLayout" :model="form" :rules="rules">
        <a-form-model-item label="计划名称" prop="name" ref="name">
          <a-input placeholder="请输入计划名称" v-model="form.name"/>
        </a-form-model-item>
        <a-form-model-item label="所属学期" prop="term" ref="term">
          <a-select placeholder="请选择学期" v-model="form.term">
            <a-select-option v-for="(terms,index) in this.tearmData" :key="index" :value="terms.id">
              {{terms.termName}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="所属年级" prop="gradeId" ref="gradeId">
          <a-tree-select
                  v-model="form.gradeId"
                  placeholder="请选择所属年级"
                  :treeData="treeData"
                  :checkedKeys="checkedKeys"
                  allow-clear
                  tree-default-expand-all>
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="启用功能">
          <a-checkbox-group v-model="form.type" @change="onChange">
            <a-checkbox value="走班排课">走班排课</a-checkbox>
            <a-checkbox value="行政班课">行政班课</a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!--    发布选课-->
    <a-modal
            :visible='publishVisit'
            width="700px"
            :closable="false">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handlePublic">确定</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <span>共计发送{{this.total}}个班</span>
      <a-table :rowKey="'uid'"
               :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
               :selectedRows="selectedRows"
               :columns="columns"
               :data-source="data"
               :bordered="true"
               :pagination="false"
               width="500px"
               style="margin-top: 50px">
      </a-table>
    </a-modal>
  </div>
</template>
<script>
  import {message} from "ant-design-vue";
  // import pick from "lodash.pick"
  const operationList = [
    {
      icon: "edit",
      text: "修改",
    },
    {
      icon: "setting",
      text: "选课设置",
    },
    {
      icon: "cloud-upload",
      text: "发布选课",
    },
    {
      icon: "pie-chart",
      text: "选课统计",
    },
    {
      icon: "snippets",
      text: "选课分班",
    },
    {
      icon: "schedule",
      text: "选课排课",
    },
    {
      icon: "calendar",
      text: "走班排课任务",
    },
    {
      icon: "calendar",
      text: "行政班排课任务",
    },
    {
      icon: "cloud-upload",
      text: "课表",
    },
  ];
  const operationListClass = [
    {
      icon: "edit",
      text: "修改",
    },
    {
      icon: "setting",
      text: "选课设置",
    },
    {
      icon: "cloud-upload",
      text: "发布选课",
    },
    {
      icon: "pie-chart",
      text: "选课统计",
    },
    {
      icon: "snippets",
      text: "选课分班",
    },
    {
      icon: "schedule",
      text: "选课排课",
    },
    {
      icon: "calendar",
      text: "走班排课任务",
    },
    {
      icon: "cloud-upload",
      text: "课表",
    },
  ];
  const operationListAdmin = [
    {
      icon: "edit",
      text: "修改",
    },
    {
      icon: "setting",
      text: "选课设置",
    },
    {
      icon: "cloud-upload",
      text: "发布选课",
    },
    {
      icon: "pie-chart",
      text: "选课统计",
    },
    {
      icon: "snippets",
      text: "选课分班",
    },
    {
      icon: "schedule",
      text: "行政班排课",
    },
    {
      icon: "calendar",
      text: "行政班排课任务",
    },
    {
      icon: "cloud-upload",
      text: "课表",
    },
  ];
  const columns=[
    {
      title: '班级',
      dataIndex:'className',
      align: 'center',
    }
  ];
  export default {
    name: "OperationList",
    data() {
      return {
        operationList,
        operationListClass,
        operationListAdmin,
        editVisit:false,
        publishVisit:false,
        loading:false,
        treeData:[],
        checkedKeys:[],
        columns,
        data:[],
        selectedRowKeys: [], // Check here to configure the default column
        selectedRows:[],
        form:{},
        planId:"",
        result:{},
        tearmData:[],
        total:"",
        checkedValues:[],
        showParts:true,
        classType:-1,
        formItemLayout: {
          labelCol: {
            xs: { span: 15 },
            sm: { span: 6 },
          },
          wrapperCol: {
            xs: { span: 15},
            sm: { span: 16 },
          },
        },
        form:{
          name:"",
          term:"",
          gradeId:"",
          type:"",
        },
        rules:{
          name:[
            {
              required:true,
              message:"请输入计划名称！",
              trigger:"blur",
            }
          ],
          term:[
            {
              required:true,
              message:"请选择学期！",
              trigger:"blur",
            }
          ],
          gradeId:[
            {
              required:true,
              message:"请选择年级！",
              trigger:"blur",
            }
          ],
          type:[
            {
              required:true,
              message:"请选择功能！",
              trigger:"change",
            }
          ],
        },
      };
    },
    created(){
      this.lookInfo();
    },
    methods: {
      //主界面的按钮
      goDetail(item) {
        if(item.text==='修改'){
          this.editVisit=true;
          this.grade();
          this.editInfo();
          this.termInf();
        }else if(item.text==='选课设置'){
          this.$router.push(`/schedule/detail/setting?planId=${this.planId}`)
        }else if(item.text==='发布选课'){
          this.publishVisit=true;
          this.lookPublicStudent();
        }else if(item.text==='选课统计'){
          this.$router.push( `/schedule/detail/statistics?planId=${this.planId}`)
        }else if(item.text==='选课分班'){
          this.$router.push(`/schedule/detail/sort_class/admin?planId=${this.planId}`)
        }else if(item.text==='选课排课'){
          this.$router.push(`/schedule/detail/sort_course/index?planId=${this.planId}`)
        }else if(item.text==='行政班排课'){
          this.$router.push(`/schedule/detail/class_admin/index?planId=${this.planId}`)
        }else if(item.text==='走班排课任务'){
          this.$router.push(`/schedule/detail/task_mobile/index?planId=${this.planId}`)
        }else if(item.text==='课表'){
          this.$router.push(`/schedule/detail/curriculum/index?planId=${this.planId}`)
        }else if(item.text==='行政班排课任务'){
          this.$router.push(`/schedule/detail/task_admin/index?planId=${this.planId}`)
        }  },
      //指定排课计划信息查看
      async lookInfo(){
        this.planId = window.location.href.split('?')[1].split('=')[1];
        let {data:{result,success}}=await this.$api.schedule.plan.schedulegetInfo({planId:this.planId});
        console.log(result);
        this.result=result;
        this.classType=result.type;
        console.log(this.classType);
        console.log(this.result);
        for(let i in this.operationList){
          if(this.classType===0) {
            this.operationList=this.operationListClass;
          }else if(this.classType===1){
            this.operationList=this.operationListAdmin;
          }
        }
        console.log(this.operationList)
      },
      //修改信息
      async editInfo(){
        this.planId = window.location.href.split('?')[1].split('=')[1];
        let {data:{result,success}}=await this.$api.schedule.plan.schedulegetInfo({planId:this.planId});
        console.log(result);
        this.form.name=result.name;
        this.form.term=result.term;
        this.form.gradeId=result.gradeName;
        console.log(result.type);
        this.form.type=result.type==0?['走班排课']:result.type==1?['行政班课']:['走班排课','行政班课'];
      },
      //查看发布选课学生
      async lookPublicStudent(){
        this.planId = window.location.href.split('?')[1].split('=')[1];
        let {data}=await this.$api.schedule.plan.scheduleDistribute({planId:this.planId});
        console.log(data);
        this.data=data.rows;
        this.total=data.total;
        console.log(this.total);
      },
      onSelectChange( selectedRowKeys,selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows=selectedRows
        console.log(this.selectedRowKeys);
        console.log(this.selectedRows);
      },
      //保存排课计划
      async handleOk(){
        if(this.form.name==undefined||this.form.term==undefined||this.form.gradeId==undefined){
          message.info('输入信息不能为空！')
        }else{
          let formData={
            planId:this.result.planId,
            name:this.form.name,
            term:this.form.term,
            gradeId:this.form.gradeId,
            type:this.form.type=='行政班课'?1:(this.form.type=='走班课'?0:2),
          };
          let {data} = await this.$api.schedule.plan.saveCoursetime(formData);
          console.log(data);
          if(data&&data.success){
            message.info("保存成功！");
            this.editVisit=false;
          }else{
            message.info("请检查修改信息是否有空！");
          }
        }
      },
      //发布选课保存
      async handlePublic(){
        let select=[];
        for(let i=0;i<this.selectedRows.length;i++){
          select[i]=this.selectedRows[i].classId;
        }
        console.log(select);
        let {data} =  await this.$api.schedule.plan.schedulesaveQua({planId:this.planId,stringList: select})
        console.log(data);
        if(data&&data.success){
          message.info("发布选课成功！");
          this.publishVisit=false;
        }else{
          message.info("发布选课失败！");
        }
      },
      //取消
      handleCancel() {
        this.editVisit = false;
        this.publishVisit=false;
      },
      //获取年级信息
      async grade(){
        this.treeData = []
        let {data:{result,success}}=await this.$api.basic.grade.fetchList();
        console.log(result);
        for(let i in result){
          //第一层（级部）
          let adminData={};
          adminData.title=result[i].adminName;
          adminData.key=adminData.value=result[i].adminId;
          if(result[i].adminGrades.length){
            //第二层（年级）
            adminData.children=[];
            for(let j=0;j<result[i].adminGrades.length;j++){
              let item=result[i].adminGrades[j];
              let gradeData={};
              gradeData.key=gradeData.value=item.gradeId;
              gradeData.title=item.gradeName;
              adminData.children.push(gradeData);
            }
          }
          this.treeData.push(adminData);
        }
      },
      //选择课程类型
      onChange(checkedValues) {
        console.log('checked = ',checkedValues);
        this.checkedValues=checkedValues;
        console.log('value = ', this.value);
      },
      //获取学期信息
      async termInf(){
        let {data:{result,success}}=await this.$api.schedule.plan.termInfo();
        this.tearmData=result;
        console.log(this.tearmData);
      },
    },
  };
</script>
<style lang='less' scoped>
  .result{
    width: 100%;
    background-color: white;
    height:50px;
    margin: 20px 0px 10px 0px;
    padding-left: 25px;
    padding-top: 15px;
    vertical-align: top;
    border-radius: 5px;
  }
  .operation{
    background-color: white;
    text-align: center;
    height: 80%;
    width:80%;
    padding: 30px;
    position: relative;
    float: left;
    .operation-icon{
      margin:0 auto;
      height: 80px;
      width:80px;
      text-align: center;
      background-color: #13c2c2;
      border-radius: 50%;
    }
  }
</style>
