<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button @click="showModal" type="primary">新建</a-button>
      </div>
      <a-table
        rowKey="id"
        :columns="columns"
        :subName="'子课程'"
        :subPath="'/basic/subject/subsubject'"
        :dataSource="dataSource"
        :selectedRows="selectedRows"
        ><span slot="operation" slot-scope="text,record">
          <a @click="edit(record.id)">编辑</a>
          |
          <a-popconfirm v-if="dataSource.length"
                      title="确认删除?"
                      cancelText="取消"
                      okText="确定"
                      @confirm="() => deleteItem(record.id)">
          <a href="javascript:;">删除</a>
        </a-popconfirm>
          |<a @click="gotoNew(record.id)">子课程</a>
        </span>
        </a-table>
    </div>
    <a-modal
     :title="changeTitle"
      :visible="show"
     :closable="false">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk('ruleForm')">保存</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <a-form-model :model="form" v-bind="formItemLayout" ref="ruleForm">
        <a-form-model-item label="科目名称" >
          <a-input v-model="form.subjectName" placeholder="请输入你想要新增的科目名称"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>
<script>
  import { message } from 'ant-design-vue';
const columns = [
  {
    title: "课程编号",
    dataIndex: "id"
  },
  {
    title: "名称",
    dataIndex: "subName"
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" }
  }
];

export default {
  name: "subject",
  data() {
    return {
      columns,
      dataSource: [],
       formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      },
      show:false,
      loading:false,
      selectedRowKeys: [],
      selectedRows: [],
      changeTitle:'新增课程',
      editText:-1,
      // form: {this.$form.createForm(this, { name: 'advanced_search' }),}
      form:{
        subjectName:"",
      },
    };
  },
  async created() {
    let { data } = await this.$api.basic.subject.fetchMainList();
    this.dataSource=data.rows
    // console.log(data);
  },
  //  beforeCreate() {
  //   this.form = this.$form.createForm(this, { name: "subject" });
  // },
  methods: {
    showModal() {
      this.show = true;
      this.changeTitle='新增课程';
    },
    edit(id){
      this.changeTitle='编辑课程';
      this.show=true;
      this.editText=this.dataSource.findIndex(item=>item.id==id)
      this.form.subjectName=this.dataSource[this.editText].subName;
      console.log(this.editText)
    },
    async handleOk(formName) {
      if(this.changeTitle=="新增课程"){
        let formData = {
          subName:this.form.subjectName,
        }
        let addData={...formData}
        let {data} = await this.$api.basic.subject.saveMain(addData);
        // this.dataSource.unshift(formData)
        this.show = false;
        this.$refs[formName].resetFields();
        // this.form.resetFields()
        let {data:buildData} = await this.$api.basic.subject.fetchMainList();
        console.log("buildData",buildData)
        this.dataSource = buildData.rows
      }else{
        let formData={
          id:this.dataSource[this.editText].id,
          subName: this.form.subjectName,
        }
        let addData={...formData}
        let {data:saveData}=await this.$api.basic.subject.saveMain(addData);
        let {data:subjectData}=await this.$api.basic.subject.fetchMainList();
        console.log("subjectData",subjectData)
        this.dataSource=subjectData.rows;
        this.show=false;
      }
    },
    handleCancel() {
      this.show = false;
    },
    onchange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    gotoNew(id) {
      this.$router.push("/basic/subject/subsubject?id=" + id);
    },
    async deleteItem(id) {
      let {data} = await this.$api.basic.subject.deleteMain({ids:[id]});
      console.log(data);
      if(data&&data.success){
        let {data:buildData} =await this.$api.basic.subject.fetchMainList();
        console.log("buildData",buildData);
        this.dataSource = buildData.rows;
        message.info('删除成功');
      }else{
        message.info('删除失败');
      }
    },


  }
};
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
