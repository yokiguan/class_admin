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
      ><span slot="operation" slot-scope="text, record">
          <a @click="showModal(record)">编辑</a>
          |
          <a @click="deleteItem(record.id)">删除</a>
          |<a @click="gotoNew(record.id)">子课程</a>
        </span>
      </a-table>
    </div>
    <a-modal
            title="新增课程"
            :visible="show"
            @ok="handleOk"
            @cancel="handleCancel"
    >
      <a-form :form="form" v-bind="formItemLayout">
        <a-form-item label="科目名称">
          <a-input
                  v-decorator="[
              'subName',
              { rules: [{ required: true, message: '请输入科目名称' }] }
            ]"
                  placeholder="请输入你想要新增的科目名称"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
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
        selectedRowKeys: [],
        selectedRows: []
      };
    },
    async created() {
      let { data } = await this.$api.basic.subject.fetchMainList();
      this.dataSource=data.rows
      console.log(data);
    },
    beforeCreate() {
      this.form = this.$form.createForm(this, { name: "subject" });
    },
    methods: {
      showModal(){
        this.show=true
      },
      async handleOk() {
        let formData = this.form.getFieldsValue();
        let res = await this.$api.basic.subject.saveMain(formData);
        console.log(formData,res);
        this.dataSource.unshift(formData)
        this.show = false;
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
      deleteItem(id) {
        let { data } = this.$api.basic.subject.deleteMain({ ids:[id] });
        if (data.success)
          this.dataSource = this.dataSource.filter(i => i.roomId == id);
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
