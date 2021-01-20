<template>
  <div>
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item><a href="">排课详情</a></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="operation-list">
      <a-row :gutter="[16,16]">
        <a-col v-for="item in operationList" :key="item.text" :span="6" @click="goDetail(item)">
          <div class="operation">
            <div class="operation-icon">
              <a-icon :type="item.icon" style="font-size:40px;line-height:80px;color:white"/>
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
      <a-form-model :model="form" :label-col="{span:5}" :wrapper-col="{span:12}">
        <a-form-model-item label="选课计划名称">
          <a-input placeholder="请输入选课计划名称" style="width: 380px" v-model="form.name"/>
        </a-form-model-item>
        <a-form-model-item label="年级：">
          <a-tree-select
                  v-model="form.gradeId"
                  style="width: 100%"
                  placeholder="请选择所属年级"
                  :treeData="treeData"
                  allow-clear
                  tree-default-expand-all>
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="所属学期">
          <a-select  v-model="form.term">
            <a-select-option value="18——19上">2018-2019学年上学期</a-select-option>
            <a-select-option value="18——19下">2018-2019学年下学期</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="启用功能">
          <a-checkbox-group
                  v-model="form.type"
                  :options="plainOptions"
                  @change="onChange"/>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!--    发布选课-->
    <a-modal
            :visible='publishVisit'
            width="700px"
            :closable="false"
            on-ok="handleOk">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">确定</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <span>共计发送1000人</span>
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
      icon: "schedule",
      text: "行政班排课",
    },
    {
      icon: "calendar",
      text: "走班排课任务",
    },
    {
      icon: "cloud-upload",
      text: "课表",
    },
    {
      icon: "calendar",
      text: "行政班排课任务",
    },
  ];
  const columns=[
    {
      title: '学号',
      dataIndex:'uid',
      align: 'center',
    },
    {
      title: '名称',
      dataIndex:'uName',
      align: 'center',
    },{
      title: '班级',
      dataIndex:'gradeName',
      align: 'center',
    }
  ]
  export default {
    name: "OperationList",
    data() {
      return {
        operationList,
        plainOptions :[
          {label: '走班排课',value: '走班排课'},
          {label:'行政班',value:'行政班'},
        ],
        editVisit:false,
        publishVisit:false,
        loading:false,
        treeData:[],
        columns,
        data:[],
        selectedRowKeys: [], // Check here to configure the default column
        selectedRows:[],
        form:{},
        planId:"",
        result:{},
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
        console.log(this.result);
      },
      //修改信息
      editInfo(){
        this.form.name=this.result.name;
        this.form.term=this.result.term;
        this.form.gradeId=this.result.gradeId;
        this.form.type=this.result.type==0?['走班排课']:['行政班'];
      },
      //查看发布选课学生
      async lookPublicStudent(){
        this.planId = window.location.href.split('?')[1].split('=')[1];
        let {data:{result,success}}=await this.$api.schedule.plan.scheduleDistribute({planId:this.planId});
        console.log(result);
        this.data=result;
      },
      onSelectChange( selectedRowKeys,selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows=selectedRows
        console.log(this.selectedRowKeys);
        console.log(this.selectedRows);
      },
      //保存
      async handleOk(){
        //保存排课计划
        let formData={
          planId:this.result.planId,
          name:this.form.name,
          term:this.form.term,
          gradeId:this.form.gradeId,
          type:this.form.type=='行政班课'?1:0,
        };
        let {data} = await this.$api.schedule.plan.saveCoursetime(formData);
        console.log(data);
        this.editVisit=false;
        //发布选课保存
        let {data:savdPublish} =  await this.$api.schedule.plan.schedulesaveQua({planId:this.planId,idsList: this.selectedRowKeys})
        console.log("xuedandan",data)

      },
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
        console.log('checked = ', checkedValues);
        console.log('value = ', this.value);
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
