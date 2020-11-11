<template>
  <div>
    <div class="result">
      <a-breadcrumb>
        <a-breadcrumb-item>首页</a-breadcrumb-item>
        <a-breadcrumb-item><a href="">排课详情</a></a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="operation-list">
      <a-row :gutter="[16,16]">
        <a-col v-for="item in operationList" :key="item.text" :span="6" @click="goDetail(item)">
            <div class="operation">
              <div class="operation-icon">
                <a-icon :type="item.icon" style="font-size:40px;line-height:80px;color:white"/>
              </div>
              <h1 style="margin-top:10px">{{item.text}}</h1>
            </div>
        </a-col>
      </a-row>
    </div>
<!--    修改-->
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
        <a-form-item label="选课计划名称：">
          <a-input placeholder="请输入"
                   v-decorate="['note',{rules:[{required:true,message:'请输入选课计划名称'}]}]"
                   style="width: 380px"></a-input>
        </a-form-item>
        <a-form-item label="年级：" has-feedback>
          <a-select v-decorator="['select',{ rules: [{ required: true, message: '请选择年级：' }] },]"
                    placeholder="请选择">
            <a-select-option value="young">高一</a-select-option>
            <a-select-option value="senior">高二</a-select-option>
            <a-select-option value="high">高三</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="启用功能">
          <a-checkbox-group>
            <a-checkbox value="admin">行政班排课  </a-checkbox>
            <a-checkbox value="mobile" >走班排课</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="所属学期" has-feedback>
          <a-select v-decorator="['times',{ rules: [{ required: true, message: '请选择所属学期' }] },]"
                    placeholder="请选择">
            <a-select-option value="18——19上">2018-2019学年上学期</a-select-option>
            <a-select-option value="18——19下">2018-2019学年下学期</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
<!--    发布选课-->
    <a-modal
            :visible='publishVisit'
            width="700px"
            :closable="false"
            on-ok="handleOk">
      <template slot="footer">
        <a-button key="Save" type="primary" :loading="loading" @click="handleOk">确定</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <span>共计发送1000人</span>
      <a-table :rowKey="'key'"
               :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
               :selectedRows="selectedRows"
               :columns="columns"
               :data-source="data"
               :bordered="true"
               :pagination="false"
               width="500px"
               style="margin-top: 50px">
      </a-table>
    </a-modal>
  </div>
</template>
<script>
const operationList = [
  {
    icon: "edit",
    text: "修改",
  },
  {
    icon: "setting",
    text: "选课设置",
  },
  {
    icon: "cloud-upload",
    text: "发布选课",
  },
  {
    icon: "pie-chart",
    text: "选课统计",
  },
  {
    icon: "snippets",
    text: "选课分班",
  },
  {
    icon: "schedule",
    text: "选课排课",
  },
  {
    icon: "schedule",
    text: "行政班排课",
  },
  {
    icon: "calendar",
    text: "走班排课任务",
  },
  {
    icon: "cloud-upload",
    text: "课表",
  },
  {
    icon: "calendar",
    text: "行政班排课任务",
  },
];
const columns=[
  {
    title:'序号',
    align:'center',
    dataIndex: 'serialNum',
    width: '15%',
  },{
  title: '名称',
    dataIndex:'name',
    align: 'center',
    width:'28.3%'
  },{
    title: '学号',
    dataIndex:'number',
    align: 'center',
    width:'28.3%'
  },{
    title: '班级',
    dataIndex:'class',
    align: 'center',
    width:'28.4%'
  }
]
const data=[
  {
    key:'0',
    serialNum:'1',
    name:'车西明',
    number:'001',
    class:'高一1班'
  },
  {
    key:'1',
    serialNum:'2',
    name:'车东明',
    number:'002',
    class:'无'
  },{
    key:'2',
    serialNum:'3',
  },{
  key:'3'
}
]
export default {
  name: "OperationList",
  data() {
    return {
      operationList,
      editVisit:false,
      publishVisit:false,
      loading:false,
      columns,
      data,
      selectedRowKeys: [], // Check here to configure the default column
      selectedRows:[],
    };
  },
  methods: {
    goDetail(item) {
      if(item.text==='修改'){
          this.editVisit=true
      }else if(item.text==='选课设置'){
        this.$router.push('/schedule/detail/setting')
      }else if(item.text==='发布选课'){
          this.publishVisit=true
      }else if(item.text==='选课统计'){
        this.$router.push('/schedule/detail/statistics')
      }else if(item.text==='选课分班'){
        this.$router.push('/schedule/detail/sort_class/index')
      }else if(item.text==='选课排课'){
        this.$router.push('/schedule/detail/sort_course/index')
      }else if(item.text==='行政班排课'){
        this.$router.push('/schedule/detail/class_admin/index')
      }else if(item.text==='走班排课任务'){
        this.$router.push('/schedule/detail/task_mobile/index')
      }else if(item.text==='课表'){
        this.$router.push('/schedule/detail/curriculum/index')
      }else if(item.text==='行政班排课任务'){
        this.$router.push('/schedule/detail/task_admin/index')
      }  },
    onSelectChange( selectedRowKeys,selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows=selectedRows
    },
      handleOkAdd() {
        this.loading=true
        setTimeout(() => {
          this.editVisit = false;
          this.loading = false;
        }, 2000);
      },
      handleOk() {
        this.loading = true;
        setTimeout(() => {
          this.editVisit = false;
          this.publishVisit=false;
          this.loading = false;
        }, 2000);
      },
      handleCancel() {
        this.editVisit = false;
        this.publishVisit=false;
      },
    form(){},
    addClassHandleSubmint(){},


  },
};
</script>
<style lang='less' scoped>
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
.operation{
  background-color: white;
  text-align: center;
  height: 80%;
  width:80%;
  padding: 30px;
  .operation-icon{
    margin:0 auto;
    height: 80px;
    width:80px;
    text-align: center;
    background-color: #13c2c2;
    border-radius: 50%;
  }
}
</style>
