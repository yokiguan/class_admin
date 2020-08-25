<template>
<div>
    <div class="search-head">
        <div class="search-input">
          <a-input-search class="search-ipt" style="width: 522px" placeholder="请输入..." size="large" enterButton="搜索" />
        </div>
      </div>
      <div class="search-content">
  <a-card>
      <simple-table
      :rowKey="'name'"
        :columns="columns"
        :dataSource="dataSource"
      />
  </a-card>
</div>
</div>
</template>

<script>
import SimpleTable from '../../../components/table/SimpleTable'
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
  components: {SimpleTable},
  data () {
    return {
      columns: columns,
      dataSource: dataSource,
    }
  },
  methods: {

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
<style lang="less" scoped>
  .search-head{
    background-color: @base-bg-color;
    margin: -25px -24px -24px;
    .search-input{
      text-align: center;
      padding: 20px 0
    }
  }
  .search-content{
    margin-top: 48px;
  }
</style>
