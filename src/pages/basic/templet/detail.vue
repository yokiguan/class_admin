
<template>
  <a-card>
    <a-form-model
      layout="horizontal"
      ref="ruleForm"
      :model="form"
      :rules="rules"
      style="overflow:hidden"
    >
      <a-row>
        <a-col :md="24" :sm="24">
          <a-form-model-item
            label="模板名称"
            prop="templet_name"
            :labelCol="{span: 2}"
            :wrapperCol="{span: 5}"
          >
            <a-input v-model="form.templet_name" placeholder="请输入" />
          </a-form-model-item>
        </a-col>
        <a-col :md="24" :sm="24">
          <a-col span="4">
            <a-form-model-item
              label="工作日"
              prop="workday"
              :labelCol="{span: 10}"
              :wrapperCol="{span: 14}"
            >
              <a-select placeholder="请选择" v-model="form.workday">
                <a-select-option value="5">5</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col span="4">
            <a-form-model-item
              label="假期"
              prop="rest"
              :labelCol="{span: 10}"
              :wrapperCol="{span: 14}"
            >
              <a-select placeholder="请选择" v-model="form.rest">
                <a-select-option value="2">2</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-col>
        <a-col span="4" v-for="item in activity" :key="item.name">
          <a-form-model-item
            :label="item.name"
            :prop="item.value"
            :labelCol="{span: 10}"
            :wrapperCol="{span: 14}"
          >
            <a-select placeholder="请选择" v-model="form[item.value]">
              <a-select-option v-for="option in item.options" :key="option">{{option}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row style="float: right;">
        <a-button type="primary" style="margin-left: 8px" @click='saveInfo'>设置</a-button>
        <a-button @click="clearInfo" style="margin-left: 8px">清空</a-button>

        <a-button type="primary" style="margin-left: 8px" @click='showPublicModal'>公共时段设置</a-button>
        <a-button type="primary" style="margin-left: 8px" @click='showTimeModal'>节次时间设置</a-button>
      </a-row>
    </a-form-model>
    <simple-table :columns="columns" :dataSource="dataSource" :rowKey="`activity`" />
    <a-row>
      <a-button @click="saveInfo" type="primary" style="margin-left:450px;height: 40px;width: 150px;margin-top: 50px">保存</a-button>
        <a-button @click="goBackAdmin"  type="primary" style="margin-left:100px;height: 40px;width: 150px;margin-top: 50px">返回</a-button>
    </a-row>
    <a-modal
    :visible='timeModal'
      title="节次时间设置"
      @ok="handleOkTime"
      @cancel="handleCancelTime"
    >
    <a-table :columns='timeColumns' :dataSource='timeData' rowKey='value' :pagination='false'>
      <span slot='time' slot-scope="time">
    <a-time-picker v-model='time[0]' format="hh:mm"/> -
    <a-time-picker v-model='time[1]' @change='changeTime' format="hh:mm"/>
    </span>
    </a-table>
    </a-modal>
    <a-modal
     :visible='publicModal'
      width="600px"
      :closable="false">
      <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="时间段位置" >
          <a-input v-model="form.name" placeholder="早读1之后"/>
        </a-form-model-item>
        <a-form-model-item label="时间段名称">
          <a-input v-model="form.time" placeholder="早饭"/>
        </a-form-model-item>
      </a-form-model>
      <a-table
              :columns="publicColumns"
              :data-source="publicData"
              :bordered = "true"
              :pagination = "false"></a-table>
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="loading" @click="handlePublicok">
          保存
        </a-button>
        <a-button key="back" @click="handlePublicCancel">
          取消
        </a-button>
        <a-button key="delete" @click="handlePublicDelete">
          删除
        </a-button>
      </template>
    </a-modal>
  </a-card>

</template>

<script>
import SimpleTable from "../../../components/table/SimpleTable";
import moment from 'moment'
const columns = [
  {
    title: "",
    dataIndex: "activity",
  },
  {
    title: "星期一",
    dataIndex: "monday",
  },
  {
    title: "星期二",
    dataIndex: "tuesday",
  },
  {
    title: "星期三",
    dataIndex: "wednesday",
  },
  {
    title: "星期四",
    dataIndex: "thursday",
  },
  {
    title: "星期五",
    dataIndex: "friday",
  },
  {
    title: "星期六",
    dataIndex: "saturday",
  },
  {
    title: "星期日",
    dataIndex: "sunday",
  },
];

const activity = [
  {
    name: "早读",
    options: [0, 1, 2],
    value: "emorning",
  },
  {
    name: "上午",
    options: [0, 1, 2, 3, 4],
    value: "morning",
  },
  {
    name: "中午",
    options: [0, 1, 2],
    value: "noon",
  },
  {
    name: "下午",
    options: [0, 1, 2, 3, 4],
    value: "afternoon",
  },
  {
    name: "晚自习",
    options: [0, 1, 2, 3, 4],
    value: "evening",
  },
];
const  publicColumns=[
        {
            title:' ',
            dataIndex:'check'
        },{
          title:'时间段位置',
          dataIndex:'timeLocate'
        },
       {
        title:'时间段名称',
       dataIndex:'timename'
       },]
const timeColumns=[

  {
    title:'时间段名',
    dataIndex:'activity'
  },
  {
    title:'时间设置',
    dataIndex:'time',
    scopedSlots: { customRender: "time" },
  }
]

export default {
  name: "QueryList",
  components: { SimpleTable },
  data() {
    return {
      columns,
      timeColumns,
      timeData:[],
      dataSource:[],
      publicColumns,
      activity,
      publicModal:false,
      timeModal:false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        templet_name: undefined,
        workday: undefined,
        rest: undefined,
        emorning: undefined,
        morning: undefined,
        noon: undefined,
        afternoon: undefined,
        evening: undefined,
      },
      rules: {
        templet_name: [
          {
            required: true,
            message: "请输入课表模板名称",
            trigger: "blur",
          },
        ],
        workday: [
          {
            required: true,
            message: "请选择工作日天数",
            trigger: "change",
          },
        ],
        rest: [
          {
            required: true,
            message: "请选择休息天数",
            trigger: "change",
          },
        ],
        emorning: [
          {
            required: true,
            message: "请选择早读节数",
            trigger: "change",
          },
        ],
        morning: [
          {
            required: true,
            message: "请选择上午节数",
            trigger: "change",
          },
        ],
        noon: [
          {
            required: true,
            message: "请选择中午节数",
            trigger: "change",
          },
        ],
        afternoon: [
          {
            required: true,
            message: "请选择下午节数",
            trigger: "change",
          },
        ],
        evening: [
          {
            required: true,
            message: "请选择晚自习节数",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
   changeTime(){
     console.log(this.timeData)
   },
    saveInfo() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let activities = [];
          let timeDatas=[];
          let list = [...this.activity];
          list.forEach((item) => {
            for (let i = 1; i <= this.form[item.value]; i++){
activities.push({
                activity: item.name + i,
                value:item.value+i
              });
timeDatas.push({
                activity: item.name + i,
                value:item.value+i,
                time:[moment(undefined),moment(undefined)]
              });
            }

          });
          this.dataSource = activities;
          this.timeData=timeDatas;
        } else return false;
      });
    },
    clearInfo() {
      this.$refs.ruleForm.resetFields();
    },
    goBackAdmin(){
      this.$router.push('/basic/template/admin')
    },
    showPublicModal(){
      this.publicModal=true
    },
    handlePublicok(){
      this.publicModal=false
    },
    handlePublicCancel(){
      this.publicModal=false
    },
    showTimeModal(){
      this.timeModal=true
    },
    handleOkTime(){
      this.timeModal=false
    },
    handleCancelTime(){
      this.timeModal=false
    },
    handlePublicDelete(){

    }
  },
};
</script>

<style lang="less" scoped>
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
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
