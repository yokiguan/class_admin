<template>
  <div>
    <!-- result -->
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item><a href="">基础数据</a></a-breadcrumb-item>
        <a-breadcrumb-item><a href="">课程管理</a></a-breadcrumb-item>
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
      </a-row>
      <a-row>
        <a-table  :rowKey="'key'"
                  :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                  :selectedRows="selectedRows"
                :columns="columns"
                 :data-source="data"
                 :bordered="true"
                 :pagination="false"
                 style="width: 63%;margin-left: 20px;">
          <div slot="action">
            <button @click="lookCourse" style="float: left;background-color: #199ed8;color: white;border-radius: 5px;width:75px;height:20px;border: 0px">查看</button>
            <button @click="editCourse" style="background-color: #008000;color: white;border-radius: 5px;width:75px;height:20px;border: 0px">修改</button>
            <button @click="childCourse" style="float: right;background-color: #199ed8;color: white;border-radius: 5px;width:75px;height:20px;border: 0px">子课程</button>
          </div>
        </a-table>
      </a-row>
    </a-card>
    <a-modal
            :visible='addClassVisit'
            width="600px"
            :closable="false"
            on-ok="handleOk">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">
          保存
        </a-button>
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
      </template>
      <a-form :form="form" :label-col="{span:5}" :wrapper-col="{span:12}" @submit="addClassHandleSubmint"
              style="margin-left: 70px">
        <a-form-item label="科目名称：">
          <a-input placeholder="请输入"
                   v-decorate="['note',{rules:[{required:true,message:'请输入科目名称'}]}]"
                   style="width: 275px"></a-input>
        </a-form-item>
        <a-form-item label="简称：">
          <a-input placeholder="请输入"
                   v-decorate="['note',{rules:[{required:true,message:'请输入简称！'}]}]"
                   style="width: 275px"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
            :visible='editVisit'
            width="600px"
            :closable="false"
            on-ok="handleOk">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">
          保存
        </a-button>
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
      </template>
      <a-form :form="form" :label-col="{span:5}" :wrapper-col="{span:12}" @submit="addClassHandleSubmint"
              style="margin-left: 70px">
        <a-form-item label="科目名称：">
          <a-input placeholder="请输入"
                   v-decorate="['note',{rules:[{required:true,message:'请输入科目名称'}]}]"
                   style="width: 275px"></a-input>
        </a-form-item>
        <a-form-item label="简称：">
          <a-input placeholder="请输入"
                   v-decorate="['note',{rules:[{required:true,message:'请输入简称！'}]}]"
                   style="width: 275px"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
            :visible='lookVisit'
            width="600px"
            :closable="false"
            on-ok="handleOk">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">
          保存
        </a-button>
        <a-button key="back" @click="handleCancel">
          取消
        </a-button>
      </template>
      <a-form :form="form" :label-col="{span:5}" :wrapper-col="{span:12}" @submit="addClassHandleSubmint"
              style="margin-left: 70px">
        <a-form-item label="科目名称：">
          <a-input placeholder="请输入"
                   v-decorate="['note',{rules:[{required:true,message:'请输入科目名称'}]}]"
                   style="width: 275px"></a-input>
        </a-form-item>
        <a-form-item label="简称：">
          <a-input placeholder="请输入"
                   v-decorate="['note',{rules:[{required:true,message:'请输入简称！'}]}]"
                   style="width: 275px"></a-input>
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
      width:'20%'
    },
    {
      title:'名称',
      dataIndex:'name',
      key:'name',
      align:'center',
      width:'20%'
    },
    {
      title:'简称',
      dataIndex:'abb',
      key:'abb',
      align:'center',
      width:'20%'
    },
    {
      title:'操作',
      dataIndex:'opts',
      key:'opts',
      align:'center',
      width:'40%',
      scopedSlots: { customRender: 'action' },
    },
  ]
  const data=[
    {
      key:'1',
      serialNum:'1',
      name:'物理',
      abb:'wl'
    },
    {
      key:'2',
      serialNum:'2',
      name:'语文',
      abb:'yw'
    },
    {
      key:'3',
      serialNum:'3',
      name:'数学',
      abb:'sx'
    },
    {
      key:'4'
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
        lookVisit:false,
        selectedRowKeys: [], // Check here to configure the default column
        selectedRows:[],
      };
    },
    methods:{
      addClass() {
        this.addClassVisit = true;
      },
      editCourse() {
        this.editVisit = true;
      },
      lookCourse(){
        this.lookVisit = true;
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
      handleOk() {
        this.loading = true;
        setTimeout(() => {
          this.addClassVisit = false;
          this.editVisit = false;
          this.loading = false;
          this.lookVisit = false;
        }, 2000);
      },
      handleCancel() {
        this.addClassVisit = false;
        this.editVisit = false;
        this.lookVisit = false;
      },
      childCourse(){
        this.$router.push('/basic/subject/subsubject')
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
