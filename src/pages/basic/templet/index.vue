<template>
  <div>
    <!-- result -->
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item><a href="">基础数据</a></a-breadcrumb-item>
        <a-breadcrumb-item><a href="">课表模板管理</a></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <!-- /result -->
    <a-card class="table-bg">
      <a-row class="buttons">
        <a-col :span="3">
          <a-button @click="addClass" type="primary"
                    style="background-color: #1abc9c">新增</a-button>
        </a-col>
        <a-col :span="3">
          <a-button @click="edit" type="primary"
                    style="background-color: #1abc9c">编辑</a-button>
        </a-col>
        <a-col :span="3">
          <a-button @click="Delete" style="background-color: #ff0000">删除</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-table :rowKey="'key'"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                 :selectedRows="selectedRows"
                 :columns="columns"
                 :data-source="data"
                 :bordered="true"
                 :pagination="false"
                 style="width:48%;margin-left: 20px;">
        </a-table>
      </a-row>
    </a-card>
  </div>
</template>
<script>
  const columns=[
    {
      title:'序号',
      dataIndex:'serialNum',
      key:'serialNum',
      align:'center',
      width:'22%'
    },
    {
      title:'模板名称',
      dataIndex:'name',
      key:'name',
      align:'center',
      width:'35%'
    },
    {
      title:'一周工作日数',
      dataIndex:'workDays',
      key:'workDays',
      align:'center',
      width:'22%'
    },
    {
      title:'休息天数',
      dataIndex:'restDays',
      key:'restDays',
      align:'center',
      width:'21%'
    },
  ]
  const data=[
    {
      key:'1',
      serialNum:'1',
      name:'高一组课表模板',
      workDays:'7',
      restDays:'2'
    },
    {
      key:'2',
      serialNum:'2',
      name:'高二组课表模板',
      workDays:'7',
      restDays:'1'
    },
    {
      key:'3',
      serialNum:'3',
      name:'高三组课表模板',
    },
    {
      key:'4',
    }
  ]
  export default {
    data() {
      return {
        columns,
        data,
        selectedRowKeys: [], // Check here to configure the default column
        selectedRows:[],
      };
    },
    methods:{
      addClass() {
        this.$router.push('/basic/template/detail')
      },
      edit() {
        this.$router.push('/basic/template/detail')
      },
      onSelectChange( selectedRowKeys,selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows=selectedRows
      },
      Delete(){
        this.data = this.data.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
        this.selectedRows = this.selectedRows.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
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
  .table-bg{
    background-color: white;
    margin: 0px 0px 20px 0px;
    padding: 20px 25px;
    border-radius: 5px;
    text-align: center;
    width: 100%;
    height: 500px;

  }
  .buttons{
    margin:0px 5px 20px 5px;
    padding:2px 4px;
    margin-left: 30px;
  }
  .buttons button{
    width: 110px;
    height: 45px;
    color:white;
  }
  /deep/ Table {
    .ant-table-thead > tr > th {
      background-color: #f4f4f4;
    }
  }

</style>
