<template>
  <div>
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>基础设置</a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="#">主课程</router-link></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
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
  </div>
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
@media screen and (max-width: 900px) {

}
</style>
