<template>
  <div>
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item>基础设置</a-breadcrumb-item>
        <a-breadcrumb-item><router-link to="#">课表模板管理</router-link></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <a-card>
      <div>
        <div class="operator">
          <a-button @click="gotoNew" type="primary">新建</a-button>
        </div>
        <a-table
                :rowKey="'id'"
                :columns="columns"
                :dataSource="dataSource"
                subPath="/basic/template/detail"
        >
      <span slot="operation" slot-scope="text, record">
        <a @click="edit(record.id)">编辑</a>
        |
        <a-popconfirm v-if="dataSource.length"
                      title="确认删除?"
                      cancelText="取消"
                      okText="确定"
                      @confirm="() => deleteItem(record.id)">
          <a href="javascript:;">删除</a>
        </a-popconfirm>
    </span></a-table>
      </div>
    </a-card>
  </div>
</template>
<script>
import{message} from 'ant-design-vue'
const columns = [
  {
    title: "模板编号",
    dataIndex: "id",
    align:'center',
    customRender: function(t, r, index) {
      return parseInt(index) + 1
    }
  },
  {
    title: "模板名称",
    dataIndex: "templateName",
    align:'center',
  },
  {
    title: "一周工作日",
    dataIndex: "workday",
    align:'center',
    customRender: (text) => text + " 天",
  },
  {
    title: "休息天数",
    dataIndex: "restday",
    align:'center',
    customRender: (text) => text + " 天",
  },
  {
    title: "操作",
    key: "operation",
    align:'center',
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  name: "templet",
  data() {
    return {
      columns: columns,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
    };
  },
  async created(){
   let {data}=await this.$api.basic.template.fetchList();
    this.dataSource=data.rows
  },
  methods: {
    gotoNew(id) {
      this.$router.push('/basic/template/detail');
    },
    edit(id) {
      this.$router.push('/basic/template/detail?id='+id);
    },
    async deleteItem(id){
      let {data}= await this.$api.basic.template.deleteTemplate({ids:id})
      if(data&&data.success){
        let {data:templateData}=await this.$api.basic.template.fetchList()
        console.log("templateData",templateData)
        this.dataSource=templateData.rows
       message.info('删除成功')
      }else{
          message.info('删除失败')
      }
    },
  },
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
    .operator {
        margin-bottom: 18px;
    }
    @media screen and (max-width: 900px) {

    }
</style>
