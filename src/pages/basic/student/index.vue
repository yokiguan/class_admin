<template>
  <a-card>
    <div>
      <div class="operator">
        <a-button @click="addNew" type="primary">新建</a-button>
        <a-button >批量操作</a-button>
        <a-dropdown>
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item key="delete">删除</a-menu-item>
            <a-menu-item key="audit">批量导入</a-menu-item>
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
    title: '序号',
    dataIndex: 'no'
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '学号',
    dataIndex: 'studentID',
  },
  {
    title: '所属年级',
    dataIndex: 'grade',
  },
  {
    title: '班级',
    dataIndex: 'class',
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
    name:'车西明',
    studentID:'021921',
    grade:'高一',
    class:'高一（1）',
},{
    key:2,
    no:2,
    name:'小管',
    grade:'高一',
    class:'高一（2）',
},{
    key:3,
    no:3,
    name:'Evan Hansen',
    studentID:'2324424',
    grade:'高二',
    class:'高一（1）',
}]

export default {
  name: 'student',
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
    name:'Hamilton',
    studentID:'2324424',
    grade:'高二',
    class:'高一（1）',
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
