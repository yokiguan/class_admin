<template>
  <div>
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="#">排课计划</router-link></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="card-list">
      <a-list :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}" :dataSource="dataSource">
        <a-list-item slot="renderItem" slot-scope="item">
          <template v-if="item.add" >
            <div @click="addNew">
              <a-button class="new-btn" type="dashed">
                <a-icon type="plus" />新增排课计划
              </a-button>
            </div>
          </template>
          <template v-else>
            <a-card :hoverable="true">
              <a-card-meta>
                <div style="margin-bottom: 3px" slot="title">{{item.name}}</div>
                <a-avatar class="card-avatar" slot="avatar" :src="item.avatar" size="large" />
                <div class="meta-content" slot="description">
                  <div>学期:{{item.term}}</div>
                  <div>参与年级:{{item.gradeName}}</div>
                </div>
              </a-card-meta>
              <router-link slot="actions" :to="`/schedule/detail/index?planId=${item.planId}`">操作</router-link>
              <a-popconfirm slot="actions"
                            v-if="dataSource.length"
                            title="确认删除?"
                            cancelText="取消"
                            okText="确定"
                            @confirm="() => handleDeletePlan(item.planId)">
                  <a >删除</a>
              </a-popconfirm>
            </a-card>
          </template>
        </a-list-item>
      </a-list>
      <!-- 添加排课规则 -->
      <a-modal
              title="添加排课规则"
              :closable="false"
              :visible="addVisit">
        <template slot="footer">
          <a-button key="Save" type="primary" :loading="loading" @click="handleOk">保存</a-button>
          <a-button key="back" @click="handleCancel">取消</a-button>
        </template>
        <a-form-model v-bind="formItemLayout" :model="form" ref="createForm" :rules="rules">
            <a-form-model-item label="计划名称" prop="name" ref="name">
              <a-input placeholder="请输入计划名称" v-model="form.name"/>
            </a-form-model-item>
            <a-form-model-item label="所属学期" prop="term" ref="prop">
              <a-select placeholder="请选择学期" style="width: 120px" v-model="form.term">
                <a-select-option v-for="(terms,index) in this.tearmData" :key="index">
                  {{terms.termName}}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="所属年级" prop="gradeId" ref="gradeId">
              <a-tree-select
                      v-model="form.gradeId"
                      placeholder="请选择所属年级"
                      :treeData="treeData"
                      allow-clear
                      tree-default-expand-all>
              </a-tree-select>
            </a-form-model-item>
            <a-form-model-item label="启用功能">
              <a-checkbox-group v-model="form.type">
                <a-checkbox value="走班排课">走班排课</a-checkbox>
                <a-checkbox value="行政班课">行政班课</a-checkbox>
              </a-checkbox-group>
            </a-form-model-item>
          </a-form-model>
      </a-modal>
    </div>
  </div>
</template>
<script>
  import { message } from 'ant-design-vue';
  export default {
    name: "CardList",
    data() {
      return {
        dataSource:[],
        addVisit : false,
        loading:false,
        treeData:[],
        tearmData:[],
        form:{
          type:[],
        },
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
              trigger:"change",
            }
          ],
          gradeId:[
            {
              required:true,
              message:"请选择年级！",
              trigger:"change",
            }
          ],
        },
      };
    },
    async created() {
      this.initSearch()
    },
    methods : {
      async initSearch(){
        // 查询排课计划
        let {data} = await this.$api.schedule.plan.getSchedulePlan()
        this.dataSource = data.result
        console.log(data)
        this.dataSource.unshift({
          add: true,
        });
      },
      //保存排课计划
      async handleOk(){
        console.log(this.form.type);
        if(this.form.name==undefined||this.form.term==undefined||this.form.gradeId==undefined){
          message.info('输入信息不能为空！')
        }else{
          let type=null;
          console.log(this.form.type.toString());
          if(this.form.type.toString()=="走班排课"){
              type=0;
          }else if(this.form.type.toString()=="行政班课"){
              type=1;
          }else{
              type=2;
          }
          let formData={
            name:this.form.name,
            term:this.tearmData[this.form.term].termName,
            gradeId:this.form.gradeId,
            type:type,
          };
          console.log(formData);
          let {data} = await this.$api.schedule.plan.saveCoursetime(formData);
          console.log(data);
          if(data&&data.success){
            message.success("保存成功！");
            this.addVisit = false;
            this.initSearch();
          }else{
            message.error("保存失败！");
          }
        }
        this.$refs.createForm.resetFields();
      },
      //取消
      handleCancel(){
        this.addVisit=false;
      },
      async handleDeletePlan(value){
        // 删除排课计划
        let {data} = this.$api.schedule.plan.deleteSchedulePlan({ids:[value]});
        if(data&&data.success){
          message.success("删除成功！");
          this.initSearch();
        }
        message.error("删除失败！");
      },
      //新增排课计划
      addNew(){
        this.addVisit=true;
        this.grade();
        this.termInf()
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
          console.log(this.treeData);
        }
      },
      //获取学期信息
      async termInf(){
        let {data:{result,success}}=await this.$api.schedule.plan.termInfo();
        this.tearmData=result;
        console.log(this.tearmData);
      },
    }
  };
</script>

<style lang="less" scoped>
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
  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }
  .new-btn {
    border-radius: 2px;
    width: 100%;
    height: 162px;
  }
  .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
</style>
