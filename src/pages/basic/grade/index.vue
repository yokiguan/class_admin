<template>
  <div>
    <!-- result -->
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item><a href="">基础数据</a></a-breadcrumb-item>
        <a-breadcrumb-item><a href="">年级管理</a></a-breadcrumb-item>
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
        <a-table :columns="columns"
                 :data-source="data"
                 :bordered="true"
                 :pagination="false"
                 style="width: 57%;margin-left: 20px;">
          <a-checkbox slot="checkBox" @change="change"></a-checkbox>
          <div slot="action">
            <button @click="lookCourse" style="float: left;background-color: #199ed8;color: white;border-radius: 5px;width:75px;height:20px;border: 0px">查看课程</button>
            <button @click="editCourse" style="background-color: #008000;color: white;border-radius: 5px;width:75px;height:20px;border: 0px">修改</button>
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
        <a-form-item label="级部" has-feedback>
          <a-select v-decorator="['级部',{ rules: [{ required: true, message: 'Please select your country!' }] },]"
                    placeholder="高中">
            <a-select-option value="junior">
              小学
            </a-select-option>
            <a-select-option value="middle">
              初中
            </a-select-option>
            <a-select-option value="senior">
              高中
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="年级名称" has-feedback>
          <a-select v-decorator="['年级名称',{ rules: [{ required: true, message: 'Please select your country!' }] },]"
                    placeholder="高一">
            <!--            <a-select-option value="junior">-->
            <!--              小学-->
            <!--            </a-select-option>-->
            <!--            <a-select-option value="middle">-->
            <!--              初中-->
            <!--            </a-select-option>-->
            <!--            <a-select-option value="senior">-->
            <!--              高中-->
            <!--            </a-select-option>-->
          </a-select>
        </a-form-item>
        <a-form-item label="课程" has-feedback>
          <a-tree-select
                  v-model="value"
                  :tree-data="treeData"
                  tree-checkable
                  :show-checked-strategy="SHOW_PARENT"
                  search-placeholder="Please select"
          />
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
        <a-form-item label="级部" has-feedback>
          <a-select v-decorator="['级部',{ rules: [{ required: true, message: 'Please select your country!' }] },]"
                    placeholder="高中">
            <a-select-option value="junior">
              小学
            </a-select-option>
            <a-select-option value="middle">
              初中
            </a-select-option>
            <a-select-option value="senior">
              高中
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="年级名称" has-feedback>
          <a-select v-decorator="['年级名称',{ rules: [{ required: true, message: 'Please select your country!' }] },]"
                    placeholder="高一">
            <!--            <a-select-option value="junior">-->
            <!--              小学-->
            <!--            </a-select-option>-->
            <!--            <a-select-option value="middle">-->
            <!--              初中-->
            <!--            </a-select-option>-->
            <!--            <a-select-option value="senior">-->
            <!--              高中-->
            <!--            </a-select-option>-->
          </a-select>
        </a-form-item>
        <a-form-item label="课程" has-feedback>
          <a-tree-select
                  v-model="value"
                  :tree-data="treeData"
                  tree-checkable
                  :show-checked-strategy="SHOW_PARENT"
                  search-placeholder="Please select"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import { TreeSelect } from 'ant-design-vue';
  const SHOW_PARENT = TreeSelect.SHOW_PARENT;
  const treeData = [
    {
      title: '物理',
      value: '0-0',
      key: '0-0',
      children: [
        {
          title: '物理学修',
          value: '0-0-0',
          key: '0-0-0',
        },
        {
          title: '物理选修',
          value: '0-0-1',
          key: '0-0-1',
        },
      ],
    },
    {
      title: '生物',
      value: '0-1',
      key: '0-1',
      children: [
        {
          title: '生物学修',
          value: '0-1-0',
          key: '0-1-0',
        },
        {
          title: '生物选修',
          value: '0-1-1',
          key: '0-1-1',
        },
      ],
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
      title:'年级',
      dataIndex:'grade',
      key:'grade',
      align:'center',
      width:'15%'
    },
    {
      title:'级部',
      dataIndex:'levelDepart',
      key:'levelDepart',
      align:'center',
      width:'15%'
    },
    {
      title:'课程名称',
      dataIndex:'name',
      key:'name',
      align:'center',
      width:'18%'
    },

    {
      title:'操作',
      dataIndex:'opts',
      key:'opts',
      align:'center',
      width:'53%',
      scopedSlots: { customRender: 'action' },
    },
  ]
  const data=[
    {
      serialNum:'1',
      grade:'高一',
      levelDepart:'高中部',
      name:'数学,语文,英语,日语',
    },
    {
      serialNum:'2',
      grade:'高二（文）',
      levelDepart:'高中部',
    },
    {
      serialNum:'3',
    },
    {

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
        value: ['语文'],
        treeData,
        SHOW_PARENT,
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
        this.$router.push('/basic/grade/subject')
      },
      editHandleSubmint(){
      },
      Delete(){
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
