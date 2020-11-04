<template>
  <EasyScrollbar :barOption="myBarOption">
    <div id="wrapper" style="width: 600px">
      <div style="width: 1800px">
        <div class="result">
          <a-breadcrumb>
            <a-breadcrumb-item>首页</a-breadcrumb-item>
            <a-breadcrumb-item><a href="">基础数据</a></a-breadcrumb-item>
            <a-breadcrumb-item><a href="">教师排课规则</a></a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="left">
          <a-row class="left_title">
            <a-col :span="3"><a-icon type="reload" style="font-size: 1.5em;
                    font-weight: bold"/></a-col>
            <a-col :span="12"><span style="font-size: 1.2em">刷新菜单</span></a-col>
            <a-col><span style="font-size: 1.2em">全部展开</span></a-col>
          </a-row>
          <div style="width: 100%; height: 1px;
            margin-top: 10px;
            border-top: solid black 1px;"></div>
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
          <a-card class="table-bg1">
            <a-row style="height: 40px;width: 1300px;background-color:#6Db5a7;color: white;border-radius: 5px;border:1px solid black;margin-left: -35px;margin-top: -30px">
              <a-col>
                <span style="float: left;padding: 10px;">场地规则</span>
              </a-col>
            </a-row>
            <a-row>
              <a-form :form="form" :label-col="{span:2}" :wrapper-col="{span:12}" @submit="addClassHandleSubmint">
                <a-form-item label="选择课表模板" has-feedback>
                  <a-select v-decorator="['选择课表模板',{ rules: [{ required: true, message: '请选择课表模板!' }] },]"
                            placeholder="高一组课表模板">
                    <a-select-option value="one">高一组课表模板</a-select-option>
                    <a-select-option value="two">高二组课表模板</a-select-option>
                    <a-select-option value="three">高三组课表模板</a-select-option>
                  </a-select>
                </a-form-item>
              </a-form>
            </a-row>
            <a-row>
              <a-table :columns="columnsPlace"
                       :data-source="placeData"
                       :bordered="true"
                       :pagination="false"
                       style="width: 45%;margin-left: 50px;margin-top: 20px">
                <a-checkbox slot="checkBox" @change="change"></a-checkbox>
                <span slot="action">查看</span>
              </a-table>
            </a-row>
          </a-card>
          <a-card class="table-bg2">
            <a-row style="height: 40px;width: 1300px;background-color:#6Db5a7;color: white;border-radius: 5px;border:1px solid black;margin-left: -35px;margin-top: -30px">
              <a-col>
                <span style="float: left;padding: 10px;">课表</span>
              </a-col>
            </a-row>
            <a-row class="buttons-sub">
              <a-col :span="2">
                <a-button type="danger" style="color:white;
                              width: 100px;
                                height: 40px;">禁选</a-button>
              </a-col>
              <a-col :span="2">
                <a-button style="background-color:grey;
                      width: 100px;
                        height: 40px;color:white">普通</a-button>
              </a-col>
              <a-col :span="3">
                <a-button style="color:white;background-color: #1abc9c;width: 100px;
                              height: 40px;">优先</a-button>
              </a-col>
              <a-col :span="6" >
                <h3 style="float:left;">未设置默认为普通</h3>
              </a-col>
              <a-col :span="3">
                <a-button style="background-color:#1abc9c;
                              width: 100px;
                              height: 40px;color:white">保存</a-button>
              </a-col>
              <a-col :span="1">
                <a-button style="background-color:#1abc9c;
                              width: 100px;
                              height: 40px;color:white">重置</a-button>
              </a-col>
              <a-col >
                <a-button type="danger" style="color:white;
                              width: 100px;
                                height: 40px;">删除</a-button>
              </a-col>
            </a-row>
            <a-row>
              <a-table id="Table"
                       :columns="columns"
                       :data-source="tableData"
                       :pagination="false"
                       :bordered="true"
                        style="margin-top: 30px">
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

      </div>
    </div>
  </EasyScrollbar>

