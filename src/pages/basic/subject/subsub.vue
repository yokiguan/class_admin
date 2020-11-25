<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button @click="addNew" type="primary">新建</a-button>
        <a-dropdown>
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item key="delete">删除</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
      <regular-table
              :rowKey="'key'"
              :columns="columns"
              :dataSource="dataSource"
              :selectedRows="selectedRows"
              @change="onchange"
      />
    </div>
    <a-modal
            :visible='addClassVisit'
            width="600px"
            :closable="false"
            on-ok="handleOk">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">
          保存
        </a-button>
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
      </template>
      <a-form-model ref="ruleForm" :model="form"
              :rules="rules" :label-col="{span:5}" :wrapper-col="{span:12}"
              style="margin-left: 70px">
        <a-form-model-item label="子科目名称：" prop="subjectName" ref="subjectName">
          <a-input placeholder="请输入" v-model="form.subjectName"
                   style="width: 275px"></a-input>
        </a-form-model-item>
        <a-form-model-item label="所属年级：" prop="grad" ref="grad">
          <a-select v-model="form.grad"
                    placeholder="请选择" style="width: 275px">
            <a-select-option value="高一">
              高一
            </a-select-option>
            <a-select-option value="高二">
              高二
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="所属类别：" prop="type" ref="type">
          <a-select v-model="form.type"
                    placeholder="请选择" style="width: 275px">
                        <a-select-option value="行政班课">
                          行政班课
                        </a-select-option>
                        <a-select-option value="走班课">
                          走班课
                        </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>

  import RegularTable from "../../../components/table/MainCourseTable";
  const columns = [
    {
      title: '子课程编号',
      dataIndex: 'no'
    },
    {
      title: '名称',
      dataIndex: 'name'
    },
    {
      title: '年级',
      dataIndex: 'grade',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
  ]

  const dataSource = [{
    key:1,
    no:1,
    name:'物理',
    grade:'高一',
    type:'行政班课'
  },{
    key:2,
    no:2,
    name:'物理选修',
    grade:'高二文;高二理',
    type:'走班课'
  },{
    key:3,
    no:3,
    name:'物理学修',
    grade:'高二文;高二理',
    type:'走班课'
  }]
export default {
  name: 'subsubject',
  components: {RegularTable},
  data () {
    return {
      columns: columns,
      dataSource: dataSource,
      selectedRowKeys: [],
      selectedRows: [],
      addClassVisit:false,
      loading:false,
      form:{
        subjectName:'',
        grad:'',
        type:''
      },
      rules:{
        subjectName:[
          {
            required:true,
            message:"请输入课程名称！",
            trigger:"blur"
          }
        ],
        grad:[
          {
            required:true,
            message:"请输入年级！",
            trigger:"blur"
          }
        ],
       type:[
          {
            required:true,
            message:"请输入课程类型！",
            trigger:"change"
          }
        ],
      }

    }
  },
    async created() {
      let queryString=(window.location.hash || " ").split('?')[1]
      let id=(queryString || " ").split('=')[1]
      if(id){
        let { data } = await this.$api.basic.subject.fetchChildList({id});
        console.log(data);
      }
    },
    methods: {
      onchange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      remove () {
        this.dataSource = this.dataSource.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
        this.selectedRows = this.selectedRows.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
      },
      addNew () {
        this.addClassVisit=true
      },
      handleOk() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.loading = true
            setTimeout(() => {
              this.dataSource.push({
                key: this.dataSource.length + 1,
                no: this.dataSource.length + 1,
                name: this.form.subjectName,
                grade: this.form.grad,
                type: this.form.type,
              })
              this.loading = false
              this.addClassVisit = false
              this.$refs.ruleForm.resetFields();
            }, 300)
          } else {
            console.log('error submit!!');
            return false
          }
        });
      },
      handleCancel() {
        this.addClassVisit = false
      },
      handleMenuClick (e) {
        if (e.key === 'delete') {
          this.remove()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .search{
    margin-bottom: 54px;
  }
  .fold{
    width: calc(100% - 216px);
    display: inline-block
  }
  .operator{
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
