<template>
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
      ><span slot="operation" slot-scope="text, record">
     <a @click="gotoNew(record.id)">编辑</a>
     |
     <a @click="deleteItem(record.id)">删除</a>
    </span></a-table>
    </div>
  </a-card>
</template>

<script>
import{message} from 'ant-design-vue'
// import {success} from  '@/'
const columns = [
  {
    title: "模板编号",
    dataIndex: "id",
  },
  {
    title: "模板名称",
    dataIndex: "templateName",
  },
  {
    title: "一周工作日",
    dataIndex: "workday",
    customRender: (text) => text + " 天",
  },
  {
    title: "休息天数",
    dataIndex: "restday",
    customRender: (text) => text + " 天",
  },
  {
    title: "操作",
    key: "operation",
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
   let {data}=await this.$api.basic.template.fetchList()
    this.dataSource=data.rows
  },
  methods: {
    gotoNew(id) {
      this.$router.push('/basic/template/detail?id='+id)
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
