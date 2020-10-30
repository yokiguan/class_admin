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
        rowKey="gradeId"
        :columns="columns"
        :subName="'查看课程'"
        :dataSource="dataSource"
        :selectedRows="selectedRows"
        @change="onchange"
      >
        <span slot="operation" slot-scope="text, record">
     <a @click="gotoNew(record.id)">编辑</a>
     |
     <a @click="deleteItem(record.gradeId)">删除</a>
     |
     <a @click="gotoNew(record.id)">查看课程</a>
    </span></a-table>
    </div>
  </a-card>
</template>

<script>
import{message} from 'ant-design-vue'
const columns = [
  {
    title: '年级编号',
    dataIndex: 'gradeId'
  },
  {
    title: '名称',
    dataIndex: 'gradeName'
  },
  {
    title: '级部',
    dataIndex: 'adminName',
  },
  {
    title: '课程',
    dataIndex: 'subjectEntities',
    customRender:(text,record)=>{
      let t=record.subjectEntities?record.subjectEntities.forEach(item=>item=item.name)?.join(','):''
      console.log(t);
      return t
    }
  },
  {
    title: '操作',
    key: 'operation',
    scopedSlots: { customRender: 'operation' },
  }
]

export default {
  name: 'grade',
  data () {
    return {
      columns: columns,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  async created(){
   let {data:{result,success}}=await this.$api.basic.grade.fetchGradeList()
   console.log(result,success);
   if(success){
     this.dataSource=result
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
    key:4,
    no:4,
    name:'物理选修',
    grade:'高二文;高二理',
    type:'走班课'
})
    },
     gotoNew(id) {
      this.$router.push('/basic/grade/subject?id='+id)
    },
    async deleteItem(id){
      let{data}=this.$api.basic.grade.deleteGrade({id})
      if(data.success){
      this.dataSource=this.dataSource.filter(item=>item.gradeId==id)
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
