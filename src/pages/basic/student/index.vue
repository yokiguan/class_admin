<template>
  <EasyScrollbar :barOption="myBarOption">
    <div id="wrapper" style="width: 600px">
      <div style="width: 1800px">
        <div class="result">
          <a-breadcrumb>
            <a-breadcrumb-item>首页</a-breadcrumb-item>
            <a-breadcrumb-item><a href="">基础数据</a></a-breadcrumb-item>
            <a-breadcrumb-item><a href="">学生管理</a></a-breadcrumb-item>
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
              <a-col :span="3">
                <a-button @click="input" type="primary"
                          style="background-color: #1abc9c">批量导入</a-button>
              </a-col>
            </a-row>
            <a-row>
              <a-table :columns="columns"
                       :data-source="data"
                       :bordered="true"
                       :pagination="false"
                       style="width: 75%;margin-left: 20px;margin-top: 20px">
                <a-checkbox slot="checkBox" @change="change"></a-checkbox>
                <div slot="action">
                  <button @click="lookStudent" style="float: left;background-color: #199ed8;color: white;border-radius: 5px;width:75px;height:20px;border: 0px">查看</button>
                  <button @click="editStudent" style="background-color: #008000;color: white;border-radius: 5px;width:75px;height:20px;border: 0px">修改</button>
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
            <a-form-item label="学生姓名">
              <a-input style="width: 300px" placeholder="车东明" v-decorator="['学生姓名', { rules: [{ required: true, message: '请输入学生姓名!' }] }]"/>
            </a-form-item>
            <a-form-item label="学号">
              <a-input style="width: 300px" placeholder="007" v-decorator="['学号', { rules: [{ required: true, message: '请输入学号!' }] }]"/>
            </a-form-item>
          </a-form>
        </a-modal>
        <a-modal
                :visible='lookStudentVisit'
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
          <a-form :form="form" :label-col="{span:5}" :wrapper-col="{span:12}" @submit="lookHandleSubmint"
                  style="margin-left: 70px">
            <a-form-item label="学生姓名">
              <a-input style="width: 300px" placeholder="车东明" v-decorator="['学生姓名', { rules: [{ required: true, message: '请输入学生姓名!' }] }]"/>
            </a-form-item>
            <a-form-item label="学号">
              <a-input style="width: 300px" placeholder="007" v-decorator="['学号', { rules: [{ required: true, message: '请输入学号!' }] }]"/>
            </a-form-item>
          </a-form>
        </a-modal>
        <a-modal
                :visible='editStudentVisit'
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
            <a-form-item label="学生姓名">
              <a-input style="width: 300px" placeholder="车东明" v-decorator="['学生姓名', { rules: [{ required: true, message: '请输入学生姓名!' }] }]"/>
            </a-form-item>
            <a-form-item label="学号">
              <a-input style="width: 300px" placeholder="007" v-decorator="['学号', { rules: [{ required: true, message: '请输入学号!' }] }]"/>
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
      title:'',
      dataIndex:'blank',
      key:'blank',
      scopedSlots:{customRender:'checkBox'},
      align:'center',
      width:'8%'
    },
    {
      title:'序号',
      dataIndex:'serialNum',
      key:'serialNum',
      align:'center',
      width:'13%'
    },
    {
      title:'学号',
      dataIndex:'num',
      key:'num',
      align:'center',
      width:'15%'
    },
    {
      title:'所属年级',
      dataIndex:'grade',
      key:'grade',
      align:'center',
      width:'15%'
    },{
      title:'班级',
      dataIndex:'class',
      key:'class',
      align:'center',
      width:'15%'
    },
    {
      title:'操作',
      dataIndex:'opts',
      key:'opts',
      align:'center',
      width:'31%',
      scopedSlots: { customRender: 'action' },
    },
  ]
  const data=[
    {
      serialNum:'1',
      name:'车东明',
      class:'高一1班',
      grade:'高一',
    },
    {
      serialNum:'2',
      class:'无',
      grade:'高一',
      name:'车西明',
    },
    {
      serialNum:'3',
    },
    {
    }
  ]
  const treeData = [
    {
      name: '高中部',
      key: '0-0',
      child: [
        { name: '高一',
          key: '0-0-0',
          child:[
            { name: '高一1班', key: '0-0-0-0' },
            {name:'高一2班',key:'0-0-0-1'},
            {name:'高一3班',key:'0-0-0-2'},
            {name:'高一4班',key:'0-0-0-3'},
          ],
        },
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
        editStudentVisit: false,
        lookStudentVisit: false,
        myBarOption:{
          barColor:'block'
        },
        disabled: false,
        replaceFields: {
          children: 'child',
          title: 'name',
        },
      };
    },
    methods: {
      addClass() {
        this.addClassVisit = true;
      },
      lookStudent(){
        this.lookStudentVisit = true;
      },
      editStudent(){
        this. editStudentVisit= true;
      },
      addClassHandleSubmint(){
      },
      editHandleSubmint(){
      },
      lookHandleSubmint(){
      },
      Delete(){
      },
      input(){
      },
      handleOk() {
        this.loading = true;
        setTimeout(() => {
          this.addClassVisit = false;
          this.editStudentVisit = false;
          this.lookStudentVisit = false;
          this.loading = false;
        }, 2000);
      },
      handleCancel() {
        this.addClassVisit = false;
        this.editStudentVisit = false;
        this.lookStudentVisit = false;
      },
      onSelect(selectedKeys, info) {
        console.log('selected', selectedKeys, info);
      },
      onCheck(checkedKeys, info) {
        console.log('onCheck', checkedKeys, info);
      },
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

