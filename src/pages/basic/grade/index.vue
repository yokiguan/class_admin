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
          <a @click="showModal(record)">编辑</a>
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
        <a-form-model-item label="级部" ref="adminName" prop="adminName">
          <a-row>
            <a-select placeholder="请选择年级所在级部" v-model="form.adminName"  @change="handleAdminChange">
              <a-select-option v-for="admin in adminData" :key="admin">
                {{ admin }}
              </a-select-option>
            </a-select>
          </a-row>
          <a-row>
            <a-col :span="5"><label style="margin-left: -30px">年级:</label></a-col>
            <a-col>
              <a-select placeholder="请选择年级所在年级" v-model="form.gradeName">
                <a-select-option v-for="grade in senior" :key="grade">
                  {{ grade }}
                </a-select-option>
              </a-select>
            </a-col>

          </a-row>
        </a-form-model-item>
        <a-form-model-item label="课程" ref="subjectEntities" prop="subjectEntities">
          <a-tree-select
                  v-model="subjectEntities"
                  style="width: 100%"
                  :tree-data="treeData"
                  tree-checkable
                  :show-checked-strategy="SHOW_PARENT"
                  show-search
                  :search-placeholder="请选择课程"
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
const treeData = [
  {
    title: '物理',
    value: '物理',
    key: '0-0',
    children: [
      {
        title: '物理学修',
        value: '0-0-0',
        key: '0-0-0',
      },  {
        title: '物理选修',
        value: '0-0-1',
        key: '0-0-1',
      },
    ],
  },
  {
    title: '生物',
    value: '生物',
    key: '0-1',
    children: [
      {
        title: '生物学修',
        value: '生物学修',
        key: '0-1-0',
      },
      {
        title: '生物选修',
        value: '生物选修',
        key: '0-1-1',
      },
    ],
  },{
    title: '语文',
    value: '语文',
    key: '0-2',
  }
];
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
    dataIndex: "subject",
  },
  {
    title: "操作",
    key: "operation",
    scopedSlots: { customRender: "operation" }
  }
];
const adminData=['小学','初中','高中'];
const gradeData={
  小学: ['一年级','二年级','三年级','四年级','五年级','六年级'],
  初中:['初一','初二','初三'],
  高中:['高一','高二','高三'],
}

export default {
  name: "grade",
  data() {
    return {
      adminData,
      gradeData,
      senior:gradeData[adminData[0]],
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
      subjectEntities:['0-0-0'],
      treeData,
      SHOW_PARENT,
      form:{
        adminName:" ",
        gradeName:" ",
      },
      rules:{
        adminName:[
          {
            required:true,
            message:"请选择年级所属级部！",
            trigger:"change"
          }
        ],
        gradeName:[
          {
            required:true,
            message:"请选择年级！",
            trigger:"change"
          }
        ],
      }
    };
  },
  async created() {
    let {data} = await this.$api.basic.grade.fetchGradeList();
      console.log(data);
      this.dataSource = data;
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "grade" });
  },
  methods: {
    showModal() {
      this.show = true;
      // this.grade=record
    },
    async handleOk() {
      let formData = {
        ...this.form,
        adminName:this.form.adminName,
        gradeName:this.form.gradeName,
        subject:this.subjectEntities,
      }
      let addData={...formData}
      // let temptQuery={gradeId:this.grade.gradeId,seniorubChildIds:[]}
      let {res} = await this.$api.basic.grade.saveGrade(addData);
      console.log(res);
      this.show = false;
      this.dataSource.unshift(addData);
    },
    handleCancel() {
      this.show = false;
    },
    onchange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    remove() {
      this.dataSource = this.dataSource.filter(
        item => this.selectedRowKeys.indexOf(item.key) < 0
      );
      this.selectedRows = this.selectedRows.filter(
        item => this.selectedRowKeys.indexOf(item.key) < 0
      );
    },
    addNew() {
      this.addNew=true
    },
    gotoNew(id) {
      this.$router.push("/basic/grade/subject?id=" + id);
    },
    async deleteItem(id) {
      let { data } = this.$api.basic.grade.deleteGrade({ gradeIds:id });
      console.log(id);
      this.dataSource = this.dataSource.filter(item => item.gradeId === id);
      console.log(this.dataSource.gradeId)
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleAdminChange(value) {
      this.senior = gradeData[value];
      this.gradeName= gradeData[value][0];
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
