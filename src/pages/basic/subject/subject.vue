<template>
  <a-card>
    <div>
      <a-table
        rowKey="id"
        :columns="columns"
        :subName="'子课程'"
        :subPath="'/basic/subject/subsubject'"
        :dataSource="dataSource"
        :selectedRows="selectedRows"
        ><span slot="operation" slot-scope="text,record">
          <a @click="gotoNew(record.id)">子课程</a>
        </span>
        </a-table>
    </div>
  </a-card>
</template>
<script>
const columns = [
  {
    title: "课程编号",
    dataIndex: "id",
      align:'center',
    customRender: function(t, r, index) {
      return parseInt(index) + 1
    }
  },
  {
    title: "名称",
    dataIndex: "subName",
    align:'center',
  },
  {
    title: "操作",
    dataIndex: "operation",
    align:'center',
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
      form:{
        subjectName:"",
      },
    };
  },
  async created() {
    let { data } = await this.$api.basic.subject.fetchMainList();
    this.dataSource=data.rows
  },
  methods: {
    onchange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    gotoNew(id) {
      this.$router.push("/basic/subject/subsubject?id=" + id);
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
