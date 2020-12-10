<template>
  <a-card>
    <div class="operator">
      <a-button @click="showModal" type="primary">新建</a-button>
    </div>
    <div>
      <a-table
        :rowKey="'gradeId'"
        :columns="columns"
        :subName="'查看课程'"
        :dataSource="dataSource"
        :selectedRows="selectedRows"
        @change="onchange"
      >
        <span slot="operation" slot-scope="text, record">
          <a @click="showModal(record.gradeId)">编辑</a>
          |
          <a @click="deleteItem(record.gradeId)">删除</a>
          |
          <a @click="gotoNew(record.gradeId)">查看课程</a>
        </span>
      </a-table>
    </div>
    <a-modal
      title="新增年级"
      :visible="show"
      :closable="false">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk()">保存</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <a-form-model :model="form" v-bind="formItemLayout">
        <a-form-model-item label="级部" >
          <a-select :default-value="adminData[0]"  @change="handleAdminChange">
            <a-select-option v-for="(admin,index) in adminData" :key="index">
              {{ admin }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
          <a-form-model-item label="年级" >
            <a-select :default-value="gradeData[0]" placeholder="请选择年级所在年级" v-model="form.gradeId" @change="handleGradeChange">
              <a-select-option v-for="(grade,index) in gradeData" :key="index" :value="grade.gradeId">
                {{ grade.gradeName }}
              </a-select-option>
            </a-select>
        </a-form-model-item>
        <a-form-model-item label="课程" ref="gradeSubChildIds" prop="gradeSubChildIds" style="margin-top: -20px">
          <!-- :tree-data="" -->
          <a-tree-select
                  v-model="value"
                  style="width: 100%"
                  :tree-data="subject"
                  tree-checkable
                  :show-checked-strategy="SHOW_PARENT"
                  show-search
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script>
import { message } from "ant-design-vue";
import { TreeSelect } from 'ant-design-vue';
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const columns = [
  {
    title: "序号",
    dataIndex: "gradeId"
  },
  {
    title: "年级",
    dataIndex: "gradeName"
  },
  {
    title: "级部",
    dataIndex: "adminName"
  },
  {
    title: "课程",
    dataIndex: "subjectEntities",
    customRender:(text,record)=>{
      // console.log(record.subjectEntities)
      let t = record.subjectEntities
              ? record.subjectEntities.forEach(item => (item = item.name))?.join(",")
              : "";
      console.log(t);
      return t;
    }
  },
  {
    title: "操作",
    key: "operation",
    scopedSlots: { customRender: "operation" }
  }
];
export default {
  name: "grade",
  data() {
    return {
      adminData:[],
      gradeData:[],
      subject:[],
      // senior:gradeData[adminData[0]],
      columns: columns,
      show: false,
      loading:false,
      grade:{},
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      },
      SHOW_PARENT,
      value:[],
      form:{
        gradeId:" ",
      },
    };
  },
  async created() {
    let {data:{result,success}} = await this.$api.basic.grade.fetchGradeList();
    console.log(result, success);
    if (success) {
      this.dataSource = result;
      this.gradeData = result;
    }
    let {data:adminData}=await this.$api.basic.grade.fetchList();
    adminData.result.map(item=>{
      this.adminData.push(item.adminName)
    })
    console.log('adminData',this.adminData,this.gradeData);
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "grade" });
  },
  methods: {
    showModal(record) {
      this.show = true;
      this.grade=record
    },
    async handleOk() {
      let formData =this.form;
      let temptQuery={gradeId: this.form.gradeId,gradeSubChildIds:this.value}
      let {data} = await this.$api.basic.grade.saveGrade(temptQuery);
      console.log(data);
      // let{data:{result,success}}=await this.$api.basic.grade.fetchGradeList();
      // console.log("gradeData",formData,data);
      // if (success) {
      //   this.dataSource = result;
      // }
      this.show = false;
    },
    handleCancel() {
      this.show = false;
    },
    onchange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    addNew() {
      this.addNew=true
    },
    gotoNew(id) {
      this.$router.push("/basic/grade/subject?id=" + id);
    },
    async deleteItem(id) {
      let { data } = this.$api.basic.grade.deleteGrade({ gradeIds:[id] });
      console.log(data);
      // if(data&&data.success){
      //   let {data:gradeData}=await this.$api.basic.grade.fetchGradeList();
      //   console.log("gradeData",gradeData)
      //   this.dataSource=gradeData.rows
      // }
      // console.log(this.dataSource.gradeId)
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleAdminChange(value) {
      // this.senior = this.gradeData[value];
      // this.gradeName= this.gradeData[value][0];
    },
    async  handleGradeChange(){
      let {data} = await this.$api.basic.grade.fetchGrade({gradeId:this.form.gradeId});
      data.result.map(item=>{
        this.subject.push(item.subjectEntities.name)
      })
    }
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
