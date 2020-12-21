<template>
  <EasyScrollbar :barOption="myBarOption">
    <div id="wrapper" style="width: 600px">
      <div style="width: 1800px">
        <div class="left">
          <a-tree
                  :tree-data="treeData"
                  :replace-fields="replaceFields"
                  @select="onSelect"
                  @check="onCheck"
                  checkable
                  style="font-size: 1.3em;"/>
        </div>
        <div class="right">
            <standard-table
                    :rowKey="'key'"
                    :columns="columns"
                    :subName="'规则设置'"
                    :dataSource="dataSource"
                    :selectedRows="selectedRows"
                    @change="onchange"/>
        </div>
      </div>
    </div>
  </EasyScrollbar>

</template>
<script>
  import StandardTable from "../../../components/table/StandardTable";
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
      title: '所授课程',
      dataIndex: 'subjects',
    },
    {
      title: '是否为班主任',
      dataIndex: 'isAdmin',
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
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
    subjects:'高一数学',
    isAdmin:'高一（1）',
    phone:'1234567890'
  },{
    key:2,
    no:2,
    name:'小管',
    subjects:'高二物理选修；高二物理学修',
    isAdmin:'无',
    phone:'15868123431'
  },{
    key:3,
    no:3,
    name:'Evan Hansen',
    subjects:'高二物理选修；高二物理学修',
    isAdmin:'无',
    phone:'15868123431'
  }]
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
    components:{StandardTable},
    data() {
      return {
        columns,
        dataSource,
        treeData,
        loading:false,
        addClassVisit: false,
        editVisit: false,
        value: ['高一1班'],
        myBarOption:{
          barColor:'block'
        },
        replaceFields: {
          children: 'child',
          title: 'name',
        },
        disabled: false,
        selectedRowKeys: [],
        selectedRows: []
      };
    },
    methods: {
      addClass() {
        this.addClassVisit = true;
      },
      handleOk() {
        this.loading = true;
        setTimeout(() => {
          this.addClassVisit = false;
          this.loading = false;
        }, 2000);
      },
      handleCancel() {
        this.addClassVisit = false;
      },
      onSelect(selectedKeys, info) {
        console.log('selected', selectedKeys, info);
      },
      onCheck(checkedKeys, info) {
        console.log('onCheck', checkedKeys, info);
      },
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
          subjects:'高二物理选修；高二物理学修',
          isAdmin:'无',
          phone:'15868123431'
        })
      },
      handleMenuClick (e) {
        if (e.key === 'delete') {
          this.remove()
        }
      }
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
    margin-top: -915px;
    margin-left: 320px;
    padding: 20px 0px 0px 20px;
    background-color: white;
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
  /deep/ Table {
    .ant-table-thead > tr > th {
      background-color: #f4f4f4;
    }
  }
</style>

