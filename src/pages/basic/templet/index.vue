<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button @click="gotoNew" type="primary">新建</a-button>
        <a-button>批量操作</a-button>
        <a-dropdown>
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item key="delete">删除</a-menu-item>
            <a-menu-item key="audit">审批</a-menu-item>
          </a-menu>
          <a-button>
            更多操作
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
      <a-table
        :rowKey="'id'"
        :columns="columns"
        :dataSource="dataSource"
        :selectedRows="selectedRows"
        subPath="/basic/template/detail"
        @change="onchange"
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
    onchange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    remove() {
      this.dataSource = this.dataSource.filter(
        (item) => this.selectedRowKeys.indexOf(item.key) < 0
      );
      this.selectedRows = this.selectedRows.filter(
        (item) => this.selectedRowKeys.indexOf(item.key) < 0
      );
    },
    gotoNew(id) {
      this.$router.push('/basic/template/detail?id='+id)
    },
    async deleteItem(id){
      let{data}=this.$api.basic.template.deleteTemplate({ids:id})
      if(data.success){
      this.dataSource=this.dataSource.filter(item=>item.id==id)
      message.info('删除成功')
      }
    },
    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
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
