<template>
  <div>
    <!-- result -->
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item><a href="">基础数据</a></a-breadcrumb-item>
        <a-breadcrumb-item><a href="">教学楼管理</a></a-breadcrumb-item>
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
          <a-button @click="Delete" style="background-color: #ff0000">删除</a-button>
        </a-col>
        <a-col :span="3">
          <a-button @click="edit" type="primary"
                    style="background-color: #1abc9c">编辑</a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-table  :rowKey="'key'"
                  :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                  :selectedRows="selectedRows"
                 :columns="columns"
                 :data-source="data"
                 :bordered="true"
                 :pagination="false"
                 style="width: 50%;margin-left: 20px;">
        </a-table>
      </a-row>
    </a-card>
    <a-modal
            :visible='addClassVisit'
            width="500px"
            :closable="false"
            on-ok="handleOk">
      <template slot="footer">
        <a-button key="SavaAdd" type="primary" :loading="loading" @click="handleOkAdd">
          保存并增加
        </a-button>
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">
          保存
        </a-button>
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
      </template>
      <a-form :form="form" :label-col="{span:5}" :wrapper-col="{span:12}" @submit="addClassHandleSubmint">
        <a-form-item label="类名名称：">
          <a-input placeholder="请输入"
                   v-decorate="['note',{rules:[{required:true,message:'请输入类名名称'}]}]"
                   style="width: 275px"></a-input>
        </a-form-item>
        <a-form-item label="楼层数：">
          <a-input
                  :rows="4"
                  placeholder="请输入"
                  v-decorate="['note',{rules:[{required:true,message:'请输入楼层数'}]}]"
                  style="width: 275px"></a-input>
        </a-form-item>
        <a-form-item label="是否启用">
          <a-switch v-decorator="['switch', { valuePropName: 'checked' }]" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
            :visible='editVisit'
            width="500px"
            :closable="false"
            on-ok="handleOk">
      <template slot="footer">
        <a-button key="SavaAdd" type="primary" :loading="loading" @click="handleOkAdd">
          保存并增加
        </a-button>
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">
          保存
        </a-button>
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
      </template>
      <a-form :form="form" :label-col="{span:5}" :wrapper-col="{span:12}" @submit="addClassHandleSubmint">
        <a-form-item label="类名名称：">
          <a-input placeholder="请输入"
                   v-decorate="['note',{rules:[{required:true,message:'请输入类名名称'}]}]"
                   style="width: 275px"></a-input>
        </a-form-item>
        <a-form-item label="楼层数：">
          <a-input
                  :rows="4"
                  placeholder="请输入"
                  v-decorate="['note',{rules:[{required:true,message:'请输入楼层数'}]}]"
                  style="width: 275px"></a-input>
        </a-form-item>
        <a-form-item label="是否启用">
          <a-switch v-decorator="['switch', { valuePropName: 'checked' }]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  const columns=[
    {
      title:'序号',
      dataIndex:'serialNum',
      key:'serialNum',
      align:'center',
      width:'25%'
    },
    {
      title:'教学楼名称',
      dataIndex:'name',
      key:'name',
      align:'center',
      width:'25%'
    },
    {
      title:'楼层数',
      dataIndex:'floor',
      key:'floor',
      align:'center',
      width:'25%'
    },
    {
      title:'状态',
      dataIndex:'situation',
      key:'situation',
      align:'center',
      width:'25%'
    },
  ]
  const data=[
    {
      key:'1',
      serialNum:'1',
      name:'主楼',
      floor:'3',
      situation:'可用',
    },
    {
      key:'2',
      serialNum:'2',
      name:'实验楼',
      floor:'6',
      situation:'不可用',
    },
    {
      key:'3',
      serialNum:'3',
      name:'逸夫楼',
      floor:'3',
      situation:'可用',
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
        loading:false,
        addClassVisit: false,
        editVisit: false,
        selectedRowKeys: [], // Check here to configure the default column
        selectedRows:[],
      };
    },
    methods:{
      addClass() {
        this.addClassVisit = true;
      },
      edit() {
        this.editVisit = true;
      },
      editHandleSubmint(){
      },
      onSelectChange( selectedRowKeys,selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows=selectedRows
      },
      Delete(){
        this.data = this.data.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
        this.selectedRows = this.selectedRows.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
      },
      handleOkAdd() {
        setTimeout(() => {
          this.addClassVisit = false;
          this.editVisit = false;
          this.loading = false;
        }, 2000);
      },
      handleOk() {
        this.loading = true;
        setTimeout(() => {
          this.addClassVisit = false;
          this.editVisit = false;
          this.loading = false;
        }, 2000);
      },
      handleCancel() {
        this.addClassVisit = false;
        this.editVisit = false;
      },
      addClassHandleSubmint(){},
      form(){},
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
