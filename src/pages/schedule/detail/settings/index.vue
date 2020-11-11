
<template>
 <div>
   <div class="result">
     <a-breadcrumb>
       <a-breadcrumb-item>首页</a-breadcrumb-item>
       <a-breadcrumb-item><a href="">排课计划</a></a-breadcrumb-item>
       <a-breadcrumb-item><a href="">选课设置</a></a-breadcrumb-item>
     </a-breadcrumb>
   </div>
   <a-card>
     <a-form-model
             layout="horizontal"
             ref="ruleForm"
             :model="form"
             :rules="rules"
             style="overflow: hidden;margin-bottom: 30px"
             :label-col="{span:4}"
             :wrapper-col="{span:10}"
             @submit="handleSubmit">
       <a-form-model-item label="选课规则" prop="rule">
         <a-select placeholder="请选择" >
           <a-select-option value="5">5</a-select-option>
         </a-select>
       </a-form-model-item>
       <a-form-model-item label="选课类型" prop="type">
         <a-select placeholder="请选择" v-model="form.workday">
           <a-select-option value="5">5</a-select-option>
         </a-select>
       </a-form-model-item>
       <a-form-item label="选课时间：" prop="type">
         <a-range-picker
                 :disabled-date="disabledDate"
                 :disabled-time="disabledRangeTime"
                 :show-time="{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],}"
                 format="YYYY-MM-DD HH:mm:ss"
                 :placeholder="['开始时间', '结束时间']"
                 style="width: 560px"/>
       </a-form-item>
     </a-form-model>
     <a-table :columns="columns" :dataSource="dataSource" :pagination='false'>
       <div slot="subjects" slot-scope="data">
         <a-table
                 :columns="columnsSubjects"
                 :dataSource="data"
                 :pagination="false"
                 bordered>
           <div slot="isMust" slot-scope="isMust">
             <a-select :default-value="isMust" style="width: 100px">
               <a-select-option :value="true"> 必选 </a-select-option>
               <a-select-option :value="false"> 可选 </a-select-option>
             </a-select>
           </div>
           <table slot="teacher" slot-scope="teacher">
             <tr v-for="t in teacher" :key="t" class="teacher">
               <td>{{ t.name }}</td>
               <td><a-input v-model="t.capacity"></a-input></td>
               <td><a-button type="primary" @click="deleteTeacher">删除</a-button></td>
             </tr>
             <tr class="teacher">
               <a class="add-btn" @click="addTeacher"><a-icon type="plus" />新增老师</a>
             </tr>
           </table>
         </a-table>
       </div>
       <a-form-item slot="regular" has-feedback>
         <a-select
                 v-decorator="['rule',{ rules: [{ required: true, message: '请选择规则!' }] },]"
                 placeholder="覆盖2科"
                 @change="handleSelectChange" style="width: 150px">
           <!--          <a-select-option value="male">male</a-select-option>-->
           <!--          <a-select-option value="female">female</a-select-option>-->
         </a-select>
       </a-form-item>

       <a slot='operate' @click="deleteTypical">删除</a>
     </a-table>
     <div style="margin-top: 30px">
       <h3>选课说明</h3>
       <a-textarea placeholder="请输入" :rows="8" style="width: 1200px" />
     </div>
     <a-row style=" margin-left:500px;margin-top:50px;margin-bottom:10px">
       <a-col :span="5"><a-button  style="width: 100px;height: 40px;background-color: #1abc9c;color: white" @click="Save">保存</a-button></a-col>
       <a-col :span="5"><a-button style="width: 100px;height: 40px;background-color: red;color: white" @click="Clear">清空</a-button></a-col>
       <a-col> <a-button style="width: 100px;height: 40px;background-color:blue;color: white" @click="back">返回</a-button></a-col>
     </a-row>
     <a-modal
             :visible='addVisit'
             width="800px"
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
       <a-form :form="form" :label-col="{ span:6 }" :wrapper-col="{ span: 13 }" @submit="handleSubmit" style="margin-bottom: 300px;margin-top: 50px">
         <a-form-item label="标题：">
           <a-tree-select
                   v-model="value"
                   style="width: 100%"
                   :tree-data="treeData"
                   tree-checkable
                   :show-checked-strategy="SHOW_PARENT"
                   placeholder="请选择"/>
         </a-form-item>
       </a-form>
     </a-modal>
   </a-card>
 </div>
</template>