</template>
<script>
  const columnsPlace=[
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
      title:'规则名称',
      dataIndex:'regularName',
      key:'regularName',
      align:'center',
      width:'40%'
    },
    {
      title:'包含老师数量',
      dataIndex:'num',
      key:'num',
      align:'center',
      width:'24%'
    },
    {
      title:'操作',
      dataIndex:'opts',
      key:'opts',
      align:'center',
      width:'15%',
      scopedSlots: { customRender: 'action' },
    },
  ]
  const placeData=[
    {
      serialNum:'1',
      regularName:'英语老师时间规则',
      num:'2',
    },
    {
      serialNum:'2',
      regularName:'数学老师时间规则',
      num:'1',
    },
    {
      serialNum:'3',
      regularName:'体育老师时间规则',
      num:'1',
    },
    {
    }
  ]
  const treeData = [
    {
      name: '教学组',
      key: '0-0',
      child: [
        { name: '高一',
          key: '0-0-0',
          child:[{name:'语文',key:'0-0-0-0'}]
        },
        { name: '高二', key: '0-0-1' ,
          child:[
            { name:'语文', key: '0-0-2-0',},
            {name:'数学',key:'0-0-2-1'},
            {name:'英语',key:'0-0-2-2',
              child:[{
                name:'赵卫民',key:'0-0-0-2-0'},
                {name:'李援朝',key: '0-0-0-2-1'}]},
          ],},
        { name: '高三', key: '0-0-2' },
      ],
    },{
      name: '教务组',
      key: '0-1',
      child: [
        { name: '初一', key: '0-1-0'},
        { name: '初二', key: '0-1-1' },
        { name: '初三', key: '0-1-2' },
      ],
    },
  ];
  const columns = [
    {
      align: "center",
      title: " ",
      dataIndex: 'key',
      width:'12.5%',

    },
    {
      title: '星期一',
      dataIndex: 'one',
      key:'one',
      width:'12.5%',
      align:'center'
    },
    {
      title: '星期二',
      dataIndex: 'two',
      key:'two',
      width:'12.5%',
      align:'center'
    },
    {
      title: '星期三',
      dataIndex: 'three',
      key:'three',
      width:'12.5%',
      align:'center'
    },
    {
      title: '星期四',
      dataIndex: 'four',
      key: 'four',
      width:'12.5%',
      align:'center'
    },
    {
      title: '星期五',
      dataIndex: 'five',
      key: 'five',
      width:'12.5%',
      align:'center'
    },
    {
      title: '星期六',
      dataIndex: 'six',
      key:'six',
      width:'12.5%',
      align:'center'
    },
    {
      title: '星期日',
      dataIndex: 'seven',
      key:'seven',
      width:'12.5%',
      align:'center'
    },
  ];
  const tableData=[
    {
      key: '早读1',
      one:'6：00-7：00'

    },
    {
      key: '上午1',
      one:'8：30-9：00'
    },
    {
      key: '上午2',
      one:'9：00-10：00'
    },
    {
      key: '上午3',
      one:'10：30-11：30'
    },
    {
      key: '上午4',
      one:'11：30-12：30'
    },
    {
      key: '下午1',
    },
    {
      key: '下午2',
    },
    {
      key: '下午3',
    },
    {
      key: '下午4',
    },
    {
      key: '晚自习1',
    },
  ];
  export default {
    data() {
      return {
        columnsPlace,
        placeData,
        treeData,
        columns,
        tableData,
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
  .table-bg1{
    background-color: white;
    margin-top: 35px;
    padding: 20px 25px;
    border-radius: 10px;
    text-align: center;
    width: 100%;
    height: 440px;
  }
  .table-bg2{
    background-color: white;
    margin-top: 10px;
    padding: 20px 25px;
    border-radius: 10px;
    text-align: center;
    width: 100%;
    height: 800px;
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
  .buttons-sub{
    margin-top: 10px;
    padding:2px 4px;
  }
  /deep/ Table {
    .ant-table-thead > tr > th {
      background-color: #f4f4f4;
    }
    .ant-table-tbody > tr:nth-child(2) > td:nth-child(2){
      background-color: #f00;
      color: white;
      }
    .ant-table-tbody > tr:first-child > td:nth-child(5),
    .ant-table-tbody > tr:first-child > td:nth-child(4),
    .ant-table-tbody > tr:first-child > td:nth-child(3){
      background-color: #bcbcbc;
    }
    .ant-table-tbody > tr:nth-child(2) > td:nth-child(3){
      background-color: #1abc9c;
    }
  }
</style>

