<template>
  <div>
    <!-- result -->
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item><a href="">基础数据</a></a-breadcrumb-item>
        <a-breadcrumb-item><a href="">子课程管理</a></a-breadcrumb-item>
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
        <a-table :rowKey="'key'"
                 :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                 :selectedRows="selectedRows"
                :columns="columns"
                 :data-source="data"
                 :bordered="true"
                 :pagination="false"
                 style="width: 63%;margin-left: 20px;">
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
        <a-form-item label="子科目名称：">
          <a-input placeholder="请输入"
                   v-decorate="['note',{rules:[{required:true,message:'请输入类名名称'}]}]"
                   style="width: 275px"></a-input>
        </a-form-item>
        <a-form-item label="所属年级：" has-feedback>
          <a-select v-decorator="['所属年级',
          { rules: [{ required: true, message: '请选择年级!' }] },]"
                    placeholder="请选择" style="width: 275px">
            <a-select-option value="one">
              高一
            </a-select-option>
            <a-select-option value="two">
              高二
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="所属类别：" has-feedback>
          <a-select v-decorator="['所属类别',
          { rules: [{ required: true, message: '请选择类别！' }] },]"
                    placeholder="请选择" style="width: 275px">
            <!--            <a-select-option value="one">-->
            <!--              高一-->
            <!--            </a-select-option>-->
            <!--            <a-select-option value="two">-->
            <!--              高二-->
            <!--            </a-select-option>-->
          </a-select>
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
        <a-form-item label="子科目名称：">
          <a-input placeholder="请输入"
                   v-decorate="['note',{rules:[{required:true,message:'请输入类名名称'}]}]"
                   style="width: 275px"></a-input>
        </a-form-item>
        <a-form-item label="所属年级：" has-feedback>
          <a-select v-decorator="['所属年级',
          { rules: [{ required: true, message: '请选择年级!' }] },]"
                    placeholder="请选择" style="width: 275px">
            <a-select-option value="one">
              高一
            </a-select-option>
            <a-select-option value="two">
              高二
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="所属类别：" has-feedback>
          <a-select v-decorator="['所属类别',
          { rules: [{ required: true, message: '请选择类别！' }] },]"
                    placeholder="请选择" style="width: 275px">
            <!--            <a-select-option value="one">-->
            <!--              高一-->
            <!--            </a-select-option>-->
            <!--            <a-select-option value="two">-->
            <!--              高二-->
            <!--            </a-select-option>-->
          </a-select>
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
      title:'年级',
      dataIndex:'grade',
      key:'grade',
      align:'center',
      width:'20%'
    },
    {
      title:'类型',
      dataIndex:'kinds',
      key:'kinds',
      align:'center',
      width:'20%'
    },
    {
      title:'图片管理',
      dataIndex:'picture',
      key:'picture',
      align:'center',
      width:'20%'
    },
  ]
  const data=[
    {
      key:'1',
      serialNum:'1',
      name:'物理',
      grade:'高一',
      kinds:'行政班课',
    },
    {
      key:'2',
      serialNum:'2',
      name:'物理选修',
      grade:'高二文，高二理',
      kinds:'走班课',
    },
    {
      key:'3',
      serialNum:'3',
      name:'物理学修',
      grade:'高二文，高二理',
      kinds:'走班课',
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
