<template>
  <div>
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
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
                  <div>学期:第{{item.term}}学期</div>
                  <div>参与年级:{{item.gradeName}}</div>
                </div>
              </a-card-meta>
              <router-link slot="actions" :to="`/schedule/detail/index?planId=${item.planId}`">操作</router-link>
              <a slot="actions" @click="handleDeletePlan(item.planId)">删除</a>
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
        <a-form-model v-bind="formItemLayout" :model="form" ref="createForm">
            <a-form-model-item label="计划名称">
              <a-input placeholder="请输入计划名称" v-model="form.name"/>
            </a-form-model-item>
            <a-form-model-item label="所属学期">
              <a-select default-value="1" style="width: 120px" v-model="form.term">
                <a-select-option value="1">第一学期</a-select-option>
                <a-select-option value="2">第二学期</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="所属年级">
              <a-tree-select
                      v-model="form.gradeId"
                      style="width: 100%"
                      placeholder="请选择所属年级"
                      :treeData="treeData"
                      allow-clear
                      tree-default-expand-all>
              </a-tree-select>
            </a-form-model-item>
            <a-form-model-item label="启用功能">
              <a-checkbox-group
                      v-model="form.type"
                      :options="plainOptions"
                      @change="onChange"/>
            </a-form-model-item>
          </a-form-model>
      </a-modal>
    </div>
  </div>
</template>
<script>
  const plainOptions = ['行政班排课', '走班排课'];
  export default {
    name: "CardList",
    data() {
      return {
        dataSource:[],
        plainOptions,
        addVisit : false,
        loading:false,
        treeData:[],
        form:{},
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
      };
    },
    async created() {
      this.initSearch()
    },
    methods : {
      async initSearch(){
        // 查询排课计划
        let {data} = await this.$api.schedule.plan.getSchedulePlan()
        this.dataSource = data.rows
        console.log(this.dataSource)
        this.dataSource.unshift({
          add: true,
        });
      },
      //保存排课计划
      async handleOk(){
        let formData={
          name:this.form.name,
          term:this.form.term,
          gradeId:this.form.gradeId,
          type:this.form.type=='行政班课'?1:0,
        };
        let {data} = await this.$api.schedule.plan.saveCoursetime(formData);
        console.log(data);
        if(data&&data.success){
          this.addVisit = false
        }
        this.initSearch()
      },
      //取消
      handleCancel(){
        this.addVisit=false;
      },
      async handleDeletePlan(value){
        // 删除排课计划
        let {data} = this.$api.schedule.plan.deleteSchedulePlan({ids:value})
        this.initSearch()
      },
      //选择课程类型
      onChange(checkedValues) {
        console.log('checked = ', checkedValues);
        console.log('value = ', this.value);
      },
      //新增排课计划
      addNew(){
        this.addVisit=true;
        this.grade();
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
