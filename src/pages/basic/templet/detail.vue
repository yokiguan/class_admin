
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
        <a-button type="primary" style="margin-left: 8px">公共时段设置</a-button>
        <a-button type="primary" style="margin-left: 8px">节次时间设置</a-button>
        <a-button @click="searchInfo" type="primary" style="margin-left: 8px">查询</a-button>
        <a-button @click="clearInfo" style="margin-left: 8px">重置</a-button>
      </a-row>
    </a-form-model>
    <simple-schedule :columns="columns" :dataSource="dataSource" :rowKey="`activity`" />
  </a-card>
</template>

<script>
import SimpleSchedule from "../../../components/schedule/SimpleSchedule";
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

const dataSource = [
  {
    activity: "早读1",
  },
  {
    activity: "上午1",
  },
  {
    activity: "上午2",
  },
  {
    activity: "上午3",
  },
  {
    activity: "上午4",
  },
  {
    activity: "下午1",
  },
  {
    activity: "下午2",
  },
  {
    activity: "下午3",
  },
  {
    activity: "下午4",
  },
  {
    activity: "晚自习1",
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

export default {
  name: "QueryList",
  components: { SimpleSchedule },
  data() {
    return {
      columns: columns,
      dataSource: dataSource,
      activity: activity,
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
    searchInfo() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let activities = [];
          let list = [...this.activity];
          list.forEach((item) => {
            for (let i = 1; i <= this.form[item.value]; i++)
              activities.push({
                activity: item.name + i,
              });
          });
          this.dataSource = activities;
        } else return false;
      });
    },
    clearInfo() {
      this.$refs.ruleForm.resetFields();
    },
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
