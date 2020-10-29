<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button @click="addNew" type="primary">新建</a-button>
        <a-button >批量操作</a-button>
        <a-dropdown>
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item key="delete">删除</a-menu-item>
            <a-menu-item key="audit">审批</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
      <a-table
        rowKey="buildingId"
        :columns="columns"
        :dataSource="dataSource"
        :selectedRows="selectedRows"
        @change="onchange"
      >
      <span slot="operation" slot-scope="text, record">
     <a @click="gotoNew(record.id)">编辑</a>
     |
     <a @click="deleteItem(record.buildingId)">删除</a>
    </span></a-table>
    </div>
  </a-card>
</template>

<script>
import {message} from 'ant-design-vue'
const columns = [
  {
    title: '教学楼编号',
    dataIndex: 'buildingId'
  },
  {
    title: '教学楼名称',
    dataIndex: 'name'
  },
  {
    title: '楼层',
    dataIndex: 'floor',
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender:(text)=>text==1?'可用':'已占用'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  }
]

export default {
  name: 'classroom',
   async created() {
    let { data } = await this.$api.basic.building.fetchList();
    this.dataSource = data.rows;
    console.log(data);
  },
  data () {
    return {
      columns: columns,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    onchange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    remove () {
      this.dataSource = this.dataSource.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
      this.selectedRows = this.selectedRows.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
    },
    addNew () {
      this.dataSource.unshift({
    key:3,
    no:3,
    name:'高一（1）',
    floor:2,
    type:'行政班级',
    building:'逸夫楼101',
    capacity:200,
    status:2
})
    },
    async deleteItem(id){
      let{data}=this.$api.basic.building.deleteBuilding({id})
      if(data.success){
      this.dataSource=this.dataSource.filter(item=>item.id==id)
      message.info('删除成功')
      }
    },
    handleMenuClick (e) {
      if (e.key === 'delete') {
        this.remove()
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .search{
    margin-bottom: 54px;
  }
  .fold{
    width: calc(100% - 216px);
    display: inline-block
  }
  .operator{
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
