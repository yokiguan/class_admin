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
                  <div>学期:{{item.term}}</div>
                  <div>参与年级:{{item.gradeId}}</div>
                </div>
              </a-card-meta>
              <router-link slot="actions" :to="`/schedule/detail/index?planId=${item.planId}`">操作</router-link>
              <a slot="actions" @click="handleDeletePlan(item.planId)">删除</a>
            </a-card>
          </template>
        </a-list-item>
      </a-list>
      <!-- 添加排课规则 -->
      <create-modal
              title="添加排课规则"
              :close="false"
              :visible="visible"
              :loading="loading"
              @modalClosed="closed"
              @modalSubmit="handleSubmit">
        <div slot="content">
          <a-form-model v-bind="formItemLayout" :model="form" @submit="handleSubmit" ref="createForm">
            <a-form-model-item label="计划名称">
              <!-- <a-date-picker v-decorator="['date-picker', config]" /> -->
              <a-input placeholder="请输入计划名称" v-model="form.name"/>
            </a-form-model-item>
            <!-- <a-form-model-item label="年份">
              <a-select :default-value="yearRange[0]" style="width: 120px" @change="handleYearChange" >
                <a-select-option v-for="(startYear, index) in yearRange" :key="index" >
                  {{ startYear }}
                </a-select-option>
              </a-select>
              <a-select :default-value="endYearRange[0]" style="width: 120px">
                <a-select-option v-for="(endYear, index) in endYearRange" :key="index">
                  {{ endYear }}
                </a-select-option>
              </a-select>
            </a-form-model-item> -->
            <a-form-model-item label="所属学期">
              <a-select default-value="1" style="width: 120px" v-model="form.term">
                <a-select-option value="1">
                  第一学期
                </a-select-option>
                <a-select-option value="2">
                  第二学期
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="所属年级">
              <a-select default-value="1" style="width: 120px" v-model="form.gradeId">
                <a-select-option value="1">
                  高一
                </a-select-option>
                <a-select-option value="2">
                  高二
                </a-select-option>
                <a-select-option value="3">
                  高三
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="启用功能">
              <a-radio-group v-model="form.type">
                <a-radio value="0">行政班排课</a-radio>
                <a-radio value="1">走班排课</a-radio>
              </a-radio-group>
            </a-form-model-item>

          </a-form-model>
        </div>
      </create-modal>
    </div>
  </div>
</template>

<script>
  import CreateModal from '../../../components/modal/CreateModal'
  export default {
    components : {CreateModal,},
    name: "CardList",
    data() {
      return {
        dataSource:[],
        // modal
        visible : false,
        loading : false,
        form:{},
        formItemLayout: {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 8 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
          },
        },
        //年份
        yearRange : [2020, 2021, 2022, 2023, 2024],
        endYearRange : [2021, 2022, 2023, 2024]
      };
    },
    async created() {
      this.initSearch()
    },
    methods : {
      async initSearch(){
        // 查询排课计划
        let {data} = await this.$api.schedule.arrangeClass.getSchedulePlan()
        this.dataSource = data.rows
        this.dataSource.unshift({
          add: true,
        });
      },
      addNew : function(){
        this.visible = true
      },
      closed : function(){
        this.visible = false
        this.loading = false
      },
      async handleSubmit(){
        this.loading = true
        let {data} = await this.$api.schedule.arrangeClass.saveCoursetime(this.form)
        if(data.success){
          this.visible = false
          this.loading = false
        }
        this.initSearch()
      },
      handleYearChange : function(index){
        console.log(this.yearRange, index)
        let temp = this.yearRange
        this.endYearRange = temp.slice(index, this.yearRange.length)
        console.log(this.endYearRange)
      },
      async handleDeletePlan(value){
        // 删除排课计划
        let {data} = this.$api.schedule.arrangeClass.deleteSchedulePlan({ids:value})
        this.initSearch()
      }
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