<script>
  import moment from 'moment';
  import { TreeSelect } from 'ant-design-vue';
  const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const columns = [
  {
    title: "类型",
    dataIndex: "type",
    align:'center',
  },
  {
    title: "课程",
    dataIndex: "subjects",
    scopedSlots: { customRender: "subjects" },
    align:'center',
  },
  {
    title: "规则",
    dataIndex: "rule",
    scopedSlots: { customRender: "regular" },
    align:'center',
  },
  {
    title: "操作",
    dataIndex: "operate",
    scopedSlots: { customRender: "operate" },
    align:'center',
  },
];
const columnsSubjects = [
  {
    title: "科目",
    dataIndex: "name",
    align:'center',
  },
  {
    title: "是否可选",
    dataIndex: "isMust",
    scopedSlots: { customRender: "isMust" },
    align:'center',
  },
  {
    title: "老师",
    dataIndex: "teacher",
    scopedSlots: { customRender: "teacher" },
    align:'center',
  },
];
const dataSource = [
  {
    key: '1',
    type: "必修课",
    subjects: [
      {
        name: "高一数学",
        isMust: true,
        teacher: [
          {
            name: "张x",
            capacity: 30,
          },
          {
            name: "王x",
            capacity: 30,
          },
        ],
      },
      {
        name: "高一语文",
        isMust: true,
        teacher: [
          {
            key:'1',
            name: "张x",
            capacity: 30,
          },
          {
            key:'2',
            name: "王x",
            capacity: 30,
          },
        ],
      },
    ],
    rule: "覆盖2科",
  },
  {
    key: '2',
    type: "选修课",
    subjects: [
      {
        name: "高一物理选修",
        isMust: true,
        teacher: [
          {
            name: "张x",
            capacity: 30,
          },
          {
            name: "王x",
            capacity: 30,
          },
        ],
      },
      {
        name: "高一生物选修",
        isMust: true,
        teacher: null,
      },
    ],
    rule: "覆盖2科",
  },
];
const treeData=[
  {
    title: '高一',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: '语文',
        value: '0-0-0',
        key: '0-0-0',
        children: [
          {
            title: '张凯元',
            value: '0-0-0-0',
            key: '0-0-0-0',
          },
          {
            title: '张凯方',
            value: '0-0-0-1',
            key: '0-0-0-1',
          },
        ],
      },
            ]},
  {
    title: '高二',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: '语文',
        value: '0-1-0',
        key: '0-1-0',
        children: [{
          title: '张凯元',
          value: '0-1-0-0',
          key: '0-1-0-0',
  }],}
  ]},
];
export default {
  name: "QueryList",
  components: {},
  data() {
    return {
      columns,
      columnsSubjects,
      dataSource: dataSource,
      loading:false,
      addVisit: false,
      value: ['张凯元'],
      treeData,
      SHOW_PARENT,
      form: {
        type: 1,
        rule: 6 + 3,
        beginTime: undefined,
        endTime: undefined,
      },
      rules: {
        rule: [
          {
            required: true,
            message: "请选择所需选课规则",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择选课类型",
            trigger: "blur",
          },
        ],
        beginTime: [
          {
            required: true,
            message: "请选择选课开始时间",
            trigger: "change",
          },
        ],
        endTime: [
          {
            required: true,
            message: "请选择选课结束时间",
            trigger: "change",
          },
        ],
      },
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'time_related_controls' });
  },
  methods: {
    moment,
    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day');
    },
    disabledRangeTime(_, type) {
      if (type === 'start') {
        return {
          disabledHours: () => this.range(0, 60).splice(4, 20),
          disabledMinutes: () => this.range(30, 60),
          disabledSeconds: () => [55, 56],
        };
      }
      return {
        disabledHours: () => this.range(0, 60).splice(20, 4),
        disabledMinutes: () => this.range(0, 31),
        disabledSeconds: () => [55, 56],
      };
    },
    handleSelectChange(value) {
      console.log(value);
      this.form.setFieldsValue({
        // note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
      });
    },
    addTeacher(){
      this.addVisit=true;
    },
    deleteTypical(key){
      const dataSource = [...this.dataSource];
      this.dataSource= dataSource.filter(item => item.key !== key);
    },
    handleOk() {
      this.loading = true;
      setTimeout(() => {
        this.addVisit=false;
        this.loading = false;
      }, 2000);
    },
    handleCancel() {
      this.addVisit=false;
    },
    addHandleSubmint(){},
    deleteTeacher(){},
    Save(){
    },
    Clear(){
      this.dataSource.subject=[]
    },
    back(){
      this.$router.go(-1)
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
.search {
  margin-bottom: 54px;
}
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
.teacher {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 5px;
}
.add-btn {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100px;
  margin: 10px auto 0 auto;
  padding: 5px;
  border: 1px solid;
  border-radius: 6px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
