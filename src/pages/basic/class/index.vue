<template>
  <EasyScrollbar :barOption="myBarOption">
    <div id="wrapper" style="width: 600px">
      <div style="width: 1800px">
        <div class="result">
          <a-breadcrumb>
            <a-breadcrumb-item>首页</a-breadcrumb-item>
            <a-breadcrumb-item><a href="">基础数据</a></a-breadcrumb-item>
            <a-breadcrumb-item><a href="">行政班管理</a></a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="left">
          <a-tree
                  :tree-data="treeData"
                  :default-expanded-keys="['0-0-0', '0-0-1']"
                  :default-selected-keys="['0-0-0', '0-0-1']"
                  :default-checked-keys="['0-0-0', '0-0-1']"
                  :replace-fields="replaceFields"
                  @select="onSelect"
                  @check="onCheck"
                  checkable
                  style="font-size: 1.3em;"/>
        </div>
        <div class="right">
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
              <a-table :rowKey="'key'"
                       :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                       :selectedRows="selectedRows"
                      :columns="columns"
                       :data-source="data"
                       :bordered="true"
                       :pagination="false"
                       style="width: 55%;margin-left: 20px;margin-top: 20px">
                <a-checkbox slot="checkBox" @change="change"></a-checkbox>
                <div slot="action">
                  <button @click="personManage" style="float: left;background-color: #199ed8;color: white;border-radius: 5px;width:75px;height:20px;border: 0px">人员管理</button>
                  <button @click="editAdmin" style="background-color: #008000;color: white;border-radius: 5px;width:75px;height:20px;border: 0px">修改</button>
                </div>
              </a-table>
            </a-row>
          </a-card>
        </div>
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
            <a-form-item label="名称">
              <a-input placeholder="1班" v-decorator="['课程', { rules: [{ required: true, message: '请输入班级!' }] }]"/>
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
          <a-form :form="form" :label-col="{span:5}" :wrapper-col="{span:12}" @submit="editHandleSubmint"
                  style="margin-left: 70px">
            <a-form-item label="名称">
              <a-input placeholder="1班" v-decorator="['课程', { rules: [{ required: true, message: '请输入班级!' }] }]"/>
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </div>
  </EasyScrollbar>

</template>
<script>
  const columns=[
    {
      title:'序号',
      dataIndex:'serialNum',
      key:'serialNum',
      align:'center',
      width:'15%'
    }, {
      title:'班级',
      dataIndex:'class',
      key:'class',
      align:'center',
      width:'17%'
    },
    {
      title:'所属年级',
      dataIndex:'grade',
      key:'grade',
      align:'center',
      width:'17%'
    },
    {
      title:'人数',
      dataIndex:'num',
      key:'num',
      align:'center',
      width:'17%'
    },
    {
      title:'操作',
      dataIndex:'opts',
      key:'opts',
      align:'center',
      width:'37%',
      scopedSlots: { customRender: 'action' },
    },
  ]
  const data=[
    {
      key:'1',
      serialNum:'1',
      class:'高一1班',
      grade:'高一',
      num:'40'
    },
    {
      key:'2',
      serialNum:'2',
      class:'高一2班',
      grade:'高一',
      num:'41'
    },
    {
      key:'3',
      serialNum:'3',
    },
    {
      key:'4',
    }
  ]
  const treeData = [
    {
      name: '高中部',
      key: '0-0',
      child: [
        { name: '高一', key: '0-0-0'},
        { name: '高二', key: '0-0-1' },
        { name: '高三', key: '0-0-2' },
      ],
    },{
      name: '初中部',
      key: '0-1',
      child: [
        { name: '初一', key: '0-1-0'},
        { name: '初二', key: '0-1-1' },
        { name: '初三', key: '0-1-2' },
      ],
    },
  ];
  export default {
    data() {
      return {
        columns,
        data,
        treeData,
        loading:false,
        addClassVisit: false,
        editVisit: false,
        myBarOption:{
          barColor:'block'
        },
        disabled: false,
        replaceFields: {
          children: 'child',
          title: 'name',
        },
        selectedRowKeys: [], // Check here to configure the default column
        selectedRows:[],
      };
    },
    methods: {
      addClass() {
        this.addClassVisit = true;
      },
      editAdmin() {
        this.editVisit = true;
      },
      personManage(){
        this.$router.push('/basic/class/member')
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
        }, 2000);
      },
      handleCancel() {
        this.addClassVisit = false;
        this.editVisit = false;
      },
      form(){},
      onSelect(){},
      onCheck(){},
      change(){},
      addClassHandleSubmint(){},
    },
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
  .left{
    width: 300px;
    height: 900px;
    background-color: white;
    margin: 0px 0px 20px 0px;
    padding: 20px 25px;
    border-radius: 10px;
  }
  .right{
    border-radius: 5px;
    margin-top: -935px;
    margin-left: 320px;
    height:700px;
  }
  .title{
    width: 100%;
    background-color: #fff;
    height: 170px;
    padding: 20px 25px;
    border-radius: 10px;
    margin-bottom: 50px;
  }
  .table-bg{
    background-color: white;
    margin-top: 35px;
    padding: 20px 25px;
    border-radius: 5px;
    text-align: center;
    width: 100%;
    height: 700px;
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

