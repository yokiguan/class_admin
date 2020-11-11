<template>
  <EasyScrollbar :barOption="myBarOption">
    <div id="wrapper" style="width: 600px">
      <div style="width: 1800px">
        <div class="result">
          <a-breadcrumb>
            <a-breadcrumb-item>首页</a-breadcrumb-item>
            <a-breadcrumb-item><a href="">基础数据</a></a-breadcrumb-item>
            <a-breadcrumb-item><a href="">教师管理</a></a-breadcrumb-item>
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
                <a-button @click="edit" type="primary"
                          style="background-color: #1abc9c">编辑</a-button>
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
                  <span>操作</span>
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
            <a-form-item label="老师姓名">
              <a-input style="width: 300px" placeholder="请输入" v-decorator="['老师姓名', { rules: [{ required: true, message: '请输入老师姓名!' }] }]"/>
            </a-form-item>
            <a-form-item label="联系电话">
              <a-input style="width: 300px" placeholder="请输入" v-decorator="['联系电话', { rules: [{ required: true, message: '请输入联系电话!' }] }]"/>
            </a-form-item>
            <a-form-item label="其他授课年级" has-feedback>
              <a-select v-decorator="['其他授课年级',{ rules: [{ required: true, message: '请选择授课年级!' }] },]"
                        placeholder="请选择">
                <!--                <a-select-option value="china">China</a-select-option>-->
                <!--                <a-select-option value="usa">U.S.A</a-select-option>-->
              </a-select>
            </a-form-item>
            <a-form-item label="是否是班主任">
              <a-radio-group v-decorator="['是否是班主任']">
                <a-radio :value="yes">
                  是
                </a-radio>
                <a-radio :value="No">
                  否
                </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="选择班级" has-feedback>
              <a-tree-select
                      v-model="value"
                      :tree-data="chooseClassData"
                      tree-checkable
                      :show-checked-strategy="SHOW_PARENT"
                      search-placeholder="Please select"/>
            </a-form-item>
            <a-form-item label="所授课程">
              <a-input-search style="margin-bottom: 8px" placeholder="请输入" @change="onChange" />
              <a-tree
                      :show-line="showLine"
                      :expanded-keys="expandedKeys"
                      :auto-expand-parent="autoExpandParent"
                      :tree-data="gData"
                      @expand="onExpand">
                <template slot="title" slot-scope="{ title }">
                  <span v-if="title.indexOf(searchValue) > -1">
                    {{ title.substr(0, title.indexOf(searchValue)) }}
                     <span style="color: #f50">{{ searchValue }}</span>
                      {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
                    </span>
                  <span v-else>{{ title }}</span>
                </template>
              </a-tree>
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </div>
  </EasyScrollbar>

</template>
<script>
  import { TreeSelect } from 'ant-design-vue';
  const SHOW_PARENT = TreeSelect.SHOW_PARENT;
  const chooseClassData = [
    {
      title: '物理',
      value: '0-0',
      key: '0-0',
    },
    {
      title: '生物',
      value: '0-1',
      key: '0-1',
    },
  ];
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
  const x = 3;
  const y = 2;
  const z = 1;
  const gData = [
    {
      title:'物理',
      key:'0-0',
      child:[],
    },{
      title: '语文',
      key:'0-1',
      child: [],
    },{
      title: '数学',
      key:'0-2',
      child: [],
    },{
      title: '化学',
      key:'0-3',
      child: [],
    },{
      title: '生物',
      key:'0-4',
      child: [],
    },{
      title: '外语',
      key:'0-5',
      child: [],},];

  const generateData = (_level, _preKey, _tns) => {
    const preKey = _preKey || '0';
    const tns = _tns || gData;

    const children = [];
    for (let i = 0; i < x; i++) {
      const key = `${preKey}-${i}`;
      tns.push({ title: key, key, scopedSlots: { title: 'title' } });
      if (i < y) {
        children.push(key);
      }
    }
    if (_level < 0) {
      return tns;
    }
    const level = _level - 1;
    children.forEach((key, index) => {
      tns[index].children = [];
      return generateData(level, key, tns[index].children);
    });
  };
  generateData(z);

  const dataList = [];
  const generateList = data => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const key = node.key;
      dataList.push({ key});
      if (node.children) {
        generateList(node.children);
      }
    }
  };
  generateList(gData);

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };
  export default {
    data() {
      return {
        columns,
        data,
        treeData,
        loading:false,
        addClassVisit: false,
        editVisit: false,
        value: ['高一1班'],
        chooseClassData,
        SHOW_PARENT,
        myBarOption:{
          barColor:'block'
        },
        disabled: false,
        replaceFields: {
          children: 'child',
          title: 'name',
        },
        showLine: true,

        expandedKeys: [],
        searchValue: '',
        autoExpandParent: true,
        gData,
      };
    },
    methods: {
      addClass() {
        this.addClassVisit = true;
      },
      edit(){
        this. editVisit= true;
      },
      opt(){},
      addClassHandleSubmint(){
      },
      editHandleSubmint(){
      },
      Delete(){
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


      onExpand(expandedKeys) {
        this.expandedKeys = expandedKeys;
        this.autoExpandParent = false;
      },
      onChange(e) {
        const value = e.target.value;
        const expandedKeys = dataList
                .map(item => {
                  if (item.title.indexOf(value) > -1) {
                    return getParentKey(item.key, gData);
                  }
                  return null;
                })
                .filter((item, i, self) => item && self.indexOf(item) === i);
        Object.assign(this, {
          expandedKeys,
          searchValue: value,
          autoExpandParent: true,
        });
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

