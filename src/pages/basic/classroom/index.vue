<template>
  <div>
    <!-- result -->
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item><a href="">基础数据</a></a-breadcrumb-item>
        <a-breadcrumb-item><a href="">教学场地管理</a></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <!-- /result -->
    <a-card class="table-bg">
      <a-row class="buttons">
        <a-col :span="3">
          <a-button @click="addClass" type="primary" style="background-color: #1abc9c">新增</a-button>
        </a-col>
        <a-col :span="3">
          <a-button @click="edit" type="primary" style="background-color: #1abc9c">编辑</a-button>
        </a-col>
        <a-col :span="3">
          <a-button @click="leadIn" style="background-color: #1abc9c">导入</a-button>
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
                 style="margin-left: 20px;">
        </a-table>
      </a-row>
    </a-card>
    <a-modal
            width="800px"
            :closable="false"
            v-model="editVisit">
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
        <a-form-item label="选择教学楼" has-feedback>
          <a-select v-decorator="['select',{ rules: [{ required: true, message: '请选择教学楼' }] },]"
                    placeholder="逸夫楼">
            <a-select-option value="yifu">
              逸夫楼
            </a-select-option>
            <a-select-option value="main">
              主楼
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择楼层" has-feedback>
          <a-select v-decorator="['选择楼层',{ rules: [{ required: true, message: '请选择楼层' }] },]"
                    placeholder="1">
            <a-select-option value="one">
              1
            </a-select-option>
            <a-select-option value="two">
              2
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="场地名称：">
          <a-input placeholder="请输入"
                   v-decorate="['note',{rules:[{required:true,message:'请输入类名名称'}]}]"
                   style="width: 380px"></a-input>
        </a-form-item>
        <a-form-item label="类型">
          <a-radio-group v-decorator="['类型']" @change="KindsOnChange">
            <a-radio value="private">专用教学场地</a-radio>
            <a-radio value="public">公共教学场地</a-radio>
            <a-radio value="admin">行政班教室</a-radio>
          </a-radio-group>
        </a-form-item>
        <div>
          <a-form-item label="最多上课人数：">
            <a-input-number  style="width: 380px" v-decorator="['input-number', { initialValue: 3 }]" :min="1" :max="100000" />
          </a-form-item>
          <a-form-item label="专用教学场地课程" has-feedback>
            <a-select v-decorator="['select',{ rules: [{ required: true, message: '请选择' }] },]"
                      placeholder="化学实验"
                      style="width: 380px">
              <a-select-option value="chemical">
                化学实验
              </a-select-option>
              <a-select-option value="biology">
                生物实验
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <a-form-item label="是否启用">
          <a-switch v-decorator="['switch', { valuePropName: 'checked' }]" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
            width="800px"
            :closable="false"
            v-model="addClassVisit">
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
        <a-form-item label="选择教学楼" has-feedback>
          <a-select v-decorator="['select',{ rules: [{ required: true, message: '请选择教学楼' }] },]"
                    placeholder="逸夫楼">
            <a-select-option value="yifu">
              逸夫楼
            </a-select-option>
            <a-select-option value="main">
              主楼
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="选择楼层" has-feedback>
          <a-select v-decorator="['选择楼层',{ rules: [{ required: true, message: '请选择楼层' }] },]"
                    placeholder="1">
            <a-select-option value="one">
              1
            </a-select-option>
            <a-select-option value="two">
              2
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="场地名称：">
          <a-input placeholder="请输入"
                   v-decorate="['note',{rules:[{required:true,message:'请输入类名名称'}]}]"
                   style="width: 380px"></a-input>
        </a-form-item>
        <a-form-item label="类型">
          <a-radio-group v-decorator="['类型']" @change="KindsOnChange">
            <a-radio value="private">专用教学场地</a-radio>
            <a-radio value="public">公共教学场地</a-radio>
            <a-radio value="admin">行政班教室</a-radio>
          </a-radio-group>
        </a-form-item>
        <div>
          <a-form-item label="最多上课人数：">
            <a-input-number  style="width: 380px" v-decorator="['input-number', { initialValue: 3 }]" :min="1" :max="100000" />
          </a-form-item>
          <a-form-item label="专用教学场地课程" has-feedback>
            <a-select v-decorator="['select',{ rules: [{ required: true, message: '请选择' }] },]"
                      placeholder="化学实验"
                      style="width: 380px">
              <a-select-option value="chemical">
                化学实验
              </a-select-option>
              <a-select-option value="biology">
                生物实验
              </a-select-option>
            </a-select>
          </a-form-item>
        </div>
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
      width:'12%'
    },
    {
      title:'教室名称',
      dataIndex:'className',
      key:'className',
      align:'center',
      width:'12%'
    },
    {
      title:'楼层',
      dataIndex:'floor',
      key:'floor',
      align:'center',
      width:'12%'
    },
    {
      title:'类型',
      dataIndex:'kinds',
      key:'kinds',
      align:'center',
      width:'14%'
    },
    {
      title:'所属教学楼',
      dataIndex:'teachBuilding',
      key:'teachBuilding',
      align:'center',
      width:'14%'
    },
    {
      title:'容纳人数',
      dataIndex:'nums',
      key:'nums',
      align:'center',
      width:'12%'
    },
    {
      title:'状态',
      dataIndex:'situation',
      key:'situation',
      align:'center',
      width:'12%'
    },
    {
      title:'时间规则',
      dataIndex:'timeRegular',
      key:'timeRegular',
      align:'center',
      width:'12%'
    },
  ]
  const data=[
    {
      key:'1',
      serialNum:'1',
      className:'主楼101',
      floor:'1',
      kinds:'公共教学楼',
      teachBuilding:'主楼101',
      nums:'200',
      situation:'可用',
      timeRegular:'操作'
    },
    {
      key:'2',
      serialNum:'2',
      className:'化学实验室',
      floor:'2',
      kinds:'专用场所',
      teachBuilding:'实验楼201',
      nums:'20',
      situation:'不可用',
    },
    {
      key:'3',
      serialNum:'3',
      className:'高一1班教室',
      floor:'3',
      kinds:'行政班教室',
      teachBuilding:'逸夫楼201',
      nums:'无',
      situation:'不可用',
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
        addClassVisit: false,
        editVisit: false,
        loading:false,
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
      onSelectChange( selectedRowKeys,selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows=selectedRows
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
      },   Delete(){
        this.data = this.data.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
        this.selectedRows = this.selectedRows.filter(item => this.selectedRowKeys.indexOf(item.key) < 0)
      },

      addClassHandleSubmint(){},
      form(){},
      leadIn(){},
      KindsOnChange(){},
      handleSubmit(){},
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
    margin:15px 5px 20px 5px;
    padding:2px 4px;
    margin-left: 70px;
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
