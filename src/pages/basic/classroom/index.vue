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
      <standard-table
              :rowKey="'key'"
              :columns="columns"
              :dataSource="dataSource"
              :selectedRows="selectedRows"
              @change="onchange"
      />
    </div>
  </a-card>
</template>

<script>
  import StandardTable from '../../../components/table/StandardTable'
  const columns = [
    {
      title: '教室编号',
      dataIndex: 'no'
    },
    {
      title: '教室名称',
      dataIndex: 'name'
    },
    {
      title: '楼层',
      dataIndex: 'floor',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '所属教学楼',
      dataIndex: 'building',
    },
    {
      title: '容纳人数',
      dataIndex: 'capacity',
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

  const dataSource = [{
    key:1,
    no:1,
    name:'主楼101',
    floor:1,
    type:'公共教学场所',
    building:'主楼101',
    capacity:200,
    status:1
  },{
    key:2,
    no:2,
    name:'化学实验',
    floor:2,
    type:'专用场所',
    building:'实验楼101',
    capacity:200,
    status:2
  },{
    key:3,
    no:3,
    name:'高一（1）',
    floor:2,
    type:'行政班级',
    building:'逸夫楼101',
    capacity:200,
    status:2
  }]

  export default {
    name: 'classroom',
    components: {StandardTable},
    data () {
      return {
        columns: columns,
        dataSource: dataSource,
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
