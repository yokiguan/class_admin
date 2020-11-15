<template>
  <a-card>
    <div>
      <a-table
        rowKey="gradeId"
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
        </span></a-table
      >
    </div>
    <a-modal
      title="新增年级"
      :visible="show"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form" v-bind="formItemLayout">
        <a-form-item label="级部">
          <a-select
            v-decorator="[
              'gradeId',
              { rules: [{ required: true, message: '请选择年级所在级部' }] }
            ]"
            placeholder="请选择年级所在级部"
          >
            <a-select-option
              v-for="b in this.adminGrades"
              :key="b.value"
              :value="b.label"
            >
              {{ b.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="年级名称">
          <a-input
            v-decorator="[
              'name',
              { rules: [{ required: true, message: '请输入年级名称' }] }
            ]"
            v-model='this.grade.gradeName'
            placeholder="请输入你想要新增的年级名称"
          ></a-input>
        </a-form-item>
        <a-form-item label="课程">
          <a-select
            v-decorator="[
              'subject',
              { rules: [{ required: true, message: '请选择年级所需课程' }] }
            ]"
            v-model='this.grade.subjectEntities'
            placeholder="请选择年级所需课程"
          >
            <a-select-option
              v-for="b in this.adminGrades"
              :key="b.adminId"
              :value="b.adminId"
            >
              {{ b.adminName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { message } from "ant-design-vue";
const columns = [
  {
    title: "年级编号",
    dataIndex: "gradeId"
  },
  {
    title: "名称",
    dataIndex: "gradeName"
  },
  {
    title: "级部",
    dataIndex: "adminName"
  },
  {
    title: "课程",
    dataIndex: "subjectEntities",
    customRender: (text, record) => {
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
      columns: columns,
      show: false,
      adminGrades: [
        { label: "高中部", value: "highschool" },
        { label: "初中部", value: "juniorhigh" },
        { label: "小学部", value: "primary" }
      ],
      grade:{},
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
      }
    };
  },
  async created() {
    let {
      data: { result, success }
    } = await this.$api.basic.grade.fetchGradeList();
    console.log(result, success);
    if (success) {
      this.dataSource = result;
    }
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
      let formData = this.form.getFieldsValue();
      let temptQuery={gradeId:this.grade.gradeId,gradeSubChildIds:[]}
      let res = await this.$api.basic.grade.saveGrade(temptQuery);
      console.log(formData,res);
      this.show = false;
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
      this.dataSource.unshift({
        key: 4,
        no: 4,
        name: "物理选修",
        grade: "高二文;高二理",
        type: "走班课"
      });
    },
    gotoNew(id) {
      this.$router.push("/basic/grade/subject?id=" + id);
    },
    async deleteItem(id) {
      let { data } = this.$api.basic.grade.deleteGrade({ id });
      if (data.success) {
        this.dataSource = this.dataSource.filter(item => item.gradeId == id);
        message.info("删除成功");
      }
    },
    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
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
